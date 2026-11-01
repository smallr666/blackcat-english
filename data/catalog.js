/* 片單目錄（參考 Netflix）：一個系列一筆，季別放在 seasons 裡。
 * 同系列的不同季 → 同一筆的 seasons 陣列
 * 不同系列       → 另開一筆
 * 每一季對應 data/shows/<file>.js（同一季的所有集數合併在一個檔案）
 */
BCE.catalog = [
  {
    id: "inside-the-mind-of-a-cat",
    title: "Inside the Mind of a Cat",
    zh: "喵星人奇思妙想",
    kind: "紀錄片",
    year: 2022,
    level: "B1–B2",
    tone: "pine",            /* 海報色：pine / amber / ink / fog */
    seasons: [
      { id: "film", label: "紀錄片", file: "inside-the-mind-of-a-cat", episodes: 1, words: 33, chunks: 38 }
    ]
  }

  /* 影集範例（有兩季時）：
  ,{
    id: "wednesday", title: "Wednesday", zh: "星期三", kind: "影集", year: 2022, level: "B2", tone: "ink",
    seasons: [
      { id: "s1", label: "第 1 季", file: "wednesday-s1", episodes: 8, words: 0, chunks: 0 },
      { id: "s2", label: "第 2 季", file: "wednesday-s2", episodes: 8, words: 0, chunks: 0 }
    ]
  }
  */
];
