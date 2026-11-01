/* 新影集範本：複製本檔改名為 <id>.js（id 用英文小寫與連字號）
 * 再到 data/catalog.js 加一筆相同 id 的資料。
 *
 * t      : 影片時間 "mm:ss"（超過一小時也用分鐘，例如 "62:15"）
 * line   : 片中「單句」原文，簡短引用即可，不要整段貼字幕
 * slots  : 語塊拆解 [["文字", "角色"], ...]
 *          角色：V 動詞 / prep 介系詞 / O 受詞 / adj / adv / N / S 主詞 /
 *               V-ing / to V / clause 子句 / prep+O / rel 關係詞 / expr 固定說法
 */
BCE.registerShow({
  id: "show-id",
  title: "English Title",
  zh: "中文片名",
  kind: "影集",
  year: 2024,
  runtime: "S1E1 · 52 分鐘",
  level: "B1",
  blurb: "一兩句說明這部片適合練什麼。",
  chapters: [ { t: "00:00", en: "Opening", zh: "開場" } ],
  words: [
    { id: "w01", t: "00:30", term: "word", ipa: "wɝːd", pos: "n.", zh: "中文",
      line: "Short line from the show.", who: "角色名", tip: "學習提示" }
  ],
  chunks: [
    { id: "c01", t: "00:45", term: "chunk phrase",
      slots: [["verb", "V"], ["prep", "prep"], ["object", "O"]],
      zh: "中文", line: "Short line from the show.", who: "角色名",
      trap: "中文母語者容易犯的錯", use: "Your own example sentence." }
  ]
});
