# ROADKIT｜公路旅行選物網站

ROADKIT 是以公路旅行為主題的選物網站，提供露營、旅行、攝影與車用商品的瀏覽介面，也包含旅行文章與內容管理後台。前台商品及文章資料透過外部 API 載入。

## 功能一覽

### 前台

- 首頁品牌介紹、商品分類、精選商品與旅行文章。
- 商品列表、分類篩選與分頁。
- 商品詳細資料、圖片瀏覽、商品描述與內容切換，以及同分類商品推薦。
- 商品頁可呼叫 API，將指定數量的商品加入購物車。
- 旅行文章列表、文章內頁與上一篇／下一篇導覽。
- 品牌介紹、購物車準備中頁面及找不到頁面的提示。

### 管理後台

- 管理員登入與登入狀態驗證。
- 商品新增、編輯、刪除與分頁瀏覽。
- 文章新增、編輯、刪除與分頁瀏覽。

## 使用技術

- React 18、Vite 6
- React Router（Hash Router）
- Axios
- Tailwind CSS 與專案自訂 CSS
- Lucide React 圖示

## 開始使用

### 需求

- Node.js 與 npm
- 可供本專案使用的後端 API

### 安裝與啟動

```bash
npm install
```

在專案根目錄新增 `.env` 檔案，設定 API 網址與商店代碼：

```env
VITE_API_URL=https://your-api-domain.com
VITE_API_PATH=your-store-path
```

`VITE_API_URL` 請填 API 主機網址，不要在結尾加上 `/`；`VITE_API_PATH` 請填商店代碼，不需加上 `/`。`.env.example` 提供變數格式範例；請將範例值換成實際 API 設定。修改 `.env` 後，重新啟動開發伺服器：

```bash
npm run dev
```

Vite 啟動後，依終端機顯示的網址開啟網站。前台資料載入和後台管理需要可連線且符合本專案 API 格式的後端服務。

## 網站路由

本專案使用 Hash Router，網址中的路徑會放在 `#` 之後，例如 `http://localhost:5173/#/products`。

| 路徑 | 頁面 |
| --- | --- |
| `/` | 首頁 |
| `/about` | 品牌介紹 |
| `/products` | 商品列表 |
| `/products/:id` | 商品詳細頁 |
| `/articles` | 旅行文章列表 |
| `/articles/:id` | 文章詳細頁 |
| `/cart` | 購物車頁面 |
| `/admin/AdminLogin` | 後台登入 |
| `/admin` | 商品管理 |
| `/admin/articles` | 文章管理 |
| `/admin/orders` | 訂單管理頁面 |

## 常用指令

| 指令 | 用途 |
| --- | --- |
| `npm run dev` | 啟動本機開發伺服器 |
| `npm run build` | 建置正式版檔案至 `dist/` |
| `npm run preview` | 在本機預覽正式版建置結果 |
| `npm run lint` | 執行 ESLint 檢查 |
| `npm run deploy` | 將 `dist/` 部署至 GitHub Pages 使用的 `gh-pages` 分支 |

部署前先執行 `npm run build`。目前正式環境的 Vite `base` 路徑設定為 `/202607_vite-project/`；若部署到其他儲存庫名稱或網域子路徑，請同步調整 `vite.config.js` 的 `base` 設定。

## 目前開發狀態

- 購物車頁目前顯示準備中訊息；雖然商品頁已提供加入購物車的 API 呼叫，購物車內容與結帳流程尚未完成。
- 訂單管理頁目前是佔位頁面。
- 商品與文章的排序選單目前只有介面，尚未套用排序結果。
- 首頁搜尋目前只記錄搜尋類型與關鍵字，尚未連接搜尋結果。
- 電子報表單目前尚未連接訂閱服務。

## 專案目錄

```text
src/
├── assets/       # 樣式、圖片與圖示資源
├── components/   # 共用元件
├── hooks/        # 自訂 React Hooks
├── pages/        # 前台頁面與 admin/ 後台頁面
├── routes/       # React Router 路由設定
├── App.jsx       # App 元件
└── main.jsx      # 應用程式進入點
```
