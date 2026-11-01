# BlackCat English

照 Netflix 影集時間軸學英文的個人學習網站。每部影集有兩種模式：**單字**與**詞彙語塊（lexical chunks）**，筆記自動保存在使用者自己的瀏覽器。

## 資料夾結構

```
index.html                 網站入口（只有一頁，內容由 JS 切換）
manifest.webmanifest       讓網站可「加到主畫面」，未來包成 App 的基礎
sw.js                      離線快取（更新內容時把 VERSION 加一）
assets/css/style.css       所有樣式與設計 token
assets/js/store.js         資料儲存層（筆記、學會狀態）— 未來換雲端只改這支
assets/js/mascot.js        吉祥物 Onyx 的圖形與互動
assets/js/app.js           頁面路由與畫面
assets/img/                App 圖示
data/catalog.js            片單目錄
data/shows/<id>.js         每部影集的學習內容
data/shows/_template.js    新影集範本
```

## 上架到 GitHub Pages

1. 在 GitHub 建立新的 repository（例如 `blackcat-english`），把整個資料夾內容上傳到根目錄。
2. 進入 repository 的 **Settings → Pages**。
3. Source 選 **Deploy from a branch**，Branch 選 `main`、資料夾選 `/ (root)`，按 Save。
4. 約一兩分鐘後，網址會是 `https://<你的帳號>.github.io/blackcat-english/`。

> 本機預覽：直接雙擊 `index.html` 就能看（筆記功能可用）。若要測試「加到主畫面」與離線功能，用 VS Code 的 Live Server 開啟。

## 新增一部影集

1. 複製 `data/shows/_template.js`，改名為 `<id>.js`（英文小寫加連字號，例如 `wednesday-s1e1.js`）。
2. 依範本填入 chapters、words、chunks。
3. 在 `data/catalog.js` 加一筆同樣 `id` 的資料。
4. 把 `sw.js` 的 `VERSION` 改成下一號（例如 `bce-v2`），推上 GitHub。

## 筆記與學習進度存在哪裡？

目前存在使用者瀏覽器的 localStorage：
- 重新整理、關掉瀏覽器、隔天再開都會留著。
- 換裝置、換瀏覽器、清除瀏覽資料、使用無痕模式時**不會**跟著走。
- 「筆記本」頁有**匯出備份 / 匯入備份**（JSON 檔），可以手動搬到其他裝置。

想要跨裝置同步，需要帳號系統與雲端資料庫（建議 Supabase），屆時只需替換 `assets/js/store.js` 裡的 adapter。

## 版權提醒

GitHub Pages 公開網站上請只放「單句、簡短」的台詞引用作為學習例句，不要上傳完整字幕檔或逐字稿。
