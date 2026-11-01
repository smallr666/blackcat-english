/* 片單目錄（參考 Netflix）：一個系列一筆，季別放在 seasons 裡。
 * 同系列的不同季 → 同一筆的 seasons 陣列
 * 不同系列       → 另開一筆
 * 每一季對應 data/shows/<file>.js（同一季的所有集數合併在一個檔案）
 *
 * netflix      : 作品在 Netflix 的頁面（用 https://www.netflix.com/title/<編號>，各地區都能自動導向）
 * totalSeasons : 這部作品總共幾季（尚未上架的季別會顯示「整理中」）
 * episodes     : 這一季總共幾集（尚未上架的集數會顯示「整理中」）
 * cover        : （選填）你自己有權使用的封面圖路徑，例如 "assets/covers/friends.jpg"
 *                沒填就使用網站自動產生的文字海報
 * 單字、語塊數量會自動從資料檔計算，不用手動填。
 */
BCE.catalog = [
  {
    id: "friends",
    title: "Friends",
    zh: "六人行",
    kind: "影集",
    year: 1994,
    level: "B1",
    tone: "plum",            /* 海報色：pine / amber / ink / fog / plum */
    netflix: "https://www.netflix.com/title/70153404",
    totalSeasons: 10,
    seasons: [
      { id: "s1", label: "第 1 季", file: "friends-s1", episodes: 24 }
    ]
  },
  {
    id: "inside-the-mind-of-a-cat",
    title: "Inside the Mind of a Cat",
    zh: "喵星人奇思妙想",
    kind: "紀錄片",
    year: 2022,
    level: "B1–B2",
    tone: "pine",
    netflix: "https://www.netflix.com/title/81447086",
    seasons: [
      { id: "film", label: "紀錄片", file: "inside-the-mind-of-a-cat", episodes: 1 }
    ]
  }
];
