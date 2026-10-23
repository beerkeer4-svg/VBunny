# 🐰 VBunny — canlı voleybol skoru (userscript)

Tüm sitelerde köşede duran kompakt panelde canlı voleybol skorunu gösterir.
Tarayıcı mağazası gerekmez; Tampermonkey / Violentmonkey üzerinden tek linkle kurulur.
Chrome, Edge, Firefox, Opera, Brave.

## Kurulum

**Tek tık:** [`vbunny.user.js`](https://raw.githubusercontent.com/beerkeer4-svg/VBunny/main/vbunny.user.js)

1. **Tampermonkey**'i kur — [tampermonkey.net](https://www.tampermonkey.net/)
2. Chrome 138+ ise: `chrome://extensions` → Tampermonkey → **Ayrıntılar** →
   **"Kullanıcı betiklerine izin ver"** anahtarını aç
3. Yukarıdaki linke tıkla → **Kur**

Güncellemeler Tampermonkey tarafından otomatik alınır (`@updateURL`).

Ayrıntılı anlatım ve sorun giderme: [KURULUM.md](KURULUM.md)

## Ne gösterir?

- **Set skoru** ve **güncel set puanı** (canlı), set set sonuçlar
- Maç durumu: canlı / bitti / başlangıç saati, lig etiketi, takım adları ve logoları
- **Favori** yıldızı, yalnızca favorileri gösteren çip
- Panelde, simgede ve popup'ta canlı maç sayısı
- **9 dil** (TR, EN, PL, PT, IT, JA, ZH, TH, ID), 4 tema, sürüklenebilir/yeniden boyutlandırılabilir panel
- Ligler: Efeler / Sultanlar, SuperLega / Serie A1, PlusLiga, Superliga, CEV ŞL & CEV Cup,
  Tayland, Çin, Japonya V.League + millî maçlar (**⚙** ile seçilir)

Veri kaynağı: Flashscore halka açık skor feed'i (resmî API değildir). Veri toplanmaz, hesap gerekmez;
ayarlar ve favoriler yalnızca tarayıcıda saklanır.

## Geliştirme

Bu depo yalnızca dağıtılabilir dosyayı barındırır; kaynak eklenti (`VoleybolStats`) ayrı bir klasörde durur.
`vbunny.user.js` o kaynaktan üretilir:

- `background.js` → `fetch` yerine `GM_xmlhttpRequest` (CORS), `chrome.alarms` → `setTimeout`
- `chrome.storage.local` → GM storage (JSON) + `onChanged` olayları
- `content.js` → olduğu gibi + başlıkta **⚙** ayarlar düğmesi + CSP uyumlu stiller
  (`adoptedStyleSheets`, CSSOM konumlama)

Sürüm çıkarmak için `@version` artır, derle, `vbunny.user.js`'i bu depoya yükle.

## Lisans

Tüm hakları saklıdır. Kaynak kodu incelemek serbest; izinsiz yeniden yayınlanamaz.
