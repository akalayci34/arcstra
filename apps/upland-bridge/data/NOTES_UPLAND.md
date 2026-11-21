# Upland Sandbox & Bridge Operasyon Notları

> **Mimari Kural:** Bu klasör izole bir dikey sandbox alanıdır. ARCSTRA Core (`server.js`, `db.js`) içinde Upland'e dair hiçbir mantık veya değişken barındırılmaz. Tüm finansal mutabakatlar yalnızca `POST /treasury/escrow` uç noktası üzerinden yürütülür.

---

## 1. Kullanım Şartları (ToS — 8 Haziran 2026) & Güvenlik Sınırları
* **Otomasyon Yasağı (ToS §3):** Upland personelinin yazılı onayı olmadan otomatik alım-satım botu veya script çalıştırmak yasaktır. Bu dizindeki araçlar yalnızca **salt-okunur (read-only) piyasa analizi ve karar destek simülasyonu** içindir; alım-satım işlemleri kullanıcı tarafından manuel yapılır.
* **Hesap ve Fon Ayrımı (ToS §2–§3):** Başkası adına işlem yapmak, hesap paylaşmak veya dış fonları tek hesapta birleştirmek yasaktır.
* **Ödeme ve Çıkış Rayı (ToS §6):** Thunes (eski Tilia) oyun içi alım rayı değil, KYC sonrası USD gelirlerinin çekildiği **çıkış (payout)** kanalıdır. Oyun içi alımlar UPX veya fiat/kripto bakiyesiyle yapılır.
* **Komisyon Gerçeği (ToS §6):** Her işlemde toplam **%10 standart komisyon** (%5 alıcı + %5 satıcı) Topluluk Havuzuna kesilir.
* **Developers API:** Yalnızca Sandbox ortamında (`play.sandbox.upland.me`) test edilir; gerçek hesapla doğrudan bağlanmaz.

---

## 2. Bölge ve Likidite Özeti (Cankurtaran / Sultanahmet)
* **Veri Seti Dosyası:** `apps/upland-bridge/data/cankurtaran_mm_dataset.json`
* **Toplam Satılık Mülk:** 56 Parsel
* **Toplam Alan:** 2.529 UP2
* **Toplam Liste Değeri:** $3.478,69 USD (Flagship `KUTLUGUN SOKAK 2D` hariç 55 mülk: $3.038,70 USD)

---

## 3. Standartlaştırılmış Tier Sistemi
* **TIER_1_INITIAL_100 (İlk 5 Parsel — $93,32 Liste / $97,99 +%5 Alıcı Komisyonu Dahil):**
  1. `KUTLUGUN SOKAK 19` — $17,99 | 17 UP2 ($1,058/UP2) | `01DEEZNU7S` | `[FLOOR_ANCHOR]`
  2. `KUTLUGUN SOKAK 12` — $18,50 | 20 UP2 ($0,925/UP2) | `WILDJASMINE` | `[STREET_LOCK]`
  3. `AKBIYIK CADDE 28` — $18,84 | 21 UP2 ($0,897/UP2) | `UMBRELLABOY` | `[AVENUE_ENTRY]`
  4. `AHIRKAPI CADDE 22A` — $18,99 | 15 UP2 ($1,266/UP2) | `XXMATHIEUXX` | `[SPREAD_GATE]`
  5. `UTANGAC SOKAK 12` — $19,00 | 30 UP2 ($0,633/UP2) | `FLEXRIP` | `[YIELD_ALPHA]`
  * *Etki:* Taban fiyat $17,99'dan $19,99'a yükselir.
* **TIER_1_FLOOR_SWEEP (6–10. Parseller — Kümülatif $195,31 Liste):**
  * $22,00 ve altındaki ilk 10 mülk temizlenir; organik taban $23,06 (`AMIRAL TAFTIL SOKAK 3`) seviyesine çıkar (+%28,1).
* **TIER_2_ACTIVE_MM (11–20. Parseller — Kümülatif $471,92 Liste):**
  * $30,00 ve altındaki 20 mülk kapsanır; sonraki en ucuz giriş $31,00 (`OYUNCU SOKAK 1A`) olur.
* **TIER_3_MID_WALL (21–39. Parseller — $31,00 – $60,00 Aralığı | 19 Parsel):**
  * Orta bant likidite duvarı.
* **TIER_4_VAULT (40–56. Parseller — $62,99 – $439,99 Aralığı | 17 Parsel):**
  * Büyük ticari parseller ve vitrin arzı.

---

## 4. Portföy & Metaventure Notları
* **Hesap:** `ahmetkalayci` (ISTANBUL Metaventure)
* **Odak:** San Francisco merkez mülkleri korunur; Sparklet yapılaşması İstanbul (Beyazıt / Seyyid Ömer / Tarihi Yarımada) ve yüksek kira getirili düğümlerde değerlendirilir.
