// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IPriceOracle {
    function getTokenAmountForUSDCents(address token, uint256 usdCents) external view returns (uint256);
}

contract ACSCoordinationEscrow is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    enum CoordinationState { IntentCreated, EscrowLocked, LogisticsActive, Milestone1Verified, Milestone2Completed, Disputed, Refunded }

    struct RailConfig {
        bool isSupported;
        bool isPeggedToUSD;
        uint8 decimals;
        address oracleAddress;
        uint256 maxSlippageBps;
    }

    struct CoordinationCase {
        bytes32 caseId;
        address initiatorWallet;
        address providerTreasury;
        address settlementToken;
        bytes32 offChainDataHash;
        bytes32 proformaTermsHash;
        bytes32 consentProofHash;
        uint256 serviceBudgetCents;
        uint256 logisticsBudgetCents;
        uint256 lockedTokenAmount;
        uint256 releasedTokenAmount;
        uint16 milestone1Bps;
        CoordinationState state;
    }

    address public arcstraCoordinator;
    uint256 public protocolFeeBps = 500;
    address public arcstraTreasury;

    mapping(address => RailConfig) public supportedRails;
    mapping(bytes32 => CoordinationCase) public cases;
    mapping(address => uint256) public providerCompletedCount;

    event RailUpdated(address indexed token, bool isSupported, bool isPeggedToUSD, address oracle);
    event CoordinationInitialized(bytes32 indexed caseId, address indexed initiator, address indexed provider, address token);
    event EscrowFunded(bytes32 indexed caseId, address indexed token, uint256 lockedAmount);
    event LogisticsReleased(bytes32 indexed caseId, uint256 tokenAmount);
    event MilestoneReleased(bytes32 indexed caseId, uint8 milestoneIndex, uint256 providerNet, uint256 protocolFee);
    event CaseRefunded(bytes32 indexed caseId, uint256 refundedAmount);
    event GdprCryptoShredded(bytes32 indexed caseId, uint256 timestamp);

    modifier onlyCoordinator() {
        require(msg.sender == arcstraCoordinator || msg.sender == owner(), "ARCSTRA: Unauthorized");
        _;
    }

    constructor(address _arcstraCoordinator, address _arcstraTreasury) Ownable(msg.sender) {
        arcstraCoordinator = _arcstraCoordinator;
        arcstraTreasury = _arcstraTreasury;
    }

    function registerSettlementRail(address token, bool isSupported, bool isPeggedToUSD, address oracleAddress, uint256 maxSlippageBps) external onlyOwner {
        require(token != address(0), "Invalid token");
        uint8 dec = IERC20Metadata(token).decimals();
        supportedRails[token] = RailConfig(isSupported, isPeggedToUSD, dec, oracleAddress, maxSlippageBps);
        emit RailUpdated(token, isSupported, isPeggedToUSD, oracleAddress);
    }

    function createCoordinationCase(bytes32 caseId, address initiatorWallet, address providerTreasury, address settlementToken, bytes32 offChainDataHash, bytes32 proformaTermsHash, bytes32 consentProofHash, uint256 serviceBudgetCents, uint256 logisticsBudgetCents, uint16 milestone1Bps) external onlyCoordinator {
        require(cases[caseId].initiatorWallet == address(0), "Case exists");
        require(supportedRails[settlementToken].isSupported, "Rail not supported");
        cases[caseId] = CoordinationCase(caseId, initiatorWallet, providerTreasury, settlementToken, offChainDataHash, proformaTermsHash, consentProofHash, serviceBudgetCents, logisticsBudgetCents, 0, 0, milestone1Bps, CoordinationState.IntentCreated);
        emit CoordinationInitialized(caseId, initiatorWallet, providerTreasury, settlementToken);
    }

    function lockEscrow(bytes32 caseId) external nonReentrant {
        CoordinationCase storage c = cases[caseId];
        require(msg.sender == c.initiatorWallet && c.state == CoordinationState.IntentCreated, "Invalid lock");
        uint256 requiredTokens = _calculateTokenAmount(c.settlementToken, c.serviceBudgetCents + c.logisticsBudgetCents, true);
        c.lockedTokenAmount = requiredTokens;
        c.state = CoordinationState.EscrowLocked;
        IERC20(c.settlementToken).safeTransferFrom(msg.sender, address(this), requiredTokens);
        emit EscrowFunded(caseId, c.settlementToken, requiredTokens);
    }

    function releaseLogisticsTranche(bytes32 caseId) external nonReentrant onlyCoordinator {
        CoordinationCase storage c = cases[caseId];
        require(c.state == CoordinationState.EscrowLocked, "Not locked");
        uint256 logisticsTokens = (c.lockedTokenAmount * c.logisticsBudgetCents) / (c.serviceBudgetCents + c.logisticsBudgetCents);
        c.releasedTokenAmount += logisticsTokens;
        c.state = CoordinationState.LogisticsActive;
        IERC20(c.settlementToken).safeTransfer(arcstraTreasury, logisticsTokens);
        emit LogisticsReleased(caseId, logisticsTokens);
    }

    function verifyMilestone1(bytes32 caseId) external nonReentrant {
        CoordinationCase storage c = cases[caseId];
        require(msg.sender == c.initiatorWallet || msg.sender == arcstraCoordinator, "Unauthorized");
        require(c.state == CoordinationState.LogisticsActive || c.state == CoordinationState.EscrowLocked, "Invalid state");
        uint256 servicePool = (c.lockedTokenAmount * c.serviceBudgetCents) / (c.serviceBudgetCents + c.logisticsBudgetCents);
        uint256 m1Gross = (servicePool * c.milestone1Bps) / 10000;
        uint256 fee = (m1Gross * protocolFeeBps) / 10000;
        c.releasedTokenAmount += m1Gross;
        c.state = CoordinationState.Milestone1Verified;
        IERC20(c.settlementToken).safeTransfer(c.providerTreasury, m1Gross - fee);
        if (fee > 0) IERC20(c.settlementToken).safeTransfer(arcstraTreasury, fee);
        emit MilestoneReleased(caseId, 1, m1Gross - fee, fee);
    }

    function verifyMilestone2Final(bytes32 caseId) external nonReentrant {
        CoordinationCase storage c = cases[caseId];
        require(msg.sender == c.initiatorWallet && c.state == CoordinationState.Milestone1Verified, "Invalid final");
        uint256 remaining = c.lockedTokenAmount - c.releasedTokenAmount;
        uint256 fee = (remaining * protocolFeeBps) / 10000;
        c.releasedTokenAmount += remaining;
        c.state = CoordinationState.Milestone2Completed;
        providerCompletedCount[c.providerTreasury] += 1;
        IERC20(c.settlementToken).safeTransfer(c.providerTreasury, remaining - fee);
        if (fee > 0) IERC20(c.settlementToken).safeTransfer(arcstraTreasury, fee);
        emit MilestoneReleased(caseId, 2, remaining - fee, fee);
    }

    function recordGdprCryptoShred(bytes32 caseId) external {
        CoordinationCase storage c = cases[caseId];
        require(msg.sender == c.initiatorWallet || msg.sender == arcstraCoordinator, "Unauthorized");
        c.offChainDataHash = bytes32(0);
        emit GdprCryptoShredded(caseId, block.timestamp);
    }

    function _calculateTokenAmount(address token, uint256 usdCents, bool applySlippage) internal view returns (uint256) {
        RailConfig memory rail = supportedRails[token];
        if (rail.isPeggedToUSD) return (usdCents * (10 ** rail.decimals)) / 100;
        uint256 baseAmt = IPriceOracle(rail.oracleAddress).getTokenAmountForUSDCents(token, usdCents);
        return applySlippage ? baseAmt + ((baseAmt * rail.maxSlippageBps) / 10000) : baseAmt;
    }
}
