// Kodlama planı: görevler burada. who: "y" = Yiğit, "a" = Ahmet, "b" = birlikte
const MODULES = [
  {
    name: "0 · Altyapı", phase: "Faz 1",
    tasks: [
      { id: "alt1", who: "y", t: "GitHub reposu ve klasör yapısı", d: "Bu site + api/ klasörü aynı repoda." },
      { id: "alt2", who: "y", t: "Bu siteyi yayına al", d: "GitHub Pages veya Netlify, ücretsiz." },
      { id: "alt3", who: "y", t: "ASP.NET Core Web API + PostgreSQL iskeleti", d: "EF Core, ilk migration, /api/health." },
      { id: "alt4", who: "y", t: "Giriş ve roller", d: "Admin, çoban, alıcı, yatırımcı." },
      { id: "alt5", who: "a", t: "Marka kararı", d: "Ana isim Düvertepe mi, Virgil VR mi? Logo, alan adı." },
    ],
  },
  {
    name: "1 · Tanıtım sitesi", phase: "Faz 1",
    tasks: [
      { id: "web1", who: "a", t: "Metinlerin son hali", d: "Ana sayfadaki her bölümü oku, düzelt, eksikleri yaz." },
      { id: "web2", who: "a", t: "Gerçek fotoğraflar", d: "Köy, hayvanlar, parseller, mandıra. Yapay zekâ görselleri yerine." },
      { id: "web3", who: "y", t: "İletişim formu", d: "Form → e-posta bildirimi." },
      { id: "web4", who: "y", t: "TR / EN dil desteği", d: "Yatırımcı ve yurt dışı için." },
    ],
  },
  {
    name: "2 · Çoban ve hayvan kaydı", phase: "Faz 1",
    tasks: [
      { id: "hay1", who: "a", t: "Pilot çoban ve hayvan listesi", d: "Sayfanın altındaki tablo başlıklarıyla Excel." },
      { id: "hay2", who: "y", t: "Tablolar: Coban, Hayvan, SaglikKaydi, SutKaydi", d: "İlişkiler ve doğrulamalar." },
      { id: "hay3", who: "y", t: "Mobil uyumlu kayıt formları", d: "Çoban telefondan süt ve sağlık girebilsin." },
      { id: "hay4", who: "y", t: "Excel'den içeri aktarma", d: "Ahmet'in listesini tek tıkla yükle." },
      { id: "hay5", who: "y", t: "Hayvan başına QR kod üretimi", d: "Küpeye yapıştırılacak etiket PDF'i." },
      { id: "hay6", who: "a", t: "Sahada QR ve veri girişini test et", d: "Çobanların kullanıp kullanamadığını gözle." },
    ],
  },
  {
    name: "3 · Üretim izlenebilirliği", phase: "Faz 1",
    tasks: [
      { id: "ure1", who: "a", t: "Sağımdan pakete süreci yazılı tarif et", d: "Mandıra ile birlikte: adımlar, kim, ne zaman." },
      { id: "ure2", who: "y", t: "Parti (batch) kaydı", d: "Her adım bir kayıt: sağım, soğutma, işleme, paket, lab." },
      { id: "ure3", who: "y", t: "Ürün QR doğrulama sayfası", d: "Panel'deki taslak ekranın gerçek hali." },
      { id: "ure4", who: "a", t: "Laboratuvar ve GMP/HACCP süreci", d: "Hangi lab, hangi testler, maliyet." },
    ],
  },
  {
    name: "4 · Panel", phase: "Faz 1",
    tasks: [
      { id: "pan1", who: "a", t: "Panelde görmek istediğin KPI listesi", d: "Şu anki demo panelde neyi tut, neyi at." },
      { id: "pan2", who: "y", t: "Paneli API'ye bağla", d: "Demo veriyi gerçek veriyle değiştir." },
      { id: "pan3", who: "y", t: "Grafikler: süt, sağlık skoru, stok", d: "Günlük / haftalık / aylık." },
    ],
  },
  {
    name: "5 · Karbon (Global Carbon Locked)", phase: "Faz 1–2",
    tasks: [
      { id: "kar1", who: "a", t: "Parsel bilgileri ve son 3 yılın girdileri", d: "102/12, 248/2, 105/3, bağ alanı." },
      { id: "kar2", who: "a", t: "Toprak numunesi için laboratuvar bul", d: "0–30 ve 30–60 cm, SOC + hacim ağırlığı." },
      { id: "kar3", who: "b", t: "Standart kararı: Turkuaz Kredi mi Verra mı", d: "Ahmet kooperatif/toplayıcı firmayla görüşür, Yiğit sistem gereksinimini çıkarır." },
      { id: "kar4", who: "y", t: "Parsel kaydı + girdi defteri", d: "Gübre, mazot, sulama, biyokömür uygulaması." },
      { id: "kar5", who: "y", t: "Hesaplayıcıyı parsel verisine bağla", d: "Ana sayfadaki hesaplayıcının gerçek hali." },
      { id: "kar6", who: "y", t: "Sentinel-2 NDVI uydu verisi", d: "Faz 2: parsel sınırına göre otomatik çekme." },
    ],
  },
  {
    name: "6 · Pazar ve lojistik", phase: "Faz 2",
    tasks: [
      { id: "paz1", who: "a", t: "İstanbul'da ilk 5 alıcı görüşmesi", d: "Restoran, şarküteri, otel." },
      { id: "paz2", who: "y", t: "Sipariş ve abonelik modülü", d: "B2B sipariş, haftalık kutu." },
      { id: "paz3", who: "y", t: "Soğuk zincir sensör entegrasyonu", d: "Sıcaklık eşiği aşılınca uyarı." },
    ],
  },
  {
    name: "7 · Sonraya kalanlar", phase: "Faz 3+",
    tasks: [
      { id: "son1", who: "b", t: "Tokenizasyon ve yatırımcı paneli", d: "Hukuki çerçeve netleşmeden başlanmaz." },
      { id: "son2", who: "y", t: "Yapay zekâ: verim ve talep tahmini", d: "En az 1 yıllık veri birikince." },
      { id: "son3", who: "y", t: "Çoban–sürü eşleştirme algoritması", d: "Beceri puanı verisi oluşunca." },
    ],
  },
];

