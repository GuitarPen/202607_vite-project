# React、Tailwind CSS 4 與 CSS 學習速查

整理：2026-09-11。供跨專案參考，ROADKIT 只作範例。這是討論重點摘要，不是逐字聊天紀錄。當前專案進度見 [handoff.md](handoff.md)。

## 1. React 元件與重複內容

- pages 通常對應整個路由頁面；components 放功能區塊或圖示，兩者本質上都是 React 元件。
- 元件不必使用多次才值得拆：功能獨立、狀態獨立、JSX 過長，都可以拆。
- 例：Layout 負責 footer 排版，NewsletterForm 負責表單，ArrowIcon 負責 SVG。
- 不同內容、相同結構可用資料陣列 + `.map()`；最外層回傳元素需要穩定的 key。

```jsx
const links = [
  { id: 'about', label: '關於我們', to: '/about' },
  { id: 'products', label: '商品', to: '/products' },
]

<ul className="flex gap-4">
  {links.map(link => (
    <li key={link.id}>
      <Link to={link.to}>{link.label}</Link>
    </li>
  ))}
</ul>
```

分組導覽用兩層 map：外層群組、內層 links。服務資料的 icon 若是圖片網址，用 `<img src={service.icon} alt="" />`；若存 JSX 元件，用 `{service.icon}`。

## 2. 連結、按鈕與表單

| 情境 | 使用方式 |
|---|---|
| 站內路由 | Link |
| 站內導覽，需要選中狀態 | NavLink，以 isActive 決定 class |
| 外部社群、mailto、tel | 原生 a |
| 執行動作 | button |
| 表單送出 | button type="submit" |

- Link／NavLink 最後會產生 a，都能加 title。
- `title` 是額外提示；只有圖示的操作元素用 `aria-label` 提供名稱，內部裝飾 SVG 用 `aria-hidden="true"`。
- 外部另開分頁：`target="_blank" rel="noopener noreferrer"`。
- 表單 label 的 `htmlFor` 對應 input 的 id；不要只靠 placeholder 取代 label。
- `preventDefault()` 只是阻止預設送出，不代表已完成訂閱。

## 3. Tailwind 主題與共用樣式

Tailwind 是 CSS 工具類別；React 使用 className，HTML 使用 class。

```css
@import 'tailwindcss';

@theme {
  --color-brand: #4a7c59;
  --font-moderustic: 'Moderustic', sans-serif;
  --tracking-brand: 0.15em;
}
```

| 主題設定 | 使用方式 |
|---|---|
| --color-brand | text-brand、bg-brand、border-brand |
| --font-moderustic | font-moderustic |
| --tracking-brand | tracking-brand |

名稱可依用途命名：brand 品牌色、sand 沙色、paper 紙色、ink 深色內文、accent 強調色。主題變數也可在 CSS 以 `var(--color-brand)` 使用。

- `@theme` 是 Tailwind 專用；`@layer` 是原生 CSS。
- `@layer base` 放全站基本樣式；`@layer components` 放自訂共用 class。
- 一般宣告的 utilities 層可覆寫 components 層；未分層的一般樣式優先於分層樣式。`!important` 的層順序相反。
- 重複的外觀可抽 CSS class；重複的結構可用 map 或元件，不必每種需求都拆元件。

## 4. 常用 Tailwind 對照

數字間距依預設 `--spacing: 0.25rem` 換算；下列 px 換算假設根字級 16px。

| Class | CSS／用途 |
|---|---|
| flex／grid | display: flex／grid |
| items-center | align-items: center |
| justify-between | justify-content: space-between |
| flex-col／flex-wrap | 垂直排列／允許換行 |
| gap-4 | gap: 1rem |
| p-4 | 四邊 padding: 1rem |
| px-6 | padding-inline: 1.5rem |
| py-5 | padding-block: 1.25rem |
| mt-4／mx-auto | 上方 margin／左右自動 margin |
| h-5 w-5／size-5 | 寬高各 1.25rem（20px） |
| min-w-0 flex-1 | 允許 Flex 項目縮小並占剩餘空間 |
| shrink-0 | 不因 Flex 空間不足而縮小 |
| border border-brand | 邊框寬度與顏色分開設定 |
| text-brand/20 | 品牌色 20% 不透明度 |
| sr-only | 視覺隱藏但保留給輔助工具 |

`h-[40px]` 是合法固定尺寸；編輯器建議 h-10 是簡化提示，不是錯誤。重複寫 pl-3 也不會加倍內距，保留一次即可。

### 容器

- 內建 `container`：width 100%，最大寬度跟隨斷點，**不含置中或左右內距**。
- 常見寫法：`container mx-auto px-4`。
- `max-w-6xl` 是固定最大寬度 72rem，與 container 的階段式寬度不同。
- 若已有 site-container，通常不再同時加 container，避免寬度規則重疊。

