// apps/api/test-treasury.js - ARCSTRA Hazine Testi (Otomatik Resetli)
const BASE = "http://localhost:3000";
let pass = 0, fail = 0;
let wallets = {};
let escrows = {};

async function call(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

function check(no, name, cond, extra = "") {
  if (cond) { pass++; console.log(`✅ ${no}. ${name}`); }
  else { fail++; console.log(`❌ ${no}. ${name} ${extra}`); }
}

async function run() {
  console.log("=== ARCSTRA HAZINE TESTI - 20 SENARYO ===\n");
  
  // Her test baslamadan once kasayi ve defteri otomatik sifirlar
  await call("POST", "/test/reset");

  // --- 1-4: CÜZDAN ---
  let r = await call("POST", "/wallet/create", { owner: "alice" });
  check(1, "Cüzdan oluştur - Alice", r.status === 200 && r.data.id, JSON.stringify(r.data));
  wallets.alice = r.data.id;

  r = await call("POST", "/wallet/create", { owner: "bob" });
  check(2, "Cüzdan oluştur - Bob", r.status === 200 && r.data.id);
  wallets.bob = r.data.id;

  r = await call("POST", "/wallet/create", {});
  check(3, "Owner yoksa 400", r.status === 400);

  r = await call("GET", "/wallet/balance/" + wallets.alice);
  check(4, "Bakiye sorgu - 0 olmalı", r.status === 200 && r.data.balance === 0);

  // --- 5-8: HAZİNE DEPOSIT ---
  r = await call("POST", "/treasury/deposit", { chain: "SOL", token: "USDC", amount: 100, txHash: "test-tx-1" });
  check(5, "Hazineye 100 USDC SOL yatır", r.status === 200 && r.data.treasury.chains.SOL.balances.USDC === 100);

  r = await call("POST", "/treasury/deposit", { chain: "ETH", token: "USDC", amount: 50 });
  check(6, "Hazineye 50 USDC ETH yatır", r.status === 200 && r.data.treasury.chains.ETH.balances.USDC === 50);

  r = await call("POST", "/treasury/deposit", { chain: "SOL", token: "USDC", amount: -10 });
  check(7, "Negatif deposit 400", r.status === 400);

  r = await call("POST", "/treasury/deposit", { chain: "BTC", token: "USDC", amount: 10 });
  check(8, "Bilinmeyen chain 400", r.status === 400);

  // --- 9-12: ESCROW ---
  r = await call("POST", "/treasury/escrow", { chain: "SOL", taskId: "upland-gorev-1", toWalletId: wallets.bob, amount: 20, app: "upland" });
  check(9, "Upland escrow 20 USDC kilitle", r.status === 200 && r.data.escrow.status === "LOCKED");
  escrows.upland1 = r.data.escrow?.id;

  r = await call("POST", "/treasury/escrow", { chain: "SOL", taskId: "dr-gorev-1", toWalletId: wallets.alice, amount: 30, app: "dr-arcstra" });
  check(10, "Dr. ARCSTRA escrow 30 USDC kilitle", r.status === 200 && r.data.escrow.app === "dr-arcstra");
  escrows.dr1 = r.data.escrow?.id;

  r = await call("POST", "/treasury/escrow", { chain: "SOL", taskId: "hata-1", toWalletId: wallets.bob, amount: 9999 });
  check(11, "Bakiyeden fazla escrow 400", r.status === 400);

  r = await call("POST", "/treasury/escrow", { chain: "SOL", taskId: "hata-2", toWalletId: "w_yok", amount: 10 });
  check(12, "Olmayan cüzdana escrow 404", r.status === 404);

  // --- 13-16: RELEASE / REFUND ---
  r = await call("POST", "/treasury/release", { escrowId: escrows.upland1, approved: true });
  check(13, "Upland escrow release - Bob 20 aldı", r.status === 200 && r.data.escrow.status === "RELEASED");

  r = await call("GET", "/wallet/balance/" + wallets.bob);
  check(14, "Bob bakiyesi 20 olmalı", r.data.balance === 20, "bakiye=" + r.data.balance);

  r = await call("POST", "/treasury/release", { escrowId: escrows.upland1, approved: true });
  check(15, "Aynı escrow 2. kez release 400", r.status === 400);

  r = await call("POST", "/treasury/refund", { escrowId: escrows.dr1 });
  check(16, "Dr escrow refund - hazineye iade", r.status === 200 && r.data.escrow.status === "REFUNDED");

  // --- 17-18: TRANSFER VALIDASYON ---
  r = await call("POST", "/wallet/transfer", { fromWalletId: wallets.bob, toWalletId: wallets.alice, amount: 5 });
  check(17, "Bob -> Alice 5 transfer", r.status === 200);

  r = await call("POST", "/wallet/transfer", { fromWalletId: wallets.bob, toWalletId: wallets.alice, amount: 9999 });
  check(18, "Bakiye yetersiz transfer 400", r.status === 400);

  // --- 19-20: LEDGER / HAZİNE TUTARLILIK ---
  r = await call("GET", "/treasury");
  const sol = r.data.chains.SOL;
  check(19, "Hazine tutarlılık SOL USDC=80, locked=0", sol.balances.USDC === 80 && sol.locked === 0, JSON.stringify(sol));

  r = await call("GET", "/ledger");
  const hasEvents = r.data.some(e => e.event_type === "ESCROW_LOCKED") && r.data.some(e => e.event_type === "ESCROW_RELEASED");
  check(20, "Ledger'da ESCROW_LOCKED + RELEASED var", r.status === 200 && hasEvents && r.data.length >= 9);

  console.log(`\n=== SONUÇ: ${pass} geçti, ${fail} kaldı ===`);
  if (fail === 0) console.log("🎉 Hepsi geçti, hazine mantığı sağlam!");
  else console.log("⚠️ Kalan hataları düzelt, tekrar çalıştır.");
}

run().catch(e => console.log("Test çöktü:", e.message));
