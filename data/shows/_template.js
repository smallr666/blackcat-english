/* 新的一季範本：複製本檔改名為 <file>.js（例如 wednesday-s1.js）
 * 並在 data/catalog.js 對應系列的 seasons 裡加一筆 file 相同的資料。
 *
 * 一季的所有集數放在同一個檔案的 episodes 陣列，學習頁會依「集數 → 段落 → 時間」排列。
 *
 * id     : 在「這一季」裡不能重複。建議加上集數前綴：e1-w01、e2-c03
 * t      : 該集的影片時間 "mm:ss"（超過一小時也用分鐘，例如 "62:15"）
 * line   : 片中「單句」原文，簡短引用即可，不要整段貼字幕
 * slots  : 語塊拆解 [["文字", "角色"], ...]
 *          角色：V 動詞 / prep 介系詞 / O 受詞 / adj / adv / N / S 主詞 /
 *               V-ing / to V / clause 子句 / prep+O / rel 關係詞 / expr 固定說法
 */
BCE.registerSeason({
  file: "series-s1",
  blurb: "一兩句說明這一季適合練什麼。",
  episodes: [
    {
      id: "e1", no: 1, title: "Episode Title", zh: "中文集名", runtime: "52 分鐘",
      chapters: [ { t: "00:00", en: "Opening", zh: "開場" } ],
      words: [
        { id: "e1-w01", t: "00:30", term: "word", ipa: "wɝːd", pos: "n.", zh: "中文",
          line: "Short line from the show.", who: "角色名", tip: "學習提示" }
      ],
      chunks: [
        { id: "e1-c01", t: "00:45", term: "chunk phrase",
          slots: [["verb", "V"], ["prep", "prep"], ["object", "O"]],
          zh: "中文", line: "Short line from the show.", who: "角色名",
          trap: "中文母語者容易犯的錯", use: "Your own example sentence." }
      ]
    },
    {
      id: "e2", no: 2, title: "Episode Two", zh: "第二集", runtime: "48 分鐘",
      chapters: [],
      words: [],
      chunks: []
    }
  ]
});
