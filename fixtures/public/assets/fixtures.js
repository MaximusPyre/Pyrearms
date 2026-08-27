(function () {
  "use strict";

  function localPath(href) {
    try {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return null;
      return url.pathname + url.search + url.hash;
    } catch {
      return null;
    }
  }

  document.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();
      event.stopPropagation();
      window.location.assign("/discarded");
    },
    true,
  );

  HTMLFormElement.prototype.submit = function () {
    window.location.assign("/discarded");
  };

  document.addEventListener(
    "click",
    function (event) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (href.startsWith("#") || href.startsWith("/")) return;
      if (!localPath(href)) {
        event.preventDefault();
      }
    },
    true,
  );

  const seconds = Number(document.body.getAttribute("data-redirect-after") || "0");
  const dest = document.body.getAttribute("data-redirect-to") || "";
  const clock = document.querySelector("[data-countdown]");
  if (dest.startsWith("/") && seconds > 0) {
    let left = seconds;
    const tick = function () {
      if (clock) {
        const mm = String(Math.floor(left / 60)).padStart(2, "0");
        const ss = String(left % 60).padStart(2, "0");
        clock.textContent = mm + ":" + ss;
      }
      if (left <= 0) {
        window.location.assign(dest);
        return;
      }
      left -= 1;
      window.setTimeout(tick, 1000);
    };
    tick();
  }
})();
