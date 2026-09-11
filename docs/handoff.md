# ROADKIT 專案交接與學習進度

更新：2026-09-11。依當日已儲存的原始碼與討論整理；接續工作前請重新閱讀相關檔案。本文件是進度摘要，不是完整聊天紀錄。

## 給下一個對話的開場

> 請先閱讀 docs/handoff.md、docs/learning-notes.md 與 TODO.md，再查看目前程式碼。我有手寫 CSS 與元件概念，正在自己學 React、Tailwind CSS 4。請用繁體中文，以解釋、短範例與逐步引導協助。除非我明確要求實作，否則不要直接修改檔案、安裝套件、執行建置或部署。請保留我的練習機會。

## 合作偏好

- 目的是學會技術，由使用者自己逐步撰寫程式。
- 解釋 Tailwind 時，同時對照原生 CSS；說清楚 class 用途、數值及放在父層或子層的原因。
- 提供片段時，說明放在哪個檔案、替換哪一段；省略的 SVG path、示範路徑要明確標示。
- 使用目前專案的命名，避免任意改名。例如字型是 `font-moderustic`，不是 `font-english`。
- 不必為了只使用一次而拒絕拆元件，也不要把每個元素都拆成元件。
- 使用者喜歡可貼入 Notion 的速查筆記：簡短重點、少量範例、對照表、官方參考。
- 文件內的待辦不是自動實作授權。這次只授權新增學習與交接文件；GitHub push 由使用者處理。

## 專案架構

- React 18、Vite 6、React Router 7、Tailwind CSS 4、Axios。
- `src/main.jsx`：載入全域 CSS，以 `createHashRouter`、`RouterProvider` 啟動路由，使用 StrictMode。
- `src/routes/index.jsx`：集中配置前台、登入頁、後台路由。
- `src/Layout.jsx`：前台 header、Outlet、服務特色與 footer。
- `src/App.jsx`：早期 Tailwind 展示元件，目前未接進入口或路由。
- `src/pages/`：路由頁面；`src/components/`：功能與圖示元件。
- `src/assets/all.css`：Tailwind 主題、全站基本樣式、共用容器／表單及服務背景。
- Redux、React Hook Form、Bootstrap 雖已安裝，不代表目前已導入對應架構。

## 已進行的前台工作

- 設計參考：根目錄 `202607_pc.jpg`，ROADKIT 公路旅行選物網站。
- header 已有白色 Logo、主要 NavLink、由資料陣列產生的購物車與會員圖示連結。
- 服務特色以 `services.map()` 顯示三組資料；圖示使用匯入的 SVG 圖片網址。
- footer 已有綠色 Logo、品牌文案、社群 SVG 連結、兩層 map 產生的網站導覽、電子報與底部資訊。
- 圖示元件：`CartIcon`、`PersonIcon`、`FacebookIcon`、`InstagramIcon`、`ArrowIcon`。
- `NewsletterForm.jsx` 已獨立：有 email 欄位、送出按鈕、ArrowIcon；送出只呼叫 `preventDefault()`，沒有訂閱 API。
- footer 分隔線使用 SVG line 與 `strokeDasharray='8 8'`。
- `Home.jsx` 已有 Hero、About、分類、精選商品、旅行誌五區骨架；內容與版面仍待完成，不能視為完成的首頁。

## 目前樣式設定

| 名稱 | 當前值／用途 |
|---|---|
| `--color-brand` | `#4a7c59` |
| `--color-brand-grey` | `#6F8074` |
| `--color-sand` | `#e8e0d6` |
| `--color-paper` | `#f7f3ee` |
| `--color-ink` | `#3d3d3d` |
| `--color-accent` | `#c17a3a` |
| `--font-sans` | Noto Sans TC、系統替代字型 |
| `--font-moderustic` | Moderustic |
| `--font-playfair` | Playfair Display SC |
| `.site-container` | 最大 1280px、置中、左右 1rem；48rem 起改為 2rem |
| `.service-benefits-bg` | relative + isolate；`::before` 載入 `service_bg.jpg`，opacity 0.1 |
| `.form-input` | 輸入框共用外觀、placeholder、focus、disabled、aria-invalid 狀態 |

目前沒有 `--color-brand-dark`，舊討論曾用過這個名稱，不要直接套用舊範例。
`index.html` 已載入 Noto Sans TC／Moderustic 的 400、500、700，以及 Playfair Display SC 的 400、700 字重。

## 路由與後台現況

- `/`：Home；`/products`：商品 API 列表；`/products/:id`：商品 API 詳情。
- `/about`、`/article`：路由直接顯示佔位 div；雖有 About.jsx、Article.jsx，但目前未引用它們。
- `/cart`：佔位頁。header 的 `/member` 尚未配置，會落入 NotFound。
- `/admin/AdminLogin`：獨立登入頁；登入成功將 token 存到 `hexToken` Cookie。
- `/admin`：AdminLayout + AdminProducts；讀 Cookie、設定 Axios Authorization、呼叫驗證 API。
- 商品管理有讀取、新增、編輯、刪除流程；ProductModal 管理表單與新增／修改 API。
- `/admin/orders`：佔位頁。
- **驗證完成前仍渲染 Outlet 的改善已列入 [TODO.md](../TODO.md)，使用者明確決定延後。** 未加驗證狀態閘門，也未實作登出。

## 後續可檢查項目（僅記錄，尚未修正）

- `community.map()` 回傳的最外層 li 缺少 `key={item.id}`。
- 社群網址目前是 Facebook／Instagram 平台首頁，非品牌帳號。
- SVG 分隔線高度 3、y=1、strokeWidth=3，上緣可能超出 SVG 範圍；可檢查是否裁切。
- Home 仍有 Tailwind `container`，與 Layout 的 `site-container` 尚未統一。
- header 疊合首頁 Hero、完整 RWD 與首頁內容仍需後續確認。
- 本次沒有啟動頁面、測試 API 或驗證視覺效果；不能以這份紀錄宣稱功能已測試通過。

## GitHub 與部署

- Repo：https://github.com/GuitarPen/202607_vite-project
- Pages 預期網址：https://guitarpen.github.io/202607_vite-project/
- Vite 正式 base：`/202607_vite-project/`。
- `npm run build` 產生 dist；**成功後**再 `npm run deploy`，後者是 `gh-pages -d dist`。
- 沒有 predeploy，自動 build 不包含在 deploy 指令中；只 push 原始碼不等於更新部署。
- GitHub Pages 若使用目前的分支部署方式，來源應是 gh-pages 的根目錄；遠端設定與最新部署狀態未在這次確認。
- 部署會改變公開網站，請等使用者明確要求；不要把 .env 或憑證內容抄入交接文件。

## 換電腦接續

1. 將這兩份文件與要同步的專案修改提交並推送到 GitHub。
2. 筆電 clone 或 pull 最新專案。
3. 在新的 Codex 討論串貼上本頁的開場文字。
4. 每完成一段工作，更新本頁進度與待辦。

這能同步文件與工作背景，不會還原原本的聊天介面。技術速查見 [learning-notes.md](learning-notes.md)。
