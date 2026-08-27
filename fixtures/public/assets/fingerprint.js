(function () {
  "use strict";

  const STORAGE_KEY = "harborline-fp-snapshots";

  function canonical(value) {
    if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
    if (value && typeof value === "object") {
      return (
        "{" +
        Object.keys(value)
          .sort()
          .map(function (key) {
            return JSON.stringify(key) + ":" + canonical(value[key]);
          })
          .join(",") +
        "}"
      );
    }
    return JSON.stringify(value);
  }

  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf), function (b) {
      return b.toString(16).padStart(2, "0");
    }).join("");
  }

  function canvasHash() {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 240;
      canvas.height = 60;
      const ctx = canvas.getContext("2d");
      if (!ctx) return "no-2d";
      ctx.fillStyle = "#0b2a4a";
      ctx.fillRect(0, 0, 240, 60);
      ctx.fillStyle = "#c4a35a";
      ctx.font = "16px serif";
      ctx.fillText("Harborline fixture 🌐", 8, 28);
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = "rgba(157, 23, 77, 0.4)";
      ctx.beginPath();
      ctx.arc(180, 30, 22, 0, Math.PI * 2);
      ctx.fill();
      return canvas.toDataURL();
    } catch (err) {
      return "error:" + (err && err.message ? err.message : "canvas");
    }
  }

  function webglInfo() {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) return { supported: false };
      const dbg = gl.getExtension("WEBGL_debug_renderer_info");
      return {
        supported: true,
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
        unmaskedVendor: dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : null,
        unmaskedRenderer: dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : null,
      };
    } catch (err) {
      return { supported: false, error: err && err.message ? err.message : "webgl" };
    }
  }

  async function audioHash() {
    try {
      const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!Ctx) return "no-audio-context";
      const ctx = new Ctx(1, 44100, 44100);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const compressor = ctx.createDynamicsCompressor();
      osc.type = "triangle";
      osc.frequency.value = 10000;
      gain.gain.value = 0.4;
      osc.connect(gain);
      gain.connect(compressor);
      compressor.connect(ctx.destination);
      osc.start(0);
      const buffer = await ctx.startRendering();
      let sum = 0;
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 100) sum += Math.abs(data[i]);
      return String(Math.round(sum * 1e6));
    } catch (err) {
      return "error:" + (err && err.message ? err.message : "audio");
    }
  }

  function detectFonts() {
    const probe = [
      "Arial",
      "Calibri",
      "Cambria",
      "Comic Sans MS",
      "Courier New",
      "Georgia",
      "Helvetica",
      "Impact",
      "Lucida Console",
      "Palatino",
      "Tahoma",
      "Times New Roman",
      "Trebuchet MS",
      "Verdana",
      "Segoe UI",
      "Noto Sans",
      "Roboto",
    ];
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return [];
    const sample = "mmmmmmmmmmlli";
    ctx.font = "72px monospace";
    const baseline = ctx.measureText(sample).width;
    return probe.filter(function (name) {
      ctx.font = '72px "' + name + '", monospace';
      return ctx.measureText(sample).width !== baseline;
    });
  }

  async function rtcHosts() {
    if (!window.RTCPeerConnection) return { supported: false, hosts: [] };
    return new Promise(function (resolve) {
      const hosts = [];
      let pc;
      try {
        pc = new RTCPeerConnection({ iceServers: [] });
      } catch (err) {
        resolve({
          supported: false,
          error: err && err.message ? err.message : "rtc",
          hosts: [],
        });
        return;
      }
      const done = function () {
        try {
          pc.close();
        } catch {
          /* ignore */
        }
        resolve({ supported: true, hosts: Array.from(new Set(hosts)).sort() });
      };
      const timer = window.setTimeout(done, 700);
      pc.onicecandidate = function (event) {
        if (!event.candidate) {
          window.clearTimeout(timer);
          done();
          return;
        }
        const cand = event.candidate.candidate || "";
        const match = cand.match(/([0-9a-f:.]+)/i);
        if (cand.indexOf(" host ") !== -1 && match) hosts.push(match[1]);
      };
      pc.createDataChannel("fp");
      pc.createOffer()
        .then(function (offer) {
          return pc.setLocalDescription(offer);
        })
        .catch(function (err) {
          window.clearTimeout(timer);
          resolve({
            supported: true,
            error: err && err.message ? err.message : "offer",
            hosts: [],
          });
        });
    });
  }

  async function collect() {
    const nav = navigator;
    const scr = window.screen;
    const components = {
      userAgent: nav.userAgent,
      appVersion: nav.appVersion,
      platform: nav.platform,
      vendor: nav.vendor,
      language: nav.language,
      languages: Array.from(nav.languages || []),
      hardwareConcurrency: nav.hardwareConcurrency || null,
      deviceMemory: nav.deviceMemory || null,
      maxTouchPoints: nav.maxTouchPoints || 0,
      cookieEnabled: nav.cookieEnabled,
      doNotTrack: nav.doNotTrack,
      webdriver: Boolean(nav.webdriver),
      pdfViewerEnabled: nav.pdfViewerEnabled ?? null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      locale: Intl.DateTimeFormat().resolvedOptions().locale,
      screen: {
        width: scr.width,
        height: scr.height,
        availWidth: scr.availWidth,
        availHeight: scr.availHeight,
        colorDepth: scr.colorDepth,
        pixelDepth: scr.pixelDepth,
        orientation: (scr.orientation && scr.orientation.type) || null,
      },
      devicePixelRatio: window.devicePixelRatio,
      inner: { width: window.innerWidth, height: window.innerHeight },
      outer: { width: window.outerWidth, height: window.outerHeight },
      canvas: canvasHash(),
      webgl: webglInfo(),
      audio: await audioHash(),
      fonts: detectFonts(),
      rtc: await rtcHosts(),
      storage: {
        localStorage: storageAvailable("localStorage"),
        sessionStorage: storageAvailable("sessionStorage"),
        indexedDB: Boolean(window.indexedDB),
      },
      pluginCount: nav.plugins ? nav.plugins.length : 0,
    };
    const hash = await sha256(canonical(components));
    return {
      collectedAt: new Date().toISOString(),
      hash: hash,
      components: components,
    };
  }

  function storageAvailable(type) {
    try {
      const store = window[type];
      const key = "__fp__";
      store.setItem(key, "1");
      store.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  function flatten(obj, prefix, out) {
    Object.keys(obj || {}).forEach(function (key) {
      const path = prefix ? prefix + "." + key : key;
      const value = obj[key];
      if (value && typeof value === "object" && !Array.isArray(value)) {
        flatten(value, path, out);
      } else {
        out[path] = Array.isArray(value) ? value.join(", ") : value;
      }
    });
    return out;
  }

  function loadHistory() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function saveHistory(rows) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows.slice(0, 12)));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderRows(components) {
    const body = document.querySelector("[data-fp-rows]");
    if (!body) return;
    const flat = flatten(components, "", {});
    body.innerHTML = Object.keys(flat)
      .map(function (key) {
        const raw = flat[key];
        const shown =
          typeof raw === "string" && raw.length > 180 ? raw.slice(0, 180) + "…" : raw;
        return (
          "<tr><th>" +
          escapeHtml(key) +
          "</th><td>" +
          escapeHtml(shown == null ? "" : shown) +
          "</td></tr>"
        );
      })
      .join("");
  }

  function renderHistory(current) {
    const root = document.querySelector("[data-fp-history]");
    if (!root) return;
    const rows = loadHistory();
    if (!rows.length) {
      root.innerHTML = "<p class=\"fine\">No snapshots stored in this profile yet.</p>";
      return;
    }
    root.innerHTML = rows
      .map(function (row, index) {
        const same = current && row.hash === current.hash ? " (matches current)" : "";
        return (
          '<p class="fp-history-row"><code>' +
          escapeHtml(row.hash.slice(0, 16)) +
          "</code> " +
          escapeHtml(row.collectedAt) +
          same +
          ' <button type="button" class="btn" data-fp-use="' +
          index +
          '">Compare</button></p>'
        );
      })
      .join("");
  }

  function showCompare(current, other) {
    const root = document.querySelector("[data-fp-result]");
    if (!root) return;
    const match = current.hash === other.hash;
    const left = flatten(current.components, "", {});
    const right = flatten(other.components, "", {});
    const keys = Array.from(new Set(Object.keys(left).concat(Object.keys(right)))).sort();
    const diffs = keys.filter(function (key) {
      return JSON.stringify(left[key]) !== JSON.stringify(right[key]);
    });
    root.innerHTML =
      '<p class="' +
      (match ? "fp-match" : "fp-differ") +
      '">' +
      (match
        ? "MATCH — both browsers produced the same hash."
        : "DIFFER — " + diffs.length + " signal(s) changed.") +
      "</p><p class=\"fine\">This browser <code>" +
      escapeHtml(current.hash.slice(0, 24)) +
      "</code><br>Pasted snapshot <code>" +
      escapeHtml(other.hash.slice(0, 24)) +
      "</code></p>" +
      (diffs.length
        ? "<table class=\"fp-table\"><thead><tr><th>Signal</th><th>This browser</th><th>Pasted</th></tr></thead><tbody>" +
          diffs
            .map(function (key) {
              return (
                "<tr><th>" +
                escapeHtml(key) +
                "</th><td>" +
                escapeHtml(left[key] == null ? "" : left[key]) +
                "</td><td>" +
                escapeHtml(right[key] == null ? "" : right[key]) +
                "</td></tr>"
              );
            })
            .join("") +
          "</tbody></table>"
        : "");
  }

  let currentSnapshot = null;

  async function refresh() {
    const hashEl = document.querySelector("[data-fp-hash]");
    const status = document.querySelector("[data-fp-status]");
    if (hashEl) hashEl.textContent = "Collecting…";
    currentSnapshot = await collect();
    if (hashEl) hashEl.textContent = currentSnapshot.hash;
    if (status) {
      status.textContent =
        "Collected locally at " +
        currentSnapshot.collectedAt +
        ". Hash is SHA-256 of the component set below.";
    }
    renderRows(currentSnapshot.components);
    renderHistory(currentSnapshot);
  }

  function parseSnapshot(raw) {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.hash !== "string" || !parsed.components) {
      throw new Error("Snapshot needs hash and components.");
    }
    return parsed;
  }

  document.addEventListener("click", function (event) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.matches("[data-fp-copy]")) {
      if (!currentSnapshot) return;
      navigator.clipboard.writeText(JSON.stringify(currentSnapshot, null, 2)).then(
        function () {
          target.textContent = "Copied";
        },
        function () {
          const area = document.querySelector("[data-fp-paste]");
          if (area) area.value = JSON.stringify(currentSnapshot, null, 2);
          target.textContent = "Pasted into compare box";
        },
      );
    }
    if (target.matches("[data-fp-record]")) {
      if (!currentSnapshot) return;
      const rows = loadHistory();
      rows.unshift(currentSnapshot);
      try {
        saveHistory(rows);
        renderHistory(currentSnapshot);
        target.textContent = "Recorded";
      } catch {
        target.textContent = "Storage blocked";
      }
    }
    if (target.matches("[data-fp-refresh]")) {
      refresh();
    }
    if (target.matches("[data-fp-compare]")) {
      const area = document.querySelector("[data-fp-paste]");
      if (!area || !currentSnapshot) return;
      try {
        showCompare(currentSnapshot, parseSnapshot(area.value));
      } catch (err) {
        const root = document.querySelector("[data-fp-result]");
        if (root) {
          root.innerHTML =
            "<p class=\"fp-differ\">Could not parse that snapshot. " +
            escapeHtml(err && err.message ? err.message : "invalid JSON") +
            "</p>";
        }
      }
    }
    const use = target.getAttribute("data-fp-use");
    if (use != null && currentSnapshot) {
      const row = loadHistory()[Number(use)];
      if (row) {
        const area = document.querySelector("[data-fp-paste]");
        if (area) area.value = JSON.stringify(row, null, 2);
        showCompare(currentSnapshot, row);
      }
    }
  });

  if (document.querySelector("[data-fp-hash]")) {
    refresh();
  }
})();
