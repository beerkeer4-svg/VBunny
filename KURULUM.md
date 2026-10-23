# 🐰 VBunny — Mağazasız kurulum (userscript)

Tarayıcı mağazasına gerek yok. Tampermonkey (veya Violentmonkey) üzerinden **tek linkle** kurulur,
güncellemeler otomatik gelir. Chrome, Edge, Firefox, Opera ve Brave'de çalışır.

---

## Takipçiler için: 3 adım

**1. Tampermonkey'i kur**
- Chrome / Edge: [Tampermonkey](https://www.tampermonkey.net/) → "Download" → mağaza sayfası
- Firefox: [Violentmonkey](https://violentmonkey.github.io/) veya Tampermonkey

**2. Chrome 138+ ise bir ayarı aç** (tek seferlik)
```
chrome://extensions  →  Tampermonkey  →  Ayrıntılar  →  "Kullanıcı betiklerine izin ver"  →  Açık
```
Edge'de aynısı: `edge://extensions` → Tampermonkey → Ayrıntılar → "Kullanıcı betiklerine izin ver".
Bu anahtar kapalıysa hiçbir userscript çalışmaz, hata da vermez — ilk bakılacak yer burası.

**3. Linke tıkla → "Kur"**
```
https://raw.githubusercontent.com/beerkeer4-svg/VBunny/main/vbunny.user.js
```
Tampermonkey kurulum ekranını açar. "Kur"a bas, bitti. Herhangi bir sitede sağ altta panel çıkar.

> Panelin sağ üstündeki **⚙** ile dil, ligler, yenileme aralığı ve "tüm sitelerde göster"
> ayarları açılır. Tampermonkey menüsünden de ("VBunny ayarları") erişilebilir.

---

## Yayıncı (sen) için: GitHub'a koyma

1. GitHub'da bir repo aç (ör. `VBunny`, public).
2. `dist\vbunny.user.js` dosyasını repo **köküne** `vbunny.user.js` adıyla yükle.
3. `src\header.txt` içindeki şu satırları kendi adresinle değiştir, sonra `build.ps1` çalıştır:
   ```
   // @namespace    https://github.com/beerkeer4-svg/VBunny
   // @updateURL    https://raw.githubusercontent.com/beerkeer4-svg/VBunny/main/vbunny.user.js
   // @downloadURL  https://raw.githubusercontent.com/beerkeer4-svg/VBunny/main/vbunny.user.js
   ```
4. Paylaşacağın link:
   ```
   https://raw.githubusercontent.com/beerkeer4-svg/VBunny/main/vbunny.user.js
   ```
5. **Güncelleme:** `@version` değerini artır (ör. 0.4.1) → `build.ps1` → dosyayı repoya tekrar yükle.
   Tampermonkey 24 saat içinde (ya da menüden "Güncellemeleri denetle") yeni sürümü alır.

> Dosya adı `.user.js` ile bitmeli; Tampermonkey sadece bu uzantıyı otomatik yakalar.
> GitHub Pages kullanacaksan ham dosya adresi de çalışır, ama `raw.githubusercontent.com` en pratiği.

---

## Twitter'da paylaşılacak hazır metin

> 🐰 **VBunny** — voleybol skoru artık her sitede, köşede.
> Mağaza yok, izin yok, hesap yok: Tampermonkey'i kur, tek linke tıkla, bitti.
> Efeler/Sultanlar, SuperLega, PlusLiga, Superliga, CEV ŞL + millî maçlar. Canlı set puanı,
> set set sonuçlar, favori takım, 9 dil, 4 tema.
> ↳ kurulum: https://raw.githubusercontent.com/beerkeer4-svg/VBunny/main/vbunny.user.js
> ↳ kaynak: https://github.com/beerkeer4-svg/VBunny

---

## Sık sorulanlar

**Neden mağaza yok?**
Chrome, mağaza dışından `.crx` kurulumunu engelliyor; "indir ve çalıştır" yolu kapalı.
Userscript, mağaza olmadan çalışan tek pratik yol.

**Telefonda çalışır mı?**
Hayır. Masaüstü tarayıcı eklentisi.

**"Panel görünmüyor" diyenler için kontrol listesi**
1. `chrome://extensions` → Tampermonkey → **Kullanıcı betiklerine izin ver** açık mı?
2. Tampermonkey panelinde VBunny **etkin** mi (yeşil)?
3. Sayfayı yenile (F5). Userscript yalnızca sayfa yüklendikten sonra çalışır.
4. ⚙ → "Tüm sitelerde göster" işaretli mi?

**Gizlilik**
Hiçbir veri toplanmaz, sunucu yok, hesap yok. Ayarlar ve favoriler yalnızca tarayıcıda saklanır.
Tek dış bağlantı: Flashscore halka açık skor feed'i ve takım logoları.

**Güncelleme nasıl geliyor?**
Tampermonkey `@updateURL`'den kontrol eder, arka planda kendisi günceller. Kullanıcı bir şey yapmaz.

**Kod değiştirilebilir mi?**
Userscript açık metindir; indiren kişi okuyabilir. `@license` satırı "tüm hakları saklıdır" olarak
duruyor — izinsiz yeniden yayınlanmasını istemiyorsan bunu koru.