```css
@layer components {
  .site-container {
    width: 100%;
    max-width: 1280px;
    margin-inline: auto;
    padding-inline: 1rem;
  }
  @media (min-width: 48rem) {
    .site-container { padding-inline: 2rem; }
  }
}
```

### 響應式與狀態

- 無前綴是基礎樣式；sm、md、lg 表示該寬度以上，並非特定裝置。
- 預設斷點：sm 40rem、md 48rem、lg 64rem、xl 80rem、2xl 96rem。
- `grid grid-cols-1 md:grid-cols-3`：一欄，達 md 後三欄。
- `hover:*` 滑鼠移入；`focus-visible:*` 焦點提示；`disabled:*` 停用外觀。

## 5. 字型、字重、字級、行高與字距

```jsx
<p className="font-moderustic text-base font-medium leading-relaxed tracking-[0.15em]">
  ROAD TRIP ESSENTIALS
</p>
```

| 項目 | 範例 | 意思 |
|---|---|---|
| 字型 | font-moderustic | 選擇字型家族 |
| 字重 | font-normal／medium／bold | 400／500／700 |
| 字級 | text-sm／base／xl／2xl | 0.875／1／1.25／1.5rem |
| 行高 | leading-tight／normal／relaxed／loose | 1.25／1.5／1.625／2 倍 |
| 字距 | tracking-tight／normal／wide／wider／widest | -0.025／0／0.025／0.05／0.1em |

- text-* 字級類別附帶預設行高，可另外用 leading-* 調整。
- 行高是行盒高度，不是兩行間額外插入的空白。
- Figma 字距 15% → `letter-spacing: 0.15em` → `tracking-[0.15em]`。
- 自訂固定數值：`text-[28px] leading-[36px] tracking-[1px]`。
- 定義字型名稱不等於下載字型；須載入字型檔或 Google Fonts。
- Google Fonts URL 的 `wght@400;500;700` 表示要求載入的字重；字級不用逐個載入。
- DevTools Computed 查看最終樣式；Rendered Fonts 確认實際字型。

## 6. 圖片與背景

- 固定素材可放 `src/assets/images`，經 Vite import 處理路徑。
- Layout.jsx：`import image from './assets/images/example.svg'`。
- pages/Home.jsx：路徑改成 `../assets/images/example.svg`。
- JSX：`<img src={image} alt="描述" />`；純裝飾圖片可用空 alt。
- public 圖片不需 import；部署有子路徑時，可用 `import.meta.env.BASE_URL + 'images/example.svg'`，網址不含 public。
- CSS url 相對於 CSS 檔案，例如 all.css 使用 `url('./images/service_bg.jpg')`。
- 背景圖不會撐開區塊高度；bg-cover 可能裁切圖片，bg-center 控制位置。

### 背景透明度與偽元素

整個 section 使用 opacity 會讓文字也變淡；只讓背景變淡時，獨立一層或用 ::before。

```css
@layer components {
  .service-background {
    position: relative;
    isolation: isolate;
    background-color: var(--color-brand);

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      background: url('./images/service_bg.jpg') center / cover no-repeat;
      opacity: 0.1;
    }
  }
}
```

## 7. SVG 與 Icon 元件

- 直接將 SVG 貼進 JSX 不需套件；抽成檔案後匯入 React 元件。
- 保留原 SVG 的 viewBox、path d、必要 fill／stroke 設定。
- JSX 改名：class → className、stroke-width → strokeWidth、stroke-linecap → strokeLinecap、fill-rule → fillRule。
- aria-* 與 data-* 保留連字號。
- `currentColor` 使用 CSS color；Tailwind text-brand 可以控制採 currentColor 的 SVG。
- 線框用 stroke，實心用 fill；原本的 fill="none" 不要全部換掉。
- 共同 stroke／strokeWidth 可放在 svg，由 path 繼承；path 自己的設定會覆寫繼承值。

```jsx
function ArrowIcon({ className = 'h-5 w-5 stroke-2' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      className={className} aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  )
}
```

- 此寫法外部 className 會取代預設值，不會自動合併。
- stroke-current 對應 stroke=currentColor；stroke-2／stroke-[1.5] 控制線寬。
- a 的 size-10 是連結範圍，內部 Icon 的 size-5 是圖示尺寸。
- 透過 img 載入的 SVG，外部 text-* 通常不能控制內部顏色。
- Lucide 以線框為主，填色並非完整支援的實心圖示系列。
- Bootstrap Icons 有 person-fill、cart-fill；可直接複製 SVG，無須引入 Bootstrap CSS。
- Iconify 集合多套圖示：可複製 SVG，或用 @iconify/react；以名稱字串載入時預設會向 API 取資料。各圖示集授權不同。

