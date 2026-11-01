/* BlackCat English — 主程式
 * 路由（hash，GitHub Pages 不需設定伺服器）：
 *   #/                     首頁
 *   #/show/<id>            影集（預設單字模式）
 *   #/show/<id>/chunks     影集語塊模式
 *   #/notes                筆記本
 */
window.BCE = window.BCE || {};

(function (BCE) {
  BCE.shows = BCE.shows || {};
  const pending = {};

  BCE.registerShow = function (show) {
    BCE.shows[show.id] = show;
    (pending[show.id] || []).forEach(fn => fn(show));
    delete pending[show.id];
  };

  BCE.loadShow = function (id) {
    return new Promise((resolve, reject) => {
      if (BCE.shows[id]) return resolve(BCE.shows[id]);
      if (!(BCE.catalog || []).some(s => s.id === id)) return reject(new Error("找不到這部影集：" + id));
      (pending[id] = pending[id] || []).push(resolve);
      if (document.querySelector(`script[data-show="${id}"]`)) return;
      const s = document.createElement("script");
      s.src = `data/shows/${id}.js`;
      s.dataset.show = id;
      s.onerror = () => reject(new Error("影集資料載入失敗：data/shows/" + id + ".js"));
      document.head.appendChild(s);
    });
  };

  /* ---------- 小工具 ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const toSec = t => t.split(":").map(Number).reduce((a, n) => a * 60 + n, 0);
  const app = () => $("#app");

  const ROLE = {
    V: "動詞", prep: "介系詞", O: "受詞", adj: "形容詞", adv: "副詞", N: "名詞", S: "主詞",
    "V-ing": "V-ing", "to V": "to + V", clause: "子句", "prep+O": "介系詞片語", rel: "關係詞", expr: "固定說法"
  };
  const patternOf = slots => slots.length === 1 && slots[0][1] === "expr"
    ? "固定說法"
    : slots.map(s => s[1] === "prep+O" ? "prep + O" : s[1]).join(" + ");

  /* ---------- 路由 ---------- */
  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    $$(".nav a").forEach(a => a.removeAttribute("aria-current"));
    window.removeEventListener("scroll", onTimelineScroll);

    if (parts[0] === "show" && parts[1]) {
      const mode = parts[2] === "chunks" ? "chunks" : "words";
      renderLoading();
      BCE.loadShow(parts[1])
        .then(show => renderShow(show, mode))
        .catch(err => renderError(err.message));
      return;
    }
    if (parts[0] === "notes") {
      $('.nav a[href="#/notes"]').setAttribute("aria-current", "page");
      renderNotebook();
      return;
    }
    $('.nav a[href="#/"]').setAttribute("aria-current", "page");
    renderHome();
  }

  function setPage(html, title) {
    app().innerHTML = html;
    document.title = title ? `${title}｜BlackCat English` : "BlackCat English｜看劇學道地英文";
    window.scrollTo(0, 0);
    app().focus({ preventScroll: true });
  }

  function renderLoading() { app().innerHTML = `<p class="state">正在載入影集資料…</p>`; }
  function renderError(msg) {
    setPage(`<section class="state"><h1>這一頁打不開</h1><p>${esc(msg)}</p><p><a class="btn" href="#/">回到片單</a></p></section>`);
  }

  /* ---------- 首頁 ---------- */
  function renderHome() {
    const shows = BCE.catalog || [];
    const latest = shows[0];
    const posters = shows.map(s => `
      <a class="poster tone-${esc(s.tone || "pine")}" href="#/show/${esc(s.id)}">
        <span class="poster-kind">${esc(s.kind)}｜${esc(s.year)}</span>
        <span class="poster-title" lang="en">${esc(s.title)}</span>
        <span class="poster-zh">${esc(s.zh)}</span>
        <span class="poster-meta">${s.words} 個單字　${s.chunks} 個語塊　${esc(s.level)}</span>
      </a>`).join("");

    setPage(`
      <section class="hero">
        <div class="moon" aria-hidden="true"></div>
        <h1 class="wordmark" aria-label="BlackCat English">
          <span class="wm-1" lang="en">BlackCat</span>
          <span class="wm-2" lang="en">English</span>
        </h1>
        <div class="hero-cat">${BCE.mascot.svg({ cls: "onyx-hero" })}</div>
        <div class="hero-copy">
          <p class="hero-lead">看劇的時候，讓英文整塊浮出來。</p>
          <p class="hero-sub">每部 Netflix 影集都照時間軸拆成兩條路線：單字，以及母語者真正成組在用的詞彙語塊。邊看邊對照，筆記會留在你的裝置上。</p>
          ${latest ? `<a class="btn btn-solid" href="#/show/${esc(latest.id)}">從《${esc(latest.zh)}》開始</a>` : ""}
        </div>
      </section>

      <section class="shelf" aria-labelledby="shelf-h">
        <div class="section-head">
          <h2 id="shelf-h">片單</h2>
          <p>目前 ${shows.length} 部，持續上架中。</p>
        </div>
        <div class="poster-row">
          ${posters}
          <div class="poster poster-empty" aria-hidden="true">
            <span class="poster-title">下一部</span>
            <span class="poster-zh">字幕整理中</span>
          </div>
        </div>
      </section>

      <section class="method" aria-labelledby="method-h">
        <div class="method-text">
          <h2 id="method-h">為什麼要學語塊？</h2>
          <p>母語者說話不是一個字一個字拼出來的，而是一次叫出一整組常一起出現的字。看劇時如果腦中存的是 <span lang="en">tap into</span> 這樣的組合，聽到的瞬間就懂，不用停下來翻譯。</p>
          <p>單字模式幫你補齊生字；語塊模式把「動詞＋介系詞＋受詞」這類搭配拆開給你看，再附上中文母語者最容易踩的坑。</p>
        </div>
        <figure class="demo" data-demo="words">
          <div class="demo-switch" role="group" aria-label="切換示範">
            <button type="button" data-demo-mode="words" aria-pressed="true">逐字看</button>
            <button type="button" data-demo-mode="chunks" aria-pressed="false">整塊看</button>
          </div>
          <p class="demo-line" lang="en">
            <span class="w">The</span><span class="w">trick</span><span class="w">is</span><span class="w">knowing</span><span class="w">how</span><span class="w">to</span><span class="w k">tap</span><span class="w k">into</span><span class="w k">that</span><span class="w k">potential.</span>
          </p>
          <figcaption><span class="demo-cap-words">十個字，大腦要處理十次。</span><span class="demo-cap-chunks"><span lang="en">tap into + potential</span>：一個語塊，一次就懂。</span></figcaption>
        </figure>
      </section>`);

    BCE.mascot.watch($(".onyx-hero"));
  }

  /* ---------- 影集頁 ---------- */
  let current = null;

  function renderShow(show, mode) {
    const isChunks = mode === "chunks";
    const items = (isChunks ? show.chunks : show.words).slice().sort((a, b) => toSec(a.t) - toSec(b.t));
    const chapters = show.chapters.map((c, i) => ({ ...c, i, items: [] }));
    items.forEach(it => {
      let ch = chapters[0];
      chapters.forEach(c => { if (toSec(c.t) <= toSec(it.t)) ch = c; });
      ch.items.push(it);
    });
    const hideLearned = BCE.store.pref("hideLearned") === true;
    const sameShow = current && current.show.id === show.id;
    current = { show, mode, items, chapters };
    BCE.store.pref("lastShow", show.id);

    const showNote = BCE.store.get(show.id, "_show").note || "";
    const chapterOptions = chapters.filter(c => c.items.length)
      .map(c => `<option value="ch-${c.i}">${esc(c.t)}　${esc(c.zh)}</option>`).join("");

    const body = chapters.filter(c => c.items.length).map(c => `
      <section class="chapter" id="ch-${c.i}" data-chapter="${c.i}">
        <header class="chapter-head">
          <span class="chapter-time">${esc(c.t)}</span>
          <h3><span lang="en">${esc(c.en)}</span><small>${esc(c.zh)}</small></h3>
        </header>
        ${c.items.map(it => isChunks ? chunkCard(show.id, it) : wordCard(show.id, it)).join("")}
      </section>`).join("");

    setPage(`
      <section class="show-head">
        <p class="crumb"><a href="#/">片單</a><span aria-hidden="true">／</span>${esc(show.kind)}</p>
        <h1 class="show-title" lang="en">${esc(show.title)}</h1>
        <p class="show-zh">${esc(show.zh)}</p>
        <p class="show-blurb">${esc(show.blurb)}</p>
        <p class="show-facts">${esc(show.year)} 年　${esc(show.runtime)}　難度 ${esc(show.level)}</p>
        <details class="show-note">
          <summary>整集筆記${showNote ? "（有內容）" : ""}</summary>
          <textarea data-note="_show" rows="4" placeholder="看這集時的想法、想追蹤的句子、下次要複習的段落…">${esc(showNote)}</textarea>
          <span class="save-state" aria-live="polite"></span>
        </details>
      </section>

      <div class="toolbar" role="region" aria-label="學習工具">
        <div class="mode-switch" data-mode="${mode}">
          <a href="#/show/${esc(show.id)}" ${!isChunks ? 'aria-current="page"' : ""}>單字<span>${show.words.length}</span></a>
          <a href="#/show/${esc(show.id)}/chunks" ${isChunks ? 'aria-current="page"' : ""}>語塊<span>${show.chunks.length}</span></a>
          <i class="mode-thumb" aria-hidden="true"></i>
        </div>
        <label class="jump">
          <span class="sr">跳到段落</span>
          <select data-jump>${chapterOptions}</select>
        </label>
        <label class="hide-learned">
          <input type="checkbox" data-hide ${hideLearned ? "checked" : ""}>
          <span>隱藏已學會</span>
        </label>
        <p class="progress-text" data-progress></p>
      </div>

      ${isChunks ? `
      <p class="legend" aria-label="語塊標示說明">
        <span class="slot r-V">動詞</span><span class="slot r-prep">介系詞</span><span class="slot r-O">受詞</span><span class="slot r-other">其他成分</span>
      </p>` : ""}

      <div class="timeline ${hideLearned ? "hide-learned-on" : ""} mode-${mode}">
        <div class="track" aria-hidden="true">
          <i class="track-fill"></i>
          <div class="walker">${BCE.mascot.svg({ cls: "onyx-mini", label: "" })}</div>
        </div>
        ${body}
      </div>`, `${show.zh} ${isChunks ? "語塊" : "單字"}`);

    updateProgress();
    window.addEventListener("scroll", onTimelineScroll, { passive: true });
    onTimelineScroll();

    const prev = BCE.store.pref("lastMode");
    if (prev && prev !== mode && sameShow) {
      $(".mode-switch").classList.add("switched");
      BCE.mascot.react(mode, $(".walker .onyx"));
    }
    BCE.store.pref("lastMode", mode);
  }

  function noteBlock(showId, it) {
    const note = BCE.store.get(showId, it.id).note || "";
    return `
      <div class="note ${note ? "has-note" : ""}" ${note ? "" : "hidden"}>
        <textarea data-note="${esc(it.id)}" rows="3" placeholder="寫下你自己的例句、聯想，或在劇裡聽到時的感覺…">${esc(note)}</textarea>
        <span class="save-state" aria-live="polite"></span>
      </div>`;
  }

  function cardActions(showId, it) {
    const st = BCE.store.get(showId, it.id);
    return `
      <div class="card-actions">
        <button type="button" class="act-learn" data-learn="${esc(it.id)}" aria-pressed="${st.learned ? "true" : "false"}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="16" rx="5" ry="4"/><circle cx="6" cy="10" r="2"/><circle cx="10" cy="6.5" r="2"/><circle cx="14" cy="6.5" r="2"/><circle cx="18" cy="10" r="2"/></svg>
          <span>${st.learned ? "已學會" : "標記學會"}</span>
        </button>
        <button type="button" class="act-note" data-open-note="${esc(it.id)}" aria-expanded="${st.note ? "true" : "false"}">
          ${st.note ? "編輯筆記" : "寫筆記"}
        </button>
      </div>`;
  }

  function wordCard(showId, it) {
    const st = BCE.store.get(showId, it.id);
    return `
      <article class="card word ${st.learned ? "is-learned" : ""}" id="${esc(it.id)}" data-item="${esc(it.id)}">
        <span class="card-time">${esc(it.t)}</span>
        <i class="dot" aria-hidden="true"></i>
        <div class="card-body">
          <h4 class="term" lang="en">${esc(it.term)}</h4>
          <p class="term-meta"><span class="ipa" lang="en">/${esc(it.ipa)}/</span><span class="pos">${esc(it.pos)}</span></p>
          <p class="zh">${esc(it.zh)}</p>
          <blockquote class="ctx" lang="en">${highlight(it.line, it.term)}<cite>${esc(it.who)}　${esc(it.t)}</cite></blockquote>
          <p class="tip">${esc(it.tip)}</p>
          ${cardActions(showId, it)}
          ${noteBlock(showId, it)}
        </div>
      </article>`;
  }

  function chunkCard(showId, it) {
    const st = BCE.store.get(showId, it.id);
    const slots = it.slots.map(([text, role]) => {
      const r = ["V", "prep", "O"].includes(role) ? role : "other";
      return `<span class="slot r-${r}" lang="en"><b>${esc(text)}</b><small>${esc(ROLE[role] || role)}</small></span>`;
    }).join("");
    return `
      <article class="card chunk ${st.learned ? "is-learned" : ""}" id="${esc(it.id)}" data-item="${esc(it.id)}">
        <span class="card-time">${esc(it.t)}</span>
        <i class="dot" aria-hidden="true"></i>
        <div class="card-body">
          <h4 class="term" lang="en">${esc(it.term)}</h4>
          <p class="pattern">${esc(patternOf(it.slots))}</p>
          <p class="slots">${slots}</p>
          <p class="zh">${esc(it.zh)}</p>
          <blockquote class="ctx" lang="en">${esc(it.line)}<cite>${esc(it.who)}　${esc(it.t)}</cite></blockquote>
          <div class="trap"><strong>中文腦陷阱</strong><p>${esc(it.trap)}</p></div>
          <p class="use"><strong>換你用</strong><span lang="en">${esc(it.use)}</span></p>
          ${cardActions(showId, it)}
          ${noteBlock(showId, it)}
        </div>
      </article>`;
  }

  function highlight(line, term) {
    const safe = esc(line);
    const re = new RegExp("(" + term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "i");
    return safe.replace(re, "<mark>$1</mark>");
  }

  function updateProgress() {
    if (!current) return;
    const ids = current.items.map(i => i.id);
    const n = BCE.store.learnedCount(current.show.id, ids);
    const el = $("[data-progress]");
    if (el) el.textContent = `已學會 ${n} / ${ids.length}`;
  }

  /* 時間軸：進度線與走動的 Onyx */
  let walkTimer = 0;
  function onTimelineScroll() {
    const tl = $(".timeline");
    if (!tl) return;
    const r = tl.getBoundingClientRect();
    const walkerY = innerHeight * 0.45;
    const h = Math.max(0, Math.min(r.height, walkerY - r.top));
    const fill = $(".track-fill");
    if (fill) fill.style.height = h + "px";
    const jump = $("[data-jump]");
    if (jump && document.activeElement !== jump) {
      let active = null;
      $$(".chapter").forEach(c => { if (c.getBoundingClientRect().top < walkerY) active = c.id; });
      if (active && jump.value !== active) jump.value = active;
    }
    const w = $(".walker");
    if (w) {
      w.classList.add("moving");
      clearTimeout(walkTimer);
      walkTimer = setTimeout(() => w.classList.remove("moving"), 220);
    }
  }

  /* ---------- 筆記本 ---------- */
  function renderNotebook() {
    const ids = (BCE.catalog || []).map(s => s.id);
    Promise.all(ids.map(id => BCE.loadShow(id).catch(() => null))).then(() => {
      const notes = BCE.store.notes();
      const rows = notes.map(n => {
        const show = BCE.shows[n.showId];
        if (!show) return "";
        const it = n.itemId === "_show" ? null
          : [...show.words, ...show.chunks].find(x => x.id === n.itemId);
        const isChunk = it && show.chunks.includes(it);
        const href = it ? `#/show/${show.id}${isChunk ? "/chunks" : ""}` : `#/show/${show.id}`;
        const when = n.updated ? new Date(n.updated).toLocaleString("zh-TW", { dateStyle: "medium", timeStyle: "short" }) : "";
        return `
          <article class="nb-item" data-show="${esc(show.id)}" data-search="${esc((it ? it.term + " " + it.zh : "整集筆記") + " " + n.note).toLowerCase()}">
            <header>
              <a href="${href}" class="nb-term" ${it ? 'lang="en"' : ""}>${it ? esc(it.term) : "整集筆記"}</a>
              <span class="nb-meta">${esc(show.zh)}${it ? "　" + esc(it.t) + "　" + (isChunk ? "語塊" : "單字") : ""}</span>
            </header>
            <textarea data-note="${esc(n.itemId)}" data-note-show="${esc(show.id)}" rows="3">${esc(n.note)}</textarea>
            <footer><span class="save-state" aria-live="polite">最後修改 ${esc(when)}</span>
              <button type="button" class="link-btn" data-clear-note="${esc(n.itemId)}" data-note-show="${esc(show.id)}">刪除這則筆記</button></footer>
          </article>`;
      }).join("");

      setPage(`
        <section class="nb-head">
          <h1>筆記本</h1>
          <p>所有影集的筆記都在這裡，可以直接修改，會自動儲存在這台裝置的瀏覽器裡。換手機或清除瀏覽器資料前，請先匯出備份。</p>
          <div class="nb-tools">
            <label class="nb-search"><span class="sr">搜尋筆記</span><input type="search" data-nb-search placeholder="搜尋單字、語塊或筆記內容"></label>
            <button type="button" class="btn" data-export>匯出備份</button>
            <label class="btn btn-file">匯入備份<input type="file" accept="application/json,.json" data-import hidden></label>
          </div>
        </section>
        <section class="nb-list">
          ${rows || `<div class="nb-empty">${BCE.mascot.svg({ cls: "onyx-empty", label: "" })}
            <p>還沒有筆記。打開任一部影集，在卡片上按「寫筆記」，寫下的內容會出現在這裡。</p>
            <a class="btn btn-solid" href="#/${BCE.catalog[0] ? "show/" + BCE.catalog[0].id : ""}">去寫第一則筆記</a></div>`}
        </section>`, "筆記本");
    });
  }

  /* ---------- 事件（委派） ---------- */
  const saveTimers = new WeakMap();

  document.addEventListener("click", e => {
    const t = e.target;

    const learn = t.closest("[data-learn]");
    if (learn && current) {
      const id = learn.dataset.learn;
      const on = BCE.store.toggleLearned(current.show.id, id);
      const card = learn.closest(".card");
      card.classList.toggle("is-learned", on);
      learn.setAttribute("aria-pressed", on ? "true" : "false");
      learn.querySelector("span").textContent = on ? "已學會" : "標記學會";
      if (on) {
        card.classList.add("stamp");
        setTimeout(() => card.classList.remove("stamp"), 700);
      }
      updateProgress();
      const chEl = card.closest(".chapter");
      const ch = current.chapters[+chEl.dataset.chapter];
      const done = on && ch.items.every(x => BCE.store.get(current.show.id, x.id).learned);
      BCE.mascot.react(done ? "chapter" : on ? "learned" : "unlearned", $(".walker .onyx"));
      return;
    }

    const open = t.closest("[data-open-note]");
    if (open) {
      const box = open.closest(".card-body").querySelector(".note");
      const willOpen = box.hidden;
      box.hidden = !willOpen;
      open.setAttribute("aria-expanded", willOpen ? "true" : "false");
      if (willOpen) box.querySelector("textarea").focus();
      return;
    }

    const clear = t.closest("[data-clear-note]");
    if (clear) {
      const item = clear.closest(".nb-item");
      BCE.store.setNote(clear.dataset.noteShow, clear.dataset.clearNote, "");
      item.remove();
      BCE.caption("[筆記已刪除]");
      return;
    }

    if (t.closest("[data-export]")) {
      const blob = new Blob([BCE.store.exportJSON()], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `blackcat-english-notes-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      BCE.caption("[備份檔已下載]");
      return;
    }

    const demoBtn = t.closest("[data-demo-mode]");
    if (demoBtn) {
      const fig = demoBtn.closest(".demo");
      fig.dataset.demo = demoBtn.dataset.demoMode;
      $$("[data-demo-mode]", fig).forEach(b => b.setAttribute("aria-pressed", b === demoBtn ? "true" : "false"));
      return;
    }

    const cat = t.closest(".onyx");
    if (cat) { BCE.mascot.react("poke", cat); return; }

    if (t.closest("[data-theme-toggle]")) {
      const root = document.documentElement;
      const dark = root.dataset.theme
        ? root.dataset.theme === "dark"
        : matchMedia("(prefers-color-scheme: dark)").matches;
      root.dataset.theme = dark ? "light" : "dark";
      BCE.store.pref("theme", root.dataset.theme);
    }
  });

  document.addEventListener("input", e => {
    const ta = e.target.closest("textarea[data-note]");
    if (ta) {
      const showId = ta.dataset.noteShow || (current && current.show.id);
      const state = ta.parentElement.querySelector(".save-state") || ta.closest(".nb-item")?.querySelector(".save-state");
      if (state) state.textContent = "儲存中…";
      clearTimeout(saveTimers.get(ta));
      saveTimers.set(ta, setTimeout(() => {
        const ok = BCE.store.setNote(showId, ta.dataset.note, ta.value);
        if (state) state.textContent = ok ? "已儲存在這台裝置" : "儲存失敗：瀏覽器可能關閉了儲存空間";
        const card = ta.closest(".card");
        if (card) {
          const btn = card.querySelector("[data-open-note]");
          btn.textContent = ta.value.trim() ? "編輯筆記" : "寫筆記";
        }
      }, 450));
      return;
    }
    const q = e.target.closest("[data-nb-search]");
    if (q) {
      const v = q.value.trim().toLowerCase();
      $$(".nb-item").forEach(el => { el.hidden = v && !el.dataset.search.includes(v); });
    }
  });

  document.addEventListener("change", e => {
    const jump = e.target.closest("[data-jump]");
    if (jump) {
      const el = document.getElementById(jump.value);
      if (el) el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      return;
    }
    const hide = e.target.closest("[data-hide]");
    if (hide) {
      BCE.store.pref("hideLearned", hide.checked);
      $(".timeline").classList.toggle("hide-learned-on", hide.checked);
      onTimelineScroll();
      return;
    }
    const imp = e.target.closest("[data-import]");
    if (imp && imp.files[0]) {
      imp.files[0].text().then(txt => {
        try {
          const n = BCE.store.importJSON(txt);
          BCE.caption(`[已匯入 ${n} 筆學習紀錄]`);
          renderNotebook();
        } catch (err) {
          BCE.caption("[匯入失敗：" + err.message + "]", 4000);
        }
      });
    }
  });

  /* ---------- 啟動 ---------- */
  function init() {
    const theme = BCE.store.pref("theme");
    if (theme) document.documentElement.dataset.theme = theme;
    $(".brand-mark").innerHTML = BCE.mascot.mark();
    window.addEventListener("hashchange", route);
    route();

    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }
  window.addEventListener("DOMContentLoaded", init);
})(window.BCE);
