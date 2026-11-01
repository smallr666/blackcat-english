/* 朗讀：使用瀏覽器內建語音（免費、免金鑰）。
 * 音色依裝置而定：iPhone / Mac 通常是 Samantha，Windows 是 Microsoft 語音，Chrome 有 Google US English。
 */
window.BCE = window.BCE || {};

(function (BCE) {
  const cfg = (BCE.config && BCE.config.speech) || { lang: "en-US", rate: 0.95, slowRate: 0.7 };
  const supported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  let voice = null;
  let activeBtn = null;

  const PREFERRED = ["Samantha", "Google US English", "Microsoft Aria", "Microsoft Jenny", "Ava", "Allison", "Alex"];

  function pickVoice() {
    if (!supported) return;
    const all = speechSynthesis.getVoices();
    if (!all.length) return;
    const us = all.filter(v => v.lang && v.lang.replace("_", "-").toLowerCase().startsWith("en-us"));
    voice = PREFERRED.map(n => us.find(v => v.name.includes(n))).find(Boolean)
      || us.find(v => v.localService) || us[0]
      || all.find(v => v.lang && v.lang.toLowerCase().startsWith("en")) || null;
  }

  if (supported) {
    pickVoice();
    speechSynthesis.addEventListener ? speechSynthesis.addEventListener("voiceschanged", pickVoice)
      : (speechSynthesis.onvoiceschanged = pickVoice);
  }

  function clear() {
    if (activeBtn) { activeBtn.classList.remove("speaking"); activeBtn.setAttribute("aria-pressed", "false"); }
    activeBtn = null;
  }

  function speak(text, btn) {
    if (!supported || !text) return false;
    const clean = String(text).replace(/[…]/g, " ").replace(/\s+/g, " ").trim();
    const wasSame = activeBtn === btn && speechSynthesis.speaking;
    speechSynthesis.cancel();
    clear();
    if (wasSame) return true;            /* 再按一次＝停止 */
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = cfg.lang;
    if (voice) u.voice = voice;
    u.rate = BCE.store && BCE.store.pref("slowSpeech") ? cfg.slowRate : cfg.rate;
    u.onend = u.onerror = clear;
    if (btn) { activeBtn = btn; btn.classList.add("speaking"); btn.setAttribute("aria-pressed", "true"); }
    speechSynthesis.speak(u);
    return true;
  }

  BCE.speech = { supported, speak, stop() { if (supported) speechSynthesis.cancel(); clear(); } };
  if (!supported) document.documentElement.classList.add("no-tts");
})(window.BCE);
