// Ana sayfa: karbon geliri hesaplayıcı
// Rakamlar GLOBAL CARBON LOCKED notundaki 2028 senaryosundan (1 t CO2e bazında)
(function () {
  const methodEl = document.getElementById("method");
  if (!methodEl) return;

  const METHODS = {
    regen:   { price: 12, cut: 3.5, defaultRate: 0.2 },
    biochar: { price: 22, cut: 5.0, defaultRate: 0.5 },
  };
  const ALLOWANCE = 25; // TR ETS tahsisat fiyatı varsayımı (€/t)

  const area = document.getElementById("area");
  const rate = document.getElementById("rate");
  const eur = document.getElementById("eur");
  let method = "regen";

  const fmt = (n, d = 0) => n.toLocaleString("tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d });
  const $ = (id) => document.getElementById(id);

  function render() {
    const m = METHODS[method];
    const da = Number(area.value);
    const r = Number(rate.value);
    const kur = Number(eur.value) || 0;
    const tons = da * r;
    const net = m.price - m.cut;
    const income = tons * net;

    $("areaOut").textContent = fmt(da) + " dekar";
    $("rateOut").textContent = fmt(r, 2) + " t CO₂e/da";
    $("eurOut").textContent = fmt(kur, 1) + " TL";
    $("resEur").textContent = "€" + fmt(income);
    $("resTry").textContent = "≈ " + fmt(income * kur) + " TL / yıl";
    $("resTon").textContent = fmt(tons, 1) + " t CO₂e";
    $("resPrice").textContent = fmt(m.price, 1) + " €/t";
    $("resCut").textContent = "−" + fmt(m.cut, 1) + " €/t";
    $("resNet").textContent = fmt(net, 1) + " €/t";
    const save = ALLOWANCE - m.price;
    $("resSave").textContent = fmt(save) + " €/t (%" + Math.round((save / ALLOWANCE) * 100) + ")";
  }

  methodEl.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    method = b.dataset.m;
    methodEl.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    rate.value = METHODS[method].defaultRate;
    render();
  });
  [area, rate, eur].forEach((el) => el.addEventListener("input", render));
  render();
})();
