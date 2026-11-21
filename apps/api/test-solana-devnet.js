const fs = require("fs");
const { Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction } = require("@solana/web3.js");
const API = "http://localhost:3000";
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const KEYFILE = "./apps/api/devnet-keypair.json";

async function main() {
  let from;
  if (fs.existsSync(KEYFILE)) {
    from = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(KEYFILE, "utf-8"))));
    console.log("Kayıtlı cüzdan kullanılıyor:", from.publicKey.toBase58());
  } else {
    from = Keypair.generate();
    fs.writeFileSync(KEYFILE, JSON.stringify(Array.from(from.secretKey)));
    console.log("Yeni cüzdan oluşturuldu, kaydedildi:", from.publicKey.toBase58());
    console.log("ŞİMDİ https://faucet.solana.com adresinden bu adrese 1 SOL iste, sonra scripti tekrar çalıştır.");
    return;
  }

  const balance = await connection.getBalance(from.publicKey);
  console.log("Bakiye:", balance / LAMPORTS_PER_SOL, "SOL");
  if (balance < 0.02 * LAMPORTS_PER_SOL) {
    console.log("Bakiye yetersiz. https://faucet.solana.com adresinden bu adrese SOL iste, tekrar çalıştır.");
    return;
  }

  const to = Keypair.generate();
  const tx = new Transaction().add(
    SystemProgram.transfer({ fromPubkey: from.publicKey, toPubkey: to.publicKey, lamports: 0.01 * LAMPORTS_PER_SOL })
  );
  const txHash = await sendAndConfirmTransaction(connection, tx, [from]);
  console.log("Gerçek txHash:", txHash);

  const res = await fetch(`${API}/treasury/deposit`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chain: "SOL", token: "SOL", amount: 0.01, txHash })
  });
  console.log("API cevabı:", JSON.stringify(await res.json(), null, 2));

  const res2 = await fetch(`${API}/treasury/deposit`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chain: "SOL", token: "SOL", amount: 0.01, txHash })
  });
  console.log("2. deneme (400 beklenir):", res2.status, await res2.text());
  console.log("\nExplorer: https://explorer.solana.com/tx/" + txHash + "?cluster=devnet");
}
main().catch(e => { console.error("HATA:", e.message); process.exit(1); });