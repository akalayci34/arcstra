// Panel: DEMO veri. Gerçekte bu veriler ASP.NET Core API'den (/api/...) gelecek.
(function () {
  const fmt = (n, d = 0) => n.toLocaleString("tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d });

  // Basit tekrarlanabilir rastgele sayı (her açılışta aynı grafik)
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  // ---------- Örnek veri ----------
  const animals = [
    { id: "GOAT-TR-77812", breed: "Kıl keçisi", age: 3.2, milk: 2.4, health: 94, status: "Sağlıklı" },
    { id: "GOAT-TR-77813", breed: "Saanen", age: 2.6, milk: 3.1, health: 97, status: "Sağlıklı" },
    { id: "GOAT-TR-77820", breed: "Kıl keçisi", age: 5.1, milk: 1.8, health: 81, status: "Gözlemde" },
    { id: "GOAT-TR-77834", breed: "Saanen", age: 1.9, milk: 2.9, health: 95, status: "Sağlıklı" },
    { id: "SHEEP-TR-1042", breed: "Sakız", age: 4.0, milk: 1.6, health: 88, status: "Sağlıklı" },
    { id: "SHEEP-TR-1051", breed: "Kıvırcık", age: 2.2, milk: 1.1, health: 72, status: "Tedavide" },
  ];
  const sensors = [
    { name: "Soğuk oda", value: "3,8 °C", ok: true },
    { name: "Süt tankı", value: "4,1 °C", ok: true },
    { name: "Toprak nemi (248/2)", value: "%28", ok: true },
    { name: "Sevkiyat aracı TR-34", value: "6,9 °C", ok: false },
    { name: "GPS tasma (aktif)", value: "112 / 120", ok: true },
  ];
  const batches = {
    "M-220524-01": {
      product: "Keçi sütü, 1 L", origin: "Düvertepe", animal: "GOAT-TR-77812", shepherd: "SWAIN-TR-0421",
      steps: [["Sağım", "22.05 06:10"], ["Soğutma (4 °C)", "22.05 06:40"], ["İşleme / pastörizasyon", "22.05 09:15"], ["Paketleme", "22.05 11:00"], ["Laboratuvar testi", "22.05 15:30"], ["Sertifika: GMP / HACCP", "23.05 10:00"]],
    },
  };

  // ---------- KPI ----------
  const milk30 = [];
  let v = 262;
  for (let i = 0; i < 30; i++) { v += (rnd() - 0.42) * 9; milk30.push(Math.round(v)); }
  document.getElementById("kAnimals").textContent = "120";
  document.getElementById("kHealth").textContent = "%94";
  document.getElementById("kMilk").textContent = fmt(milk30[29]) + " L";
  document.getElementById("kCarbon").textContent = fmt(5 * 0.5, 1) + " t";

  // ---------- Süt grafiği (SVG) ----------
  const svg = document.getElementById("milkChart");
  const W = 640, H = 220, padL = 36, padB = 24, padT = 10, padR = 8;
  const min = Math.floor(Math.min(...milk30) / 10) * 10 - 10;
  const max = Math.ceil(Math.max(...milk30) / 10) * 10 + 10;
  const x = (i) => padL + (i / 29) * (W - padL - padR);
  const y = (val) => padT + (1 - (val - min) / (max - min)) * (H - padT - padB);
  let g = "";
  for (let t = 0; t <= 3; t++) {
    const val = min + ((max - min) * t) / 3;
    g += `<line x1="${padL}" x2="${W - padR}" y1="${y(val)}" y2="${y(val)}" stroke="rgba(236,230,214,.08)"/>`;
    g += `<text x="${padL - 6}" y="${y(val) + 4}" text-anchor="end">${Math.round(val)}</text>`;
  }
  [0, 10, 20, 29].forEach((i) => { g += `<text x="${x(i)}" y="${H - 6}" text-anchor="middle">${i === 29 ? "bugün" : "-" + (29 - i) + "g"}</text>`; });
  const pts = milk30.map((m, i) => `${x(i)},${y(m)}`).join(" ");
  g += `<defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#d6aa5a" stop-opacity=".28"/><stop offset="1" stop-color="#d6aa5a" stop-opacity="0"/></linearGradient></defs>`;
  g += `<polygon points="${x(0)},${H - padB} ${pts} ${x(29)},${H - padB}" fill="url(#fill)"/>`;
  g += `<polyline points="${pts}" fill="none" stroke="#d6aa5a" stroke-width="2" stroke-linejoin="round"/>`;
  g += `<circle cx="${x(29)}" cy="${y(milk30[29])}" r="4" fill="#d6aa5a"/>`;
  svg.innerHTML = g;

  // ---------- Sensörler ----------
  document.getElementById("sensors").innerHTML = sensors.map((s) =>
    `<div><span class="status" style="--c:${s.ok ? "var(--green)" : "var(--red)"}">${s.name}</span><span class="num">${s.value}</span></div>`
  ).join("");

  // ---------- Hayvan tablosu ----------
  const color = (st) => st === "Sağlıklı" ? "var(--green)" : st === "Gözlemde" ? "var(--gold)" : "var(--red)";
  document.getElementById("animals").innerHTML = animals.map((a) => `
    <tr><td class="num">${a.id}</td><td>${a.breed}</td><td class="r num">${fmt(a.age, 1)}</td>
    <td class="r num">${fmt(a.milk, 1)}</td><td class="r num">%${a.health}</td>
    <td><span class="status" style="--c:${color(a.status)}">${a.status}</span></td></tr>`).join("");

  // ---------- Parti doğrulama ----------
  const input = document.getElementById("batchInput");
  const trace = document.getElementById("trace");
  function showTrace() {
    const b = batches[input.value.trim().toUpperCase()];
    if (!b) { trace.innerHTML = `<p style="color:var(--red);font-size:14px">Parti bulunamadı. Örnek: M-220524-01</p>`; return; }
    trace.innerHTML = `
      <div class="tag gold" style="margin-bottom:10px">✓ Doğrulandı</div>
      <div class="result-rows" style="margin-top:0">
        <div><span>Ürün</span><span>${b.product}</span></div>
        <div><span>Menşe</span><span>${b.origin}</span></div>
        <div><span>Hayvan</span><span class="num">${b.animal}</span></div>
        <div><span>Çoban</span><span class="num">${b.shepherd}</span></div>
        ${b.steps.map((s) => `<div><span>${s[0]}</span><span class="num">${s[1]}</span></div>`).join("")}
      </div>`;
  }
  input.addEventListener("input", showTrace);
  showTrace();

  // ---------- Saat ----------
  const clock = document.getElementById("clock");
  const tick = () => { clock.textContent = "Canlı · " + new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }); };
  tick(); setInterval(tick, 30000);
})();
