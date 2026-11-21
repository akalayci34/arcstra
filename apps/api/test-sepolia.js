const fs = require('fs');
const { ethers } = require('ethers');
const API = 'http://localhost:3000';
const provider = new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
const KEYFILE = './apps/api/sepolia-keypair.json';

async function main() {
  let wallet;
  if (fs.existsSync(KEYFILE)) {
    const j = JSON.parse(fs.readFileSync(KEYFILE, 'utf-8'));
    wallet = new ethers.Wallet(j.privateKey, provider);
    console.log('Kayitli cuzdan:', wallet.address);
  } else {
    wallet = ethers.Wallet.createRandom().connect(provider);
    fs.writeFileSync(KEYFILE, JSON.stringify({ address: wallet.address, privateKey: wallet.privateKey }));
    console.log('Yeni cuzdan olusturuldu:', wallet.address);
    console.log('SIMDI https://cloud.google.com/application/web3/faucet/ethereum/sepolia adresinden bu adrese SepoliaETH iste, sonra tekrar calistir.');
    return;
  }
  const bal = await provider.getBalance(wallet.address);
  console.log('Bakiye:', ethers.formatEther(bal), 'SepoliaETH');
  if (bal < ethers.parseEther('0.002')) {
    console.log('Bakiye yetersiz. Faucet’ten SepoliaETH iste, tekrar calistir.');
    return;
  }
  const to = ethers.Wallet.createRandom().address;
  const tx = await wallet.sendTransaction({ to, value: ethers.parseEther('0.001') });
  console.log('Gonderildi, bekleniyor...', tx.hash);
  const receipt = await tx.wait();
  console.log('Onaylandi, block:', receipt.blockNumber);
  const res = await fetch(API + '/treasury/deposit', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chain: 'ETH', token: 'ETH', amount: 0.001, txHash: tx.hash })
  });
  console.log('API cevabi:', JSON.stringify(await res.json(), null, 2));
  console.log('Explorer: https://sepolia.etherscan.io/tx/' + tx.hash);
}
main().catch(e => { console.error('HATA:', e.message); process.exit(1); });