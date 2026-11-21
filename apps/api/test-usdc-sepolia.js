const fs = require('fs');
const { ethers } = require('ethers');
const API = 'http://localhost:3000';
const provider = new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
const KEYFILE = './apps/api/sepolia-keypair.json';
const USDC = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';
const ERC20_ABI = ['function balanceOf(address) view returns (uint256)', 'function transfer(address to, uint256 amount) returns (bool)', 'function decimals() view returns (uint8)'];

async function main() {
  const j = JSON.parse(fs.readFileSync(KEYFILE, 'utf-8'));
  const wallet = new ethers.Wallet(j.privateKey, provider);
  console.log('Kayitli cuzdan:', wallet.address);

  const usdc = new ethers.Contract(USDC, ERC20_ABI, wallet);
  const bal = await usdc.balanceOf(wallet.address);
  console.log('USDC Bakiye:', ethers.formatUnits(bal, 6), 'USDC');

  if (bal < ethers.parseUnits('1', 6)) {
    console.log('Bakiye yetersiz. https://faucet.circle.com/ adresinden Ethereum Sepolia -> 20 USDC iste, tekrar calistir.');
    return;
  }

  const ethBal = await provider.getBalance(wallet.address);
  console.log('ETH Bakiye (gas icin):', ethers.formatEther(ethBal));
  if (ethBal < ethers.parseEther('0.001')) {
    console.log('Gas icin ETH yetersiz. Google faucetten SepoliaETH iste.');
    return;
  }

  const to = ethers.Wallet.createRandom().address;
  const tx = await usdc.transfer(to, ethers.parseUnits('1', 6));
  console.log('Gonderildi, bekleniyor...', tx.hash);
  const receipt = await tx.wait();
  console.log('Onaylandi, block:', receipt.blockNumber);

  const res = await fetch(API + '/treasury/deposit', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chain: 'ETH', token: 'USDC', amount: 1, txHash: tx.hash })
  });
  console.log('API cevabi:', JSON.stringify(await res.json(), null, 2));
  console.log('Explorer: https://sepolia.etherscan.io/tx/' + tx.hash);
}
main().catch(e => { console.error('HATA:', e.message); process.exit(1); });