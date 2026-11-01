# BlackCat English

照 Netflix 影集時間軸學英文的個人學習網站。每部影集有兩種模式：**單字**與**詞彙語塊（lexical chunks）**，筆記自動保存在使用者自己的瀏覽器。

## 資料夾結構

```
index.html                 網站入口（只有一頁，內容由 JS 切換）
manifest.webmanifest       讓網站可「加到主畫面」，未來包成 App 的基礎
sw.js                      離線快取（更新內容時把 VERSION 加一）
assets/css/style.css       所有樣式與設計 token
assets/js/config.js        全站設定（吉祥物名字、朗讀語速）
assets/js/store.js         資料儲存層（筆記、學會狀態）— 未來換雲端只改這支
assets/js/speech.js        朗讀（瀏覽器內建語音）
assets/js/mascot.js        吉祥物 小墨 Onyx 的圖形與互動
assets/js/app.js           頁面路由與畫面
assets/img/                App 圖示
data/catalog.js            片單目錄（系列 → 季別）
data/shows/<file>.js       每一季的學習內容（同一季所有集數合併在一個檔案）
data/shows/_template.js    新的一季範本（含兩集示範）
```

## 上架到 GitHub Pages

1. 在 GitHub 建立新的 repository（例如 `blackcat-english`），把整個資料夾內容上傳到根目錄。
2. 進入 repository 的 **Settings → Pages**。
3. Source 選 **Deploy from a branch**，Branch 選 `main`、資料夾選 `/ (root)`，按 Save。
4. 約一兩分鐘後，網址會是 `https://<你的帳號>.github.io/blackcat-english/`。

> 本機預覽：直接雙擊 `index.html` 就能看（筆記功能可用）。若要測試「加到主畫面」與離線功能，用 VS Code 的 Live Server 開啟。

## 片單結構（參考 Netflix）

```
系列（catalog.js 一筆）
 └─ 季別 seasons（每季一個 data/shows/<file>.js）
     └─ 集數 episodes（同一季合併在一頁，依「集數 → 段落 → 時間」排列）
```

- **同系列不同季**：加在同一筆的 `seasons` 陣列，頁面上會出現季別切換。
- **不同系列**：在 `catalog.js` 另開一筆，會是片單上的另一張海報。
- 紀錄片或電影：只有一季、一集，頁面會自動隱藏季別與集數標題。

## 新增內容

**新系列**
1. 在 `data/catalog.js` 加一筆系列資料（`catalog.js` 內有註解範例）。
2. 複製 `data/shows/_template.js` 為 `<系列>-s1.js`，填入集數內容。

**同系列的新一季**
1. 在該系列的 `seasons` 加一筆，例如 `{ id: "s2", label: "第 2 季", file: "wednesday-s2", ... }`。
2. 新增對應的 `data/shows/wednesday-s2.js`。

**同一季的新一集**：直接在該季檔案的 `episodes` 陣列加一集。單字與語塊的 `id` 在同一季不可重複，建議用 `e2-w01` 這種格式。

最後把 `sw.js` 的 `VERSION` 改成下一號（例如 `bce-v3`），推上 GitHub。

## 吉祥物名字

在 `assets/js/config.js` 修改 `mascot.en`、`mascot.zh`，全站的字幕式反應與介紹會一起改。

## 朗讀功能

使用瀏覽器內建語音，免費、不需金鑰。音色依裝置而定（iPhone/Mac 多為 Samantha，Windows 為 Microsoft 語音，Chrome 有 Google US English）。工具列可切換慢速。瀏覽器不支援時，朗讀按鈕會自動隱藏。

## 筆記與學習進度存在哪裡？

目前存在使用者瀏覽器的 localStorage：
- 重新整理、關掉瀏覽器、隔天再開都會留著。
- 換裝置、換瀏覽器、清除瀏覽資料、使用無痕模式時**不會**跟著走。
- 「筆記本」頁有**匯出備份 / 匯入備份**（JSON 檔），可以手動搬到其他裝置。

想要跨裝置同步，需要帳號系統與雲端資料庫（建議 Supabase），屆時只需替換 `assets/js/store.js` 裡的 adapter。

## 版權提醒

GitHub Pages 公開網站上請只放「單句、簡短」的台詞引用作為學習例句，不要上傳完整字幕檔或逐字稿。