(function () {
  const KEY = "duvertepe-plan-v1";
  const OWNER = { y: "Yiğit", a: "Ahmet", b: "Birlikte" };
  let done = {};
  try { done = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { done = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {} };

  const root = document.getElementById("modules");
  let filter = "all";

  function render() {
    root.innerHTML = MODULES.map((m) => {
      const list = m.tasks.filter((t) => filter === "all" || t.who === filter);
      if (!list.length) return "";
      const pct = Math.round((m.tasks.filter((t) => done[t.id]).length / m.tasks.length) * 100);
      return `<div class="module">
        <div class="module-head"><h3>${m.name}</h3><span class="tag">${m.phase} · %${pct}</span></div>
        <div class="progress"><i style="width:${pct}%"></i></div>
        ${list.map((t) => `
          <label class="task ${done[t.id] ? "done" : ""}">
            <input type="checkbox" data-id="${t.id}" ${done[t.id] ? "checked" : ""}>
            <div><div class="t">${t.t}</div><div class="d">${t.d}</div></div>
            <span class="owner ${t.who}">${OWNER[t.who]}</span>
          </label>`).join("")}
      </div>`;
    }).join("");

    const all = MODULES.flatMap((m) => m.tasks);
    const count = (w) => all.filter((t) => t.who === w).length;
    document.getElementById("totalProgress").textContent =
      `${all.filter((t) => done[t.id]).length} / ${all.length} tamam · Yiğit ${count("y")} · Ahmet ${count("a")} · Birlikte ${count("b")}`;
  }

  root.addEventListener("change", (e) => {
    const id = e.target.dataset.id;
    if (!id) return;
    done[id] = e.target.checked;
    save();
    render();
  });
  document.getElementById("filters").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    filter = b.dataset.f;
    document.querySelectorAll("#filters button").forEach((x) => x.classList.toggle("on", x === b));
    render();
  });
  render();
})();
