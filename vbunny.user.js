// ==UserScript==
// @name         VBunny — canlı voleybol skoru
// @name:en      VBunny — live volleyball scores
// @namespace    https://github.com/beerkeer4-svg/VBunny
// @version      0.4.0
// @description  Tüm sitelerde köşede duran kompakt panelde canlı voleybol skorunu gösterir (Flashscore feed).
// @description:en  Compact live volleyball score panel on every site (Flashscore feed).
// @author       Uğur
// @license      Tüm hakları saklıdır / All rights reserved
// @match        *://*/*
// @run-at       document-idle
// @noframes
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      local-global.flashscore.ninja
// @connect      static.flashscore.com
// @updateURL    https://raw.githubusercontent.com/beerkeer4-svg/VBunny/main/vbunny.user.js
// @downloadURL  https://raw.githubusercontent.com/beerkeer4-svg/VBunny/main/vbunny.user.js
// ==/UserScript==

(function () {
// ---------------------------------------------------------------------------
// chrome.* köprüsü
// Eklenti kodu (shared/background/content) hiç değiştirilmeden çalışsın diye
// chrome.storage / runtime / alarms / action API'lerini userscript ortamında
// taklit eder. Depolama GM_getValue/GM_setValue üzerinde JSON olarak tutulur.
// ---------------------------------------------------------------------------
function __vbCreateChrome() {
  const PREF = "vb_";
  const ICON32 = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAApLSURBVFhHrZcHVFRnGobZtRtgZghFkexmVwOJWWOJHalDld5hCk1AFCyIlIAoYkFBDAiWjdEUTUJiNBrdxO4maNyIWKJiFBtgRWkiCgL32XMvSpTjSbI5+57zn5l7587/fv/X3u/q6PwKbGxseioGj1ik97fha3X6vDJYvHdeEPTegxHLBcFzviBocwRBNaloU8gbY21Lpyel1w4ZY7u1+z5/GD1f/vvUrNyV7D5wgDfG2N50/2L3v4KO/HTD4aMd2K7fyqTVn2O5dgtvBkzh34f2ICIyfg42K9enloCi+37/M4yGjPzi4oWfpI0PHdzNICsPjN2nYKRUY6RUYewaQU9zSxYvWwodD+F+A3n5KzGfnUVoeVV1piCkAL267/u7sEAQho5VR1+/Vn4SSsuhrYm56fPoN8IBA7dIFK4R9LdXMczOncZ716DkNFRU8t4H79NnhCOmERnYfbafGbebfiwQhKHd9/9VZAuCvaqs4p65ewjnjh2GQyfh1AWqr53jL2OV9LdXoz85ih4jnMhclg0P6mFbCVTeYEVhAb0neGGqTcbIJ47XM9YSdq66VtyzO88LsVwQ7DSlPz8a6DsNxdCJHD18EE5cgB1H4FEDcUkp9Bjthq5bNAajlJQdL4Hzl2FrCdy6RWLGfHpO8kcvcA4m6mRMQxJ5JT4bzalrLb9pRKEgmEecuVZv5h+HiVJFv2G2bNy0ES5XwdbvofI63+7dSf/h9vR2DGOsWwAtNZVwqAx2HYXb15msiaSPSyTy4LnIguZgqEnBLDSVvyasIOL8jYZ3BcGiO6+E49Arrrr2mEVcJgNsA5A7avjzcEdik5Lh7h3Yfhh+OMPta+UMsXbnT+O8CZuRAPU1sPMH+O4UtyvOMMTOE12/WShC5qJQJSFXJ2MYlo5ZeDpDsz8kvrquFOjZnV9nfruQYLdhOy9P9MbISYuuXQj9rAMY7ujF/epLcKAM9h6Hx/fxjpqOjrkVK1YXQmMDbDsMFyvZuq2YfqNdkatTJXIDdQoK7TvIQ9MYELUAE1USyq3fI3I9R74PZOpj5+8M9JjCQGeRPBh9BzV6zmH0fdOar3ZsgZv3uPPRN+wq3sK4yb7oGFoQEhtP2a59sPMoPGwkOGYavR1CUWhSUahTMNC+g0FYurTk2ncwi0jHLCYTbVnFHZGzy4AsQYi0XrcFI2t/FI4a9JVqZI5a9F3C6WsdgNJPzdzUDFw9Q4ialUhe4SrWbXif9MVL8dVEERgYwcKFizCz9UEmnl7TefJO8nkYhKahEEOhTsbEfxa2m/eQ2S5M6TJg6tWa3UNi5jHASYuevUoilzmHIXOLos94L14ba0/R+vXcq60GWoDHvyzhPv8pO0pweDT937JDX5XcSRya9sunaJBqLrLA2ZgGJ2CelEfMlZq9EvkhkPvt+7F2gFskxq5h6Dloush7j/fCarIvVy+fAzqgowFa7j2/WmuBh0ArRYWr0B/liDw0HYPwjCfkyRK5IigBmf9MBgTPxjQkAb+Dx+t2ie26UBBGO3+2W2qtBi5h6DuFInONpL9Sg8UkFyovnek8qUj2uO7FBoirrR5oJzNzIX0tfVFELug6uUguD5iF3DceQ/94jD1jcNmyn3xBGKOzWBC8bN/fhqFShdwlHJlLOPru0fQa4UBh0SpAgJa70N7QSfSsEU+JW598F5p4UFvJcAcvdP1nSZXQRe4Xj9xnGgqvWIxcI7D9YAdLwFtHlNRJq4ul0pO7RiCbHInu5CkMGufM5fIyoBmEZo7+cIiAyOmUny2TiERCoa2BpIxMcvILEUTDxGeBjIVZ9LANQaZOeY5c5jkVuXsUxi7hWK4pZoEghIqioxFl1dg5DPnkSGTu0fRzCmeUsx/NtVWdcRceUHqsBDuvYE6dOCpdSyfuaGRWShrzly4D2jh9upS1Gz/EzT8EHQtL+rtESHEXXS/3jJHySuQwdtZiWfQZmYKgFYXHw3bDdoxcwlF4RCPziJH+ONLJV3JnZ+KJIajvdHdbXSe5eC2GgXaqKi8QHDkVa3d/piZmsCR/LWlZy7H2CEL2ljX6zqHS6WWuEchdwzFShmDz3peI4dcpgLedivdg7DYFQ+9Y6UE9r1hMxztTce54p1ufxlx08+NaqL8JVVekkjx56hijndVsXOlD28WZUgie4lFrKxs/KWbAW9bo2vij7xqBgUsoRvbBOG3ehVgAOl+JZbi/9N5A/xmY+MWh7xWLzH8WvUe7UlCQ31l+z2Y9zZSfPkb+ynyam+5iMc6eYbY+rCrKpPXIGB43naZJLMyOTiMy90F03gHMx1rxkl0QRq5hmLiE4vPtkVqxBXQ2oss1u19LWMZA0QDvacj9ZqLrGcuQic5cPn/iSRnehbYGbt28Ql5hIcvz8wkIjyYnP5/q69UsyvsnRamvwu1sHjzxQOq2B3itbuQRkLY4l15vWGLsrGFwZApTL93e09UJFwhClM3H32DiGcvLYtb6z5DUrK9dCJNcvKl82oiERh413OBh8x3qbl9BFR3X5e6cVevJW6KCCm/R+eTse4wyr56bzYJYyHx3spxBo2xRTPTCek2xmIDRXQaIYdCUVdSYhr2DmSpRylyxfkVR6avUMMzGjc+LN9PccFPqeBJaa7HxCCQxPYPk9DRGBi/FK+ck/DSBTQdPMSm3hUt1HdLpxRZ1pb6F4XYeyG0DUB87XyNydhkgYv5jIcHu030Y+8ZLk4w4TEiNJGweL/nOQHecG+Pcgpidms7qdWt4tyCfMQ6ebN6+m9Iz5dx9DBuONLNi4zoGpzVScqNTLe60QV1HB1drbjFkpBUTCzaR0S7MeY5chDgkTK+qLbXIWMugkEQMtSnIRWHRpkp9XRGZSf/ABHoptfSc4E3PcZ4YD7fiTEXlkyA84GLVz8QW7mXVR/nUns+FqjRaz05HqIji9JfeDAuMYurVmhcPJCLEkSz8XFXDX2Ysk8Yooyc63qVq2lTkGtGwJEn1+oz1IWteBNTMpeFHFRf2a+HEBCgPIv+Dd9m+t5i2xsO0d1xmbloylksKG1fB6915n0OuINhrT19rEWc4s7B0aZIRjVA8o2pSe/WfgZ5HLK+9PYKcomy0G+9RcrUNzgXSfqeYRd/Bq/PaKW+Br0tOMNgxoMXr673K7nwvRDY4TLlwu/7NZR9jokqWJhlxmBD1XExQmdhavachE5cymN7mbiQW7qNdzPeLHtBySApK5KZH2M39mpF2Tk1mDr7O3Xl+FbmC8I+ZNQ+PKrd9zyuxC6VJRhwmTIJmY+gXj8I7VhIWUTkNlAGYjbLGJUDDwtnjyF6aRlJWLm5RCZi8bV8qG2U1qvv+vwtAjwWCMCfsbGWVffFeLJJXYqqaI+m5KKmiqhk7aTF0UGOoDOGl8R4Ye8UzNquASTlrqq1zixL/8KvZs/gEFFkQE3ezcU/QkbN17jsP4/jpbqzWbcFq7ec4bNqF21eHCDp8ui7uVtOeBRDzf3k5fRG2CoLxCkGYuBy85wtCmLiyBcFHvCf+1v3538J/AXQkMAunugziAAAAAElFTkSuQmCC";

  const cache = new Map();
  const changeListeners = new Set();
  const messageListeners = new Set();
  const alarmListeners = new Set();
  const alarmTimers = new Map();

  const hasSyncGM =
    typeof GM_getValue === "function" && typeof GM_setValue === "function";
  const hasAsyncGM =
    !hasSyncGM && typeof GM !== "undefined" && GM && typeof GM.getValue === "function";

  function parse(txt) {
    if (typeof txt !== "string") return txt === undefined ? null : txt;
    try {
      return JSON.parse(txt);
    } catch (e) {
      return txt;
    }
  }

  async function readRaw(key) {
    if (cache.has(key)) return cache.get(key);
    let txt = null;
    if (hasSyncGM) txt = GM_getValue(PREF + key, null);
    else if (hasAsyncGM) txt = await GM.getValue(PREF + key, null);
    else txt = localStorage.getItem(PREF + key);
    const val = parse(txt);
    cache.set(key, val);
    return val;
  }

  async function writeRaw(key, value) {
    const txt = JSON.stringify(value === undefined ? null : value);
    if (hasSyncGM) GM_setValue(PREF + key, txt);
    else if (hasAsyncGM) await GM.setValue(PREF + key, txt);
    else localStorage.setItem(PREF + key, txt);
  }

  function fireChanges(changes) {
    if (!Object.keys(changes).length) return;
    queueMicrotask(() => {
      for (const fn of Array.from(changeListeners)) {
        try {
          fn(changes, "local");
        } catch (e) {
          /* dinleyici hatası akışı bozmasın */
        }
      }
    });
  }

  function normKeys(keys) {
    if (keys == null) return [];
    if (typeof keys === "string") return [keys];
    if (Array.isArray(keys)) return keys.map(String);
    if (typeof keys === "object") return Object.keys(keys);
    return [];
  }

  async function storageGet(keys) {
    const out = {};
    const list = normKeys(keys);
    const defaults = keys && typeof keys === "object" && !Array.isArray(keys) ? keys : null;
    for (const k of list) {
      const v = await readRaw(k);
      if (v !== null && v !== undefined) out[k] = v;
      else if (defaults && k in defaults) out[k] = defaults[k];
    }
    return out;
  }

  async function storageSet(obj) {
    obj = obj || {};
    const changes = {};
    for (const k of Object.keys(obj)) {
      const oldValue = await readRaw(k);
      const newValue = obj[k];
      if (JSON.stringify(oldValue) === JSON.stringify(newValue)) continue;
      cache.set(k, newValue);
      await writeRaw(k, newValue);
      changes[k] = { oldValue, newValue };
    }
    fireChanges(changes);
  }

  async function storageRemove(keys) {
    const changes = {};
    for (const k of normKeys(keys)) {
      const oldValue = await readRaw(k);
      if (oldValue === null || oldValue === undefined) continue;
      cache.delete(k);
      if (hasSyncGM) GM_setValue(PREF + k, "null");
      else if (hasAsyncGM) await GM.setValue(PREF + k, "null");
      else localStorage.removeItem(PREF + k);
      changes[k] = { oldValue, newValue: undefined };
    }
    fireChanges(changes);
  }

  async function storageClear() {
    const changes = {};
    for (const k of Array.from(cache.keys())) {
      changes[k] = { oldValue: cache.get(k), newValue: undefined };
      cache.delete(k);
    }
    fireChanges(changes);
  }

  const storageArea = {
    get: storageGet,
    set: storageSet,
    remove: storageRemove,
    clear: storageClear,
    getBytesInUse: async () => 0,
    QUOTA_BYTES: 5242880,
  };

  function sendMessage(msg) {
    return new Promise((resolve) => {
      let settled = false;
      const done = (v) => {
        if (settled) return;
        settled = true;
        resolve(v);
      };
      for (const fn of Array.from(messageListeners)) {
        try {
          const keep = fn(msg, { id: "vbunny-userscript", url: location.href }, done);
          if (keep && typeof keep.then === "function") keep.then(done, () => {});
        } catch (e) {
          /* yut */
        }
      }
      setTimeout(() => done(undefined), 12000);
    });
  }

  const alarms = {
    create(name, info) {
      const when =
        info && info.when
          ? info.when
          : Date.now() + (info && info.delayInMinutes ? info.delayInMinutes * 60000 : 60000);
      const prev = alarmTimers.get(name);
      if (prev) clearTimeout(prev);
      const t = setTimeout(() => {
        alarmTimers.delete(name);
        for (const fn of Array.from(alarmListeners)) {
          try {
            fn({ name, scheduledTime: Date.now() });
          } catch (e) {
            /* yut */
          }
        }
      }, Math.max(0, when - Date.now()));
      alarmTimers.set(name, t);
    },
    clear(name) {
      const t = alarmTimers.get(name);
      if (t) clearTimeout(t);
      alarmTimers.delete(name);
    },
    clearAll() {
      for (const t of alarmTimers.values()) clearTimeout(t);
      alarmTimers.clear();
    },
    get: async () => ({}),
    getAll: async () => ({}),
    onAlarm: {
      addListener: (fn) => alarmListeners.add(fn),
      removeListener: (fn) => alarmListeners.delete(fn),
    },
  };

  const noop = () => {};
  const action = {
    setBadgeText: async () => {},
    setBadgeBackgroundColor: async () => {},
    setTitle: async () => {},
    setIcon: async () => {},
    onClicked: { addListener: noop },
  };

  const runtime = {
    id: "vbunny-userscript",
    getURL: () => (ICON32 ? "data:image/png;base64," + ICON32 : ""),
    getManifest: () => ({ version: "0.4.0" }),
    sendMessage,
    onMessage: {
      addListener: (fn) => messageListeners.add(fn),
      removeListener: (fn) => messageListeners.delete(fn),
      hasListener: (fn) => messageListeners.has(fn),
    },
    onInstalled: { addListener: noop },
    onStartup: { addListener: noop },
    onSuspend: { addListener: noop },
    lastError: null,
  };

  return {
    storage: { local: storageArea, sync: storageArea, session: storageArea, onChanged: { addListener: (fn) => changeListeners.add(fn), removeListener: (fn) => changeListeners.delete(fn) } },
    runtime,
    alarms,
    action,
    tabs: { query: async () => [], sendMessage: async () => undefined, create: noop, get: async () => null },
    scripting: { executeScript: async () => [] },
  };
}

// ---------------------------------------------------------------------------
// fetch yerine GM_xmlhttpRequest (CORS'u aşar; flashscore.ninja için şart)
// ---------------------------------------------------------------------------
function __vbGmFetch(url, opts) {
  opts = opts || {};
  return new Promise((resolve, reject) => {
    const headers = Object.assign({}, opts.headers || {});
    if (opts.cache === "no-store") headers["Cache-Control"] = "no-cache";
    const req = {
      method: opts.method || "GET",
      url,
      headers,
      timeout: opts.timeout || 15000,
      nocache: opts.cache === "no-store",
      responseType: "text",
      onload: (r) =>
        resolve({
          ok: r.status >= 200 && r.status < 300,
          status: r.status,
          statusText: r.statusText || "",
          headers: r.responseHeaders || "",
          text: async () => r.responseText,
          json: async () => JSON.parse(r.responseText),
        }),
      onerror: () => reject(new Error("Ağ hatası")),
      ontimeout: () => reject(new Error("Zaman aşımı")),
      onabort: () => reject(new Error("İptal edildi")),
    };
    if (opts.signal) {
      if (opts.signal.aborted) return reject(new Error("İptal edildi"));
      opts.signal.addEventListener(
        "abort",
        () => {
          try {
            req.abort && req.abort();
          } catch (e) {}
          reject(new Error("İptal edildi"));
        },
        { once: true }
      );
    }
    const fn =
      typeof GM_xmlhttpRequest === "function"
        ? GM_xmlhttpRequest
        : typeof GM !== "undefined" && GM && GM.xmlHttpRequest
        ? GM.xmlHttpRequest.bind(GM)
        : null;
    if (!fn) return reject(new Error("GM_xmlhttpRequest yok"));
    try {
      fn(req);
    } catch (e) {
      reject(e);
    }
  });
}

const chrome = __vbCreateChrome();

// ===== shared.js (eklentiden, degismeden) =====
// VBunny - ortak yardımcılar
// Veri kaynağı: Flashscore halka açık feed'i (resmî API değildir).
(function (global) {
  const VB_FEED = "https://local-global.flashscore.ninja/2/x/feed/";
  const VB_FSIGN = "SW9D1eZo"; // Flashscore feed imzası
  const VB_SPORT = 12; // Flashscore voleybol

  const VB_DEFAULT_CONFIG = {
    comps: {
      trMen: true,
      trWomen: true,
      itMen: true,
      itWomen: true,
      clMen: true,
      clWomen: true,
      cevcMen: true,
      cevcWomen: true,
      plMen: true,
      plWomen: true,
      brMen: true,
      brWomen: true,
      thMen: true,
      thWomen: true,
      cnMen: true,
      cnWomen: true,
      jpMen: true,
      jpWomen: true,
      national: true,
    },
    allSites: true,
    showOnYouTube: true,
    showOnTwitch: true,
    startCollapsed: false,
    fastLive: true,
    refreshSec: 30,
    panelWidth: 320,
    panelHeight: null,
    teamTheme: true,
    teamThemeName: "",
    theme: "team",
    accountOnly: true,
    lang: "tr",
  };

  const COMP_LABELS = {
    trMen: "Efeler Ligi",
    trWomen: "Sultanlar Ligi",
    itMen: "SuperLega",
    itWomen: "Serie A1",
    clMen: "CEV ŞL",
    clWomen: "CEV ŞL (K)",
    cevcMen: "CEV Cup",
    cevcWomen: "CEV Cup (K)",
    plMen: "PlusLiga",
    plWomen: "PlusLiga (K)",
    brMen: "Superliga",
    brWomen: "Superliga Feminina",
    thMen: "Thailand Men",
    thWomen: "Thailand Women",
    cnMen: "China Men",
    cnWomen: "China Women",
    jpMen: "V.League Men",
    jpWomen: "V.League Women",
  };

  // "A÷B¬C÷D" → { A: "B", C: "D" }
  function parseKv(str) {
    const out = {};
    const parts = String(str || "").split("¬");
    for (const p of parts) {
      const i = p.indexOf("÷");
      if (i > 0) out[p.slice(0, i)] = p.slice(i + 1);
    }
    return out;
  }

  function num(v) {
    if (v === undefined || v === null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  // Feed metnini maç listesine çevirir.
  function parseFeed(text) {
    const out = [];
    const blocks = String(text || "").split("~ZA÷").slice(1);
    for (const block of blocks) {
      const segs = block.split("~AA÷");
      const head = parseKv("ZA÷" + segs[0]);
      const league = {
        name: head.ZA || "",
        path: head.ZL || "",
        country: head.ZAF || "",
        id: head.ZEE || "",
      };
      for (let i = 1; i < segs.length; i++) {
        const ev = parseKv("AA÷" + segs[i]);
        if (!ev.AA) continue;
        out.push({
          id: ev.AA,
          league: league.name,
          leaguePath: league.path,
          country: league.country,
          start: (num(ev.AD) || 0) * 1000,
          status: num(ev.AB) || 0, // 1 program, 2 canlı, 3 bitti
          home: ev.AE || "",
          away: ev.AF || "",
          homeLogo: logoUrl(ev.OA),
          awayLogo: logoUrl(ev.OB),
          homeSets: num(ev.AG),
          awaySets: num(ev.AH),
        });
      }
    }
    return out;
  }

  function compOf(league) {
    const l = String(league || "");
    if (/^TURKEY:\s*Efeler Ligi/i.test(l)) return "trMen";
    if (/^TURKEY:\s*Sultanlar Ligi/i.test(l)) return "trWomen";
    if (/^ITALY:\s*SuperLega/i.test(l)) return "itMen";
    if (/^ITALY:\s*Serie A1/i.test(l)) return "itWomen";
    // Flashscore, Polonya erkek PlusLiga'yı "TAURON Liga" adıyla verebiliyor.
    if (/^POLAND:\s*(PlusLiga|TAURON Liga)(?!\s+Women)/i.test(l)) return "plMen";
    if (/^POLAND:\s*(PlusLiga|TAURON Liga)\s+Women/i.test(l)) return "plWomen";
    if (/^BRAZIL:\s*Superliga(?:\s+(Women|Masculina|Feminina))?\s*$/i.test(l)) {
      return /women|feminina/i.test(l) ? "brWomen" : "brMen";
    }
    if (/^THAILAND:\s*Women/i.test(l)) return "thWomen";
    if (/^THAILAND:/i.test(l)) return "thMen";
    if (/^CHINA:\s*Women/i.test(l)) return "cnWomen";
    if (/^CHINA:/i.test(l)) return "cnMen";
    if (/^JAPAN:\s*V\.League\s*Women/i.test(l)) return "jpWomen";
    if (/^JAPAN:/i.test(l)) return "jpMen";
    if (/^EUROPE:\s*Champions League/i.test(l)) {
      return /women/i.test(l) ? "clWomen" : "clMen";
    }
    if (/^EUROPE:\s*CEV Cup/i.test(l)) {
      return /women/i.test(l) ? "cevcWomen" : "cevcMen";
    }
    return null;
  }

  function isNationalTeam(name) {
    return /^(turkey|türkiye|italy|italya)$/i.test(String(name || "").trim());
  }

  // Ulusal takım konkuransını lig adına göre tespit eder (Dünya Şampionası, Avrupa Şampionası, VNL, Olimpiyat vb.).
  function isNationalLeague(leagueName) {
    const l = String(leagueName || "");
    return /world|europe|olympic|championship|nations league|continental|challenger cup|world cup|grand champions/i.test(l);
  }

  function tagsOf(m) {
    const tags = [];
    if (m.comp) tags.push(m.comp);
    if (m.comp && m.comp.startsWith("tr")) tags.push("tr");
    if (m.comp && m.comp.startsWith("it")) tags.push("it");
    if (m.comp && m.comp.startsWith("cl")) tags.push("cl");
    if (m.comp && m.comp.startsWith("cevc")) tags.push("cevc");
    if (m.comp && m.comp.startsWith("pl")) tags.push("pl");
    if (m.comp && m.comp.startsWith("br")) tags.push("br");
    if (m.comp && m.comp.startsWith("th")) tags.push("th");
    if (m.comp && m.comp.startsWith("cn")) tags.push("cn");
    if (m.comp && m.comp.startsWith("jp")) tags.push("jp");
    if (isNationalTeam(m.home) || isNationalTeam(m.away) || isNationalLeague(m.league)) {
      tags.push("milli");
      if (isNationalTeam(m.home) || isNationalTeam(m.away)) {
        if (/turkey|türkiye/i.test(m.home + m.away)) tags.push("tr");
        if (/italy|italya/i.test(m.home + m.away)) tags.push("it");
      }
    }
    return [...new Set(tags)];
  }

  // Detay feed'i: set skorları (AC÷Set 1¬IG÷25¬IH÷19 ...)
  function parseSetScores(text) {
    const out = [];
    for (const chunk of String(text || "").split("~")) {
      const kv = parseKv(chunk);
      if (!kv.AC || !/^Set\s*\d+/i.test(kv.AC)) continue;
      out.push({ label: kv.AC, h: num(kv.IG), a: num(kv.IH) });
    }
    return out;
  }

  // ---- Dil / i18n ---------------------------------------------------------
  const LANGS = [
    { id: "tr", label: "Türkçe" },
    { id: "en", label: "English" },
    { id: "pl", label: "Polski" },
    { id: "pt", label: "Português" },
    { id: "it", label: "Italiano" },
    { id: "ja", label: "日本語" },
    { id: "zh", label: "中文" },
    { id: "th", label: "ไทย" },
    { id: "id", label: "Bahasa Indonesia" },
  ];

  const I18N = {
    tr: {
      vb: "Voleybol",
      brand: "Canlı Stats",
      live: "Canlı",
      today: "Bugün",
      soon: "Yaklaşan",
      all: "Tümü",
      national: "Milli",
      milliTag: "MİLLİ",
      clTag: "ŞL",
      favorite: "Favori",
      clShort: "ŞL",
      noLive: "Şu an canlı maç yok.",
      noMatches: "Bu görünümde maç yok.",
      next: "Sıradaki",
      set: "SET",
      finished: "Bitti",
      done: "Biten",
      liveUpper: "CANLI",
      hide: "gizle",
      show: "Göster",
      refresh: "Yenile",
      collapse: "Küçült",
      expand: "Büyüt",
      favTitle: "Favori",
      stale: "eski veri",
      noData: "veri yok",
      updated: "son güncelleme",
      settings: "Ayarlar",
      liveCount: "{n} canlı",
      todayWord: "Bugün",
      tomorrowWord: "Yarın",
      optTitle: "VBunny — Ayarlar",
      optSubtitle: "Tüm sitelerde gezinirken köşede duran kompakt canlı voleybol skor paneli.",
      leagues: "Ligler",
      men: "(erkek)",
      women: "(kadın)",
      nationalDesc: "Millî maçlar; VNL, Avrupa Şampiyonası, Dünya Şampiyonası gibi organizasyonlarda Türkiye veya İtalya'nın oynadığı karşılaşmaları kapsar.",
      comp_trMen: "Efeler Ligi",
      comp_trWomen: "Sultanlar Ligi",
      comp_itMen: "SüperLega",
      comp_itWomen: "Serie A1",
      comp_clMen: "CEV Şampiyonlar Ligi",
      comp_clWomen: "CEV Şampiyonlar Ligi (K)",
      comp_cevcMen: "CEV Cup",
      comp_cevcWomen: "CEV Cup (K)",
      comp_plMen: "PlusLiga",
      comp_brMen: "Süperliga",
      comp_brWomen: "Süperliga Feminina",
      comp_plWomen: "PlusLiga (K)",
      comp_thMen: "Tayland Erkekler",
      comp_thWomen: "Tayland Kadınlar",
      comp_cnMen: "Çin Erkekler",
      comp_cnWomen: "Çin Kadınlar",
      comp_jpMen: "Japonya V.League Erkekler",
      comp_jpWomen: "Japonya V.League Kadınlar",
      comp_national: "Milli",
      panel: "Panel",
      showYT: "YouTube'da göster",
      showTwitch: "Twitch'te göster",
      startCollapsed: "Küçük (pill) olarak başlat",
      fastLive: "Canlı maçta 2 sn'de bir güncelle",
      panelWidth: "Panel genişliği",
      resetPos: "Paneli sıfırla",
      panelHint: "Paneli başlıktan veya küçük pill'den sürükleyebilirsiniz. Pill varsayılan olarak alt ortada durur ve bıraktığınız konumu hatırlar.",
      teamTheme: "Takım renkleri + logo teması",
      teamThemeHint: "Türkiye, İtalya, Polonya ve Brezilya takımları için renkler ve logolar kullanılır.",
      bgRefresh: "Arka plan yenileme",
      data: "Veri",
      refreshNow: "Şimdi yenile",
      saved: "Kaydedildi.",
      refreshing: "Yenileniyor…",
      justRefreshed: "Az önce yenilendi.",
      statusLine: "{count} maç • {live} canlı • son güncelleme {time}",
      resetDone: "Panel konumu sıfırlandı.",
      sourceNote: "Kaynak: Flashscore halka açık voleybol feed'i (resmî API değil). Set skorları, güncel set puanı ve toplam sayılar bu kaynaktan gelir. Veri gecikmesi kaynağın kendi güncelleme hızına bağlıdır (genellikle 10–30 sn).",
      language: "Dil",
      accounts: "Hesaplar (deneysel)",
      accountNote: "Flashscore ve Sofascore'un resmî hesap/favori API'si yok. Şifreniz istenmez ve saklanmaz. Siteye normal şekilde giriş yapın, favoriler sayfasını açık bırakın ve 'Favorileri aktar' düğmesine basın. Yalnızca açık sayfadaki maç bağlantıları okunur.",
      openSite: "Siteyi aç",
      importFav: "Favorileri aktar",
      clearImported: "İçe aktarılanları temizle",
      importManual: "URL'lerden aktar",
      manualPh: "Flashscore maç URL'leri veya 'Takım A - Takım B' satırları (her satıra bir tane)",
      importDone: "{matched}/{total} favori eşleşti.",
      importNoTab: "Açık bir {site} sekmesi bulunamadı. Önce siteyi açıp giriş yapın.",
      importNeedPage: "Lütfen {site} favoriler sayfasını açın.",
      importEmpty: "Favori bulunamadı.",
      importError: "Aktarma başarısız.",
      importedStatus: "{n} favori • {time}",
      cleared: "İçe aktarılan favoriler temizlendi.",
      error: "Hata",
      notImported: "Bağlı değil",
      fsHint: "Flashscore'da giriş yapıp My Games sayfasını açın, sonra aktarın.",
      soHint: "Sofascore'da giriş yapıp favoriler sayfasını açın, sonra aktarın.",
      allSites: "Tüm sitelerde göster",
      allSitesHint: "Kapalıysa yalnızca YouTube/Twitch'te görünür.",
      theme: "Tema",
      themeTeam: "Takım",
      themeDark: "Koyu",
      themeLight: "Açık",
      themeNeon: "Neon",
      themeHint: "Temayı panelin üstündeki palet düğmesinden de değiştirebilirsiniz.",
      teamPick: "Takım teması",
      teamAuto: "Otomatik (maçtaki takımlar)",
      pin: "Sabitle",
      unpin: "Sabitlemeyi kaldır",
      resize: "Boyutlandır",
      resizeHint: "Sağ alt köşeden sürükleyerek genişlik ve yüksekliği ayarlayın.",
      scored: "SAYI",
      setWon: "SET",
      accountMode: "Hesap favorileri",
      accountShort: "HESAP",
      noAccountFav: "Hesap favorilerinde maç yok.",
      accountOnly: "Hesap bağlıyken sadece favorileri göster",
      accountOnlyHint: "Flashscore/Sofascore favorileri aktarıldığında normal fikstür gizlenir.",
    },
    en: {
      vb: "Volleyball",
      brand: "Live Stats",
      live: "Live",
      today: "Today",
      soon: "Upcoming",
      all: "All",
      national: "National",
      milliTag: "NAT",
      clTag: "CL",
      favorite: "Favorites",
      clShort: "CL",
      noLive: "No live matches right now.",
      noMatches: "No matches in this view.",
      next: "Next",
      set: "SET",
      finished: "Finished",
      done: "Finished",
      liveUpper: "LIVE",
      hide: "hide",
      show: "Show",
      refresh: "Refresh",
      collapse: "Minimize",
      expand: "Expand",
      favTitle: "Favorite",
      stale: "stale data",
      noData: "no data",
      updated: "last update",
      settings: "Settings",
      liveCount: "{n} live",
      todayWord: "Today",
      tomorrowWord: "Tomorrow",
      optTitle: "VBunny — Settings",
      optSubtitle: "A compact live volleyball score panel that stays in the corner while you browse any site.",
      leagues: "Leagues",
      men: "(men)",
      women: "(women)",
      nationalDesc: "National matches include Turkey or Italy games in competitions such as VNL, the European Championship and the World Championship.",
      comp_trMen: "Turkish Men's League",
      comp_trWomen: "Turkish Women's League",
      comp_itMen: "Italian SuperLega",
      comp_itWomen: "Italian Serie A1",
      comp_clMen: "CEV Champions League",
      comp_clWomen: "CEV Champions League (Women)",
      comp_cevcMen: "CEV Cup",
      comp_cevcWomen: "CEV Cup (Women)",
      comp_plMen: "PlusLiga",
      comp_brMen: "Brazilian Superliga",
      comp_brWomen: "Brazilian Superliga Feminina",
      comp_plWomen: "PlusLiga (Women)",
      comp_thMen: "Thailand Men",
      comp_thWomen: "Thailand Women",
      comp_cnMen: "China Men",
      comp_cnWomen: "China Women",
      comp_jpMen: "V.League Men",
      comp_jpWomen: "V.League Women",
      comp_national: "National Teams",
      panel: "Panel",
      showYT: "Show on YouTube",
      showTwitch: "Show on Twitch",
      startCollapsed: "Start minimized (pill)",
      fastLive: "Update live matches every 2 s",
      panelWidth: "Panel width",
      resetPos: "Reset panel position",
      panelHint: "Drag the panel by its header or by the small pill. The pill starts bottom-center and remembers where you leave it.",
      teamTheme: "Team colors + logo theme",
      teamThemeHint: "Uses colors and logos for Turkish, Italian, Polish and Brazilian teams.",
      bgRefresh: "Background refresh",
      data: "Data",
      refreshNow: "Refresh now",
      saved: "Saved.",
      refreshing: "Refreshing…",
      justRefreshed: "Refreshed just now.",
      statusLine: "{count} matches • {live} live • last update {time}",
      resetDone: "Panel position reset.",
      sourceNote: "Source: Flashscore public volleyball feed (not an official API). Set scores, current set points and totals come from this source. Data delay depends on the source update rate (usually 10–30 s).",
      language: "Language",
      accounts: "Accounts (experimental)",
      accountNote: "Flashscore and Sofascore have no official account/favorites API. Your password is never requested or stored. Log in normally on the site, keep the favorites page open and press 'Import favorites'. Only match links on the open page are read.",
      openSite: "Open site",
      importFav: "Import favorites",
      clearImported: "Clear imported",
      importManual: "Import from URLs",
      manualPh: "Flashscore match URLs or 'Team A - Team B' lines (one per line)",
      importDone: "{matched}/{total} favorites matched.",
      importNoTab: "No open {site} tab found. Open the site and log in first.",
      importNeedPage: "Please open the {site} favorites page.",
      importEmpty: "No favorites found.",
      importError: "Import failed.",
      importedStatus: "{n} favorites • {time}",
      cleared: "Imported favorites cleared.",
      error: "Error",
      notImported: "Not connected",
      fsHint: "Log in on Flashscore, open My Games, then import.",
      soHint: "Log in on Sofascore, open your favorites, then import.",
      allSites: "Show on all sites",
      allSitesHint: "When off, the panel appears only on YouTube/Twitch.",
      theme: "Theme",
      themeTeam: "Team",
      themeDark: "Dark",
      themeLight: "Light",
      themeNeon: "Neon",
      themeHint: "You can also switch themes from the palette button at the top of the panel.",
      teamPick: "Team theme",
      teamAuto: "Auto (teams in match)",
      pin: "Pin",
      unpin: "Unpin",
      resize: "Resize",
      resizeHint: "Drag the bottom-right corner to adjust width and height.",
      scored: "POINT",
      setWon: "SET",
      accountMode: "Account favorites",
      accountShort: "ACCOUNT",
      noAccountFav: "No matches in account favorites.",
      accountOnly: "Show only favorites when an account is connected",
      accountOnlyHint: "When Flashscore/Sofascore favorites are imported, the normal fixture is hidden.",
    },
    pl: {
      vb: "Siatkówka",
      brand: "Na żywo",
      live: "Na żywo",
      today: "Dziś",
      soon: "Nadchodzące",
      all: "Wszystkie",
      national: "Reprezentacja",
      milliTag: "REP",
      clTag: "LM",
      favorite: "Ulubione",
      clShort: "LM",
      noLive: "Brak meczów na żywo.",
      noMatches: "Brak meczów w tym widoku.",
      next: "Następny",
      set: "SET",
      finished: "Zakończony",
      done: "Zakończony",
      liveUpper: "NA ŻYWO",
      hide: "ukryj",
      show: "Pokaż",
      refresh: "Odśwież",
      collapse: "Zwiń",
      expand: "Rozwiń",
      favTitle: "Ulubione",
      stale: "nieaktualne dane",
      noData: "brak danych",
      updated: "ostatnia aktualizacja",
      settings: "Ustawienia",
      liveCount: "{n} na żywo",
      todayWord: "Dziś",
      tomorrowWord: "Jutro",
      optTitle: "VBunny — Ustawienia",
      optSubtitle: "Kompaktowy panel z wynikami siatkówki na żywo w rogu ekranu podczas przeglądania dowolnej strony.",
      leagues: "Ligi",
      men: "(mężczyźni)",
      women: "(kobiety)",
      nationalDesc: "Mecze reprezentacji obejmują spotkania Turcji lub Włoch w rozgrywkach VNL, mistrzostwach Europy i świata.",
      comp_trMen: "Turecka Liga Mężczyzn",
      comp_trWomen: "Turecka Liga Kobiet",
      comp_itMen: "Włoska SuperLega",
      comp_itWomen: "Włosi Serie A1",
      comp_clMen: "Liga Mistrzów CEV",
      comp_clWomen: "Liga Mistrzów CEV (Kobiety)",
      comp_cevcMen: "Puchar CEV",
      comp_cevcWomen: "Puchar CEV (Kobiety)",
      comp_plMen: "PlusLiga",
      comp_brMen: "Brazylijska Superliga",
      comp_brWomen: "Brazylijska Superliga Kobiet",
      comp_plWomen: "PlusLiga (Kobiety)",
      comp_thMen: "Mężczyźni Tajlandii",
      comp_thWomen: "Kobiety Tajlandii",
      comp_cnMen: "Mężczyźni Chin",
      comp_cnWomen: "Kobiety Chin",
      comp_jpMen: "Mężczyźni Japonii",
      comp_jpWomen: "Kobiety Japonii",
      comp_national: "Reprezentacje",
      panel: "Panel",
      showYT: "Pokaż na YouTube",
      showTwitch: "Pokaż na Twitch",
      startCollapsed: "Startuj zwinięty (pigułka)",
      fastLive: "Odświeżaj mecze na żywo co 2 s",
      panelWidth: "Szerokość panelu",
      resetPos: "Resetuj pozycję panelu",
      panelHint: "Przeciągnij panel za nagłówek lub małą pigułkę. Pigułka startuje na dole pośrodku i pamięta pozycję.",
      teamTheme: "Kolory drużyn + motyw logo",
      teamThemeHint: "Używa kolorów i logo drużyn z Turcji, Włoch, Polski i Brazylii.",
      bgRefresh: "Odświeżanie w tle",
      data: "Dane",
      refreshNow: "Odśwież teraz",
      saved: "Zapisano.",
      refreshing: "Odświeżanie…",
      justRefreshed: "Odświeżono przed chwilą.",
      statusLine: "{count} meczów • {live} na żywo • ostatnia aktualizacja {time}",
      resetDone: "Pozycja panelu zresetowana.",
      sourceNote: "Źródło: publiczny kanał Flashscore (nieoficjalne API). Wyniki setów, punkty bieżącego seta i sumy pochodzą z tego źródła. Opóźnienie zależy od źródła (zwykle 10–30 s).",
      language: "Język",
      accounts: "Konta (eksperymentalne)",
      accountNote: "Flashscore i Sofascore nie mają oficjalnego API kont/ulubionych. Hasło nie jest proszone ani przechowywane. Zaloguj się normalnie na stronie, otwórz ulubione i naciśnij 'Importuj ulubione'. Odczytywane są tylko linki meczów na otwartej stronie.",
      openSite: "Otwórz stronę",
      importFav: "Importuj ulubione",
      clearImported: "Wyczyść zaimportowane",
      importManual: "Importuj z URL",
      manualPh: "Adresy meczów Flashscore lub wiersze 'Drużyna A - Drużyna B' (jeden na linię)",
      importDone: "Dopasowano {matched}/{total} ulubionych.",
      importNoTab: "Nie znaleziono otwartej karty {site}. Otwórz stronę i zaloguj się.",
      importNeedPage: "Otwórz stronę ulubionych {site}.",
      importEmpty: "Nie znaleziono ulubionych.",
      importError: "Import nie powiódł się.",
      importedStatus: "{n} ulubionych • {time}",
      cleared: "Wyczyszczono zaimportowane ulubione.",
      error: "Błąd",
      notImported: "Nie połączono",
      fsHint: "Zaloguj się na Flashscore, otwórz My Games, potem importuj.",
      soHint: "Zaloguj się na Sofascore, otwórz ulubione, potem importuj.",
      allSites: "Pokaż na wszystkich stronach",
      allSitesHint: "Po wyłączeniu panel pojawia się tylko na YouTube/Twitch.",
      theme: "Motyw",
      themeTeam: "Drużyna",
      themeDark: "Ciemny",
      themeLight: "Jasny",
      themeNeon: "Neon",
      themeHint: "Motyw możesz też zmienić przyciskiem palety u góry panelu.",
      teamPick: "Motyw drużyny",
      teamAuto: "Automatyczny (drużyny meczu)",
      pin: "Przypnij",
      unpin: "Odepnij",
      resize: "Zmień rozmiar",
      resizeHint: "Przeciągnij prawy dolny róg, aby zmienić szerokość i wysokość.",
      scored: "PUNKT",
      setWon: "SET",
      accountMode: "Ulubione konta",
      accountShort: "KONTO",
      noAccountFav: "Brak meczów w ulubionych konta.",
      accountOnly: "Pokazuj tylko ulubione po połączeniu konta",
      accountOnlyHint: "Po zaimportowaniu ulubionych Flashscore/Sofascore normalny terminarz jest ukryty.",
    },
    pt: {
      vb: "Vôlei",
      brand: "Ao Vivo",
      live: "Ao vivo",
      today: "Hoje",
      soon: "Próximos",
      all: "Todos",
      national: "Seleção",
      milliTag: "SEL",
      clTag: "CL",
      favorite: "Favoritos",
      clShort: "CL",
      noLive: "Nenhuma partida ao vivo agora.",
      noMatches: "Nenhuma partida nesta visão.",
      next: "Próximo",
      set: "SET",
      finished: "Encerrado",
      liveUpper: "AO VIVO",
      hide: "ocultar",
      show: "Mostrar",
      refresh: "Atualizar",
      collapse: "Minimizar",
      expand: "Expandir",
      favTitle: "Favorito",
      stale: "dados antigos",
      noData: "sem dados",
      updated: "última atualização",
      settings: "Configurações",
      liveCount: "{n} ao vivo",
      todayWord: "Hoje",
      tomorrowWord: "Amanhã",
      optTitle: "VBunny — Configurações",
      optSubtitle: "Painel compacto de placar de vôlei ao vivo no canto enquanto você navega em qualquer site.",
      leagues: "Ligas",
      men: "(masculino)",
      women: "(feminino)",
      nationalDesc: "Partidas de seleções incluem jogos da Turquia ou da Itália em competições como VNL, Europeu e Mundial.",
      comp_trMen: "Liga Turca Masculina",
      comp_trWomen: "Liga Turca Feminina",
      comp_itMen: "SuperLega Italiana",
      comp_itWomen: "Serie A1 Italiana",
      comp_clMen: "Liga dos Campeões CEV",
      comp_clWomen: "Liga dos Campeões CEV (Feminino)",
      comp_cevcMen: "CEV Cup",
      comp_cevcWomen: "CEV Cup (Feminino)",
      comp_plMen: "PlusLiga",
      comp_plWomen: "PlusLiga (Feminino)",
      comp_brMen: "Superliga Brasileira",
      comp_brWomen: "Superliga Feminina Brasileira",
      comp_thMen: "Masculino Tailândia",
      comp_thWomen: "Feminino Tailândia",
      comp_cnMen: "Masculino China",
      comp_cnWomen: "Feminino China",
      comp_jpMen: "Masculino Japão",
      comp_jpWomen: "Feminino Japão",
      comp_national: "Seleções Nacionais",
      panel: "Painel",
      showYT: "Mostrar no YouTube",
      showTwitch: "Mostrar na Twitch",
      startCollapsed: "Iniciar minimizado (pílula)",
      fastLive: "Atualizar ao vivo a cada 2 s",
      panelWidth: "Largura do painel",
      resetPos: "Redefinir posição",
      panelHint: "Arraste o painel pelo cabeçalho ou pela pílula. A pílula começa no centro inferior e lembra a posição.",
      teamTheme: "Cores + tema de logos",
      teamThemeHint: "Usa cores e logos de equipes da Turquia, Itália, Polônia e Brasil.",
      bgRefresh: "Atualização em segundo plano",
      data: "Dados",
      refreshNow: "Atualizar agora",
      saved: "Salvo.",
      refreshing: "Atualizando…",
      justRefreshed: "Atualizado agora.",
      statusLine: "{count} partidas • {live} ao vivo • última atualização {time}",
      resetDone: "Posição do painel redefinida.",
      sourceNote: "Fonte: feed público de vôlei do Flashscore (não é API oficial). Sets, pontos do set atual e totais vêm dessa fonte. O atraso depende da fonte (normalmente 10–30 s).",
      language: "Idioma",
      accounts: "Contas (experimental)",
      accountNote: "Flashscore e Sofascore não têm API oficial de conta/favoritos. Sua senha nunca é pedida ou armazenada. Entre normalmente no site, deixe a página de favoritos aberta e clique em 'Importar favoritos'. Apenas os links de partidas da página aberta são lidos.",
      openSite: "Abrir site",
      importFav: "Importar favoritos",
      clearImported: "Limpar importados",
      importManual: "Importar de URLs",
      manualPh: "URLs de partidas do Flashscore ou linhas 'Equipe A - Equipe B' (uma por linha)",
      importDone: "{matched}/{total} favoritos encontrados.",
      importNoTab: "Nenhuma aba do {site} aberta. Abra o site e entre primeiro.",
      importNeedPage: "Abra a página de favoritos do {site}.",
      importEmpty: "Nenhum favorito encontrado.",
      importError: "Falha na importação.",
      importedStatus: "{n} favoritos • {time}",
      cleared: "Favoritos importados limpos.",
      error: "Erro",
      notImported: "Não conectado",
      fsHint: "Entre no Flashscore, abra My Games e importe.",
      soHint: "Entre no Sofascore, abra os favoritos e importe.",
      allSites: "Mostrar em todos os sites",
      allSitesHint: "Quando desativado, o painel aparece apenas no YouTube/Twitch.",
      theme: "Tema",
      themeTeam: "Equipe",
      themeDark: "Escuro",
      themeLight: "Claro",
      themeNeon: "Neon",
      themeHint: "Você também pode trocar o tema pelo botão de paleta no topo do painel.",
      teamPick: "Tema da equipe",
      teamAuto: "Automático (equipes da partida)",
      pin: "Fixar",
      unpin: "Desafixar",
      resize: "Redimensionar",
      resizeHint: "Arraste o canto inferior direito para ajustar largura e altura.",
      scored: "PONTO",
      setWon: "SET",
      done: "Encerrados",
      accountMode: "Favoritos da conta",
      accountShort: "CONTA",
      noAccountFav: "Nenhuma partida nos favoritos da conta.",
      accountOnly: "Mostrar apenas favoritos quando uma conta estiver conectada",
      accountOnlyHint: "Quando os favoritos do Flashscore/Sofascore são importados, a tabela normal fica oculta.",
    },
    it: {
      vb: "Pallavolo",
      brand: "Live",
      live: "In diretta",
      today: "Oggi",
      soon: "Prossimi",
      all: "Tutti",
      national: "Nazionale",
      milliTag: "NAZ",
      clTag: "CL",
      favorite: "Preferiti",
      clShort: "CL",
      noLive: "Nessuna partita in diretta.",
      noMatches: "Nessuna partita in questa vista.",
      next: "Prossima",
      set: "SET",
      finished: "Finita",
      liveUpper: "IN DIRETTA",
      hide: "nascondi",
      show: "Mostra",
      refresh: "Aggiorna",
      collapse: "Riduci",
      expand: "Espandi",
      favTitle: "Preferito",
      stale: "dati non aggiornati",
      noData: "nessun dato",
      updated: "ultimo aggiornamento",
      settings: "Impostazioni",
      liveCount: "{n} in diretta",
      todayWord: "Oggi",
      tomorrowWord: "Domani",
      optTitle: "VBunny — Impostazioni",
      optSubtitle: "Pannello compatto con punteggio di pallavolo live nell'angolo mentre navighi su qualsiasi sito.",
      leagues: "Campionati",
      men: "(uomini)",
      women: "(donne)",
      nationalDesc: "Le partite delle nazionali includono Turchia o Italia in competizioni come VNL, Europei e Mondiali.",
      comp_trMen: "Lega Turca Maschile",
      comp_trWomen: "Lega Turca Femminile",
      comp_itMen: "SuperLega Italiana",
      comp_itWomen: "Serie A1 Italiana",
      comp_clMen: "Champions League CEV",
      comp_clWomen: "Champions League CEV (Donne)",
      comp_cevcMen: "CEV Cup",
      comp_cevcWomen: "CEV Cup (Donne)",
      comp_plMen: "PlusLiga",
      comp_plWomen: "PlusLiga (Donne)",
      comp_brMen: "Superliga Brasiliana",
      comp_brWomen: "Superliga Feminina Brasiliana",
      comp_thMen: "Maschile Thailandia",
      comp_thWomen: "Femminile Thailandia",
      comp_cnMen: "Maschile Cina",
      comp_cnWomen: "Femminile Cina",
      comp_jpMen: "Maschile Giappone",
      comp_jpWomen: "Femminile Giappone",
      comp_national: "Squadre Nazionali",
      panel: "Pannello",
      showYT: "Mostra su YouTube",
      showTwitch: "Mostra su Twitch",
      startCollapsed: "Avvia ridotto (pillola)",
      fastLive: "Aggiorna live ogni 2 s",
      panelWidth: "Larghezza pannello",
      resetPos: "Reimposta posizione",
      panelHint: "Trascina il pannello dall'intestazione o dalla pillola. La pillola parte in basso al centro e ricorda la posizione.",
      teamTheme: "Colori + tema loghi",
      teamThemeHint: "Usa colori e loghi di squadre turche, italiane, polacche e brasiliane.",
      bgRefresh: "Aggiornamento in background",
      data: "Dati",
      refreshNow: "Aggiorna ora",
      saved: "Salvato.",
      refreshing: "Aggiornamento…",
      justRefreshed: "Aggiornato poco fa.",
      statusLine: "{count} partite • {live} in diretta • ultimo aggiornamento {time}",
      resetDone: "Posizione del pannello reimpostata.",
      sourceNote: "Fonte: feed pubblico di pallavolo Flashscore (non API ufficiale). Set, punti del set corrente e totali provengono da questa fonte. Il ritardo dipende dalla fonte (di solito 10–30 s).",
      language: "Lingua",
      accounts: "Account (sperimentale)",
      accountNote: "Flashscore e Sofascore non hanno API ufficiali per account/preferiti. La password non viene mai richiesta o salvata. Accedi normalmente al sito, lascia aperta la pagina dei preferiti e premi 'Importa preferiti'. Vengono letti solo i link delle partite nella pagina aperta.",
      openSite: "Apri sito",
      importFav: "Importa preferiti",
      clearImported: "Cancella importati",
      importManual: "Importa da URL",
      manualPh: "URL partite Flashscore o righe 'Squadra A - Squadra B' (una per riga)",
      importDone: "{matched}/{total} preferiti trovati.",
      importNoTab: "Nessuna scheda {site} aperta. Apri il sito e accedi prima.",
      importNeedPage: "Apri la pagina dei preferiti di {site}.",
      importEmpty: "Nessun preferito trovato.",
      importError: "Importazione non riuscita.",
      importedStatus: "{n} preferiti • {time}",
      cleared: "Preferiti importati cancellati.",
      error: "Errore",
      notImported: "Non connesso",
      fsHint: "Accedi a Flashscore, apri My Games, poi importa.",
      soHint: "Accedi a Sofascore, apri i preferiti, poi importa.",
      allSites: "Mostra su tutti i siti",
      allSitesHint: "Se disattivato, il pannello appare solo su YouTube/Twitch.",
      theme: "Tema",
      themeTeam: "Squadra",
      themeDark: "Scuro",
      themeLight: "Chiaro",
      themeNeon: "Neon",
      themeHint: "Puoi cambiare tema anche dal pulsante tavolozza in cima al pannello.",
      teamPick: "Tema squadra",
      teamAuto: "Automatico (squadre della partita)",
      pin: "Fissa",
      unpin: "Rimuovi fissaggio",
      resize: "Ridimensiona",
      resizeHint: "Trascina l'angolo in basso a destra per regolare larghezza e altezza.",
      scored: "PUNTO",
      setWon: "SET",
      done: "Finito",
      accountMode: "Preferiti account",
      accountShort: "ACCOUNT",
      noAccountFav: "Nessuna partita nei preferiti dell'account.",
      accountOnly: "Mostra solo i preferiti quando un account è connesso",
      accountOnlyHint: "Quando i preferiti di Flashscore/Sofascore vengono importati, il calendario normale viene nascosto.",
    },
    ja: {
      vb: "バレーボール",
      brand: "ライブ",
      live: "ライブ",
      today: "今日",
      soon: "今後",
      all: "すべて",
      national: "代表",
      milliTag: "代表",
      clTag: "CL",
      favorite: "お気に入り",
      clShort: "CL",
      noLive: "現在ライブ中の試合はありません。",
      noMatches: "この表示に試合はありません。",
      next: "次の試合",
      set: "セット",
      finished: "終了",
      liveUpper: "ライブ",
      hide: "隠す",
      show: "表示",
      refresh: "更新",
      collapse: "最小化",
      expand: "最大化",
      favTitle: "お気に入り",
      stale: "古いデータ",
      noData: "データなし",
      updated: "最終更新",
      settings: "設定",
      liveCount: "ライブ {n}",
      todayWord: "今日",
      tomorrowWord: "明日",
      optTitle: "VBunny — 設定",
      optSubtitle: "どのサイトを見ていても隅に表示できるコンパクトなバレーボールライブスコアパネル。",
      leagues: "リーグ",
      men: "（男子）",
      women: "（女子）",
      nationalDesc: "代表戦は VNL、欧州選手権、世界選手権などでのトルコまたはイタリアの試合を含みます。",
      comp_trMen: "トルコ男子リーグ",
      comp_trWomen: "トルコ女子リーグ",
      comp_itMen: "イタリア セリエA1 男子",
      comp_itWomen: "イタリア セリエA1 女子",
      comp_clMen: "CEVチャンピオンズリーグ",
      comp_clWomen: "CEVチャンピオンズリーグ (女子)",
      comp_cevcMen: "CEVカップ",
      comp_cevcWomen: "CEVカップ (女子)",
      comp_plMen: "プラスリーガ",
      comp_plWomen: "プラスリーガ (女子)",
      comp_brMen: "ブラジル スーペルリーガ",
      comp_brWomen: "ブラジル スーペルリーガ フェミニーナ",
      comp_thMen: "タイ 男子",
      comp_thWomen: "タイ 女子",
      comp_cnMen: "中国 男子",
      comp_cnWomen: "中国 女子",
      comp_jpMen: "Vリーグ 男子",
      comp_jpWomen: "Vリーグ 女子",
      comp_national: "ナショナルチーム",
      panel: "パネル",
      showYT: "YouTube で表示",
      showTwitch: "Twitch で表示",
      startCollapsed: "小さく（ピル）開始",
      fastLive: "ライブ試合を2秒ごとに更新",
      panelWidth: "パネル幅",
      resetPos: "パネル位置をリセット",
      panelHint: "ヘッダーまたは小さなピルをドラッグして移動できます。ピルは下中央から始まり、位置を記憶します。",
      teamTheme: "チームカラー＋ロゴテーマ",
      teamThemeHint: "トルコ、イタリア、ポーランド、ブラジルのチームの色とロゴを使用します。",
      bgRefresh: "バックグラウンド更新",
      data: "データ",
      refreshNow: "今すぐ更新",
      saved: "保存しました。",
      refreshing: "更新中…",
      justRefreshed: "たった今更新しました。",
      statusLine: "{count} 試合 • ライブ {live} • 最終更新 {time}",
      resetDone: "パネル位置をリセットしました。",
      sourceNote: "出典：Flashscore の公開バレーボールフィード（公式 API ではありません）。セットスコア、現在のセットポイント、合計はこのソースから取得します。遅延はソースの更新速度によります（通常10〜30秒）。",
      language: "言語",
      accounts: "アカウント（実験的）",
      accountNote: "Flashscore と Sofascore には公式のアカウント/お気に入り API がありません。パスワードは要求も保存もされません。サイトに通常どおりログインし、お気に入りページを開いたまま「お気に入りを読み込む」を押してください。開いているページの試合リンクだけを読み取ります。",
      openSite: "サイトを開く",
      importFav: "お気に入りを読み込む",
      clearImported: "読み込んだお気に入りを消去",
      importManual: "URL から読み込む",
      manualPh: "Flashscore の試合 URL または「チームA - チームB」の行（1行に1つ）",
      importDone: "{matched}/{total} 件のお気に入りが一致しました。",
      importNoTab: "開いている {site} タブが見つかりません。先にサイトを開いてログインしてください。",
      importNeedPage: "{site} のお気に入りページを開いてください。",
      importEmpty: "お気に入りが見つかりません。",
      importError: "読み込みに失敗しました。",
      importedStatus: "{n} 件のお気に入り • {time}",
      cleared: "読み込んだお気に入りを消去しました。",
      error: "エラー",
      notImported: "未接続",
      fsHint: "Flashscore にログインし、My Games を開いてから読み込んでください。",
      soHint: "Sofascore にログインし、お気に入りを開いてから読み込んでください。",
      allSites: "すべてのサイトで表示",
      allSitesHint: "オフにすると YouTube/Twitch のみ表示します。",
      theme: "テーマ",
      themeTeam: "チーム",
      themeDark: "ダーク",
      themeLight: "ライト",
      themeNeon: "ネオン",
      themeHint: "パネル上部のパレットボタンからもテーマを変更できます。",
      teamPick: "チームテーマ",
      teamAuto: "自動（試合のチーム）",
      pin: "固定",
      unpin: "固定解除",
      resize: "サイズ変更",
      resizeHint: "右下隅をドラッグして幅と高さを調整します。",
      scored: "得点",
      setWon: "セット",
      done: "終了",
      accountMode: "アカウントのお気に入り",
      accountShort: "アカウント",
      noAccountFav: "アカウントのお気に入りに試合がありません。",
      accountOnly: "アカウント接続時はお気に入りだけ表示",
      accountOnlyHint: "Flashscore/Sofascore のお気に入りを読み込むと、通常の日程は非表示になります。",
    },
    zh: {
      vb: "排球",
      brand: "直播",
      live: "直播",
      today: "今天",
      soon: "即将",
      all: "全部",
      national: "国家队",
      milliTag: "国家队",
      clTag: "欧冠",
      favorite: "收藏",
      clShort: "欧冠",
      noLive: "当前没有直播比赛。",
      noMatches: "此视图没有比赛。",
      next: "下一场",
      set: "局",
      finished: "已结束",
      liveUpper: "直播",
      hide: "隐藏",
      show: "显示",
      refresh: "刷新",
      collapse: "最小化",
      expand: "最大化",
      favTitle: "收藏",
      stale: "旧数据",
      noData: "无数据",
      updated: "最后更新",
      settings: "设置",
      liveCount: "{n} 场直播",
      todayWord: "今天",
      tomorrowWord: "明天",
      optTitle: "VBunny — 设置",
      optSubtitle: "浏览任何网站时，在角落显示紧凑的排球实时比分面板。",
      leagues: "联赛",
      men: "（男子）",
      women: "（女子）",
      nationalDesc: "国家队比赛包括土耳其或意大利在 VNL、欧锦赛、世锦赛等赛事中的比赛。",
      comp_trMen: "土耳其男子联赛",
      comp_trWomen: "土耳其女子联赛",
      comp_itMen: "意大利超级联赛",
      comp_itWomen: "意大利甲级联赛",
      comp_clMen: "CEV欧冠联赛",
      comp_clWomen: "CEV欧冠联赛 (女子)",
      comp_cevcMen: "CEV杯",
      comp_cevcWomen: "CEV杯 (女子)",
      comp_plMen: "波兰联赛",
      comp_plWomen: "波兰联赛 (女子)",
      comp_brMen: "巴西超级联赛",
      comp_brWomen: "巴西女子超级联赛",
      comp_thMen: "泰国男子联赛",
      comp_thWomen: "泰国女子联赛",
      comp_cnMen: "中国男子联赛",
      comp_cnWomen: "中国女子联赛",
      comp_jpMen: "日本V联赛 男子",
      comp_jpWomen: "日本V联赛 女子",
      comp_national: "国家队",
      panel: "面板",
      showYT: "在 YouTube 显示",
      showTwitch: "在 Twitch 显示",
      startCollapsed: "以小型胶囊开始",
      fastLive: "直播比赛每 2 秒更新",
      panelWidth: "面板宽度",
      resetPos: "重置面板位置",
      panelHint: "拖动标题栏或小胶囊可移动面板。胶囊默认位于底部中央，并记住位置。",
      teamTheme: "球队颜色 + 标志主题",
      teamThemeHint: "使用土耳其、意大利、波兰和巴西球队的颜色与标志。",
      bgRefresh: "后台刷新",
      data: "数据",
      refreshNow: "立即刷新",
      saved: "已保存。",
      refreshing: "正在刷新…",
      justRefreshed: "刚刚刷新。",
      statusLine: "{count} 场比赛 • {live} 场直播 • 最后更新 {time}",
      resetDone: "面板位置已重置。",
      sourceNote: "来源：Flashscore 公开排球数据源（非官方 API）。局分、当前局得分和总分来自该来源。延迟取决于来源更新速度（通常 10–30 秒）。",
      language: "语言",
      accounts: "账户（实验性）",
      accountNote: "Flashscore 和 Sofascore 没有官方账户/收藏 API。不会要求或保存密码。请正常登录网站，保持收藏页面打开，然后点击“导入收藏”。只读取打开页面中的比赛链接。",
      openSite: "打开网站",
      importFav: "导入收藏",
      clearImported: "清除已导入",
      importManual: "从 URL 导入",
      manualPh: "Flashscore 比赛 URL 或“A 队 - B 队”行（每行一个）",
      importDone: "已匹配 {matched}/{total} 个收藏。",
      importNoTab: "未找到打开的 {site} 标签页。请先打开网站并登录。",
      importNeedPage: "请打开 {site} 收藏页面。",
      importEmpty: "未找到收藏。",
      importError: "导入失败。",
      importedStatus: "{n} 个收藏 • {time}",
      cleared: "已清除导入的收藏。",
      error: "错误",
      notImported: "未连接",
      fsHint: "登录 Flashscore，打开 My Games，然后导入。",
      soHint: "登录 Sofascore，打开收藏，然后导入。",
      allSites: "在所有网站显示",
      allSitesHint: "关闭后仅在 YouTube/Twitch 显示。",
      theme: "主题",
      themeTeam: "球队",
      themeDark: "深色",
      themeLight: "浅色",
      themeNeon: "霓虹",
      themeHint: "也可以通过面板顶部的调色板按钮切换主题。",
      teamPick: "球队主题",
      teamAuto: "自动（比赛球队）",
      pin: "固定",
      unpin: "取消固定",
      resize: "调整大小",
      resizeHint: "拖动右下角调整宽度和高度。",
      scored: "得分",
      setWon: "局",
      done: "已结束",
      accountMode: "账户收藏",
      accountShort: "账户",
      noAccountFav: "账户收藏中没有比赛。",
      accountOnly: "连接账户后仅显示收藏",
      accountOnlyHint: "导入 Flashscore/Sofascore 收藏后，普通赛程将被隐藏。",
    },
    th: {
      vb: "วอลเลย์บอล",
      brand: "สด",
      live: "สด",
      today: "วันนี้",
      soon: "กำลังจะมาถึง",
      all: "ทั้งหมด",
      national: "ทีมชาติ",
      milliTag: "ทีมชาติ",
      clTag: "CL",
      favorite: "รายการโปรด",
      clShort: "CL",
      noLive: "ไม่มีแมตช์ที่กำลังเล่นอยู่",
      noMatches: "ไม่มีแมตช์ในมุมมองนี้",
      next: "ถัดไป",
      set: "เซต",
      finished: "จบแล้ว",
      liveUpper: "สด",
      hide: "ซ่อน",
      show: "แสดง",
      refresh: "รีเฟรช",
      collapse: "ย่อ",
      expand: "ขยาย",
      favTitle: "รายการโปรด",
      stale: "ข้อมูลเก่า",
      noData: "ไม่มีข้อมูล",
      updated: "อัปเดตล่าสุด",
      settings: "การตั้งค่า",
      liveCount: "{n} แมตช์สด",
      todayWord: "วันนี้",
      tomorrowWord: "พรุ่งนี้",
      optTitle: "VBunny — การตั้งค่า",
      optSubtitle: "แผงคะแนนวอลเลย์บอลสดขนาดกะทัดรัดที่มุมจอขณะเปิดเว็บไซต์ใดก็ได้",
      leagues: "ลีก",
      men: "(ชาย)",
      women: "(หญิง)",
      nationalDesc: "แมตช์ทีมชาติรวมเกมของตุรกีหรืออิตาลีในรายการ VNL, ชิงแชมป์ยุโรป และชิงแชมป์โลก",
      comp_trMen: "ลีกตุรกีชาย",
      comp_trWomen: "ลีกตุรกีหญิง",
      comp_itMen: "ลีกอิตาลี ซูเปอร์เลกา",
      comp_itWomen: "ลีกอิตาลี เซเรียอา1",
      comp_clMen: "แชมเปียนส์ลีก CEV",
      comp_clWomen: "แชมเปียนส์ลีก CEV (หญิง)",
      comp_cevcMen: "ถ้วย CEV",
      comp_cevcWomen: "ถ้วย CEV (หญิง)",
      comp_plMen: "พลัสลีกา",
      comp_plWomen: "พลัสลีกา (หญิง)",
      comp_brMen: "ซูเปอร์ลีกา บราซิล",
      comp_brWomen: "ซูเปอร์ลีกา หญิง บราซิล",
      comp_thMen: "ลีกไทยชาย",
      comp_thWomen: "ลีกไทยหญิง",
      comp_cnMen: "ลีกจีนชาย",
      comp_cnWomen: "ลีกจีนหญิง",
      comp_jpMen: "ลีกญี่ปุ่นชาย",
      comp_jpWomen: "ลีกญี่ปุ่นหญิง",
      comp_national: "ทีมชาติ",
      panel: "แผง",
      showYT: "แสดงบน YouTube",
      showTwitch: "แสดงบน Twitch",
      startCollapsed: "เริ่มแบบย่อ (แคปซูล)",
      fastLive: "อัปเดตแมตช์สดทุก 2 วินาที",
      panelWidth: "ความกว้างแผง",
      resetPos: "รีเซ็ตตำแหน่งแผง",
      panelHint: "ลากแผงที่หัวหรือแคปซูลเล็ก แคปซูลเริ่มที่กลางด้านล่างและจำตำแหน่งไว้",
      teamTheme: "สีทีม + ธีมโลโก้",
      teamThemeHint: "ใช้สีและโลโก้ของทีมตุรกี อิตาลี โปแลนด์ และบราซิล",
      bgRefresh: "รีเฟรชเบื้องหลัง",
      data: "ข้อมูล",
      refreshNow: "รีเฟรชตอนนี้",
      saved: "บันทึกแล้ว",
      refreshing: "กำลังรีเฟรช…",
      justRefreshed: "เพิ่งรีเฟรช",
      statusLine: "{count} แมตช์ • {live} สด • อัปเดตล่าสุด {time}",
      resetDone: "รีเซ็ตตำแหน่งแผงแล้ว",
      sourceNote: "แหล่งข้อมูล: ฟีดวอลเลย์บอลสาธารณะของ Flashscore (ไม่ใช่ API อย่างเป็นทางการ) คะแนนเซต คะแนนเซตปัจจุบัน และคะแนนรวมมาจากแหล่งนี้ ความล่าช้าขึ้นอยู่กับแหล่งข้อมูล (ปกติ 10–30 วินาที)",
      language: "ภาษา",
      accounts: "บัญชี (ทดลอง)",
      accountNote: "Flashscore และ Sofascore ไม่มี API บัญชี/รายการโปรดอย่างเป็นทางการ ระบบจะไม่ขอหรือบันทึกรหัสผ่าน โปรดเข้าสู่ระบบบนเว็บไซต์ตามปกติ เปิดหน้ารายการโปรดค้างไว้ แล้วกด 'นำเข้ารายการโปรด' ระบบจะอ่านเฉพาะลิงก์แมตช์ในหน้าที่เปิดอยู่",
      openSite: "เปิดเว็บไซต์",
      importFav: "นำเข้ารายการโปรด",
      clearImported: "ล้างรายการที่นำเข้า",
      importManual: "นำเข้าจาก URL",
      manualPh: "URL แมตช์ Flashscore หรือบรรทัด 'ทีม A - ทีม B' (บรรทัดละหนึ่งรายการ)",
      importDone: "จับคู่รายการโปรด {matched}/{total} รายการ",
      importNoTab: "ไม่พบแท็บ {site} ที่เปิดอยู่ กรุณาเปิดเว็บไซต์และเข้าสู่ระบบก่อน",
      importNeedPage: "กรุณาเปิดหน้ารายการโปรดของ {site}",
      importEmpty: "ไม่พบรายการโปรด",
      importError: "นำเข้าไม่สำเร็จ",
      importedStatus: "{n} รายการโปรด • {time}",
      cleared: "ล้างรายการโปรดที่นำเข้าแล้ว",
      error: "ข้อผิดพลาด",
      notImported: "ยังไม่เชื่อมต่อ",
      fsHint: "เข้าสู่ระบบ Flashscore เปิด My Games แล้วนำเข้า",
      soHint: "เข้าสู่ระบบ Sofascore เปิดรายการโปรด แล้วนำเข้า",
      allSites: "แสดงบนทุกเว็บไซต์",
      allSitesHint: "เมื่อปิด จะแสดงเฉพาะ YouTube/Twitch",
      theme: "ธีม",
      themeTeam: "ทีม",
      themeDark: "มืด",
      themeLight: "สว่าง",
      themeNeon: "นีออน",
      themeHint: "เปลี่ยนธีมได้จากปุ่มจานสีด้านบนของแผง",
      teamPick: "ธีมทีม",
      teamAuto: "อัตโนมัติ (ทีมในแมตช์)",
      pin: "ปักหมุด",
      unpin: "เลิกปักหมุด",
      resize: "ปรับขนาด",
      resizeHint: "ลากมุมขวาล่างเพื่อปรับความกว้างและความสูง",
      scored: "แต้ม",
      setWon: "เซต",
      done: "จบแล้ว",
      accountMode: "รายการโปรดบัญชี",
      accountShort: "บัญชี",
      noAccountFav: "ไม่มีแมตช์ในรายการโปรดบัญชี",
      accountOnly: "แสดงเฉพาะรายการโปรดเมื่อเชื่อมต่อบัญชี",
      accountOnlyHint: "เมื่อนำเข้ารายการโปรด Flashscore/Sofascore ตารางปกติจะถูกซ่อน",
    },
    id: {
      vb: "Bola Voli",
      brand: "Live",
      live: "Live",
      today: "Hari ini",
      soon: "Akan datang",
      all: "Semua",
      national: "Timnas",
      milliTag: "TIMNAS",
      clTag: "CL",
      favorite: "Favorit",
      clShort: "CL",
      noLive: "Tidak ada pertandingan live saat ini.",
      noMatches: "Tidak ada pertandingan di tampilan ini.",
      next: "Berikutnya",
      set: "SET",
      finished: "Selesai",
      liveUpper: "LIVE",
      hide: "sembunyikan",
      show: "Tampilkan",
      refresh: "Segarkan",
      collapse: "Perkecil",
      expand: "Perbesar",
      favTitle: "Favorit",
      stale: "data lama",
      noData: "tanpa data",
      updated: "pembaruan terakhir",
      settings: "Pengaturan",
      liveCount: "{n} live",
      todayWord: "Hari ini",
      tomorrowWord: "Besok",
      optTitle: "VBunny — Pengaturan",
      optSubtitle: "Panel skor bola voli live ringkas di sudut layar saat menjelajahi situs apa pun.",
      leagues: "Liga",
      men: "(putra)",
      women: "(putri)",
      nationalDesc: "Pertandingan timnas mencakup pertandingan Turki atau Italia di VNL, Kejuaraan Eropa, dan Kejuaraan Dunia.",
      comp_trMen: "Liga Turki Pria",
      comp_trWomen: "Liga Turki Wanita",
      comp_itMen: "Liga Italia SuperLega",
      comp_itWomen: "Liga Italia Serie A1",
      comp_clMen: "Liga Champions CEV",
      comp_clWomen: "Liga Champions CEV (Wanita)",
      comp_cevcMen: "CEV Cup",
      comp_cevcWomen: "CEV Cup (Wanita)",
      comp_plMen: "PlusLiga",
      comp_plWomen: "PlusLiga (Wanita)",
      comp_brMen: "Superliga Brasil",
      comp_brWomen: "Superliga Feminina Brasil",
      comp_thMen: "Thailand Pria",
      comp_thWomen: "Thailand Wanita",
      comp_cnMen: "China Pria",
      comp_cnWomen: "China Wanita",
      comp_jpMen: "Jepang Pria",
      comp_jpWomen: "Jepang Wanita",
      comp_national: "Tim Nasional",
      panel: "Panel",
      showYT: "Tampilkan di YouTube",
      showTwitch: "Tampilkan di Twitch",
      startCollapsed: "Mulai dalam mode kecil (pil)",
      fastLive: "Perbarui pertandingan live setiap 2 dtk",
      panelWidth: "Lebar panel",
      resetPos: "Atur ulang posisi panel",
      panelHint: "Seret panel dari header atau pil kecil. Pil dimulai di tengah bawah dan mengingat posisinya.",
      teamTheme: "Warna tim + tema logo",
      teamThemeHint: "Menggunakan warna dan logo tim Turki, Italia, Polandia, dan Brasil.",
      bgRefresh: "Penyegaran latar belakang",
      data: "Data",
      refreshNow: "Segarkan sekarang",
      saved: "Tersimpan.",
      refreshing: "Menyegarkan…",
      justRefreshed: "Baru saja disegarkan.",
      statusLine: "{count} pertandingan • {live} live • pembaruan terakhir {time}",
      resetDone: "Posisi panel diatur ulang.",
      sourceNote: "Sumber: feed bola voli publik Flashscore (bukan API resmi). Skor set, poin set saat ini, dan total berasal dari sumber ini. Keterlambatan bergantung pada sumber (biasanya 10–30 dtk).",
      language: "Bahasa",
      accounts: "Akun (eksperimental)",
      accountNote: "Flashscore dan Sofascore tidak memiliki API akun/favorit resmi. Kata sandi tidak pernah diminta atau disimpan. Masuk seperti biasa di situs, biarkan halaman favorit terbuka, lalu tekan 'Impor favorit'. Hanya tautan pertandingan di halaman terbuka yang dibaca.",
      openSite: "Buka situs",
      importFav: "Impor favorit",
      clearImported: "Hapus yang diimpor",
      importManual: "Impor dari URL",
      manualPh: "URL pertandingan Flashscore atau baris 'Tim A - Tim B' (satu per baris)",
      importDone: "{matched}/{total} favorit cocok.",
      importNoTab: "Tidak ada tab {site} yang terbuka. Buka situs dan masuk terlebih dahulu.",
      importNeedPage: "Buka halaman favorit {site}.",
      importEmpty: "Favorit tidak ditemukan.",
      importError: "Impor gagal.",
      importedStatus: "{n} favorit • {time}",
      cleared: "Favorit impor dihapus.",
      error: "Kesalahan",
      notImported: "Belum terhubung",
      fsHint: "Masuk ke Flashscore, buka My Games, lalu impor.",
      soHint: "Masuk ke Sofascore, buka favorit, lalu impor.",
      allSites: "Tampilkan di semua situs",
      allSitesHint: "Jika dimatikan, panel hanya muncul di YouTube/Twitch.",
      theme: "Tema",
      themeTeam: "Tim",
      themeDark: "Gelap",
      themeLight: "Terang",
      themeNeon: "Neon",
      themeHint: "Anda juga bisa mengganti tema lewat tombol palet di atas panel.",
      teamPick: "Tema tim",
      teamAuto: "Otomatis (tim dalam pertandingan)",
      pin: "Sematkan",
      unpin: "Lepas sematan",
      resize: "Ubah ukuran",
      resizeHint: "Seret sudut kanan bawah untuk mengatur lebar dan tinggi.",
      scored: "POIN",
      setWon: "SET",
      done: "Selesai",
      accountMode: "Favorit akun",
      accountShort: "AKUN",
      noAccountFav: "Tidak ada pertandingan di favorit akun.",
      accountOnly: "Tampilkan hanya favorit saat akun terhubung",
      accountOnlyHint: "Saat favorit Flashscore/Sofascore diimpor, jadwal normal disembunyikan.",
    },
  };

  const LOCALES = {
    tr: "tr-TR",
    en: "en-GB",
    pl: "pl-PL",
    pt: "pt-BR",
    it: "it-IT",
    ja: "ja-JP",
    zh: "zh-CN",
    th: "th-TH",
    id: "id-ID",
  };

  function t(key, lang, vars) {
    const dict = I18N[lang] || I18N.tr;
    let s = dict[key];
    if (s == null) s = I18N.en[key];
    if (s == null) s = key;
    if (vars) {
      for (const k of Object.keys(vars)) {
        s = s.split("{" + k + "}").join(String(vars[k]));
      }
    }
    return s;
  }

  function localeOf(lang) {
    return LOCALES[lang] || LOCALES.tr;
  }

  function fmtClock(ms, lang) {
    if (!ms) return "-";
    const d = new Date(ms);
    return d.toLocaleTimeString(localeOf(lang), { hour: "2-digit", minute: "2-digit" });
  }

  function fmtDay(ms, lang) {
    const d = new Date(ms);
    const now = new Date();
    const sameDay =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
    if (sameDay) return t("todayWord", lang);
    const tm = new Date(now.getTime() + 86400000);
    if (
      d.getFullYear() === tm.getFullYear() &&
      d.getMonth() === tm.getMonth() &&
      d.getDate() === tm.getDate()
    ) {
      return t("tomorrowWord", lang);
    }
    return d.toLocaleDateString(localeOf(lang), { day: "2-digit", month: "2-digit" });
  }

  function statusLabel(m, lang) {
    if (m.status === 2) return t("liveUpper", lang);
    if (m.status === 3) return t("finished", lang);
    return fmtClock(m.start, lang);
  }

  function metaStatus(m, lang) {
    // Canlı maçta metin gösterilmez; arayüzler kendi yanıp sönen noktasını çizer.
    if (m.status === 2) return "";
    if (m.status === 3) return t("finished", lang);
    return `${fmtDay(m.start, lang)} ${fmtClock(m.start, lang)}`;
  }

  function shortComp(m, lang) {
    if (!m.comp) {
      return String(m.league || "")
        .replace(/^[A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜ ]*:\s*/, "")
        .replace(/\s+-\s+.*$/, "");
    }
    const translated = t("comp_" + m.comp, lang);
    if (translated !== "comp_" + m.comp) return translated;
    if (lang && lang !== "tr") {
      if (m.comp === "clMen") return "CEV CL";
      if (m.comp === "clWomen") return "CEV CL (W)";
    }
    return COMP_LABELS[m.comp] || m.league || "";
  }


  function isLive(m) {
    return m.status === 2;
  }

  // Skor gösterimi: setler + (canlıysa) güncel set puanı
  function scoreText(m) {
    if (m.homeSets == null && m.awaySets == null) return "";
    return `${m.homeSets == null ? 0 : m.homeSets} - ${m.awaySets == null ? 0 : m.awaySets}`;
  }

  function currentSetText(m) {
    if (m.status !== 2) return "";
    if (m.curH == null || m.curA == null) return "";
    return `${m.curH}-${m.curA}`;
  }

  // ---- Takım teması (renk + logo) ---------------------------------------
  // Türkiye / İtalya kulüpleri ve millî takımlar için marka renkleri.
  const TEAM_COLORS = [
    [/(fenerbah[cç]e)/i, "#00285e", "#ffed00"],
    [/(galatasaray)/i, "#a90432", "#fdb912"],
    [/(be[sş]ikta[sş])/i, "#111111", "#f5f5f5"],
    [/(vak[ıi]fbank)/i, "#ffd200", "#111111"],
    [/(eczac[ıi]ba[sş][ıi])/i, "#ff6a00", "#ffffff"],
    [/(t[üu]rk hava yollar[ıi]|\bthy\b)/i, "#c8102e", "#ffffff"],
    [/(ziraat)/i, "#e30613", "#ffffff"],
    [/(halkbank)/i, "#0057a8", "#ffffff"],
    [/(arkas)/i, "#0b2a5b", "#f58220"],
    [/(spor toto)/i, "#003b71", "#ffffff"],
    [/(nil[üu]fer)/i, "#009688", "#ffffff"],
    [/(kuzeyboru)/i, "#5b2c83", "#ffffff"],
    [/(ayd[ıi]n b[üu]y[üu]k[sş]ehir)/i, "#0d6efd", "#ffffff"],
    [/(bursa b[üu]y[üu]k[sş]ehir)/i, "#0a7d3c", "#ffffff"],
    [/(sigorta shop)/i, "#e91e63", "#ffffff"],
    [/(sar[ıi]yer)/i, "#f4b400", "#111111"],
    [/(zeren)/i, "#1b1b1b", "#ffd200"],
    [/(aras kargo)/i, "#e30613", "#ffffff"],
    [/(\bptt\b)/i, "#ffd200", "#003b71"],
    [/([çc]ukurova)/i, "#0a7d3c", "#ffffff"],
    [/(perugia)/i, "#111111", "#ffffff"],
    [/(trentino)/i, "#0a4d9c", "#ffd200"],
    [/(modena)/i, "#ffd200", "#003b71"],
    [/(piacenza)/i, "#e30613", "#ffffff"],
    [/(civitanova)/i, "#c8102e", "#ffffff"],
    [/(conegliano|imoco)/i, "#ffd200", "#003b71"],
    [/(novara)/i, "#0a4d9c", "#ffffff"],
    [/(milano)/i, "#e30613", "#0a4d9c"],
    [/(monza)/i, "#e30613", "#ffffff"],
    [/(busto arsizio)/i, "#0a4d9c", "#ffffff"],
    [/(bergamo)/i, "#0a4d9c", "#ffd200"],
    [/(scandicci)/i, "#0a4d9c", "#ffffff"],
    [/(chieri)/i, "#0a4d9c", "#ffd200"],
    [/(t[üu]rkiye|turkey)/i, "#e30a17", "#ffffff"],
    [/(italya|italy)/i, "#0066cc", "#ffffff"],
  ];

  function hashTheme(name) {
    let h = 0;
    const s = String(name || "");
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    const hue = h % 360;
    return { primary: `hsl(${hue} 55% 38%)`, secondary: `hsl(${(hue + 35) % 360} 65% 62%)` };
  }

  function teamTheme(name) {
    const n = String(name || "").trim();
    if (!n) return null;
    for (const [re, primary, secondary] of TEAM_COLORS) {
      if (re.test(n)) return { primary, secondary };
    }
    return hashTheme(n);
  }

  function logoUrl(v) {
    if (!v) return "";
    const s = String(v).trim();
    if (/^https?:\/\//i.test(s)) return s;
    return "https://static.flashscore.com/res/image/data/" + s.replace(/^\/+/, "");
  }

  // Favori eşleştirme için takım adı normalizasyonu.
  function normName(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\b(women|men|volley|volleyball|club|kulubu|spor|sk|ssa)\b/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function teamHit(text, name) {
    const hay = " " + normName(text) + " ";
    const n = normName(name);
    if (!n) return false;
    if (hay.includes(" " + n + " ")) return true;
    // Sponsor/şehir ekleri farklı yazılabiliyor; ilk anlamlı takım kelimesi yeter.
    const toks = n.split(" ").filter((x) => x.length >= 4);
    return toks.length > 0 && hay.includes(toks[0]);
  }

  global.VB = {
    FEED: VB_FEED,
    FSIGN: VB_FSIGN,
    SPORT: VB_SPORT,
    DEFAULT_CONFIG: VB_DEFAULT_CONFIG,
    COMP_LABELS,
    parseKv,
    parseFeed,
    compOf,
    tagsOf,
    parseSetScores,
    fmtClock,
    fmtDay,
    statusLabel,
    metaStatus,
    shortComp,
    isLive,
    scoreText,
    currentSetText,
    num,
    isNationalTeam,
    teamTheme,
    logoUrl,
    LANGS,
    I18N,
    t,
    localeOf,
    normName,
    teamHit,
  };
})(typeof window !== "undefined" ? window : self);


// ===== background.js (fetch -> GM_xmlhttpRequest) =====
(function (fetch) {
// VBunny - arka plan servis çalışanı
// Flashscore voleybol feed'ini çekip seçili liglerdeki maçları depolar.
// shared.js yukarida zaten yuklendi

const VB = window.VB;
const ALARM = "vb-poll";
const TOMORROW_TTL = 10 * 60 * 1000; // yarının fikstürü 10 dk önbellek
const DETAIL_TTL_LIVE = 1500; // canlıda 2 sn'lik yoklamayı beslemek için kısa tut
const DETAIL_TTL_DONE = 60000;
const MAX_ENRICH = 12;

let refreshing = false;
let lastManual = 0;
let lastRefresh = 0;
const detailCache = new Map(); // id -> { at, data }

async function getConfig() {
  const { vbConfig } = await chrome.storage.local.get("vbConfig");
  const c = vbConfig || {};
  return {
    ...VB.DEFAULT_CONFIG,
    ...c,
    comps: { ...VB.DEFAULT_CONFIG.comps, ...(c.comps || {}) },
  };
}

async function fetchFeed(offset) {
  const url = `${VB.FEED}f_${VB.SPORT}_${offset}_3_en_1`;
  const res = await fetch(url, {
    headers: { "x-fsign": VB.FSIGN },
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error("Feed HTTP " + res.status);
  return await res.text();
}

async function fetchDetail(path) {
  const res = await fetch(VB.FEED + path, {
    headers: { "x-fsign": VB.FSIGN },
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) return null;
  const t = await res.text();
  return t || null;
}

function selected(m, cfg) {
  if (m.comp && cfg.comps[m.comp]) return true;
  if (cfg.comps.national && (VB.isNationalTeam(m.home) || VB.isNationalTeam(m.away))) return true;
  return false;
}

async function enrich(m, prev) {
  const cached = detailCache.get(m.id);
  const ttl = m.status === 2 ? DETAIL_TTL_LIVE : DETAIL_TTL_DONE;
  if (cached && cached.status === m.status && Date.now() - cached.at < ttl) {
    return { ...m, ...cached.data };
  }

  // Biten maçın set skorları zaten elimizdeyse tekrar çekme.
  if (m.status === 3 && prev && prev.setScores && prev.setScores.length) {
    return {
      ...m,
      setScores: prev.setScores,
      totalH: prev.totalH,
      totalA: prev.totalA,
    };
  }

  const [dcTxt, suiTxt] = await Promise.all([
    fetchDetail(`dc_1_${m.id}`).catch(() => null),
    fetchDetail(`df_sui_1_${m.id}`).catch(() => null),
  ]);

  const out = { ...m };
  if (dcTxt) {
    const dc = VB.parseKv(dcTxt);
    const hs = VB.num(dc.DE);
    const as = VB.num(dc.DF);
    if (hs != null) out.homeSets = hs;
    if (as != null) out.awaySets = as;
    if (m.status === 2) {
      out.curH = VB.num(dc.DN);
      out.curA = VB.num(dc.DO);
    }
    out.totalH = VB.num(dc.DP);
    out.totalA = VB.num(dc.DQ);
  }
  if (suiTxt) {
    const sets = VB.parseSetScores(suiTxt);
    if (sets.length) out.setScores = sets;
  }
  // Canlı maçta güncel set puanı dc'den gelmezse son set satırından türet.
  if (out.status === 2 && (out.curH == null || out.curA == null) && out.setScores && out.setScores.length) {
    const last = out.setScores[out.setScores.length - 1];
    if (last.h != null && last.a != null) {
      out.curH = last.h;
      out.curA = last.a;
    }
  }

  detailCache.set(m.id, {
    at: Date.now(),
    status: m.status,
    data: {
      homeSets: out.homeSets,
      awaySets: out.awaySets,
      curH: out.curH,
      curA: out.curA,
      totalH: out.totalH,
      totalA: out.totalA,
      setScores: out.setScores,
    },
  });
  return out;
}

function sortMatches(list) {
  const rank = (m) => (m.status === 2 ? 0 : m.status === 1 ? 1 : 2);
  return list.sort((a, b) => {
    const r = rank(a) - rank(b);
    if (r) return r;
    if (a.status === 3 && b.status === 3) return (b.start || 0) - (a.start || 0);
    return (a.start || 0) - (b.start || 0);
  });
}

async function refreshVb(force) {
  if (refreshing) return { ok: false, busy: true };
  const now = Date.now();
  if (force && now - lastManual < 3000) return { ok: true, throttled: true };
  // Tüm sitelerde açık sekmeler aynı anda yoklayabilir; global throttle ile tek fetch.
  if (!force && now - lastRefresh < 1800) return { ok: true, throttled: true };
  lastManual = now;
  lastRefresh = now;
  refreshing = true;
  // Servis çalışanı iş sırasında sonlandırılsa bile bir sonraki alarm garanti olsun.
  chrome.alarms.create(ALARM, { when: now + 120000 });
  try {
    const cfg = await getConfig();
    const { vbData, vbCache, vbImported } = await chrome.storage.local.get(["vbData", "vbCache", "vbImported"]);
    const importedIds = new Set();
    for (const entry of Object.values(vbImported || {})) {
      for (const id of (entry && entry.matched) || []) importedIds.add(String(id));
    }
    const prev = vbData || { matches: [] };
    const prevById = new Map((prev.matches || []).map((m) => [m.id, m]));

    let text = "";
    let error = null;
    try {
      text = await fetchFeed(0);
    } catch (e) {
      error = String((e && e.message) || e);
    }

    let tomorrowText = (vbCache && vbCache.tomorrowText) || "";
    let tomorrowAt = (vbCache && vbCache.tomorrowAt) || 0;
    if (!tomorrowText || now - tomorrowAt > TOMORROW_TTL) {
      try {
        tomorrowText = await fetchFeed(1);
        tomorrowAt = now;
      } catch (e) {
        /* yarın feed'i olmasa da bugünkü veri yeter */
      }
    }

    let raw = VB.parseFeed(text).map((m) => ({ ...m, comp: VB.compOf(m.league) }));
    const tomorrow = VB.parseFeed(tomorrowText).map((m) => ({ ...m, comp: VB.compOf(m.league) }));

    // Bugünkü maçlara yarının yaklaşanlarını ekle (aynı id varsa tekrar etme).
    const seen = new Set(raw.map((m) => m.id));
    for (const m of tomorrow) {
      if (!seen.has(m.id)) raw.push(m);
    }

    // Hesap favorisi, seçili lig dışında olsa bile panelde görünsün.
    let list = raw.filter(
      (m) => selected(m, cfg) || (cfg.accountOnly !== false && importedIds.has(String(m.id)))
    );
    for (const m of list) m.tags = VB.tagsOf(m);

    // Canlı ve biten maçlar için set detaylarını tamamla (4'erli gruplar).
    const enrichable = list
      .filter((m) => m.status === 2 || m.status === 3)
      .slice(0, MAX_ENRICH);
    const enriched = new Map();
    for (let i = 0; i < enrichable.length; i += 4) {
      const chunk = enrichable.slice(i, i + 4);
      const res = await Promise.allSettled(chunk.map((m) => enrich(m, prevById.get(m.id))));
      res.forEach((r, j) => {
        if (r.status === "fulfilled") enriched.set(chunk[j].id, r.value);
      });
    }
    list = list.map((m) => enriched.get(m.id) || m);

    if (error && prev.matches && prev.matches.length) {
      list = prev.matches; // geçici hata: eski veriyi koru
    }

    sortMatches(list);
    const liveCount = list.filter((m) => m.status === 2).length;

    const data = {
      matches: list,
      updatedAt: Date.now(),
      error,
      liveCount,
      stale: !!error,
    };
    await chrome.storage.local.set({
      vbData: data,
      vbCache: { tomorrowText, tomorrowAt },
    });

    // Simge üzerinde canlı maç sayısı
    try {
      await chrome.action.setBadgeText({ text: liveCount ? String(liveCount) : "" });
      if (liveCount) {
        await chrome.action.setBadgeBackgroundColor({ color: "#d32f2f" });
      }
    } catch (e) {}

    // Canlı varsa ayarlanmış aralık, yoksa 2 dk sonra tekrar.
    const liveSec = Math.max(30, Math.min(300, Number(cfg.refreshSec) || 30));
    chrome.alarms.create(ALARM, { when: Date.now() + (liveCount ? liveSec * 1000 : 120000) });
    return { ok: true, count: list.length, live: liveCount, error };
  } catch (e) {
    const msg = String((e && e.message) || e);
    const { vbData } = await chrome.storage.local.get("vbData");
    await chrome.storage.local.set({
      vbData: { ...(vbData || { matches: [] }), error: msg, stale: true, updatedAt: Date.now() },
    });
    chrome.alarms.create(ALARM, { when: Date.now() + 120000 });
    return { ok: false, error: msg };
  } finally {
    refreshing = false;
  }
}

chrome.runtime.onInstalled.addListener(() => {
  refreshVb(true);
  chrome.alarms.create(ALARM, { when: Date.now() + 2000 });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create(ALARM, { when: Date.now() + 2000 });
});

chrome.alarms.onAlarm.addListener((a) => {
  if (a.name === ALARM) refreshVb(false);
});

// ---- Hesap favorileri (deneysel) -----------------------------------------
// Flashscore/Sofascore sayfasından okunan maç bağlantılarını mevcut feed ile eşler.
async function importFavorites(source, rows, href) {
  const src = source === "sofascore" ? "sofascore" : "flashscore";
  const { vbData, vbFavorites, vbImported } = await chrome.storage.local.get([
    "vbData",
    "vbFavorites",
    "vbImported",
  ]);
  const now = Date.now();
  const stale = !vbData || !vbData.matches || now - (vbData.updatedAt || 0) > 90000;
  // Eşleme yapabilmek için güncel maç verisi gerekiyor; yoksa önce feed'i tazele.
  if (stale) {
    await refreshVb(true);
    const d2 = await chrome.storage.local.get("vbData");
    const d2m = (d2.vbData && d2.vbData.matches) || [];
    if (d2m.length) vbData = d2.vbData;
  }
  const matches = (vbData && vbData.matches) || [];
  const byId = new Map(matches.map((m) => [m.id, m]));
  const matched = [];
  const unmatched = [];

  const seenRows = new Set();
  for (const row of rows || []) {
    const url = String((row && row.href) || "");
    const text = String((row && row.text) || "");
    const rowId = String((row && row.id) || "");
    const rowKey = rowId + "|" + url + "|" + text.slice(0, 120);
    if (seenRows.has(rowKey)) continue;
    seenRows.add(rowKey);
    let m = null;

    if (src === "flashscore") {
      const ids = [];
      if (rowId) ids.push(rowId);
      const idm = url.match(/\/match\/([^/?#]+)/i);
      if (idm && idm[1]) ids.push(idm[1]);
      for (const id of ids) {
        if (byId.has(id)) {
          m = byId.get(id);
          break;
        }
      }
    }
    if (!m && text) {
      m = matches.find((x) => VB.teamHit(text, x.home) && VB.teamHit(text, x.away)) || null;
    }
    if (m) {
      if (!matched.includes(m.id)) matched.push(m.id);
    } else {
      unmatched.push({ href: url, text: text.slice(0, 180) });
    }
  }

  if (matched.length === 0) {
    return { ok: false, error: "noMatches", total: (rows || []).length, matched: 0, ids: [] };
  }
  const favs = new Set((vbFavorites || []).map(String));
  for (const id of matched) favs.add(String(id));
  const imported = { ...(vbImported || {}) };
  imported[src] = {
    at: Date.now(),
    href: href || "",
    total: (rows || []).length,
    matched,
    unmatched: unmatched.slice(0, 40),
  };
  await chrome.storage.local.set({ vbFavorites: [...favs], vbImported: imported });
  return { ok: true, total: (rows || []).length, matched: matched.length, ids: matched };
}

async function clearImported() {
  const { vbFavorites, vbImported } = await chrome.storage.local.get(["vbFavorites", "vbImported"]);
  const favs = new Set((vbFavorites || []).map(String));
  let removed = 0;
  for (const src of Object.keys(vbImported || {})) {
    for (const id of (vbImported[src] && vbImported[src].matched) || []) {
      if (favs.delete(String(id))) removed++;
    }
  }
  await chrome.storage.local.set({ vbFavorites: [...favs], vbImported: {} });
  return { ok: true, removed };
}


chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    try {
      if (msg && msg.type === "vbRefresh") {
        sendResponse(await refreshVb(!!msg.force));
      } else if (msg && msg.type === "vbGet") {
        const { vbData, vbConfig, vbImported } = await chrome.storage.local.get([
          "vbData",
          "vbConfig",
          "vbImported",
        ]);
        sendResponse({ ok: true, data: vbData || null, config: vbConfig || null, imported: vbImported || {} });
      } else if (msg && msg.type === "vbImportFavorites") {
        sendResponse(await importFavorites(msg.source, msg.rows, msg.href));
      } else if (msg && msg.type === "vbClearImported") {
        sendResponse(await clearImported());
      } else if (msg && msg.type === "vbToggleFavorite") {
        const { vbFavorites } = await chrome.storage.local.get("vbFavorites");
        const favs = new Set((vbFavorites || []).map(String));
        if (favs.has(String(msg.id))) favs.delete(String(msg.id)); else favs.add(String(msg.id));
        await chrome.storage.local.set({ vbFavorites: [...favs] });
        sendResponse({ ok: true, favs: [...favs] });
      } else {
        sendResponse({ ok: false });
      }
    } catch (e) {
      sendResponse({ ok: false, error: String((e && e.message) || e) });
    }
  })();
  return true;
});

// İlk açılışta veri yoksa hemen çek.
chrome.storage.local.get("vbData").then(({ vbData }) => {
  if (!vbData) refreshVb(false);
  else if (Date.now() - (vbData.updatedAt || 0) > 120000) refreshVb(false);
});

})(__vbGmFetch);

// ===== content.js (eklentiden, sadece ⚙ dugmesi eklendi) =====
// VBunny - tüm sitelerde kompakt panel (Shadow DOM)
(function () {
  if (window.__vbOverlayLoaded) return;
  window.__vbOverlayLoaded = true;

  const VB = window.VB;
  const HOST_ID = "vb-stats-host";
  const BRAND_URL = (() => {
    try { return chrome.runtime.getURL("icons/icon32.png"); } catch (e) { return ""; }
  })();
  const THEME_COLORS = {
    dark: { home: "#4dd0e1", away: "#4dd0e1" },
    light: { home: "#2b7a9b", away: "#7cc4d8" },
    neon: { home: "#ff2fb3", away: "#4dffdf" },
  };

  const state = {
    data: null,
    cfg: VB.DEFAULT_CONFIG,
    ui: {
      collapsed: false,
      hidden: false,
      tab: "live",
      chip: "all",
      panelWidth: 320,
      panelHeight: null,
      left: null,
      top: null,
      fastLive: true,
      pinned: false,
      pillMatchIndex: 0,
      pillDetail: false,
    },
    favs: new Set(),
    imported: null,
    marks: {},
    themeMenu: false,
    ready: false,
  };

  let host = null;
  let root = null;
  let placedIn = null;
  let lastPoke = 0;
  let fastTimer = null;

  const L = () => state.cfg.lang || "tr";
  const T = (key, vars) => VB.t(key, L(), vars);

  function pokeRefresh() {
    if (Date.now() - lastPoke < 1500) return;
    lastPoke = Date.now();
    chrome.runtime.sendMessage({ type: "vbRefresh" }).catch(() => {});
  }

  // -------------------------------------------------------------------------
  // Yardımcılar
  // -------------------------------------------------------------------------
  function isYouTube() {
    return /(^|\.)youtube\.com$/.test(location.hostname);
  }
  function isTwitch() {
    return /(^|\.)twitch\.tv$/.test(location.hostname);
  }

  function onVideoPage() {
    if (window.__vbForceShow) return true;
    if (state.cfg.allSites !== false) return true;
    if (isYouTube()) {
      const p = location.pathname;
      if (p === "/watch") return true;
      if (p.startsWith("/live/")) return true;
      return false;
    }
    if (isTwitch()) {
      const p = location.pathname;
      const blocked = /^\/(directory|search|settings|downloads|jobs|turbo|subscriptions|inventory|wallet|drops|friends|p|login|signup|videos|collections)\b/;
      return p.length > 1 && !blocked.test(p);
    }
    return false;
  }

  function allowedHere() {
    if (window.__vbForceShow) return true;
    if (state.cfg.allSites !== false) return true;
    if (isYouTube()) return state.cfg.showOnYouTube !== false;
    if (isTwitch()) return state.cfg.showOnTwitch !== false;
    return false;
  }

  function saveUi(patch) {
    state.ui = { ...state.ui, ...patch };
    chrome.storage.local.set({ vbUi: state.ui }).catch(() => {});
    render();
  }

  function toggleFav(id) {
    const n = new Set(state.favs);
    if (n.has(id)) n.delete(id); else n.add(id);
    state.favs = n;
    chrome.storage.local.set({ vbFavorites: [...n] }).catch(() => {});
    render();
  }

  function importedInfo() {
    const imp = state.imported || {};
    const ids = new Set();
    let has = false;
    for (const key of Object.keys(imp)) {
      const entry = imp[key];
      if (!entry) continue;
      has = true;
      for (const id of (entry.matched || [])) ids.add(String(id));
    }
    return { has, ids };
  }

  function accountMode() {
    return state.cfg.accountOnly !== false && importedInfo().has;
  }

  function accountFilter(list) {
    if (!accountMode()) return list;
    // Hesap modunda yalnızca şu an favoride olan maçlar görünür;
    // içe aktarılan kimlikler zaten vbFavorites'a eklenmiştir.
    return list.filter((m) => state.favs.has(String(m.id)));
  }

  function computeMarks(next) {
    const prev = state.data;
    const marks = {};
    if (prev && next) {
      const pmap = new Map(((prev.matches) || []).map((m) => [String(m.id), m]));
      for (const nm of (next.matches || [])) {
        const pm = pmap.get(String(nm.id));
        if (!pm || pm.status !== 2 || nm.status !== 2) continue;
        const homeSetUp = (nm.homeSets || 0) > (pm.homeSets || 0);
        const awaySetUp = (nm.awaySets || 0) > (pm.awaySets || 0);
        let home = 0;
        let away = 0;
        let kind = "point";
        if (homeSetUp || awaySetUp) {
          kind = "set";
          home = homeSetUp ? 1 : 0;
          away = awaySetUp ? 1 : 0;
        } else if (pm.curH != null && nm.curH != null && pm.curA != null && nm.curA != null) {
          const dh = nm.curH - pm.curH;
          const da = nm.curA - pm.curA;
          if (dh > 0) home = dh;
          if (da > 0) away = da;
        }
        if (home || away) marks[String(nm.id)] = { home, away, kind };
      }
    }
    state.marks = marks;
  }

  function themeLabel(id) {
    return T({ team: "themeTeam", dark: "themeDark", light: "themeLight", neon: "themeNeon" }[id] || "themeTeam");
  }

  function todayMatches() {
    const list = (state.data && state.data.matches) || [];
    return list.filter((m) => {
      const d = new Date(m.start);
      const n = new Date();
      return d.toDateString() === n.toDateString();
    });
  }

  function tabMatches() {
    const tab = state.ui.tab || "live";
    const all = (state.data && state.data.matches) || [];
    if (tab === "live") return all.filter((m) => m.status === 2);
    if (tab === "today") {
      const live = all.filter((m) => m.status === 2);
      const today = todayMatches().filter((m) => m.status !== 2 && m.status !== 3);
      return [...live, ...today];
    }
    if (tab === "done") return all.filter((m) => m.status === 3);
    return all.filter((m) => m.status === 1);
  }

  function chipFilter(list) {
    const chip = state.ui.chip || "all";
    if (chip === "all" || chip === "fav") return list;
    return list.filter((m) => (m.tags || []).includes(chip));
  }

  function visibleMatches() {
    let list = chipFilter(tabMatches());
    list = accountFilter(list);
    const chip = state.ui.chip || "all";
    if (chip === "fav") list = list.filter((m) => state.favs.has(m.id));
    return list;
  }

  function liveTop() {
    const list = ((state.data && state.data.matches) || []).filter((m) => m.status === 2);
    return list[0] || null;
  }

  function liveMatches() {
    return ((state.data && state.data.matches) || []).filter((m) => m.status === 2);
  }

  // Küçük pill'de gösterilecek canlı maçı dizin ile seçer; yoksa ilk canlı maç.
  function pillMatch() {
    const list = liveMatches();
    if (!list.length) return null;
    const idx = Math.max(0, Math.min(Number(state.ui.pillMatchIndex || 0), list.length - 1));
    return list[idx] || null;
  }

  // Büyük pill görünümü için sadece canlı (status 2) maçı döndürür; bittiği maç gösterilmez.
  function pillDetailMatch() {
    const list = liveMatches();
    return list.length ? list[0] : null;
  }

  // Kapalı pill için takım kısaltması: Fenerbahçe → FEN, Türkiye → TUR.
  function abbrName(name) {
    const n = String(name || "").trim();
    if (!n) return "?";
    const first = n
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9]+/g, " ")
      .trim()
      .split(/\s+/)[0];
    if (first) return first.slice(0, 3).toUpperCase();
    // Latin dışı (Çince/Japonca/Tayca vb.) adlarda ilk üç karakteri kullan.
    return Array.from(n.replace(/\s+/g, "")).slice(0, 3).join("").toUpperCase() || "?";
  }

  function pillRowHtml(m, side) {
    const name = side === "home" ? m.home : m.away;
    const logo = side === "home" ? m.homeLogo : m.awayLogo;
    const sets = side === "home" ? m.homeSets : m.awaySets;
    const points = side === "home" ? m.curH : m.curA;
    const t = VB.teamTheme(name);
    const color = t ? t.primary : "#4dd0e1";
    const img = logo
      ? `<img class="vb-pill-logo" src="${esc(logo)}" alt="" referrerpolicy="no-referrer" loading="lazy">`
      : "";
    return `<span class="vb-pill-row" style="--vb-row:${color}" title="${esc(name)}">
      <span class="vb-pill-team"><span class="vb-pill-dot" style="background:${color}">${img}</span><b>${esc(abbrName(name))}</b></span>
      <span class="vb-pill-set" title="${esc(T("set"))}">${sets != null ? sets : 0}</span>
      <span class="vb-pill-point" title="${esc(T("scored"))}">${points != null ? esc(points) : "–"}</span>
    </span>`;
  }

  // Tema menüsünde seçilebilecek takımlar (mevcut feed'deki tüm takımlar).
  function teamChoices() {
    const names = new Set();
    for (const m of (state.data && state.data.matches) || []) {
      if (m.home) names.add(String(m.home).trim());
      if (m.away) names.add(String(m.away).trim());
    }
    const picked = String(state.cfg.teamThemeName || "").trim();
    if (picked) names.add(picked);
    return [...names]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, L()))
      .slice(0, 120);
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setLine(m) {
    if (!m.setScores || !m.setScores.length) return "";
    const last = m.setScores.length - 1;
    return m.setScores
      .map(
        (s, i) =>
          `<span class="vb-set ${s.h > s.a ? "won" : ""} ${m.status === 2 && i === last ? "now" : ""}">${s.h}-${s.a}</span>`
      )
      .join("");
  }

  function scoreBadge(mark) {
    if (!mark) return "";
    const n = Number(mark.n) || 1;
    return `<span class="vb-point">${esc(mark.kind === "set" ? T("setWon") : T("scored"))}${n > 1 ? " +" + n : ""}</span>`;
  }

  function teamCell(name, logo, lead, mark) {
    const badge = scoreBadge(mark);
    const teamLook = state.cfg.teamTheme !== false || (state.cfg.theme || "team") === "team";
    if (!teamLook) {
      return `<div class="vb-team ${lead ? "lead" : ""} ${mark ? "scored" : ""}"><span class="vb-tname">${esc(name)}</span>${badge}</div>`;
    }
    const t = VB.teamTheme(name);
    const color = t ? t.primary : "#4dd0e1";
    const img = logo ? `<img class="vb-logo" src="${esc(logo)}" alt="" referrerpolicy="no-referrer" loading="lazy">` : "";
    return `<div class="vb-team ${lead ? "lead" : ""} ${mark ? "scored" : ""}"><span class="vb-tdot" style="background:${color}">${img}</span><span class="vb-tname">${esc(name)}</span>${badge}</div>`;
  }

  function rowHtml(m) {
    const live = m.status === 2;
    const time = VB.metaStatus(m, L());
    const comp = VB.shortComp(m, L());
    const fav = state.favs.has(m.id) ? "★" : "☆";
    const hasScore = m.status !== 1 && m.homeSets != null && m.awaySets != null;
    const showCur = live && m.curH != null && m.curA != null;
    const homeLead = hasScore && m.homeSets > m.awaySets;
    const awayLead = hasScore && m.awaySets > m.homeSets;
    const mark = state.marks[String(m.id)] || null;
    const homeMark = mark && mark.home ? { n: mark.home, kind: mark.kind } : null;
    const awayMark = mark && mark.away ? { n: mark.away, kind: mark.kind } : null;
    const home = teamCell(m.home, m.homeLogo, homeLead, homeMark);
    const away = teamCell(m.away, m.awayLogo, awayLead, awayMark);
    const board = hasScore
      ? `<div class="vb-board ${showCur ? "" : "no-cur"}">
          <span class="vb-board-h" aria-hidden="true"></span>
          <span class="vb-board-h">${esc(T("set"))}</span>
          ${showCur ? `<span class="vb-board-h h-cur">${esc(T("scored"))}</span>` : ""}
          ${home}
          <span class="vb-set-n ${homeLead ? "win" : ""}">${m.homeSets}</span>
          ${showCur ? `<span class="vb-cur-n">${m.curH}</span>` : ""}
          ${away}
          <span class="vb-set-n ${awayLead ? "win" : ""}">${m.awaySets}</span>
          ${showCur ? `<span class="vb-cur-n">${m.curA}</span>` : ""}
        </div>`
      : `<div class="vb-board plain">${home}${away}</div>`;
    const sets = setLine(m);
    return `<div class="vb-match ${live ? "is-live" : ""}" data-id="${esc(m.id)}">
      <div class="vb-meta">
        <span class="vb-comp">${esc(comp)}</span>
        <span class="vb-status ${live ? "live" : m.status === 3 ? "done" : "soon"}" ${
          live ? `title="${esc(T("live"))}" aria-label="${esc(T("live"))}"` : ""
        }>${live ? `<span class="vb-live-dot" aria-hidden="true"></span>` : esc(time)}</span>
        <button class="vb-fav ${state.favs.has(m.id) ? "on" : ""}" data-fav="${m.id}" title="${esc(T("favTitle"))}">${fav}</button>
      </div>
      ${board}
      ${sets ? `<div class="vb-sets">${sets}</div>` : ""}
    </div>`;
  }

  function emptyHtml() {
    if (accountMode()) return `<div class="vb-empty">${esc(T("noAccountFav"))}</div>`;
    const tab = state.ui.tab || "live";
    if (tab === "live") {
      const next = ((state.data && state.data.matches) || [])
        .filter((m) => m.status === 1 && m.start > Date.now() - 60000)
        .sort((a, b) => a.start - b.start)[0];
      return `<div class="vb-empty">${esc(T("noLive"))}${
        next
          ? `<br><span class="vb-next">${esc(T("next"))}: ${esc(VB.fmtDay(next.start, L()))} ${esc(VB.fmtClock(next.start, L()))} — ${esc(next.home)} - ${esc(next.away)}</span>`
          : ""
      }</div>`;
    }
    if (tab === "done") return `<div class="vb-empty">${esc(T("finished"))}</div>`;
    return `<div class="vb-empty">${esc(T("noMatches"))}</div>`;
  }

  function render() {
    if (!root) return;
    // Sürükleme sırasında DOM'u yeniden oluşturmayacek (takılmayı ve kaydırmayı önler).
    if (window.__vbDragging) {
      applyPosition();
      return;
    }
    if (!allowedHere() || !onVideoPage() || state.ui.hidden) {
      host.style.display = "none";
      return;
    }
    host.style.display = "block";

    const oldList = root.querySelector(".vb-list");
    const scrollTop = oldList ? oldList.scrollTop : 0;

    const liveCount = ((state.data && state.data.matches) || []).filter((m) => m.status === 2).length;
    const topLive = pillMatch();
    const pillList = liveMatches();
    const pillIndex = Math.max(0, Math.min(Number(state.ui.pillMatchIndex || 0), pillList.length - 1)) + 1;
    const upd = state.data && state.data.updatedAt ? VB.fmtClock(state.data.updatedAt, L()) : "-";
    const stale = state.data && state.data.stale;

    const list = visibleMatches();
    const tab = state.ui.tab || "live";
    const chip = state.ui.chip || "all";

    // Tema: takım renkleri veya üstteki paletten seçilen sabit tema.
    const theme = state.cfg.theme || "team";
    const themeM = list.find((m) => m.status === 2) || list[0] ||
      ((state.data && state.data.matches) || [])[0];
    const pickName = String(state.cfg.teamThemeName || "").trim();
    const useTheme = theme === "team";
    const pickedTheme = useTheme && pickName ? VB.teamTheme(pickName) : null;
    const th = useTheme ? (pickedTheme || (themeM ? VB.teamTheme(themeM.home) : null)) : null;
    const ta = useTheme
      ? (pickedTheme ? { primary: pickedTheme.secondary } : (themeM ? VB.teamTheme(themeM.away) : null))
      : null;
    const palette = THEME_COLORS[theme] || THEME_COLORS.dark;
    host.style.setProperty("--vb-home", th ? th.primary : palette.home);
    host.style.setProperty("--vb-away", ta ? ta.primary : palette.away);

    const accOn = accountMode();
    const impInfo = importedInfo();
    const accCount = [...impInfo.ids].filter((id) => state.favs.has(id)).length;
    const teamPick = theme === "team"
      ? `<div class="vb-team-pick-wrap">
          <span class="vb-pick-label">${esc(T("teamPick"))}</span>
          <div class="vb-team-list" data-team-list>
            <button class="vb-team-opt ${pickName ? "" : "on"}" data-team="">${esc(T("teamAuto"))}</button>
            ${teamChoices()
              .map((n) => `<button class="vb-team-opt ${n === pickName ? "on" : ""}" data-team="${esc(n)}">${esc(n)}</button>`)
              .join("")}
          </div>
        </div>`
      : "";
    const themeOpts = ["team", "dark", "light", "neon"]
      .map((id) => `<button class="vb-theme-opt ${theme === id ? "on" : ""}" data-theme="${id}">${esc(themeLabel(id))}</button>`)
      .join("") + teamPick;

    const tabs = [
      ["live", T("live")],
      ["today", T("today")],
      ["soon", T("soon")],
      ["done", T("done")],
    ];
    const chips = [
      ["all", T("all")],
      ["tr", "TR"],
      ["it", "IT"],
      ["pl", "PL"],
      ["br", "BR"],
      ["cl", T("clShort")],
      ["milli", T("national")],
      ["fav", T("favorite")],
    ];

    root.innerHTML = `
      <style>${CSS}</style>
      <div class="vb-panel vb-theme-${esc(theme)} ${state.ui.pinned ? "pinned" : ""}" ${state.ui.collapsed ? "hidden" : ""}>
        <div class="vb-team-bar"></div>
        <div class="vb-head" data-drag="1">
          <span class="vb-head-center">
            ${BRAND_URL ? `<img class="vb-brand" src="${esc(BRAND_URL)}" alt="">` : `<span class="vb-ball">🐰</span>`}
            <span class="vb-title" title="${esc(T("vb"))}">VBunny</span>
            ${liveCount ? `<span class="vb-live"><i></i>${liveCount}</span>` : ""}
          </span>
          <span class="vb-spacer"></span>
          <span class="vb-head-right">
            <span class="vb-theme-wrap">
              <button class="vb-ico ${state.themeMenu ? "on" : ""}" data-act="theme" title="${esc(T("theme"))}">🎨</button>
              ${state.themeMenu ? `<div class="vb-theme-menu">${themeOpts}</div>` : ""}
            </span>
            <button class="vb-ico" data-act="settings" title="Ayarlar / Settings">⚙</button>
            <button class="vb-ico ${state.ui.pinned ? "on" : ""}" data-act="pin" title="${esc(T(state.ui.pinned ? "unpin" : "pin"))}">${state.ui.pinned ? "📌" : "📍"}</button>
            <button class="vb-ico" data-act="refresh" title="${esc(T("refresh"))}">⟳</button>
            <button class="vb-ico" data-act="collapse" title="${esc(T("collapse"))}">–</button>
          </span>
        </div>
        <div class="vb-tabs">
          ${tabs
            .map(
              ([id, label]) =>
                `<button class="vb-tab ${tab === id ? "on" : ""}" data-tab="${id}">${esc(label)}</button>`
            )
            .join("")}
        </div>
        <div class="vb-chips">
          ${chips
            .map(
              ([id, label]) =>
                `<button class="vb-chip ${chip === id ? "on" : ""}" data-chip="${id}">${esc(label)}</button>`
            )
            .join("")}
        </div>
        <div class="vb-list">${list.length ? list.map(rowHtml).join("") : emptyHtml()}</div>
        <div class="vb-foot">
          <span>${accOn ? `<b class="vb-acc">${esc(T("accountShort"))} ${accCount}</b> • ` : ""}${stale ? "⚠ " + esc(T("stale")) + " — " : ""}Flashscore • ${esc(upd)}</span>
          <button class="vb-link" data-act="hided">${esc(T("hide"))}</button>
        </div>
        <div class="vb-resize" data-resize="1" title="${esc(T("resize"))}"></div>
      </div>
      <div class="vb-pill vb-theme-${esc(theme)}" ${state.ui.collapsed ? "" : "hidden"}>
        <span class="vb-pill-brand-col">
          ${BRAND_URL ? `<img class="vb-pill-logo" src="${esc(BRAND_URL)}" alt="" style="width:20px;height:20px;">` : `<span class="vb-pill-ball" style="font-size:20px;">🐰</span>`}
          ${liveCount ? `<span class="vb-pill-live" title="${esc(T("live"))}"><i></i>${liveCount}</span>` : ""}
        </span>
        ${state.ui.pillDetail
          ? (() => {
              const dm = pillDetailMatch();
              if (!dm) return `<b class="vb-pill-brand" role="button" tabindex="0" aria-label="${esc(T("expand"))}" style="font-size:12px;">VBunny</b>`;
              const comp = esc(VB.shortComp(dm, L()));
              const when = dm.status === 1 ? `${VB.fmtDay(dm.start, L())} ${VB.fmtClock(dm.start, L())}` : esc(T("finished"));
              const cls = dm.status === 1 ? "vb-pill-soon" : "vb-pill-done";
              return `<div class="vb-pill-detail ${cls}"><span class="vb-pill-comp">${comp}</span><span class="vb-pill-when">${when}</span><span class="vb-pill-teams">${esc(dm.home)} – ${esc(dm.away)}</span></div>`;
            })()
          : topLive
            ? `<div class="vb-pill-stack"><span class="vb-pill-rows" role="button" tabindex="0" aria-label="${esc(T("expand"))}">${pillRowHtml(topLive, "home")}${pillRowHtml(topLive, "away")}</span>${pillList.length > 1 ? `<span class="vb-pill-nav"><button class="vb-pill-nav-btn" data-act="pill-prev" title="${esc(T("prev"))}" aria-label="${esc(T("prev"))}">‹</button><span class="vb-pill-nav-index">${pillIndex} / ${pillList.length}</span><button class="vb-pill-nav-btn" data-act="pill-next" title="${esc(T("next"))}" aria-label="${esc(T("next"))}">›</button></span>` : ``}</div>`
            : `<b class="vb-pill-brand" role="button" tabindex="0" aria-label="${esc(T("expand"))}" style="font-size:12px;">VBunny</b>`}
      </div>`;

    bind();
    const p = root.querySelector(".vb-panel");
    if (p) {
      const pw = Math.max(260, Math.min(640, Number(state.ui.panelWidth) || 320));
      p.style.width = pw + "px";
      if (state.ui.panelHeight != null) p.style.height = Math.max(150, Number(state.ui.panelHeight) || 0) + "px";
    }
    applyPosition();
    const newList = root.querySelector(".vb-list");
    if (newList) newList.scrollTop = scrollTop;
  }

  // -------------------------------------------------------------------------
  // Olaylar
  // -------------------------------------------------------------------------
  let drag = null;
  let pillMoved = false;

  function bind() {
    root.querySelectorAll(".vb-logo, .vb-pill-logo").forEach((img) => {
      img.addEventListener("error", () => img.remove(), { once: true });
    });
    root.querySelectorAll(".vb-brand").forEach((img) => {
      img.addEventListener("error", () => {
        const s = document.createElement("span");
        s.className = "vb-ball";
        s.textContent = "🐰";
        img.replaceWith(s);
      }, { once: true });
    });
    root.querySelectorAll("[data-tab]").forEach((b) => {
      b.addEventListener("click", () => saveUi({ tab: b.dataset.tab }));
    });
    root.querySelectorAll("[data-chip]").forEach((b) => {
      b.addEventListener("click", () => saveUi({ chip: b.dataset.chip }));
    });
    root.querySelectorAll("[data-act]").forEach((b) => {
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        const act = b.dataset.act;
        if (act === "collapse" && pillMoved) {
          pillMoved = false;
          return;
        }
        if (act === "collapse") saveUi({ collapsed: !state.ui.collapsed });
        else if (act === "expand") saveUi({ collapsed: false });
        else if (act === "pin") saveUi({ pinned: !state.ui.pinned });
        else if (act === "theme") {
          state.themeMenu = !state.themeMenu;
          render();
        } else if (act === "refresh") {
          b.textContent = "…";
          chrome.runtime.sendMessage({ type: "vbRefresh", force: true }).catch(() => {});
          setTimeout(() => {
            const btn = root && root.querySelector('[data-act="refresh"]');
            if (btn) btn.textContent = "⟳";
          }, 1500);
        } else if (act === "settings") {
          if (typeof window.__vbOpenSettings === "function") window.__vbOpenSettings();
        } else if (act === "hided") saveUi({ hidden: true });
      });
    });
    root.querySelectorAll("[data-theme]").forEach((b) => {
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        const picked = b.dataset.theme;
        state.cfg = {
          ...state.cfg,
          theme: picked,
          ...(picked === "team" ? { teamTheme: true } : {}),
        };
        // Takım teması seçilince menü açık kalır; altındaki takım listesi görünür.
        state.themeMenu = picked === "team";
        chrome.storage.local.set({ vbConfig: state.cfg }).catch(() => {});
        render();
      });
    });
    root.querySelectorAll("[data-team]").forEach((b) => {
      b.addEventListener("pointerdown", (e) => e.stopPropagation());
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        const name = b.dataset.team;
        state.cfg = {
          ...state.cfg,
          theme: "team",
          teamTheme: true,
          teamThemeName: name,
        };
        state.themeMenu = true;
        chrome.storage.local.set({ vbConfig: state.cfg }).catch(() => {});
        render();
      });
    });
    root.querySelectorAll("[data-fav]").forEach((b) => {
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFav(b.dataset.fav);
      });
    });

    const head = root.querySelector(".vb-head");
    if (head) {
      head.addEventListener("pointerdown", (e) => {
        if (state.ui.pinned || e.target.closest("button, select, .vb-theme-menu")) return;
        const r = host.getBoundingClientRect();
        drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
        window.__vbDragging = true;
        head.setPointerCapture(e.pointerId);
      });
      head.addEventListener("pointermove", (e) => {
        if (!drag) return;
        const w = host.offsetWidth || 310;
        const h = host.offsetHeight || 200;
        let left = Math.max(4, Math.min(window.innerWidth - w - 4, e.clientX - drag.dx));
        let top = Math.max(4, Math.min(window.innerHeight - h - 4, e.clientY - drag.dy));
        host.style.left = left + "px";
        host.style.top = top + "px";
        host.style.right = "auto";
        host.style.bottom = "auto";
      });
      head.addEventListener("pointerup", () => {
        if (!drag) return;
        drag = null;
        window.__vbDragging = false;
        const left = parseInt(host.style.left, 10);
        const top = parseInt(host.style.top, 10);
        state.ui.left = Number.isFinite(left) ? left : null;
        state.ui.top = Number.isFinite(top) ? top : null;
        chrome.storage.local.set({ vbUi: { ...state.ui } });
      });
    }

    // Küçük pill de sürüklenebilir; bırakınca konum hatırlanır. Tıklamayla canlı maçlar arasında geçiş yapılır.
    const pill = root.querySelector(".vb-pill");
    if (pill) {
      let pd = null;
      let moved = false;
      pill.addEventListener("pointerdown", (e) => {
        // Sayfalayıcı düğmeleri pill'i sürüklemez/açmaz.
        if (e.target.closest(".vb-pill-nav")) return;
        const r = host.getBoundingClientRect();
        pd = { dx: e.clientX - r.left, dy: e.clientY - r.top, x: e.clientX, y: e.clientY, pinned: !!state.ui.pinned };
        moved = false;
        pillMoved = false;
        // Sabitlenmiş panelde sürükleme yok; yine de tıklama paneyi açar.
        if (pd.pinned) return;
        window.__vbDragging = true;
        try { pill.setPointerCapture(e.pointerId); } catch (err) {}
      });
      pill.addEventListener("pointermove", (e) => {
        if (!pd || pd.pinned) return;
        if (Math.abs(e.clientX - pd.x) + Math.abs(e.clientY - pd.y) > 3) moved = true;
        if (!moved) return;
        const w = host.offsetWidth || 90;
        const h = host.offsetHeight || 32;
        const left = Math.max(4, Math.min(window.innerWidth - w - 4, e.clientX - pd.dx));
        const top = Math.max(4, Math.min(window.innerHeight - h - 4, e.clientY - pd.dy));
        host.style.left = left + "px";
        host.style.top = top + "px";
        host.style.right = "auto";
        host.style.bottom = "auto";
        host.style.transform = "none";
      });
      pill.addEventListener("pointerup", (e) => {
        if (!pd) return;
        pd = null;
        window.__vbDragging = false;
        if (moved) {
          pillMoved = true;
          const left = parseInt(host.style.left, 10);
          const top = parseInt(host.style.top, 10);
          state.ui.left = Number.isFinite(left) ? left : null;
          state.ui.top = Number.isFinite(top) ? top : null;
          chrome.storage.local.set({ vbUi: { ...state.ui } });
          return;
        }
        // Pill'e tıklandığında büyük pill (maç detayı) açar; tekrar tıklamayıp
        // sayfalayıcıya basılmamışsa paneyi genişletir. Sayfalayıcı düğmesine yapılan
        // tık paneyi açmaz; o düğmenin kendi click handler'ı yürür.
        if (e.target.closest(".vb-pill-nav")) return;
        const hasMatch = liveMatches().length > 0 || pillDetailMatch() != null;
        if (hasMatch && !state.ui.pillDetail) {
          saveUi({ pillDetail: true });
          return;
        }
        saveUi({ pillDetail: false, collapsed: false });
      });
      // Sayfalayıcı düğmeler için doğrudan click (ve klavye) handler'ı:
      // [data-act] delegasyonundan bağımsız çalışır, paneyi açmaz.
      root.querySelectorAll(".vb-pill-nav-btn").forEach((b) => {
        b.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();
          const act = b.dataset.act;
          const list = liveMatches();
          if (list.length > 1) {
            const idx = Number(state.ui.pillMatchIndex || 0);
            const next =
              act === "pill-prev" ? (idx - 1 + list.length) % list.length : (idx + 1) % list.length;
            saveUi({ pillMatchIndex: next });
          }
        });
      });
      pill.addEventListener("keydown", (e) => {
        if (e.target.closest(".vb-pill-nav")) return;
        if (!e.target.closest(".vb-pill-rows, .vb-pill-brand")) return;
        if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
        e.preventDefault();
        saveUi({ collapsed: false });
      });
    }

    // Sağ alt köşeden fareyle genişlik/yükseklik ayarı.
    const rz = root.querySelector(".vb-resize");
    if (rz) {
      let rd = null;
      rz.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const p = root.querySelector(".vb-panel");
        if (!p) return;
        const r = p.getBoundingClientRect();
        rd = { sx: e.clientX, sy: e.clientY, w: r.width, h: r.height };
        try { rz.setPointerCapture(e.pointerId); } catch (err) {}
      });
      rz.addEventListener("pointermove", (e) => {
        if (!rd) return;
        const p = root.querySelector(".vb-panel");
        if (!p) return;
        const w = Math.max(260, Math.min(640, rd.w + e.clientX - rd.sx));
        const h = Math.max(160, Math.min(window.innerHeight - 24, rd.h + e.clientY - rd.sy));
        state.ui.panelWidth = Math.round(w);
        state.ui.panelHeight = Math.round(h);
        p.style.width = w + "px";
        p.style.height = h + "px";
        host.style.width = w + "px";
        if (host.style.left !== "auto") {
          const left = Math.max(4, Math.min(window.innerWidth - w - 4, parseFloat(host.style.left) || 0));
          host.style.left = left + "px";
          state.ui.left = left;
        }
        if (host.style.top !== "auto") {
          const top = Math.max(4, Math.min(window.innerHeight - Math.max(160, host.offsetHeight) - 4, parseFloat(host.style.top) || 0));
          host.style.top = top + "px";
          state.ui.top = top;
        }
      });
      const finishResize = () => {
        if (!rd) return;
        rd = null;
        state.cfg = {
          ...state.cfg,
          panelWidth: state.ui.panelWidth,
          panelHeight: state.ui.panelHeight,
        };
        chrome.storage.local.set({ vbUi: { ...state.ui }, vbConfig: state.cfg }).catch(() => {});
        render();
      };
      rz.addEventListener("pointerup", finishResize);
      rz.addEventListener("pointercancel", finishResize);
      rz.addEventListener("dblclick", (e) => {
        e.preventDefault();
        state.ui.panelWidth = 320;
        state.ui.panelHeight = null;
        state.cfg = { ...state.cfg, panelWidth: 320, panelHeight: null };
        chrome.storage.local.set({ vbUi: { ...state.ui }, vbConfig: state.cfg }).catch(() => {});
        render();
      });
    }
  }

  function applyPosition() {
    const w = Math.max(260, Math.min(640, Number(state.ui.panelWidth) || 320));
    if (state.ui.left != null && state.ui.top != null) {
      const ww = state.ui.collapsed ? 120 : w;
      const hh = state.ui.collapsed ? 38 : (host.offsetHeight || 200);
      const left = Math.max(4, Math.min(window.innerWidth - ww - 4, state.ui.left));
      const top = Math.max(4, Math.min(window.innerHeight - hh - 4, state.ui.top));
      host.style.left = left + "px";
      host.style.top = top + "px";
      host.style.right = "auto";
      host.style.bottom = "auto";
      host.style.transform = "none";
      host.style.width = state.ui.collapsed ? "auto" : w + "px";
    } else if (state.ui.collapsed) {
      // Küçültülmede varsayılan: ekranın alt ortası; sürükle-bırak ve hatırlama destekli.
      host.style.left = "50%";
      host.style.top = "auto";
      host.style.right = "auto";
      host.style.bottom = "16px";
      host.style.transform = "translateX(-50%)";
      host.style.width = "auto";
    } else {
      host.style.left = "auto";
      host.style.top = "auto";
      host.style.right = "16px";
      host.style.bottom = "16px";
      host.style.transform = "none";
      host.style.width = w + "px";
    }
  }

  function placeHost() {
    const fs = document.fullscreenElement;
    const target = fs || document.documentElement;
    if (host && placedIn === target) return;
    if (host && target.contains(host)) {
      placedIn = target;
      return;
    }
    target.appendChild(host);
    placedIn = target;
  }

  // -------------------------------------------------------------------------
  // Yükleme
  // -------------------------------------------------------------------------
  async function load() {
    const d = await chrome.storage.local.get(["vbData", "vbConfig", "vbUi", "vbFavorites", "vbImported"]);
    state.data = d.vbData || null;
    state.imported = d.vbImported || null;
    state.cfg = {
      ...VB.DEFAULT_CONFIG,
      ...(d.vbConfig || {}),
      comps: { ...VB.DEFAULT_CONFIG.comps, ...((d.vbConfig || {}).comps || {}) },
    };
    if (d.vbUi) {
      state.ui = { ...state.ui, ...d.vbUi };
    } else if (state.cfg.startCollapsed) {
      state.ui.collapsed = true;
    }
    state.favs = new Set((d.vbFavorites || []).map(String));
    // Genişlik ve hızlı-canlı ayarı options'dan (vbConfig) gelirse onu tercih et.
    if (d.vbConfig) {
      if (d.vbConfig.panelWidth != null) state.ui.panelWidth = Number(d.vbConfig.panelWidth) || 320;
      if (d.vbConfig.panelHeight != null) state.ui.panelHeight = Number(d.vbConfig.panelHeight) || null;
      if (d.vbConfig.fastLive != null) state.ui.fastLive = d.vbConfig.fastLive !== false;
    }
    state.ready = true;

    // Paneli varsayılan olarak canlı sekmesinde aç.
    if (!d.vbUi) {
      state.ui.tab = "live";
    }

    render();

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "local") return;
      if (changes.vbData) {
        computeMarks(changes.vbData.newValue || null);
        state.data = changes.vbData.newValue || null;
        render();
      }
      if (changes.vbConfig) {
        state.cfg = {
          ...VB.DEFAULT_CONFIG,
          ...(changes.vbConfig.newValue || {}),
          comps: {
            ...VB.DEFAULT_CONFIG.comps,
            ...((changes.vbConfig.newValue || {}).comps || {}),
          },
        };
        if (state.cfg.fastLive != null) state.ui.fastLive = state.cfg.fastLive !== false;
        if (state.cfg.panelWidth != null) state.ui.panelWidth = Number(state.cfg.panelWidth) || 320;
        if (state.cfg.panelHeight != null) state.ui.panelHeight = Number(state.cfg.panelHeight) || null;
        render();
      }
      if (changes.vbImported) {
        state.imported = changes.vbImported.newValue || null;
        render();
      }
      if (changes.vbUi) {
        const u = changes.vbUi.newValue;
        if (u) state.ui = { ...state.ui, ...u };
        render();
      }
      if (changes.vbFavorites) {
        state.favs = new Set((changes.vbFavorites.newValue || []).map(String));
        render();
      }
    });

    // Veri eskiyse hemen tazele.
    if (!state.data || Date.now() - (state.data.updatedAt || 0) > 90000) {
      pokeRefresh();
    }
  }

  function init() {
    host = document.createElement("div");
    host.id = HOST_ID;
    // CSP style-src 'unsafe-inline' olmayan sitelerde style="" engellenir;
    // CSSOM atamalari engellenmez.
    host.style.position = "fixed";
    host.style.zIndex = "2147483647";
    host.style.pointerEvents = "none";
    host.style.fontFamily = "'Segoe UI',system-ui,sans-serif";
    document.documentElement.appendChild(host);
    root = host.attachShadow({ mode: "open" });
    try {
      if ("adoptedStyleSheets" in root && typeof CSSStyleSheet === "function") {
        const __vbSheet = new CSSStyleSheet();
        __vbSheet.replaceSync(CSS);
        root.adoptedStyleSheets = [__vbSheet];
      }
    } catch (e) { /* eski tarayici: inline <style> yeter */ }

    load();

    document.addEventListener("fullscreenchange", placeHost);
    window.addEventListener("resize", () => applyPosition());

    // Popup'tan gizle/göster gibi UI değişikliklerini anında uygula.
    chrome.runtime.onMessage.addListener((msg) => {
      if (!msg || msg.type !== "vbReloadUi") return;
      chrome.storage.local
        .get(["vbUi", "vbConfig", "vbImported"])
        .then((d) => {
          if (d.vbUi) state.ui = { ...state.ui, ...d.vbUi };
          state.imported = d.vbImported || null;
          if (d.vbConfig) {
            state.cfg = {
              ...VB.DEFAULT_CONFIG,
              ...d.vbConfig,
              comps: { ...VB.DEFAULT_CONFIG.comps, ...(d.vbConfig.comps || {}) },
            };
            if (state.cfg.fastLive != null) state.ui.fastLive = state.cfg.fastLive !== false;
            if (state.cfg.panelWidth != null) state.ui.panelWidth = Number(state.cfg.panelWidth) || 320;
            if (state.cfg.panelHeight != null) state.ui.panelHeight = Number(state.cfg.panelHeight) || null;
          }
          render();
        })
        .catch(() => {});
    });

    setInterval(() => {
      placeHost();
      if (location.pathname !== state._path) {
        state._path = location.pathname;
        render();
      }
      const live = state.data && state.data.liveCount ? state.data.liveCount : 0;
      // Canlı maç varsa 2 saniyede bir tazele (sayfa açıkken en hızlı güncelleme).
      if (state.ui.fastLive !== false && live > 0 && !document.hidden) {
        if (!fastTimer) {
          fastTimer = setInterval(() => pokeRefresh(), 2000);
        }
        if (Date.now() - (state.data.updatedAt || 0) > 2000) pokeRefresh();
      } else {
        if (fastTimer) { clearInterval(fastTimer); fastTimer = null; }
        if (!document.hidden && live > 0 && Date.now() - (state.data.updatedAt || 0) > 60000) {
          pokeRefresh();
        } else if (!document.hidden && live === 0 && Date.now() - (state.data.updatedAt || 0) > 15000) {
          // Canlı maç başlamış olabilir; 15 sn'de bir yokla.
          pokeRefresh();
        }
      }
    }, 2000);
  }

  // -------------------------------------------------------------------------
  // Stiller (Shadow DOM)
  // -------------------------------------------------------------------------
  const CSS = `
    :host { all: initial; }
    * { box-sizing: border-box; }
    .vb-panel {
      pointer-events: auto;
      position: relative;
      width: auto;
      max-width: 320px;
      max-height: min(90vh, 900px);
      display: flex;
      flex-direction: column;
      background: rgba(14, 17, 20, .96);
      color: #e9eef3;
      border: 1px solid rgba(255,255,255,.14);
      border-radius: 14px;
      box-shadow: 0 18px 50px rgba(0,0,0,.55);
      overflow: hidden;
      backdrop-filter: blur(10px);
      font-size: 12px;
      line-height: 1.3;
    }
    .vb-team-bar {
      height: 8px;
      background: linear-gradient(90deg, var(--vb-home, #4dd0e1) 0 50%, var(--vb-away, #4dd0e1) 50% 100%);
      flex: none;
      box-shadow: 0 0 12px rgba(0,0,0,.4);
    }
    .vb-head {
      display: flex; align-items: center; justify-content: space-between; gap: 5px;
      padding: 8px 9px;
      background: linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.02));
      cursor: grab; user-select: none;
      border-bottom: 1px solid rgba(255,255,255,.08);
    }
    .vb-head-center { display: flex; align-items: center; gap: 6px; }
    .vb-head-right { display: flex; align-items: center; gap: 5px; }
    .vb-head:active { cursor: grabbing; }
    .vb-panel.pinned .vb-head { cursor: default; }
    .vb-ball { font-size: 14px; }
    .vb-brand { width: 24px; height: 24px; object-fit: contain; flex: none; filter: drop-shadow(0 0 6px rgba(255,255,255,.5)); }
    .vb-title { font-weight: 900; letter-spacing: .03em; font-size: 14px; color: #fff; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; filter: drop-shadow(0 0 8px rgba(77,208,225,.4)); }
    .vb-live {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 10px; font-weight: 800; color: #ffd4d4;
      background: rgba(255,77,79,.16); border: 1px solid rgba(255,77,79,.5);
      padding: 1px 5px; border-radius: 999px;
    }
    .vb-live i { width: 6px; height: 6px; border-radius: 50%; background: #ff4d4f; animation: vbp 1.1s infinite; }
    .vb-live-dot { flex: none; width: 6px; height: 6px; border-radius: 50%; background: #ff4d4f; display: inline-block; animation: vbp 1.1s infinite; }
    @keyframes vbp { 50% { opacity: .25; } }
    .vb-spacer { flex: 1; }
    .vb-ico {
      pointer-events: auto; width: 22px; height: 22px; border-radius: 6px;
      border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.05);
      color: #cfe8ff; cursor: pointer; font-size: 13px; line-height: 1;
      display: grid; place-items: center;
    }
    .vb-ico:hover { background: rgba(255,255,255,.12); }
    .vb-ico.on { background: rgba(77,208,225,.2); border-color: rgba(77,208,225,.55); color: #d9fbff; }
    .vb-theme-wrap { position: relative; display: inline-flex; }
    .vb-theme-menu {
      position: absolute; top: 26px; right: 0; z-index: 30;
      display: flex; flex-direction: column; gap: 2px; padding: 4px;
      background: #151b22; border: 1px solid rgba(255,255,255,.18);
      border-radius: 8px; box-shadow: 0 10px 24px rgba(0,0,0,.55); min-width: 176px;
    }
    .vb-theme-opt {
      text-align: left; border: 0; background: transparent; color: #cfe8ff;
      font-size: 10.5px; padding: 4px 6px; border-radius: 5px; cursor: pointer;
    }
    .vb-theme-opt:hover, .vb-theme-opt.on { background: rgba(255,255,255,.12); }
    .vb-team-pick-wrap {
      display: flex; flex-direction: column; gap: 3px; margin-top: 3px;
      padding: 5px 2px 1px; border-top: 1px solid rgba(255,255,255,.12);
    }
    .vb-pick-label { font-size: 9px; font-weight: 700; color: #8fb3c9; letter-spacing: .03em; }
    .vb-team-pick {
      width: 100%; min-width: 0; box-sizing: border-box;
      background: #0f1419; color: #e9eef3; border: 1px solid rgba(255,255,255,.2);
      border-radius: 5px; padding: 3px 4px; font-size: 10.5px; font-family: inherit;
      cursor: pointer;
    }
    .vb-team-pick:focus { outline: 1px solid rgba(77,208,225,.65); outline-offset: 0; }
    .vb-team-list {
      display: flex; flex-direction: column; gap: 2px; max-height: 200px; overflow-y: auto;
      padding: 2px; scrollbar-width: thin;
    }
    .vb-team-opt {
      width: 100%; text-align: left; border: 0; background: transparent; color: #cfe8ff;
      font-size: 10.5px; padding: 3px 6px; border-radius: 5px; cursor: pointer;
    }
    .vb-team-opt:hover, .vb-team-opt.on { background: rgba(255,255,255,.12); color: #d9fbff; }
    .vb-tabs { display: flex; gap: 4px; padding: 6px 8px 0; }
    .vb-tab {
      flex: 1; padding: 4px 0; border-radius: 7px; border: 1px solid transparent;
      background: transparent; color: #93a1b0; font-size: 11px; font-weight: 700; cursor: pointer;
    }
    .vb-tab.on { background: rgba(77,208,225,.14); color: #a9f0f8; border-color: rgba(77,208,225,.35); }
    .vb-chips { display: flex; gap: 4px; padding: 6px 8px; flex-wrap: wrap; }
    .vb-chip {
      padding: 2px 7px; border-radius: 999px; cursor: pointer;
      border: 1px solid rgba(255,255,255,.12); background: transparent;
      color: #93a1b0; font-size: 10px; font-weight: 700;
    }
    .vb-chip.on { background: rgba(255,255,255,.12); color: #fff; border-color: rgba(255,255,255,.3); }
    .vb-list {
      overflow-y: auto; padding: 0 6px 4px; flex: 1; min-height: 0;
      scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.22) transparent;
    }
    .vb-list::-webkit-scrollbar { width: 8px; height: 8px; }
    .vb-list::-webkit-scrollbar-track { background: transparent; }
    .vb-list::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,.22); border-radius: 999px;
      border: 2px solid transparent; background-clip: content-box;
    }
    .vb-list::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,.38); background-clip: content-box; }
    .vb-match {
      padding: 6px 7px; border-radius: 9px; margin-bottom: 4px;
      background: rgba(255,255,255,.035); border: 1px solid rgba(255,255,255,.06);
    }
    .vb-match.is-live { border-color: rgba(255,77,79,.35); background: rgba(255,77,79,.06); }
    .vb-meta { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px; min-width: 0; }
    .vb-comp { flex: 1; min-width: 0; color: #8fb3c9; font-size: 9px; text-transform: uppercase; letter-spacing: .03em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .vb-status { flex: none; display: inline-flex; align-items: center; gap: 4px; min-height: 8px; font-size: 9.5px; font-weight: 800; color: #8a97a5; white-space: nowrap; margin-left: 3px; }
    .vb-status.live { color: #ff6b6d; }
    .vb-status.done { color: #6f7c89; }
    .vb-status.soon { color: #c9d6e2; }
    .vb-fav {
      pointer-events: auto; margin-left: 6px; background: transparent; border: 1px solid rgba(255,255,255,.18);
      color: #93a1b0; border-radius: 5px; width: 20px; height: 20px; cursor: pointer; font-size: 11px;
      display: grid; place-items: center; line-height: 1;
    }
    .vb-fav.on, .vb-fav[data-state="on"] { color: #ffd166; border-color: rgba(255,209,102,.6); }
    .vb-fav:hover { background: rgba(255,255,255,.08); }
    .vb-board {
      display: grid; width: 100%; min-width: 0;
      grid-template-columns: minmax(0, 1fr) 22px 38px;
      grid-auto-rows: minmax(18px, auto);
      align-items: center; column-gap: 6px; row-gap: 2px;
    }
    .vb-board.no-cur { grid-template-columns: minmax(0, 1fr) 22px; }
    .vb-board.plain { grid-template-columns: minmax(0, 1fr); }
    .vb-board-h {
      font-size: 7px; font-weight: 800; letter-spacing: .1em;
      color: #6f8a96; text-align: center; line-height: 1;
    }
    .vb-board-h.h-cur { color: #7fd8cc; }
    .vb-team { display: flex; align-items: center; gap: 5px; min-width: 0; white-space: nowrap; overflow: hidden; font-size: 12px; color: #dfe7ee; }
    .vb-team.lead { font-weight: 800; color: #fff; }
    .vb-tdot {
      flex: none; width: 14px; height: 14px; border-radius: 50%;
      display: inline-grid; place-items: center; overflow: hidden;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,.18);
    }
    .vb-logo { width: 14px; height: 14px; object-fit: contain; display: block; }
    .vb-tname { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .vb-team.scored .vb-tname { color: #ff8a8a; font-weight: 800; }
    .vb-set-n { min-width: 0; text-align: center; font-size: 13px; font-weight: 900; line-height: 1.1; color: #eef4f8; }
    .vb-set-n.win { color: #fff; }
    .vb-cur-n {
      min-width: 0; text-align: center; font-size: 11.5px; font-weight: 900; line-height: 1.45;
      color: #d9fbff; background: rgba(77,208,225,.12);
      border: 1px solid rgba(77,208,225,.34); border-radius: 5px; padding: 0 3px;
    }
    .vb-point {
      flex: none; margin-left: 2px; padding: 0 4px; border-radius: 4px;
      background: #e53935; color: #fff; font-size: 8px; font-weight: 900;
      letter-spacing: .02em; line-height: 1.55; white-space: nowrap;
      animation: vbScore .5s ease-out;
    }
    @keyframes vbScore {
      from { transform: scale(.55); opacity: .15; }
      to { transform: scale(1); opacity: 1; }
    }
    .vb-sets { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 3px; min-width: 0; }
    .vb-set { font-size: 9.5px; padding: 0 4px; border-radius: 4px; background: rgba(255,255,255,.07); color: #b9c6d2; }
    .vb-set.won { color: #d7ffd7; background: rgba(76,175,80,.18); }
    .vb-set.now { outline: 1px solid rgba(77,208,225,.55); color: #d9fbff; }
    .vb-empty { padding: 16px 10px; text-align: center; color: #8a97a5; font-size: 11.5px; }
    .vb-next { display: inline-block; margin-top: 6px; color: #c9d6e2; }
    .vb-foot {
      display: flex; align-items: center; justify-content: space-between;
      padding: 5px 28px 5px 9px; border-top: 1px solid rgba(255,255,255,.08);
      font-size: 9.5px; color: #6f7c89;
    }
    .vb-link { background: none; border: 0; color: #8fb3c9; cursor: pointer; font-size: 9.5px; padding: 0; }
    .vb-link:hover { text-decoration: underline; }
    .vb-acc { color: #a9f0f8; font-weight: 800; }
    .vb-resize {
      position: absolute; right: 0; bottom: 0; z-index: 12;
      width: 26px; height: 26px; cursor: nwse-resize; touch-action: none;
      opacity: .8; color: #8fb3c9; background: transparent;
    }
    .vb-resize::before, .vb-resize::after {
      content: ""; position: absolute; right: 3px; bottom: 3px;
      border-right: 2px solid currentColor; border-bottom: 2px solid currentColor;
    }
    .vb-resize::before { width: 14px; height: 14px; border-radius: 0 0 4px 0; }
    .vb-resize::after { width: 7px; height: 7px; right: 7px; bottom: 7px; opacity: .65; border-radius: 0 0 3px 0; }
    .vb-resize:hover { opacity: 1; color: #a9f0f8; }
    .vb-pill {
      pointer-events: auto; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      max-width: calc(100vw - 16px);
      padding: 6px 10px; border-radius: 14px; cursor: pointer;
      background: rgba(14,17,20,.96); color: #e9eef3;
      border: 1px solid var(--vb-home, rgba(255,255,255,.16));
      box-shadow: 0 8px 24px rgba(0,0,0,.5);
      font-size: 12px;
    }
    .vb-pill-brand-col { display: flex; flex-direction: column; align-items: center; gap: 3px; flex: none; }
    .vb-pill:focus-visible, .vb-pill-rows:focus-visible, .vb-pill-brand:focus-visible { outline: 2px solid #4dd0e1; outline-offset: 2px; border-radius: 6px; }
    .vb-pill b { font-size: 11px; color: #a9f0f8; }
    .vb-pill-live { display: inline-flex; align-items: center; gap: 2px; flex: none; font-size: 11px; font-weight: 800; color: #ffd4d4; }
    .vb-pill-live i {
      width: 5px; height: 5px; border-radius: 50%; background: #ff4d4f;
      animation: vbp 1.1s infinite;
    }
    .vb-pill-stack { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
    .vb-pill-rows { display: flex; flex-direction: column; gap: 2px; min-width: 0; border-radius: 6px; }
    .vb-pill-row {
      position: relative; display: flex; align-items: center; gap: 3px;
      min-width: 0; padding: 1px 2px 1px 4px; border-radius: 6px;
      white-space: nowrap; overflow: hidden;
    }
    .vb-pill-row::before {
      content: ""; position: absolute; inset: 0; background: var(--vb-row, #4dd0e1);
      opacity: .16; border-radius: 6px;
    }
    .vb-pill-row > * { position: relative; }
    .vb-pill-team { display: flex; align-items: center; gap: 4px; flex: 1 1 auto; min-width: 0; }
    .vb-pill-team b {
      flex: 1; min-width: 0; font-size: 11px; font-weight: 900; letter-spacing: .05em; color: #eef7ff;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .vb-pill-dot {
      flex: none; width: 11px; height: 11px; border-radius: 50%;
      display: inline-grid; place-items: center; overflow: hidden;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,.22);
    }
    .vb-pill-logo { width: 14px; height: 14px; object-fit: contain; display: block; }
    .vb-pill-ball { font-size: 14px; }
    .vb-pill-set {
      flex: none; min-width: 0; text-align: center; font-size: 12px;
      font-weight: 900; line-height: 1.5; color: #e9eef3;
      background: rgba(0,0,0,.32); border: 1px solid var(--vb-row, rgba(255,255,255,.15));
      border-radius: 999px; padding: 0 5px;
    }
    .vb-pill-point {
      flex: none; min-width: 0; text-align: center; font-size: 13px;
      font-weight: 900; line-height: 1.35; color: #0b1f33;
      border: 1px solid var(--vb-row, #4dd0e1); border-radius: 999px;
      background: #f4f8fb; padding: 0 5px;
    }
    .vb-pill-nav {
      display: flex; align-items: center; justify-content: center; gap: 6px;
      width: 100%; margin-top: 2px; padding-top: 2px;
      border-top: 1px solid rgba(255,255,255,.09); font-size: 10px;
    }
    .vb-pill-nav-btn {
      flex: none; width: 18px; height: 18px; border-radius: 50%; border: 1px solid rgba(255,255,255,.25);
      background: rgba(255,255,255,.08); color: #cfe8ff; cursor: pointer; font-size: 11px;
      display: grid; place-items: center; line-height: 1; padding: 0;
    }
    .vb-pill-nav-btn:hover { background: rgba(255,255,255,.18); color: #fff; }
    .vb-pill-nav-index {
      flex: none; font-size: 10px; font-weight: 800; color: #a9f0f8; min-width: 30px; text-align: center;
    }
    .vb-pill-detail { display: flex; flex-direction: column; gap: 2px; align-items: center; text-align: center; padding: 4px 6px; border-radius: 8px; font-size: 11px; min-width: 0; }
    .vb-pill-detail .vb-pill-comp { font-size: 8.5px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #8fb3c9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px; }
    .vb-pill-detail .vb-pill-when { font-size: 9.5px; font-weight: 700; color: #c9d6e2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }
    .vb-pill-detail .vb-pill-teams { font-size: 11px; font-weight: 800; color: #e9eef3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }
    .vb-pill-detail.vb-pill-soon { background: rgba(77,208,225,.12); border: 1px solid rgba(77,208,225,.35); }
    .vb-pill-detail.vb-pill-done { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1); }

    /* --- Sabit temalar --- */
    .vb-panel.vb-theme-team { border-color: var(--vb-home, rgba(255,255,255,.14)); }
    .vb-panel.vb-theme-dark {
      background: rgba(8, 14, 18, .97);
      border-color: rgba(77,208,225,.3);
    }
    .vb-theme-dark .vb-title { color: #a9f0f8; }
    .vb-theme-dark .vb-tab.on { background: rgba(77,208,225,.16); color: #d9fbff; border-color: rgba(77,208,225,.45); }

    .vb-panel.vb-theme-light {
      background: rgba(248, 250, 252, .98);
      color: #14212b;
      border-color: #cfd9e2;
      box-shadow: 0 18px 50px rgba(20,40,60,.28);
    }
    .vb-theme-light .vb-head { background: linear-gradient(180deg, #fff, #eef4f8); border-bottom-color: #dbe5ec; }
    .vb-theme-light .vb-title { color: #12384a; }
    .vb-theme-light .vb-ico { border-color: #cfd9e2; background: #fff; color: #24556b; }
    .vb-theme-light .vb-ico:hover { background: #e8f1f6; }
    .vb-theme-light .vb-tab { color: #5e7180; }
    .vb-theme-light .vb-tab.on { background: #dff1f7; color: #0d5d73; border-color: #9bd3e2; }
    .vb-theme-light .vb-chip { border-color: #cfd9e2; color: #5e7180; }
    .vb-theme-light .vb-chip.on { background: #12384a; color: #fff; border-color: #12384a; }
    .vb-theme-light .vb-match { background: #fff; border-color: #e1e8ef; }
    .vb-theme-light .vb-match.is-live { background: #fff5f5; border-color: #f0b8b8; }
    .vb-theme-light .vb-team { color: #22313d; }
    .vb-theme-light .vb-team.lead { color: #000; }
    .vb-theme-light .vb-team.scored .vb-tname { color: #c62828; }
    .vb-theme-light .vb-set-n { color: #0d2b3a; }
    .vb-theme-light .vb-cur-n { color: #0d5d73; background: #e6f6fa; border-color: #9bd3e2; }
    .vb-theme-light .vb-live { color: #b3261e; background: #ffe8e8; border-color: #f0b8b8; }
    .vb-theme-light .vb-live i { background: #d32f2f; }
    .vb-theme-light .vb-board-h { color: #5e7180; }
    .vb-theme-light .vb-board-h.h-cur { color: #0d6a80; }
    .vb-theme-light .vb-set { background: #eef3f7; color: #3c5160; }
    .vb-theme-light .vb-set.won { background: #e3f6e5; color: #1d6b24; }
    .vb-theme-light .vb-set.now { outline-color: #3aa5c0; color: #0d6a80; }
    .vb-theme-light .vb-foot { border-top-color: #dbe5ec; color: #657a88; }
    .vb-theme-light .vb-link { color: #2b6f86; }
    .vb-theme-light .vb-empty { color: #657a88; }
    .vb-theme-light .vb-status.soon { color: #3c5160; }
    .vb-theme-light .vb-theme-menu { background: #fff; border-color: #cfd9e2; }
    .vb-theme-light .vb-theme-opt { color: #22313d; }
    .vb-theme-light .vb-theme-opt:hover, .vb-theme-light .vb-theme-opt.on { background: #e8f1f6; }
    .vb-theme-light .vb-team-pick-wrap { border-top-color: #dbe5ec; }
    .vb-theme-light .vb-pick-label { color: #5e7180; }
    .vb-theme-light .vb-team-pick { background: #f5f9fb; color: #14212b; border-color: #cfd9e2; }
    .vb-theme-light .vb-team-opt { color: #22313d; }
    .vb-theme-light .vb-team-opt:hover, .vb-theme-light .vb-team-opt.on { background: #e8f1f6; color: #0d5d73; }
    .vb-theme-light .vb-list { scrollbar-color: #a9bcc9 #eef4f8; }
    .vb-theme-light .vb-list::-webkit-scrollbar-track { background: #eef4f8; }
    .vb-theme-light .vb-list::-webkit-scrollbar-thumb { background: #a9bcc9; border: 2px solid transparent; background-clip: content-box; }
    .vb-theme-light .vb-resize { color: #5e7180; }
    .vb-theme-light .vb-acc { color: #0d6a80; }
    .vb-pill.vb-theme-light { background: rgba(248,250,252,.98); color: #14212b; }
    .vb-pill.vb-theme-light b { color: #0d6a80; }
    .vb-pill.vb-theme-light .vb-pill-team b { color: #14212b; }
    .vb-pill.vb-theme-light .vb-pill-live { color: #b3261e; }
    .vb-pill.vb-theme-light .vb-pill-live i { background: #d32f2f; }
    .vb-pill.vb-theme-light .vb-pill-nav { border-top-color: #dbe5ec; }
    .vb-pill.vb-theme-light .vb-pill-nav-btn { border-color: #c6d7e2; background: #eef4f8; color: #24556b; }
    .vb-pill.vb-theme-light .vb-pill-nav-index { color: #0d6a80; }
    .vb-pill.vb-theme-light .vb-pill-row::before { opacity: .22; }
    .vb-pill.vb-theme-light .vb-pill-set { background: rgba(18,56,74,.1); color: #12384a; }
    .vb-pill.vb-theme-light .vb-pill-point { background: #fff; color: #0d2b3a; }
    .vb-pill.vb-theme-light .vb-pill-brand { color: #12384a; }
    .vb-pill.vb-theme-light .vb-pill-ball { color: #0d5d73; }

    .vb-panel.vb-theme-neon {
      background: rgba(20, 10, 34, .97);
      border-color: #6b2a8f;
      box-shadow: 0 18px 50px rgba(120,0,180,.4);
    }
    .vb-theme-neon .vb-head { background: linear-gradient(180deg, rgba(255,47,179,.16), rgba(20,10,34,0)); }
    .vb-theme-neon .vb-title { color: #ff9be4; }
    .vb-theme-neon .vb-ico.on { background: rgba(255,47,179,.25); border-color: #ff2fb3; color: #ffd4f4; }
    .vb-theme-neon .vb-tab.on { background: rgba(255,47,179,.2); color: #ffc1ee; border-color: #ff2fb3; }
    .vb-theme-neon .vb-chip.on { background: #ff2fb3; color: #fff; border-color: #ff2fb3; }
    .vb-theme-neon .vb-match { background: rgba(255,255,255,.045); border-color: #3a2058; }
    .vb-theme-neon .vb-match.is-live { border-color: #ff2fb3; background: rgba(255,47,179,.1); }
    .vb-theme-neon .vb-cur-n { color: #d9fff9; background: rgba(77,255,223,.12); border-color: #4dffdf; }
    .vb-theme-neon .vb-board-h { color: #b7a4cf; }
    .vb-theme-neon .vb-board-h.h-cur { color: #4dffdf; }
    .vb-theme-neon .vb-set-n { color: #f3e9ff; }
    .vb-theme-neon .vb-set.now { outline-color: #4dffdf; color: #d9fff9; }
    .vb-theme-neon .vb-live { color: #ffd4f4; background: rgba(255,47,179,.18); border-color: #ff2fb3; }
    .vb-theme-neon .vb-live i { background: #ff2fb3; }
    .vb-theme-neon .vb-point { background: #ff2fb3; }
    .vb-theme-neon .vb-team-pick { background: #1a0d2b; border-color: #6b2a8f; color: #f3e9ff; }
    .vb-theme-neon .vb-team-opt { color: #f3e9ff; }
    .vb-theme-neon .vb-team-opt:hover, .vb-theme-neon .vb-team-opt.on { background: rgba(255,47,179,.2); color: #ffd4f4; }
    .vb-theme-neon .vb-team-pick-wrap { border-top-color: #3a2058; }
    .vb-theme-neon .vb-pick-label { color: #b7a4cf; }
    .vb-theme-neon .vb-list { scrollbar-color: #ff2fb3 #1a0d2b; }
    .vb-theme-neon .vb-list::-webkit-scrollbar-track { background: #1a0d2b; }
    .vb-theme-neon .vb-list::-webkit-scrollbar-thumb { background: #ff2fb3; border: 2px solid transparent; background-clip: content-box; }
    .vb-theme-neon .vb-resize { color: #ff9be4; }
    .vb-theme-neon .vb-acc { color: #4dffdf; }
    .vb-pill.vb-theme-neon { background: rgba(20,10,34,.97); border-color: #ff2fb3; }
    .vb-pill.vb-theme-neon b { color: #4dffdf; }
    .vb-pill.vb-theme-neon .vb-pill-team b { color: #f3e9ff; }
    .vb-pill.vb-theme-neon .vb-pill-set { background: rgba(255,47,179,.16); color: #ffd4f4; }
    .vb-pill.vb-theme-neon .vb-pill-point { color: #f3e9ff; background: rgba(20,10,34,.7); }
    .vb-pill.vb-theme-neon .vb-pill-brand { color: #f3e9ff; }
    .vb-pill.vb-theme-neon .vb-pill-ball { color: #ffd4f4; }

    .vb-pill[hidden], .vb-panel[hidden] { display: none !important; }
  `;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();


