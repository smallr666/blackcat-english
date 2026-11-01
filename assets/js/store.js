/* BlackCat English — 資料儲存層
 * 目前：存在使用者這台裝置的瀏覽器（localStorage），重新整理、關掉再開都還在。
 * 未來：只要把 adapter 換成雲端（Supabase / Firebase），畫面程式完全不用改。
 */
window.BCE = window.BCE || {};

(function (BCE) {
  const KEY = "bce:v1";
  const empty = () => ({ version: 1, items: {}, prefs: {} });

  /* ---- adapter：唯一需要替換的地方 ---- */
  const localAdapter = {
    load() {
      try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : empty();
      } catch (e) { return empty(); }
    },
    save(data) {
      try { localStorage.setItem(KEY, JSON.stringify(data)); return true; }
      catch (e) { return false; }
    }
  };

  let adapter = localAdapter;
  let data = adapter.load();
  if (!data.items) data.items = {};
  if (!data.prefs) data.prefs = {};

  const k = (showId, itemId) => showId + "::" + itemId;
  const listeners = new Set();
  function commit() {
    const ok = adapter.save(data);
    listeners.forEach(fn => fn());
    return ok;
  }

  BCE.store = {
    get(showId, itemId) { return data.items[k(showId, itemId)] || {}; },

    setNote(showId, itemId, text) {
      const key = k(showId, itemId);
      const cur = data.items[key] || {};
      cur.note = text;
      cur.updated = Date.now();
      if (!cur.note && !cur.learned) delete data.items[key];
      else data.items[key] = cur;
      return commit();
    },

    toggleLearned(showId, itemId) {
      const key = k(showId, itemId);
      const cur = data.items[key] || {};
      cur.learned = !cur.learned;
      cur.updated = Date.now();
      if (!cur.note && !cur.learned) delete data.items[key];
      else data.items[key] = cur;
      commit();
      return !!cur.learned;
    },

    /* 所有筆記：[{showId, itemId, note, updated}] */
    notes() {
      return Object.entries(data.items)
        .filter(([, v]) => v.note && v.note.trim())
        .map(([key, v]) => {
          const [showId, itemId] = key.split("::");
          return { showId, itemId, note: v.note, updated: v.updated || 0 };
        })
        .sort((a, b) => b.updated - a.updated);
    },

    learnedCount(showId, ids) {
      return ids.filter(id => (data.items[k(showId, id)] || {}).learned).length;
    },

    pref(name, value) {
      if (value === undefined) return data.prefs[name];
      data.prefs[name] = value;
      commit();
    },

    exportJSON() {
      return JSON.stringify({ app: "BlackCat English", exported: new Date().toISOString(), ...data }, null, 2);
    },

    importJSON(text) {
      const incoming = JSON.parse(text);
      if (!incoming || typeof incoming.items !== "object") throw new Error("檔案格式不對：找不到 items 欄位");
      Object.entries(incoming.items).forEach(([key, v]) => {
        const cur = data.items[key];
        if (!cur || (v.updated || 0) >= (cur.updated || 0)) data.items[key] = v;
      });
      Object.assign(data.prefs, incoming.prefs || {});
      commit();
      return Object.keys(incoming.items).length;
    },

    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },

    /* 未來接雲端：BCE.store.useAdapter(supabaseAdapter) */
    useAdapter(next) { adapter = next; data = adapter.load() || empty(); commit(); }
  };
})(window.BCE);
