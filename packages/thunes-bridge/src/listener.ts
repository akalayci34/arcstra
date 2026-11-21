import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const ESCROW_ABI = ["event MilestoneReleased(bytes32 indexed caseId, uint8 milestoneIndex, uint256 providerNet, uint256 protocolFee)"];

async function startBridge() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_HTTP_URL || "https://base.org");
  const contract = new ethers.Contract(process.env.ESCROW_CONTRACT_ADDRESS || ethers.ZeroAddress, ESCROW_ABI, provider);
  console.log("ARCSTRA <-> Thunes Cross-Border Payout Bridge Active | Contact: arcstra@drarcstra.com");
  contract.on("MilestoneReleased", async (caseId, milestoneIndex, providerNet) => {
    console.log(`Milestone ${milestoneIndex} released for case ${caseId}: ${providerNet.toString()}`);
  });
}
startBridge();