// ===== ayarlar paneli =====
// ---------------------------------------------------------------------------
// Ayarlar paneli (userscript sürümünde options.html'in yerini alır)
// Panel başlığındaki ⚙ düğmesi ve Tampermonkey menüsü buradan açar.
// ---------------------------------------------------------------------------
function __vbBuildSettings() {
  const HOST_ID = "vb-settings-host";

  const CSS = `
    :host { all: initial; }
    .vb-back { position: fixed; inset: 0; z-index: 2147483647; background: rgba(6,8,10,.62);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Segoe UI', system-ui, sans-serif; }
    .vb-card { width: min(520px, 94vw); max-height: min(86vh, 760px); display: flex; flex-direction: column;
      background: #14181c; color: #e9eef3; border: 1px solid rgba(255,255,255,.14);
      border-radius: 14px; box-shadow: 0 24px 70px rgba(0,0,0,.6); overflow: hidden; }
    .vb-h { display: flex; align-items: center; gap: 8px; padding: 14px 16px;
      border-bottom: 1px solid rgba(255,255,255,.10); font-weight: 600; font-size: 15px; }
    .vb-h .vb-x { margin-left: auto; background: none; border: 0; color: #9fb0bf; font-size: 20px; cursor: pointer; line-height: 1; }
    .vb-h .vb-x:hover { color: #fff; }
    .vb-body { padding: 14px 16px; overflow: auto; }
    .vb-row { display: flex; align-items: center; gap: 10px; padding: 7px 0; font-size: 13px; }
    .vb-row label { flex: 1; }
    .vb-row input[type=checkbox] { width: 16px; height: 16px; accent-color: #d32f2f; }
    select, input[type=number] { background: #1e252b; color: #e9eef3; border: 1px solid rgba(255,255,255,.16);
      border-radius: 8px; padding: 6px 8px; font: inherit; font-size: 13px; }
    .vb-sec { margin: 16px 0 4px; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: #8b9aa8; }
    .vb-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 14px; }
    .vb-foot { display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,.10); }
    .vb-btn { background: #1e252b; color: #dfe8ef; border: 1px solid rgba(255,255,255,.16);
      border-radius: 9px; padding: 8px 14px; font: inherit; font-size: 13px; cursor: pointer; }
    .vb-btn:hover { background: #263038; }
    .vb-btn.primary { background: #d32f2f; border-color: #d32f2f; color: #fff; font-weight: 600; }
    .vb-btn.primary:hover { background: #e03b3b; }
    .vb-note { color: #8b9aa8; font-size: 11px; margin-top: 10px; line-height: 1.5; }
    .vb-toast { position: absolute; left: 50%; bottom: 18px; transform: translateX(-50%);
      background: #1f6f43; color: #fff; padding: 7px 14px; border-radius: 8px; font-size: 12px; opacity: 0;
      transition: opacity .18s; pointer-events: none; }
    .vb-toast.on { opacity: 1; }
  `;

  let host = null;
  let shadow = null;

  function cfgOf(stored) {
    const base = JSON.parse(JSON.stringify(VB.DEFAULT_CONFIG));
    const c = stored || {};
    return Object.assign(base, c, { comps: Object.assign(base.comps, c.comps || {}) });
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  function close() {
    if (host && host.parentNode) host.parentNode.removeChild(host);
    host = null;
    shadow = null;
    document.removeEventListener("keydown", onKey, true);
  }

  function onKey(e) {
    if (e.key === "Escape") close();
  }

  async function open() {
    if (host) return;
    host = document.createElement("div");
    host.id = HOST_ID;
    document.documentElement.appendChild(host);
    shadow = host.attachShadow({ mode: "open" });
    document.addEventListener("keydown", onKey, true);

    // Sayfa CSP'si inline <style>'ı engelliyorsa (GitHub, X vb.) gölge stili
    // constructable stylesheet ile uygula.
    try {
      if ("adoptedStyleSheets" in shadow && typeof CSSStyleSheet === "function") {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(CSS);
        shadow.adoptedStyleSheets = [sheet];
      }
    } catch (e) {
      /* eski tarayıcı: inline <style> yeter */
    }

    const stored = await chrome.storage.local.get("vbConfig");
    const cfg = cfgOf(stored.vbConfig);

    const labels = Object.assign({ national: "Millî maçlar / National teams" }, VB.COMP_LABELS);
    const compKeys = Object.keys(VB.DEFAULT_CONFIG.comps).filter((k) => k in labels);
    const compRows = compKeys
      .map(
        (k) =>
          `<label class="vb-row" style="padding:4px 0"><input type="checkbox" data-comp="${esc(k)}" ${
            cfg.comps[k] ? "checked" : ""
          }><span>${esc(labels[k])}</span></label>`
      )
      .join("");

    const langOpts = VB.LANGS.map(
      (l) => `<option value="${esc(l.id)}" ${cfg.lang === l.id ? "selected" : ""}>${esc(l.label)}</option>`
    ).join("");

    const secOpts = [15, 30, 60, 120]
      .map((s) => `<option value="${s}" ${Number(cfg.refreshSec) === s ? "selected" : ""}>${s} sn</option>`)
      .join("");

    shadow.innerHTML = `
      <style>${CSS}</style>
      <div class="vb-back">
        <div class="vb-card" role="dialog" aria-label="VBunny">
          <div class="vb-h"><span>🐰</span><span>VBunny</span><button class="vb-x" data-x="1" aria-label="Kapat">×</button></div>
          <div class="vb-body">
            <div class="vb-sec">Dil / Language</div>
            <div class="vb-row"><label>Dil / Language</label><select data-f="lang">${langOpts}</select></div>

            <div class="vb-sec">Ligler / Competitions</div>
            <div class="vb-grid">${compRows}</div>

            <div class="vb-sec">Davranış / Behavior</div>
            <div class="vb-row"><label>Tüm sitelerde göster / Show on all sites</label><input type="checkbox" data-f="allSites" ${cfg.allSites !== false ? "checked" : ""}></div>
            <div class="vb-row"><label>YouTube'da göster / On YouTube</label><input type="checkbox" data-f="showOnYouTube" ${cfg.showOnYouTube !== false ? "checked" : ""}></div>
            <div class="vb-row"><label>Twitch'te göster / On Twitch</label><input type="checkbox" data-f="showOnTwitch" ${cfg.showOnTwitch !== false ? "checked" : ""}></div>
            <div class="vb-row"><label>Canlı maçta hızlı yenileme (2 sn)</label><input type="checkbox" data-f="fastLive" ${cfg.fastLive !== false ? "checked" : ""}></div>
            <div class="vb-row"><label>Canlı yenileme aralığı</label><select data-f="refreshSec">${secOpts}</select></div>
            <div class="vb-row"><label>Küçültülmüş başlat</label><input type="checkbox" data-f="startCollapsed" ${cfg.startCollapsed ? "checked" : ""}></div>

            <div class="vb-note">Ayarlar bu tarayıcıda saklanır, hesap gerekmez. Kaydettiğinde panel anında güncellenir.</div>
          </div>
          <div class="vb-foot">
            <button class="vb-btn primary" data-save="1">Kaydet / Save</button>
            <button class="vb-btn" data-sync="1">⟳ Şimdi yenile</button>
            <button class="vb-btn" data-reset="1">Sıfırla</button>
            <button class="vb-btn" data-x="1" style="margin-left:auto">Kapat</button>
          </div>
          <div class="vb-toast">Kaydedildi ✓</div>
        </div>
      </div>`;

    const q = (sel) => shadow.querySelector(sel);

    function collect() {
      const next = cfgOf(cfg);
      next.lang = q('[data-f="lang"]').value;
      next.refreshSec = Number(q('[data-f="refreshSec"]').value) || 30;
      for (const k of ["allSites", "showOnYouTube", "showOnTwitch", "fastLive", "startCollapsed"]) {
        next[k] = q(`[data-f="${k}"]`).checked;
      }
      shadow.querySelectorAll("[data-comp]").forEach((el) => {
        next.comps[el.dataset.comp] = el.checked;
      });
      return next;
    }

    function toast(text) {
      const t = q(".vb-toast");
      if (!t) return;
      t.textContent = text;
      t.classList.add("on");
      setTimeout(() => t.classList.remove("on"), 1400);
    }

    shadow.querySelectorAll("[data-x]").forEach((b) => b.addEventListener("click", close));
    q(".vb-back").addEventListener("click", (e) => {
      if (e.target.classList.contains("vb-back")) close();
    });

    q("[data-save]").addEventListener("click", async () => {
      await chrome.storage.local.set({ vbConfig: collect() });
      toast("Kaydedildi ✓");
    });

    q("[data-sync]").addEventListener("click", async () => {
      await chrome.runtime.sendMessage({ type: "vbRefresh", force: true });
      toast("Yenilendi ✓");
    });

    q("[data-reset]").addEventListener("click", async () => {
      await chrome.storage.local.set({ vbConfig: JSON.parse(JSON.stringify(VB.DEFAULT_CONFIG)) });
      close();
      open();
    });
  }

  return { open, close };
}

try {
  const s = __vbBuildSettings();
  window.__vbOpenSettings = () => s.open();
  if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand('VBunny ayarları', () => s.open());
} catch (e) { console.warn('[VBunny] ayarlar yuklenemedi', e); }
})();
