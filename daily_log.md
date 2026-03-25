# Daily Log

## 2026-03-25

### 常見問題擴充與分類功能

**1. [MODIFY] [FaqSection.js](file:///d:/Projects/the-fictional-train/js/components/personal-center/FaqSection.js)**
- [Feature] 在常見問題清單 `FAQ_DATA` 中新增三個問題（包含更改密碼、支援裝置、QR Code 掃描問題）。
- [UIUX] 新增 `FAQ_CATEGORIES` 定義分類（全部問題、帳號與同步、功能與操作、障礙排除），並於問題卡片中加上對應的分類標籤。
- [Feature] 在常見問題標題旁新增「問題分類」下拉選單，並在 `initFaqSectionEvents` 中實裝根據分類即時過濾及重新渲染 FAQ 列表的邏輯（含重新呼叫 `lucide.createIcons()`）。
## 2026-03-19

### 帳號管理與書櫃品牌正名修復

**1. [MODIFY] [AccountSection.js](file:///d:/Projects/the-fictional-train/js/components/personal-center/AccountSection.js)**
- [UIUX] 簡化單一書店模式下的目前登入方式卡片，移除多餘的「已連結：書店名稱」文字，提升介面簡潔度。
- [Fix] 在 `createSingleModeHTML` 與 `createLinkedStoreTagsHTML` 中加入正名兼容層，確保即使資料中含有舊名稱（如「iRead 灰熊」），在帳號管理介面中也會正確顯示為「灰熊愛讀書」。

**2. [MODIFY] [bookshelf.js](file:///d:/Projects/the-fictional-train/js/features/bookshelf.js)**
- [Clean] 修正書櫃過濾邏輯中的舊名稱殘留，將原本轉譯為 `iRead` 的邏輯修正為統一使用 `灰熊愛讀書`。

### Header 品牌正名修復

**1. [MODIFY] [Header.js](file:///d:/Projects/the-fictional-train/js/components/Header.js)**
- [Fix] 在 `updateHeaderLoginMode` 函式中加入正名兼容層，確保若 LocalStorage 存有舊名稱（如「iRead 灰熊」或「灰熊」）時，Header 登入模式標籤仍會正確顯示為「灰熊愛讀書登入」。

### 登入幫助彈窗優化

**1. [MODIFY] [Login.js](file:///d:/Projects/the-fictional-train/js/views/Login.js)**
- [UIUX] 移除登入幫助彈窗（login-help-modal）底部的「前往完整常見問題」按鈕及其容器，簡化幫助資訊呈現。
- [Clean] 同步移除 `initLoginEvents` 中針對 `goToFaqBtn` 的事件監聽與相關頁面跳轉邏輯，確保程式碼乾淨且無冗餘引用。

---

## 2026-03-16

### 品牌正名：iRead 灰熊更名為「灰熊愛讀書」

- 全專案正名：將所有程式碼、模擬資料、UI 標籤及文件中的「iRead 灰熊」、「灰熊 iRead」及單獨的「灰熊」字樣統一正名為「灰熊愛讀書」。
- 涉及文件：
    - `js/views/Login.js`
    - `js/views/Bookshelf.js`
    - `js/data/books.js`
    - `js/features/bookshelf.js`
    - `js/components/Modals.js`
    - `js/components/personal-center/AccountSection.js`
    - `doc/PRD`
    - `daily_log.md`

### Header 調整：登入模式標籤與帳號管理按鈕優化
(其餘內容保持不變，但在內容中將灰熊相關稱呼正名)

**1. [MODIFY] [Header.js](file:///d:/Projects/the-fictional-train/js/components/Header.js)**
- **[Update] 登入模式標籤 (`updateHeaderLoginMode`)**：
    - 將「裝置登入」更名為「裝置登入模式」。
    - 將登入模式標籤（裝置登入模式、書店登入）改為純文字顯示，移除點選效果、懸停樣式及右側箭頭圖示，使其符合純資訊展示之需求。
- **[Refactor] 帳號管理按鈕 (`createHeaderHTML`)**：
    - 移除原本頭像按鈕的下拉選單功能。
    - 將按鈕樣式改為「圖示 + 文字（帳號管理）」，提升功能辨識度。
- **[Update] 右側元件排序**：
    - 調整 Header 右側元件順序為：登入方式標籤、通知按鈕、帳號管理按鈕。
- **[Clean] 程式碼清理**：
    - 移除不再使用的 `DROPDOWN_CONTENT` 常數及其相關的事件綁定邏輯。
    - 更新 `initHeaderEvents`，將帳號管理按鈕改為直接點擊跳轉至個人中心的帳號設定頁面。

---


### 帳號管理：單一書店模式新增切換書店區塊與 QR 掃描跳轉首頁

**1. [MODIFY] [AccountSection.js](file:///d:/Projects/the-fictional-train/js/components/personal-center/AccountSection.js)**

- **[New] `ALL_STORES` 常數**：統一定義平台支援的四家書店（三民書局、讀冊生活、灰熊愛讀書、HyRead），供切換書店按鈕生成使用。
- **[New] `createSwitchStoreBlockHTML(currentStore)`**：在 `single` 模式帳號管理頁新增「區塊二：切換書店登入」，動態排除目前已登入書店，以 3 欄 Grid 呈現其他可切換的書店卡片。
- **[Update] `createSingleModeHTML(authState)`**：調整三區塊排版：
  - 區塊一：目前登入方式（維持原狀）
  - 區塊二：切換書店（新增，FR-ACCT-SWITCH）
  - 區塊三：同步多家書櫃 QR Code（維持原狀）
- **[Fix] QR Code 掃描成功後跳轉首頁**：`#acct-qr-simulate-btn` 點擊後呼叫 `loginWithDevice()`，再呼叫 `switchView('homepage')` 跳回首頁（原本停留在帳號頁重新渲染）。
- **[New] 切換書店事件**：`bindInternalEvents()` 中新增 `.acct-switch-store-btn` 點擊事件，彈出確認對話框後呼叫 `loginWithStore(storeName)`，`auth-state-changed` 事件觸發帳號管理區塊自動重新渲染。
- **[New] import `switchView`**：從 `../../router.js` 引入 `switchView`，供 QR 掃描成功後跳轉使用。

---

### 登入頁面進入流程保護（路由守衛）

**1. [MODIFY] [auth.js](file:///d:/Projects/the-fictional-train/js/features/auth.js)**
- **[New] `isLoggedIn()`**：新增輔助函數，方便 router 快速查詢登入狀態，避免每次解構 `getAuthState()`。

**2. [MODIFY] [router.js](file:///d:/Projects/the-fictional-train/js/router.js)**
- **[Refactor] `switchView` 改為 `export`**：讓其他模組（Login.js、AccountSection.js）可直接呼叫。
- **[Feature] 初始路由守衛**：`initRouter()` 時若 `!isLoggedIn()`，改呼叫 `openLoginView()` 而非預設進入首頁。
- **[Feature] switchView 路由守衛**：每次 `switchView()` 執行前先檢查 `isLoggedIn()`，未登入則攔截導向登入頁。
- **[New] import `openLoginView` 與 `isLoggedIn`**：從 `Login.js` 與 `auth.js` 引入。

**3. [MODIFY] [Login.js](file:///d:/Projects/the-fictional-train/js/views/Login.js)**
- **[Update] 書店登入成功後**：改用 `switchView('homepage')` 取代 `nav-link.click()`，確保流程一致。
- **[Update] QR Code 掃描成功後**：同上，改用 `switchView('homepage')`。
- **[New] import `switchView`**：從 `../router.js` 引入。

**4. [MODIFY] [main.js](file:///d:/Projects/the-fictional-train/js/main.js)**
- **[Fix] 初始化順序調整**：將 `initAuthFeature()` 移至 `initRouter()` 之前，確保路由初始化時 `isLoggedIn()` 可讀到正確的 localStorage 狀態。



### 帳號管理頁面（Account Management）三狀態 UI 改寫

**1. [MODIFY] [AccountSection.js](file:///d:/Projects/the-fictional-train/js/components/personal-center/AccountSection.js)**

完整改寫 `createAccountSectionHTML`、`renderAccountSection` 與事件綁定邏輯，依 `loginMethod` 動態渲染三種完全不同的帳號管理畫面：

- **[Feature] 未登入狀態**：
  - 顯示「未登入」狀態標頭。
  - 提供「使用其他書店帳號連結」區塊（含前往登入頁按鈕）。
  - 提供「使用書紐 App 一鍵同步」QR Code 區塊。

- **[Feature] 書店帳號登入 (`single`) 狀態（FR-ACCT-01, 02, 03）**：
  - 顯示「透過 {linkedStores[0]} 帳號登入」及已連結書店清單。
  - 顯示 QR Code 區塊（含 90 秒倒數計時、重新整理按鈕、模擬掃描按鈕），掃描後 `loginMethod` 升級為 `device`，合併現有書店清單。
  - 顯示紅色「登出」按鈕，點擊後彈出確認對話框「確定要安全登出您的帳號嗎？」，確認後清除狀態並導回登入頁。

- **[Feature] 裝置登入 (`device`) 狀態（FR-ACCT-04, 05, 06）**：
  - 顯示「透過信任裝置登入」狀態標頭（藍色主題）。
  - 以唯讀 tag 形式呈現所有 `linkedStores`（依書店名稱對應顏色標籤）；無書店時顯示「尚無同步紀錄」。
  - 顯示注意說明「書店連結由 App 端管理，如需變更請至書紐 App 操作」。
  - 隱藏所有連結操作入口，僅保留「解除此裝置連結」按鈕，點擊後彈出確認對話框「確定要解除此裝置的信任連結嗎？解除後需重新登入。」，確認後清除狀態並導回登入頁。

- **[Refactor] QR Code 計時器模組**：
  - 新增模組層級 `qrTimerInterval`、`qrTimeLeft`、`qrExpired` 狀態管理。
  - `startQrTimer(container)` 重置並啟動倒數；`stopQrTimer()` 清除計時器（切換頁面或登入狀態改變時呼叫）。
  - `updateQrDisplay(container)` 依計時狀態更新倒數文字、狀態訊息、掃描線顯示與按鈕禁用狀態（規格對應 FR-LOGIN-02 與 FR-ACCT-02）。

- **[Style] 掃描線動畫**：使用 `animation: scan 2.5s ease-in-out infinite`，與 Login.js 同一套 `@keyframes scan` 定義，確保視覺一致性。

- **[Refactor] 事件重構**：移除舊有的 `createStoresListHTML`、`store-status-btn` 委派邏輯，改為各狀態各自獨立的 `#acct-logout-btn`、`#acct-unlink-btn`、`#acct-qr-refresh-btn`、`#acct-qr-simulate-btn`、`#acct-goto-login-btn` 精確選取，避免跨狀態污染。

## 2026-03-04

### 文件更新 (PRD & Sitemap)

**1. [MODIFY] [PRD](file:///d:/Projects/the-fictional-train/doc/PRD)**
- [Update] 更新首頁段落：移除每日閱讀目標設定，改為描述今日閱讀時間與閱讀成就（本月讀完本數）。
- [Update] 更新帳號與登入機制段落：詳述「雙軌登入模式」（單一書店與載具登入）及個人帳號管理、新版獨立登入頁面（左右分割/垂直佈局與 QR Code）。
- [New] 新增全域元件段落：記錄新加入的底部頁尾 (Footer) 與問題回報 (Issue Report) 彈窗邏輯（如：系統問題連動書本來源）。

**2. [MODIFY] [SITEMAP.md](file:///d:/Projects/the-fictional-train/doc/SITEMAP.md)**
- [Update] 主要頁面結構中新增「登入頁面 (Login)」，包含單一書店與載具驗證分支。
- [Update] 在全域架構中加入「全域底部頁尾 (Footer)」。
- [Update] 首頁架構更新，以「閱讀成就統計」取代原有的設定目標按鈕。
- [Update] 個人中心架構重構，細分帳號管理區塊的「模式切換」與「載具/單一書店視圖」，並移除靜態寫死的閱讀目標設定。
- [Update] 彈出視窗 (Modals) 表格新增 `issue-report-modal` 與 `login-qr-modal`。

### 問題回報彈窗欄位與邏輯調整

**1. [MODIFY] [Modals.js](file:///d:/Projects/the-fictional-train/js/components/Modals.js)**
- [UIUX] 於「問題回報」彈窗新增「聯絡信箱」文字輸入框。
- [UIUX] 將「涉及書店」文字修改為「書本來源」，並取消必填設定。
- [UIUX] 將「問題描述」設定為必填欄位 (標示 `*` 與 `required` 屬性)。

**2. [MODIFY] [main.js](file:///d:/Projects/the-fictional-train/js/main.js)**
- [Logic] 新增「問題回報」彈窗的表單互動邏輯：當「問題類型」選擇「系統問題」時，自動將「書本來源」鎖定為「無」，且其餘選項轉為不可選狀態（加上半透明與禁止點擊樣式）；選擇「書本問題」時則恢復正常。

### 問題回報彈窗欄位調整

**1. [MODIFY] [Modals.js](file:///d:/Projects/the-fictional-train/js/components/Modals.js)**
- [UIUX] 於「問題回報」彈窗的「涉及書店」區塊新增「無」的選項。
- [UIUX] 於「問題回報」彈窗新增「書本名稱/ISBN編碼」之文字輸入框。
- [UIUX] 隱藏「問題回報」彈窗中的「系統資訊」區塊。

### 登入頁面調整

**1. [MODIFY] [Login.js](file:///d:/Projects/the-fictional-train/js/views/Login.js)**
- [UIUX] 桌面版改為左右分割佈局：左側新增 App 下載引導區塊（品牌 Logo、主標題文案、功能亮點列表、App Store / Google Play 下載按鈕），右側放置原有登入卡片。
- [UIUX] 重新整合手機版版面：將主要登入卡片與 App 下載引導區塊合併為單一卡片視覺，並隱藏手機版重複的品牌圖示與功能亮點，簡化畫面長度以提升行動端體驗。
- [UIUX] 桌面版登入卡片內隱藏品牌圖示（已於左側呈現），手機版仍正常顯示。
- [Logic] 點擊「裝置登入 (多帳號)」按鈕後，不再使用 `alert()`，改為彈出 QR Code 掃描視窗 (`#login-qr-modal`)。
- [New] 新增 QR Code 掃描彈窗，包含掃描說明、QR Code 圖示、「取消」及「模擬掃描成功」按鈕，成功後導回首頁。
- [New] 在登入頁左側的 App Store 與 Google Play 下載按鈕旁，各新增一個桌機版專屬的 QR Code 圖示，方便電腦使用者直接掃描下載應用程式。

## 2026-03-03

### 書櫃書封顯示來源標籤

**1. [MODIFY] [bookshelf.js](file:///d:/Projects/the-fictional-train/js/features/bookshelf.js)**
- [UIUX] 在書櫃的網格視圖與列表視圖中，將書籍來源（如：讀冊、三民）標籤疊加顯示於書封圖片的左下角。

## 2026-03-02

### Footer 新增問題回報彈窗

**1. [MODIFY] [Footer.js](file:///d:/Projects/the-fictional-train/js/components/Footer.js)**
- [UIUX] 將 Footer 頁尾的「客服信箱」連結更改為「問題回報」按鈕。
- [Logic] 取消原有的 `mailto:` 連結，改為綁定 `data-modal-target="issue-report-modal"` 以觸發問題回報彈窗。

**2. [MODIFY] [Modals.js](file:///d:/Projects/the-fictional-train/js/components/Modals.js)**
- [New] 於 `createModalsHTML` 中新增 `#issue-report-modal` 結構，提供使用者填寫問題回報。
- [UIUX] 彈窗內包含「系統資訊」區塊（裝置名稱、系統版本、APP版本預設值帶入）。
- [UIUX] 提供單選按鈕讓使用者選擇「問題類型」（系統問題、書本問題）以及「涉及書店」（灰熊愛讀書、讀冊、三民）。
- [UIUX] 提供文字輸入框讓使用者簡述問題內容，並包含一個點擊上傳截圖的拖曳/上傳區塊。
- [UIUX] 於表單底部附上客服信箱資訊，供進階協助使用。

## 2026-02-26

### 移除教學資源更新相關功能

**1. [MODIFY] [Modals.js](file:///d:/Projects/the-fictional-train/js/components/Modals.js)**
- [UIUX] 於書籍資訊彈窗標籤列中，將原本的「新教學資源」標籤更名為「有教學資源」，並將背景色由紅色 (`bg-red-100`) 調整為藍色 (`bg-blue-100`)。

**2. [MODIFY] [bookshelf.js](file:///d:/Projects/the-fictional-train/js/features/bookshelf.js)**
- [Logic] 取消判斷 `teachingResources.hasNew` 來決定標籤顯示的邏輯，改為只要該書籍有 `teachingResources` 即顯示該「有教學資源」標籤。
- [UIUX] 移除了在附件與參考連結卡片中顯示紅底白字 `NEW` 標記的邏輯。

**3. [MODIFY] [books.js](file:///d:/Projects/the-fictional-train/js/data/books.js)**
- [Data] 刪除了 `BOOKS_DATA` 模擬資料中，`teachingResources` 內的 `hasNew` 與陣列項目內的 `isNew` 屬性。

**4. [MODIFY] [notifications.js](file:///d:/Projects/the-fictional-train/js/data/notifications.js)**
- [Data] 從 `NOTIFICATIONS_DATA` 模擬資料中移除 ID 為 7 的「教學資源更新」假通知設定。

### 調整通知類型與簡化分類

**1. [MODIFY] [notifications.js](file:///d:/Projects/the-fictional-train/js/data/notifications.js)**
- [Logic] 將 `NOTIFICATION_CATEGORIES` 陣列精簡，僅保留「全部」、「系統訊息 (system)」與「到期提醒 (expiry)」。
- [Data] 從 `NOTIFICATIONS_DATA` 模擬資料中移除原屬於 `reading-goal` 分類的所有假資料（目標達成與本週報告），貫徹功能改版後單純依靠圖表與成就顯示而非推播通知的設計。

### 新增多語系切換選單

**1. [MODIFY] [Footer.js](file:///d:/Projects/the-fictional-train/js/components/Footer.js)**
- [UIUX] 於 Footer 區域新增多語系切換選單 (Language Switcher)，提供繁體中文、English、日本語等選項，目前僅作 UI 展示，尚未實質綁定切換邏輯。
- [Style] 調整原有的「關於我們」與「客服信箱」佈局，使其與語系切換選單在桌面與手機版都能保持良好的間距與對齊方式。


## 2026-02-25

### 新增全域 Footer 頁尾區塊

**1. [NEW] [Footer.js](file:///d:/Projects/the-fictional-train/js/components/Footer.js)**
- [UIUX] 新增共用的 Footer 頁尾元件，提供「關於我們」(連結至官方網站) 與「客服信箱」(mailto 連結) 兩個基本超連結。
- [Style] 設計為簡潔的底部留白區塊，文字置中，符合整體響應式 (RWD) 佈局，於手機版與桌面版均能置底顯示。

**2. [MODIFY] [main.js](file:///d:/Projects/the-fictional-train/js/main.js)**
- [Update] 於主程式中匯入 `createFooterHTML` 並將其注入至 `id="main-content"` 容器的最下方，使其能跟隨所有主畫面內容一起滾動置底。

### 帳號管理視圖流程重構

**1. [MODIFY] [AccountSection.js](file:///d:/Projects/the-fictional-train/js/components/personal-center/AccountSection.js)**
- [UIUX] 移除原先在頂部使用按鈕切換「單一書店登入」與「裝置登入」頁籤的設計，改為直接依據當前的登入狀態（單一書店 / 載具綁定）顯示對應的專屬視圖。
- [UIUX] 單一書店登入模式下，畫面會整合顯示「目前的書店（三民）」、「其他可切換的書店」，並將「裝置驗證入口」置於最下方。
- [UIUX] 裝置登入模式下，隱藏所有單一書店的登出與切換按鈕，專注顯示目前連結的手機裝置資訊以及被該裝置所同步的所有書店列表。
- [Logic] 簡化切換邏輯。完成 QR Code 模擬驗證成功後，會隱藏 `single-mode-view` 並顯示 `carrier-mode-view`；點擊解除連結後則反之。同步移除原本按鈕內文字替換的舊邏輯。

### 載具驗證流程體驗優化 (QR Code 模擬視窗)

**1. [MODIFY] [AccountSection.js](file:///d:/Projects/the-fictional-train/js/components/personal-center/AccountSection.js)**
- [UIUX] 點擊「進行裝置驗證」後不再直接跳出原生 `alert`，而是彈出一個模擬的 QR Code 掃描視窗 (`#qr-code-modal`)。
- [Style] 使用 Backdrop Blur (毛玻璃) 與 Tailwind 轉場動畫 (`scale-95` 到 `scale-100` 以及 `opacity` 漸變) 使彈出視窗更加平滑流暢。
- [Feature] 視窗內提供假 QR Code 圖示與「取消」、「模擬掃描成功」兩顆按鈕以供操作互動。點擊取消會關閉視窗，點擊模擬成功則會帶出原先的裝置連結成功狀態。

## 2026-02-24

### 閱讀目標改版：移除自訂目標，改為紀錄與顯示成就

**1. [MODIFY] [Homepage.js](file:///d:/Projects/the-fictional-train/js/views/Homepage.js)**
- [UIUX] 調整首頁閱讀目標區塊內容：標題改為「今日閱讀時間」，並移除目標設定按鈕與原有進度條機制。
- [Feature] 區塊內新增「本月已讀完幾本書」統計數字顯示，以取代舊有設定。

**2. [DELETE] [ReadingGoalSection.js](file:///d:/Projects/the-fictional-train/js/components/personal-center/ReadingGoalSection.js)**
- [Remove] 刪除原設定閱讀目標的元件。

**3. [MODIFY] [PersonalCenter.js](file:///d:/Projects/the-fictional-train/js/views/PersonalCenter.js)**
- [Remove] 移除 `SECTIONS` 陣列中的 `reading-goal` 區塊宣告與相關匯入。

**4. [MODIFY] [readingGoal.js](file:///d:/Projects/the-fictional-train/js/features/readingGoal.js)**
- [Remove] 刪除與設定 `goal` 相關的狀態與儲存邏輯。
- [Feature] 匯入 `BOOKS_DATA`，計算並在首頁更新「本月已讀完幾本書」（過濾 `progress === 100` 且 `lastRead` 為本月的書籍）。

**5. [MODIFY] [books.js](file:///d:/Projects/the-fictional-train/js/data/books.js)**
- [New] 新增兩筆 `progress: 100` 且 `lastRead` 落在本月（2026/02）的模擬資料以供前端展示統計值。

### 行動版 Header UI 行為調整

**1. [MODIFY] [Header.js](file:///d:/Projects/the-fictional-train/js/components/Header.js)**
- [UIUX] 調整手機版 Header 頂部的「通知按鈕」與「帳號按鈕」行為：移除這兩個按鈕原有的下拉選單（Dropdown），點擊後改為直接跳轉至「個人中心 - 全部通知」與「個人中心 - 帳號管理」頁面。

### 書櫃 FilterBar (篩選列) 佈局修正

**1. [MODIFY] [FilterBar.js](file:///d:/Projects/the-fictional-train/js/components/FilterBar.js)**
- [Fix] 修正「我的書櫃」往下滾動時篩選列會與 Header 重疊/破版的問題。將原先 `sticky top-0 z-10` 調整為 `sticky top-14 md:top-16 z-30`，確保篩選列在行動版及桌面版均能正確吸附於 Header 下方。


### 單一書店登入模式 - 登出與切換流程及登入頁面建置

**1. [NEW] [Login.js](file:///d:/Projects/the-fictional-train/js/views/Login.js)**
- [New] 新建平台通用登入頁面元件，提供「單一書店登入」與「載具登入 (多帳號)」兩種獨立分支選擇的視覺入口。
- [UIUX] 調整登入方式按鈕順序：將「載具登入 (多帳號)」置於上方，「單一書店登入」置於下方。
- [UIUX] 採用毛玻璃特效、置中卡片式設計。為符合強制登入邏輯，已移除原有的「回到首頁」退出連結。
- [New] 擴充「單一書店登入」流程分支：點擊後會以水平滑動轉場進入「選擇登入書店」的子視窗，提供讀冊、三民、灰熊愛讀書三間書店卡片供選擇跳轉。
- [Update] 調整 Login 視窗為獨立情境頁面：在 `openLoginView()` 被呼叫時會隱藏全域的 Desktop Header, Mobile Header 與 Bottom Navbar，退出時（透過路由在 `router.js` 切換時）自動恢復顯示，達到真正的全螢幕沉浸體驗。

**2. [MODIFY] [Header.js](file:///d:/Projects/the-fictional-train/js/components/Header.js)**
- [UIUX] 重新設計個人頭像下拉選單 (`DROPDOWN_CONTENT`)，將「載具登入模式」與「單一書店登入模式」分為兩個獨立的節點區塊 (`header-carrier-content`, `header-single-content`)。
- [Feature] 匯出 `updateHeaderLoginMode(mode)` 函式，供外部（如帳號管理）根據當下綁定狀態動態切換 Header 中顯示的登入模式。

**3. [MODIFY] [main.js](file:///d:/Projects/the-fictional-train/js/main.js)**
- [Update] 於主程式中注入 `createLoginHTML` 與 `initLoginEvents`，使新建立的登入頁面加入視圖切換系統中。

**4. [MODIFY] [AccountSection.js](file:///d:/Projects/the-fictional-train/js/components/personal-center/AccountSection.js)**
- [UIUX] 更新單一書店登入模式下的按鈕文案及行為：將尚未連結的書店卡片按鈕改為「切換」（原本為「連結」）；若為已連結且目前所在的書店，按鈕改為紅色的「登出」。
- [UIUX] 預設狀態設為主動呈現「單一書店登入（三民）」，並在初始化時呼叫 Header 函式同步選單狀態。
- [UIUX] 將「單一書店登入」與「載具登入 (多帳號)」按鈕的位置對調，載具登入移至左側，單一書店登入移至右側。
- [UIUX] 載具登入頁籤中，當使用者點選「進行載具驗證」後，除了切換該頁籤內的 UI，同步更新 Header 個人頭像下拉選單為「載具登入模式」。
- [UIUX] 當載具驗證成功後，切換回「單一書店登入」頁籤時，三間書店卡片上的按鈕皆會連動變成綠底的「登入」狀態。
- [Feature] 將以上單一書店按鈕的點擊事件均導向新建立的 `Login.js` 視圖，模擬回歸登出/切換/登入帳號狀態。
  - 目前登入的書店（已登入）：按鈕文字維持「登出」（樣式改為紅色警告色 hover 效果）。
- [Logic] 將「登出」或「切換」的點擊事件全部導向匯入的 `openLoginView()`，以回到登入前狀態的頁面。

### 支援平行帳號登入模式 (單一書店 / 手機條碼載具)

**1. [MODIFY] [AccountSection.js](file:///d:/Projects/the-fictional-train/js/components/personal-center/AccountSection.js)**
- [UIUX] 實作平行帳號登入模式，讓使用者可以選擇「單一書店登入」或「載具登入 (多帳號)」。
- [New] 新增頂部模式切換按鈕 (`.mode-btn`)，點擊可切換兩種不同的登入流程畫面。
- [Update] 將原有的各家書店連結卡片（讀冊、三民、灰熊愛讀書）移入「單一帳號登入模式容器」內。
- [New] 新增「載具登入模式」UI 流程：包含未綁定狀態的提示說明與認證按鈕，以及已綁定後自動帶入多筆書店帳號的畫面狀態。
- [Update] 更新 `initAccountSectionEvents`，加入模式切換的 UI 更新事件，以及模擬載具驗證/解除綁定的行為提示。

## 2026-02-23

### 濾選列 (FilterBar) 重構缺失修正

**1. [MODIFY] [FilterBar.js](file:///d:/Projects/the-fictional-train/js/components/FilterBar.js)**
- [Fix] 將所有篩選、排序、視圖切換的監聽器改為基於 \`document.addEventListener\` 的事件委派 (Event Delegation)，解決當篩選列 DOM 被重新渲染（例如執行 \`renderContent()\` 更新 \`innerHTML\`）時，已綁定的事件會丟失導致按鈕失效的問題。
- [Fix] 修復 \`type: 'buttons'\` 在產生 HTML 時漏掉 \`id\` 屬性的問題，確保事件委派可以準確選到該按鈕。
- [Fix] 解決因為 \`initFilterBarEvents\` 被多次呼叫而可能綁定重複 \`document\` 監聽器的問題，加入 \`window._filterBarEventsInitialized\` 全域追蹤紀錄，確保每種 \`prefix\` 的監聽只註冊一次，並動態更新 \`callback\` 以防 Closure 捕獲舊的函式。
- [Style] 修改 \`createFilterBarHTML\` 預設的 \`containerClass\`，使其在手機版 (\`< md\`) 恢復 \`overflow-x-auto no-scrollbar whitespace-nowrap\` 單列左右滑動，並保留在桌機版 (\`md:\`) 使用 \`overflow-visible md:whitespace-normal md:flex-wrap\` 以解決排序下拉選單被裁切的問題。
- [Style] 為了與手機版設計風格保持一致，將網頁版的「批次選取」按鈕文字精簡為「批次」，並一併加上打鉤的 icon 樣式。
- [Feature] 為 \`type: 'buttons'\` 的篩選器新增 \`allowDeselect\` 支援，當使用者再次點擊已啟用的按鈕時，可將其取消選取，並送出 \`deselectValue\`（預設為空字串或 \`all\`）。

**2. [MODIFY] [Bookmark.js](file:///d:/Projects/the-fictional-train/js/views/Bookmark.js)**
- [Style] 將 \`bookmarkFilterConfig\` 的 \`containerClass\` 樣式套用與 \`FilterBar\` 相同的響應式 (RWD) 設定，確保手機版也是維持單行滑動而非自動換行，且同樣在桌面版避免裁切。
- [Logic] 將 \`type\` (顯示類型) 篩選器的「全部」選項移除，並開啟 \`allowDeselect: true\` 允許作動態開關（Toggle）。

**3. [MODIFY] [bookmark.js](file:///d:/Projects/the-fictional-train/js/features/bookmark.js)** & **[Modals.js](file:///d:/Projects/the-fictional-train/js/components/Modals.js)**
- [Logic] 將手機版 Drawer 中的「全部」顯示類型按鈕移除。
- [Logic] 更新手機版的點選邏輯：如果再次點擊當前選擇的「劃線/筆記」，則取消選擇狀態並將 \`draftFilterState.type\` 設回 \`all\`。
- [Fix] 修正 \`applyBtn\` 同步更新桌面 UI 按鈕時遭遇自定義 Inline CSS (\`b.style.backgroundColor\`) 覆蓋導致顏色不會自動重設的問題，統一回歸 \`FilterBar.js\` 管理的 Tailwind \`bg-white shadow-sm\` 樣式切換。

### 教科書教學資源更新提示

**1. [MODIFY] [notifications.js](file:///d:/Projects/the-fictional-train/js/data/notifications.js)**
- [New] 新增一筆「設計系統實戰」有新教學資源上傳的系統通知假資料。

**2. [MODIFY] [books.js](file:///d:/Projects/the-fictional-train/js/data/books.js)**
- [Update] 在「設計系統實戰」的 `teachingResources` 結構中加入 `hasNew` 旗標與各資源本身的 `isNew` 標示。

**3. [MODIFY] [Modals.js](file:///d:/Projects/the-fictional-train/js/components/Modals.js)**
- [New] 於書籍資訊彈窗 (`#book-info-modal`) 的標籤列 (`#modal-tag-row`) 中，新增「新教學資源」紅底標籤。

**4. [MODIFY] [bookshelf.js](file:///d:/Projects/the-fictional-train/js/features/bookshelf.js)**
- [Update] `showBookDetails` 中加入更新「新教學資源」標籤的顯示邏輯（依賴 `teachingResources.hasNew`）。
- [Update] `showBookDetails` 在生成教學資源列表時，根據 `isNew` 屬性，在附件或連結卡片的左上角新增絕對定位的 `NEW` 標籤。
- [Update] 修改 `NEW` 標籤的顯示位置，從卡片左上方移動至右側（下載或外部連結圖示左方），使其更融入列表項目佈局。

### 通用篩選列 (FilterBar) 模組化重構

**1. [MODIFY] [FilterBar.js](file:///d:/Projects/the-fictional-train/js/components/FilterBar.js)**
- [Update] 將 `FilterBar.js` 重構為純配置驅動 (config-driven) 的通用元件
- [New] 支援 `type: 'select'`, `type: 'buttons'`, `type: 'custom'` 等多種篩選器配置
- [New] 內建處理 RWD，自動生成 Mobile 底部選單觸發按鈕，並統整事件派發邏輯
- [New] 新增 `initFilterBarEvents` 以統一註冊所有切換與點擊事件
- [Fix] 修正由 `type: 'custom'` 自定義元件所引發的手機版按鈕 Undefined Property `options` 錯誤，加入型別保護機制以防止無 options 按鈕產生例外。
- [Feature] 根據回饋實裝 `extraMobileButtons` 與 `sort.hideOnMobile` 等配置進階支援，使得客製化更加彈性。

**2. [MODIFY] [bookmark.js](file:///d:/Projects/the-fictional-train/js/features/bookmark.js) & [Bookmark.js](file:///d:/Projects/the-fictional-train/js/views/Bookmark.js)**
- [Fix] 更新因為重構造成 `state.selectedType` 遺失 Set Property (`has`, `size`) 的類型定義問題。
- [Update] 修改配置 `bookmarkFilterConfig` 並將各個特殊屬性 (類型、顏色、排序) 全部隱藏手機版觸發按鈕，以單一客製化總列表按鈕 `extraMobileButtons` ?代??
- [Revert] 重新放回原本遭到替換掉的 `openBookmarkFilterDrawer` 與對應的 `#bookmark-filter-drawer` 單一抽屜面板，並串皆回共用的 DOM 事件來觸發桌面版。
- [Style] 調整 Drawer 中「顯示類型」與「排序方式」按鈕選中時的樣式，改為和「劃線顏色」相同的藍色框線，並修正選取「筆記」時顏色篩選僅 Disable 非隱藏，及排序方向無選擇時預設不顯示箭頭。

**3. [MODIFY] [Bookshelf.js](file:///d:/Projects/the-fictional-train/js/views/Bookshelf.js) & [bookshelf.js](file:///d:/Projects/the-fictional-train/js/features/bookshelf.js)**
- [Update] 移除原本寫死的 Toolbar DOM，改用 `createFilterBarHTML(bookshelfFilterConfig)` 生成我的書櫃的篩選列
- [New] 建立 `bookshelfFilterConfig` 配置檔，定義閱讀狀態、來源、分類、書種等篩選條件
- [New] 建立 `archiveFilterConfig`，將封存區專屬篩選器也改用通用 FilterBar
- [Remove] 移除舊有的自訂過濾器邏輯，改由 `initFilterBarEvents` 處理事件派發

**3. [MODIFY] [main.js](file:///d:/Projects/the-fictional-train/js/main.js)**
- [Fix] 修正 `bookshelf.js` 移除 `initFilterBar` 後，於 main 中造成的 import SyntaxError，將 BookDetails 畫面也一併切換至使用 `initFilterBarEvents` 架構。

**3. [MODIFY] [Bookmark.js](file:///d:/Projects/the-fictional-train/js/views/Bookmark.js) & [bookmark.js](file:///d:/Projects/the-fictional-train/js/features/bookmark.js)**
- [Update] 完全汰除原有的手寫行動版巨大 Drawer UI 及龐雜的事件邏輯
- [New] 透過 `bookmarkFilterConfig` 整合劃線筆記頁面的批次、顏色(Custom)、類型、排序篩選按鈕
- [Update] 行動版顏色選擇、排序、類型切換全面改用共用的 Bottom Sheet 元件
- [Fix] 修正批次選取按鈕在行動版的顯示邏輯與樣式問題
- [Update] 統一以狀態 `state.selectedType`（單一值取代 Set）簡化判斷邏輯

**4. [DELETE] [ArchiveFilterBar.js](file:///d:/Projects/the-fictional-train/js/components/ArchiveFilterBar.js)**
- [Remove] 將冗餘的專屬 Archive UI 廢棄，並將封存區專屬工具函式搬移回 `bookshelf.js` 模組內，減少元件碎片化

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
  - [Update] 主帳號顯示格式：`[灰熊愛讀書] abcd123@gmail.com`
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
- 顯示書店帳號連結卡片（讀冊生活、三民書局、灰熊愛讀書）
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
