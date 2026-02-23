# Daily Log

## 2026-02-23

### 劃線筆記篩選與排序 Panel UI 修正

**1. [MODIFY] [bookmark.js](file:///d:/Projects/the-fictional-train/js/features/bookmark.js)**
- [Fix] 桌面版類型篩選按鈕 active 樣式：改用 **inline style**（`btn.style.backgroundColor/color`）取代 Tailwind 動態 class，徹底解決 JIT 動態 class 無效問題
  - 選中：`var(--bg-accent, #629BC1)` 背景 + 白字 + `font-weight:700`
  - 未選中：transparent 背景 + `var(--text-secondary, #666666)` 灰字
- [New] 新增 **UI 同步機制**：實作 `syncDesktopTypeUI` 並透過 `window.__syncDesktopTypeUI` 讓行動版 Drawer 套用時能即時更新桌面版樣式。
- [Fix] 桌面版初始化：修正 `initBookmarkFeature` 載入時未讀取當前篩選狀態的問題。
- [Update] 手機 Drawer 排序按鈕改為動態注入：
  - 選中的按鈕右方顯示 ↑（升冪）或 ↓（降冪）箭頭
  - 點選已選中的排序選項 → 切換升/降冪
  - 點選其他排序選項 → 切換排序方式（方向不重設）
- [Remove] 移除舊的獨立方向按鈕 `#bfd-sort-dir-btn` 邏輯

**2. [MODIFY] [Modals.js](file:///d:/Projects/the-fictional-train/js/components/Modals.js)**
- [Remove] 移除排序 section 中的靜態 `.bfd-sort-btn` 按鈕列與 `#bfd-sort-dir-btn` 按鈕
- [Update] `#bfd-sort-options` 改為空容器，由 JS 動態注入排序按鈕（含方向箭頭）

---

### 劃線顏色系統更新

#### 變更內容

**1. [MODIFY] [bookmark.js](file:///d:/Projects/the-fictional-train/js/features/bookmark.js)**
- [Update] 桌面版 `colors` array 顏色定義：由 yellow/green/blue/red/purple 改為 4 色
  - 粉色 `pink` → `#EA8192`，50% 不透明度
  - 藍色 `blue` → `#86E7D0`，50% 不透明度
  - 紫色 `purple` → `#B881E7`，50% 不透明度
  - 黃色 `yellow` → `#FFF500`，50% 不透明度
- [New] 新增 `colorSwatchStyle(c)` helper：依 `hex` 欄位產生 inline style，`all` 選項改用四色漸層
- [Update] `renderColorDropdownUI`：trigger preview 和 menu item 圓點改用 inline `style` 替代 Tailwind bg class
- [Update] 手機版 `BOOKMARK_COLORS` 常數同步改為相同 4 色 hex 格式
- [New] 新增 `bookmarkColorSwatchStyle(c)` helper（模組層，供 drawer 使用）
- [Update] Drawer color pill 的顏色 swatch 改用 inline style
- [Update] Drawer apply 時同步桌面版 trigger preview 改用 hex inline style

**2. [MODIFY] [books.js](file:///d:/Projects/the-fictional-train/js/data/books.js)**
- [Update] 範例資料中已廢棄的顏色值遷移：
  - `green` → `blue`（‹習慣是自我改善的複利› 劃線）
  - `red` → `pink`（‹好的領導者不是告訴別人做什麼› 筆記、‹WYSIATI› 劃線）
  - `green` → `purple`（‹System 1 operates automatically› 筆記）

---

### 手機版 Filter Drawer 重構（劃線筆記模組）

#### 變更內容

**1. [MODIFY] [Modals.js](file:///d:/Projects/the-fictional-train/js/components/Modals.js)**
- [New] 新增 `#bookmark-filter-drawer` 底部 Drawer：
  - 段落一：顯示類型（全部 / 劃線 / 筆記）`.bfd-type-btn`
  - 段落二：劃線顏色（`.bfd-color-options`，JS 動態注入顏色 pills）
  - 段落三：排序方式（依時間 / 書名 / 閱讀位置 `.bfd-sort-btn` + 方向切換 `#bfd-sort-dir-btn`）
  - 底部：「清除重設」`#bfd-reset-btn` + 「套用」`#bfd-apply-btn` 按鈕

**2. [MODIFY] [Bookmark.js](file:///d:/Projects/the-fictional-train/js/views/Bookmark.js)**
- [Update] Toolbar 重構為桌面/手機分離：
  - 桌面版 `hidden md:flex`：保留批次選取、劃線/筆記切換、顏色 dropdown、排序選單
  - 手機版 `md:hidden flex overflow-x-auto`（同一行）：批次按鈕 + 篩選按鈕 + 分隔線 + 書籍 capsule 容器（同行橫向捲動）
- [Remove] 移除原 mobile sort 按鈕（已整合至 drawer）
- [Remove] 移除原獨立的手機版 mobile-book-capsules-container 列（整合至手機 toolbar 同一行）

**3. [MODIFY] [bookmark.js](file:///d:/Projects/the-fictional-train/js/features/bookmark.js)**
- [Remove] 移除 `mobileSortBtn` 相關變數與 `initMobileSort(btn)` 的初始呼叫
- [New] 新增 `initMobileFilterPanel()`：綁定 `#mobile-filter-panel-btn` 點擊事件
- [New] 新增 `openBookmarkFilterDrawer()`：
  - 本地 draft state（類型、顏色、排序、方向），與 global state 分離
  - `renderDrawerUI()`：同步類型按鈕高亮、顏色段落禁用（僅筆記時關閉顏色）、顏色 pills、排序按鈕高亮、排序方向圖示
  - 套用 → 寫入 global state，同步桌面 color trigger UI，rerenderContent，關閉 Drawer
  - 重設 → 還原 draft state 到預設值，重新渲染 Drawer UI
- [Update] Batch 選取：新增 `toggleBatchMode(btn)` 共用函式，處理Desktop（`#notes-batch-select-btn`）與 Mobile（`#notes-batch-select-btn-mobile`）兩個按鈕
- [Update] `renderMobileBookCapsules`：移除 `window.innerWidth >= 768` 的桌面判斷（已靠 HTML `md:hidden` 控制），搜尋時清空容器

---



### 劃線筆記模組 Header RWD 調整

**[MODIFY] [Bookmark.js](file:///d:/Projects/the-fictional-train/js/views/Bookmark.js)**
- [Update] 標題 `<h1>劃線筆記</h1>` 加入 `hidden md:block`，手機版不顯示
- [Update] Header 容器改為 `flex items-center justify-between`，搜尋列手機版佔全寬（`w-full`），桌面版維持 `w-1/3`

---

### 書櫃搜尋列 UI 調整

#### 變更內容

**1. [MODIFY] [Bookshelf.js](file:///d:/Projects/the-fictional-train/js/views/Bookshelf.js)**
- [Update] 標題 `<h1>我的書櫃</h1>` 加入 `hidden md:block`，手機版不顯示標題
- [Update] 搜尋列從標題行右側搬移至 tabs 上方，成為獨立區塊（層級提升，橫跨所有 tab）
  - 手機版：全寬 `w-full`，搜尋列置頂
  - 桌面版：維持 `w-64` 寬度
- [New] 新增清除搜尋按鈕（`#bookshelf-search-clear`，X 圖示）
- [New] 新增搜尋結果容器 `#bookshelf-search-results`：
  - `#search-results-info`：搜尋結果數量提示文字
  - `#search-results-grid`：書籍卡片 Grid 排列
  - `#search-results-empty`：找不到結果的 empty state（含圖示說明）

**2. [MODIFY] [bookshelf.js](file:///d:/Projects/the-fictional-train/js/features/bookshelf.js)**
- [Remove] 移除 tab 切換時隱藏搜尋列的邏輯（搜尋列現在橫跨所有 tab）
- [Remove] 移除不再使用的 `searchContainer` 變數
- [New] 新增 `performSearch(query)` 搜尋功能：
  - 搜尋 BOOKS_DATA 全部書籍（含封存書籍），比對書名與作者
  - 有結果：隱藏 tabs & tab-content，顯示搜尋結果 Grid
  - 無結果：顯示 empty state
  - 清空輸入：恢復 tabs & tab-content
- [New] 搜尋 input 事件監聽（即時搜尋）
- [New] 清除按鈕點擊事件
- [New] 搜尋結果 Grid 的 click 事件代理（重用 `handleBookClick`）

---

### 書櫃模組分頁功能

#### 變更內容

**1. [NEW] [Pagination.js](file:///d:/Projects/the-fictional-train/js/components/Pagination.js)**
- 新建通用分頁元件，供書櫃三個分頁（全部書籍、自訂書單、封存區）共用
- 提供三個 API：
  - `createPaginationHTML(totalPages, currentPage, paginationId)` — 產生分頁列 HTML（上一頁按鈕、頁碼、省略號、下一頁按鈕）
  - `initPagination(containerId, onPageChange)` — 以事件委派方式綁定點擊事件，避免重複綁定
  - `renderPagination(containerId, totalPages, currentPage)` — 更新分頁列 HTML 並重新掛接 Lucide 圖示
- 支援超過 5 頁時顯示省略號，自動計算頁碼區間

**2. [MODIFY] [Bookshelf.js](file:///d:/Projects/the-fictional-train/js/views/Bookshelf.js)**
- 在三個分頁的書籍/書單容器下方分別加入分頁列容器：
  - `#all-books-pagination`（全部書籍）
  - `#collections-pagination`（自訂書單）
  - `#archived-pagination`（封存區）

**3. [MODIFY] [bookshelf.js](file:///d:/Projects/the-fictional-train/js/features/bookshelf.js)**
- 引入 `renderPagination`、`initPagination`
- **全部書籍**：
  - `render()` 新增分頁切片邏輯（Grid 每頁 24 本、List 每頁 20 本）
  - 呼叫 `renderPagination('all-books-pagination', ...)` 更新頁碼列
  - 初始化分頁點擊事件（`initPagination`）
  - 篩選/排序後重設 `allBooksCurrentPage = 1`
- **封存區**：
  - `renderArchivedBooks()` 新增分頁切片邏輯（同樣 24/20 本）
  - 呼叫 `renderPagination('archived-pagination', ...)`
  - 初始化分頁點擊事件
  - 篩選、視圖切換後重設 `archiveCurrentPage = 1`

**4. [MODIFY] [collections.js](file:///d:/Projects/the-fictional-train/js/features/collections.js)**
- 引入 `renderPagination`、`initPagination`
- `renderCollections()` 新增分頁邏輯（每頁 18 個書單卡片）
- 初始化書單分頁點擊事件（`initPagination`）

**5. [MODIFY] [components.css](file:///d:/Projects/the-fictional-train/css/components.css)**
- 新增 `.pagination`、`.pagination-pages`、`.pagination-btn`、`.pagination-ellipsis` 等 CSS 樣式
- `.pagination-btn--active`：當前頁碼高亮（accent 色背景）
- `.pagination-btn--disabled`：停用狀態（透明度降低）
- RWD：`@media (max-width: 640px)` 縮小按鈕尺寸，適應手機螢幕

---

## 2026-02-05


### 個人中心功能開發

#### 變更內容

**1. 修改使用者選單**

##### [MODIFY] [Header.js](file:///d:/Projects/the-fictional-train/js/components/Header.js)
- 更新下拉選單內容結構：
  - [Update] 主帳號顯示格式：`[灰熊] abcd123@gmail.com`
  - [New] 新增「已連結書店」區塊，以膠囊標籤顯示（`[讀冊]`、`[三民]`）
  - [Update] 「連結其他帳號」改為標題列右側的文字連結，減少視覺干擾
- [New] 新增按鈕事件監聽，支援跳轉功能

**2. 新增個人中心頁面結構**

##### [NEW] [PersonalCenter.js](file:///d:/Projects/the-fictional-train/js/views/PersonalCenter.js)
- 建立個人中心主頁面 View 模組
- 採用模組化設計，支援多區塊動態切換
- RWD 響應式設計：
  - 桌機版 (md+)：左側固定側邊欄 + 右側內容區
  - 手機版：頂部橫向滾動 Tab 列 + 全寬內容區
- 匯出 `openPersonalCenter(sectionId)` 函式供外部呼叫

##### [NEW] [AccountSection.js](file:///d:/Projects/the-fictional-train/js/components/personal-center/AccountSection.js)
- 帳號管理區塊元件
- 顯示書店帳號連結卡片（讀冊生活、三民書局、iRead 灰熊）
- 包含連結說明區塊
- 支援篩選：系統訊息、到期提醒、閱讀目標。

**8. 錯誤修復與優化**

- [Fix] 修正 `notifications.js` 缺失欄位導致的白屏問題（補回 `category` 與 `NOTIFICATION_CATEGORIES`）。
- [Fix] 修正 Personal Center 導覽列膠囊背景色與選取色衝突問題，改用 CSS 變數 `var(--bg-accent)` 確保顯示正確。

##### [NEW] [NotificationsSection.js](file:///d:/Projects/the-fictional-train/js/components/personal-center/NotificationsSection.js)
- 全部通知區塊元件
- 按時間排序顯示所有通知（最新在上）
- 顯示通知類型圖示（成功/警告/資訊）
- 未讀通知標記與「全部標為已讀」功能
- 點擊通知自動標記為已讀

**2. 修改通知下拉選單**

##### [MODIFY] [Header.js](file:///d:/Projects/the-fictional-train/js/components/Header.js)
- 在通知中心標題列新增「查看全部」連結
- 點擊連結後關閉下拉選單並跳轉至個人中心通知區塊
- 匯入並使用 `openPersonalCenter` 函式

**3. 整合至主程式**

##### [MODIFY] [main.js](file:///d:/Projects/the-fictional-train/js/main.js)
- 匯入 `createPersonalCenterHTML` 和 `initPersonalCenterEvents`
- 在 app layout 中加入個人中心頁面 HTML
- 初始化個人中心事件監聽

**4. 樣式更新**

##### [MODIFY] [components.css](file:///d:/Projects/the-fictional-train/css/components.css)
- 新增 `.personal-center-nav` 導覽列樣式
- 新增 `.scrollbar-hide` 隱藏滾動條樣式
- 新增 `.notification-card` 通知卡片懸停效果
- 新增 `.store-card-large` 大尺寸書店卡片樣式

**5. 文件更新**

##### [MODIFY] [SITEMAP.md](file:///d:/Projects/the-fictional-train/doc/SITEMAP.md)
- 新增個人中心頁面結構說明
- 更新通知下拉選單結構（加入「查看全部」連結）

---

## 2026-02-02

### 書籍 TTS 設定及詳情彈窗標籤列調整
(略...)

### 封存區篩選功能
(略...)

### 劃線筆記頁面優化
(略...)

### 展開式劃線卡片（方案 D）與樣式調整

#### 變更內容

**1. [bookmark.js](file:///d:/Projects/the-fictional-train/js/features/bookmark.js) - `createNoteCard` 重構**
- 實作雙狀態卡片結構：**收合** 與 **展開**
- 收合狀態：筆記以純文字顯示
- [Update] 編輯按鈕設計調整：
  - 位置：移至卡片**右下角**，與日期並列
  - 圖示：改為 **帶框筆圖示** (`square-pen`)
  - 行為：點擊後展開卡片，隱藏此按鈕
- 展開狀態：
  - 筆記區變為可編輯 `<textarea>`
  - 底部 Action Bar 顯示：取消、儲存、分享、刪除
  - "取消" 操作會還原內容並恢復收合狀態 (重新顯示編輯按鈕)

**2. [bookmark.js](file:///d:/Projects/the-fictional-train/js/features/bookmark.js) - 樣式修正**
- [Fix] 修正儲存按鈕 (`.btn-save-edit`) 樣式，將背景色由 `bg-accent` 改為 `bg-blue-600` 以確保可見性
- [Fix] 修正顏色下拉選單在滾動容器中被裁切的問題 (使用 Fixed Positioning)
- [Update] 優化手機版體驗：點擊顏色選單時，使用底部滑出面板 (Drawer/Bottom Sheet) 顯示選項，保持與排序選單一致的互動體驗

**3. [bookmark.js](file:///d:/Projects/the-fictional-train/js/features/bookmark.js) - 事件處理更新**
- 新增 `expandCard()` / `collapseCard()` 輔助函式，支援新的 Footer UI 切換邏輯
- 新增展開/收合切換邏輯 (`.btn-toggle-expand`)
- 新增取消與儲存編輯邏輯

### 手機版書名膠囊篩選

**1. [Bookmark.js](file:///d:/Projects/the-fictional-train/js/views/Bookmark.js)**
- 新增 `#mobile-book-capsules-container` 容器，位於篩選列下方

**2. [bookmark.js](file:///d:/Projects/the-fictional-train/js/features/bookmark.js)**
- 新增 `renderMobileBookCapsules()` 函式
- 預設顯示 5 顆書名膠囊，點選可篩選該書筆記
- 超過 5 本書時，顯示 "..." 按鈕，點擊後以 Drawer 形式顯示所有書籍
- [Update] 統一書名膠囊樣式，與搜尋結果樣式一致 (`bg-accent/10` 選中, `bg-gray-50` 未選)
- [Update] Drawer 內改為膠囊形式，支援複選並提供「清除選擇」與「確認」按鈕
- [Fix] 膠囊樣式改為包含書封縮圖 + 書名，選中狀態使用 `bg-accent` + `ring-2`
- [Fix] 確認按鈕背景色改為 `bg-blue-600` 確保可見性
