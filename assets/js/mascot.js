/* Onyx — BlackCat English 的吉祥物
 * 原則：Onyx 是一隻真正的貓，不說話、不擬人。
 * 牠的反應用「影集字幕的聲音描述」方式呈現，例如 [Onyx 慢慢眨眼]。
 */
window.BCE = window.BCE || {};

(function (BCE) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function svg(opts = {}) {
    const cls = opts.cls || "";
    const label = opts.label || "黑貓吉祥物 Onyx";
    return `
<svg class="onyx ${cls}" viewBox="0 0 200 260" role="img" aria-label="${label}">
  <g class="onyx-tail"><path d="M138 240 C 184 238, 198 200, 178 174 C 170 164, 160 168, 165 180" /></g>
  <g class="onyx-body">
    <path class="onyx-ear onyx-ear-l" d="M58 66 L60 16 L96 46 Z" />
    <path class="onyx-ear onyx-ear-r" d="M142 66 L140 16 L104 46 Z" />
    <path d="M100 98 C 62 104, 42 168, 48 228 C 52 254, 148 254, 152 228 C 158 168, 138 104, 100 98 Z" />
    <ellipse cx="100" cy="76" rx="48" ry="42" />
  </g>
  <g class="onyx-whiskers">
    <path d="M80 96 L40 88 M80 100 L38 102 M82 104 L44 116" />
    <path d="M120 96 L160 88 M120 100 L162 102 M118 104 L156 116" />
  </g>
  <g class="onyx-eyes">
    <g class="onyx-eye"><path d="M66 76 Q80 62 94 76 Q80 88 66 76 Z" /></g>
    <g class="onyx-eye"><path d="M106 76 Q120 62 134 76 Q120 88 106 76 Z" /></g>
    <g class="onyx-pupils">
      <ellipse cx="80" cy="75.5" rx="2.6" ry="8" />
      <ellipse cx="120" cy="75.5" rx="2.6" ry="8" />
    </g>
  </g>
  <g class="onyx-z" aria-hidden="true"><text x="150" y="30">z</text><text x="166" y="14">z</text></g>
</svg>`;
  }

  /* 小頭像（logo / icon 用） */
  function mark(cls = "") {
    return `
<svg class="onyx-mark ${cls}" viewBox="0 0 64 64" aria-hidden="true">
  <path class="m-cat" d="M12 26 L13 6 L27 17 Q32 15.5 37 17 L51 6 L52 26 Q55 32 52 40 Q46 54 32 54 Q18 54 12 40 Q9 32 12 26 Z"/>
  <path class="m-eye" d="M19 32 Q24.5 27 30 32 Q24.5 36 19 32 Z"/>
  <path class="m-eye" d="M34 32 Q39.5 27 45 32 Q39.5 36 34 32 Z"/>
</svg>`;
  }

  /* ---------- 眼睛跟著游標 ---------- */
  const watched = new Set();
  let px = innerWidth / 2, py = innerHeight / 3, raf = 0;

  function track() {
    raf = 0;
    watched.forEach(el => {
      if (!el.isConnected) { watched.delete(el); return; }
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height * 0.29;
      const dx = px - cx, dy = py - cy;
      const d = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, d / 260);
      const tx = (dx / d) * 5 * reach, ty = (dy / d) * 2.4 * reach;
      const p = el.querySelector(".onyx-pupils");
      if (p) p.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
    });
  }
  window.addEventListener("pointermove", e => {
    px = e.clientX; py = e.clientY;
    if (!raf && !reduceMotion) raf = requestAnimationFrame(track);
  }, { passive: true });

  function watch(el) { if (el) { watched.add(el); track(); } }

  /* ---------- 眨眼 ---------- */
  function blinkLoop() {
    const wait = 2800 + Math.random() * 4200;
    setTimeout(() => {
      if (!document.documentElement.classList.contains("is-asleep")) {
        document.querySelectorAll(".onyx").forEach(c => {
          c.classList.add("blink");
          setTimeout(() => c.classList.remove("blink"), 170);
        });
      }
      blinkLoop();
    }, wait);
  }
  if (!reduceMotion) blinkLoop();

  /* ---------- 閒置就睡著 ---------- */
  let idleTimer = 0;
  const IDLE_MS = 45000;
  function wake() {
    const root = document.documentElement;
    if (root.classList.contains("is-asleep")) {
      root.classList.remove("is-asleep");
      caption("[Onyx 醒過來，伸了個懶腰]");
    }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      root.classList.add("is-asleep");
      caption("[Onyx 窩成一團睡著了]");
    }, IDLE_MS);
  }
  ["pointerdown", "keydown", "scroll", "touchstart"].forEach(ev =>
    window.addEventListener(ev, wake, { passive: true }));
  wake();

  /* ---------- 字幕式反應 ---------- */
  let capTimer = 0;
  function caption(text, ms = 2600) {
    const box = document.getElementById("caption");
    if (!box) return;
    box.textContent = text;
    box.classList.remove("show");
    void box.offsetWidth;
    box.classList.add("show");
    clearTimeout(capTimer);
    capTimer = setTimeout(() => box.classList.remove("show"), ms);
  }

  const lines = {
    learned: [
      "[Onyx 慢慢眨眼，這是貓表達信任的方式]",
      "[Onyx 輕輕甩了一下尾巴]",
      "[Onyx 發出低低的呼嚕聲]",
      "[Onyx 用鼻子碰了碰你的手指]"
    ],
    unlearned: ["[Onyx 歪著頭看你]"],
    chapter: ["[Onyx 伸了個大懶腰，這一章學完了]"],
    words: ["[Onyx 一隻耳朵轉向你：單字模式]"],
    chunks: ["[Onyx 兩隻耳朵都豎起來：語塊模式]"],
    poke: [
      "[Onyx 盯著你看了三秒，然後慢慢眨眼]",
      "[Onyx 從鍵盤上走過去]",
      "[Onyx 把頭靠過來蹭你的手]",
      "[Onyx 尾巴尖端輕輕抖動，牠很好奇]"
    ],
    saved: ["[Onyx 把你的筆記藏進紙箱]"]
  };

  function react(kind, targetEl) {
    const pool = lines[kind] || lines.poke;
    caption(pool[Math.floor(Math.random() * pool.length)]);
    const anim = { learned: "flick", chapter: "stretch", words: "ear", chunks: "ears", poke: "flick", unlearned: "tilt" }[kind];
    const cats = targetEl ? [targetEl] : document.querySelectorAll(".onyx");
    cats.forEach(c => {
      if (!anim || reduceMotion) return;
      c.classList.remove(anim);
      void c.getBoundingClientRect();
      c.classList.add(anim);
      setTimeout(() => c.classList.remove(anim), 900);
    });
  }

  BCE.mascot = { svg, mark, watch, react };
  BCE.caption = caption;
})(window.BCE);