### 自訂虛線

CSS border-dashed 不能精準指定每段 dash／gap；SVG 可用 strokeDasharray。

```jsx
<svg width="100%" height="4" className="text-brand" aria-hidden="true">
  <line x1="0" y1="2" x2="100%" y2="2"
    stroke="currentColor" strokeWidth={2} strokeDasharray="8 6" />
</svg>
```

8 6 表示畫 8、空 6。此例不設 viewBox，容器變寬時增加段數。線条置於足夠高度內，避免上下被裁切。也能改用 CSS repeating-linear-gradient 製作單邊分隔線。

## 8. 原生 CSS 補充速查

這些功能並非全部在 2021 年後發明；部分較早存在，近年才跨瀏覽器普及。使用前查閱官方文件的支援表。

| 功能 | 重點／何時查 |
|---|---|
| padding-inline | 沿文字行進方向的內距；橫書通常是左右 |
| padding-block | 沿換行方向的內距；橫書通常是上下；不動另一方向 |
| Flex gap | 父容器管理項目間距，不加首尾留白；不同於 padding |
| aspect-ratio | 固定圖片／卡片比例，至少一個尺寸需自動計算 |
| svh／lvh／dvh | 手機工具列影響視窗高度時查；小／大／動態視窗 |
| text-wrap: balance | 短標題換行更平均 |
| scrollbar-gutter: stable | 預留傳統捲軸空間，減少左右跳動 |
| @container | 依元件容器寬度調整內部排版，先設 container-type |
| subgrid | 子 Grid 沿用父層欄／列線 |
| :has() | 根據內部元素或狀態選取父層等元素 |
| CSS Nesting | 原生巢狀樣式，&::before 指父選擇器自己的偽元素 |
| @layer | 管理樣式層級與覆寫順序 |
| color-mix() | 混合顏色，例如品牌色加白色 |
| isolation: isolate | 建立堆疊上下文，讓區塊的 z-index 分組；不等於裁切 |
| pointer-events: none | 裝飾層不作為指標目標；不等於 disabled，也不阻止鍵盤聚焦 |
| inset | top/right/bottom/left 簡寫；一般非 static 定位才生效，不是 padding |

`relative` 提供常見的絕對定位基準；`absolute inset-0` 在未限制尺寸等條件下鋪滿容器；overflow-hidden 才用來裁切溢出。

```css
.menu { display: flex; gap: 24px; padding-inline: 16px; }
.image { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }
.page { min-height: 100dvh; }
.title { text-wrap: balance; }
.option:has(input:checked) { border-color: green; }
```

## 9. 編輯器提示

- Unknown at rule @theme：確認 Tailwind CSS IntelliSense 與 Tailwind CSS 語言模式。
- Noto Unknown word / cSpell：拼字提示，不是 CSS 錯誤；workspace 字典只作用於工作區，user 字典跨專案。
- 行首紅色區塊可能來自縮排顯色外掛。格式化使用 2 格、外掛預期 4 格時會不一致，需先確認設定，不能只憑顏色斷定語法錯誤。
- Tailwind 建議較短的 class 寫法通常是提示；重複 class 可移除。
- 以 DevTools 檢查實際 CSS、覆寫與尺寸，比只看 class 名稱可靠。

## 10. 官方參考

- [Tailwind 主題](https://tailwindcss.com/docs/theme)、[自訂樣式](https://tailwindcss.com/docs/adding-custom-styles)
- [字型](https://tailwindcss.com/docs/font-family)、[字距](https://tailwindcss.com/docs/letter-spacing)
- [Padding](https://tailwindcss.com/docs/padding)、[Gap](https://tailwindcss.com/docs/gap)、[容器最大寬度](https://tailwindcss.com/docs/max-width)
- [Google Fonts CSS API](https://developers.google.com/fonts/docs/css2)
- [React 列表渲染](https://react.dev/learn/rendering-lists)
- [Lucide React](https://lucide.dev/guide/react)、[Lucide 填色限制](https://lucide.dev/guide/react/advanced/filled-icons)
- [Bootstrap Icons](https://icons.getbootstrap.com/)、[Iconify React](https://iconify.design/docs/icon-components/react/)
- [MDN CSS 參考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)
- [MDN isolation](https://developer.mozilla.org/en-US/docs/Web/CSS/isolation)、[pointer-events](https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events)、[inset](https://developer.mozilla.org/en-US/docs/Web/CSS/inset)
- [Vite 靜態部署](https://vite.dev/guide/static-deploy)
