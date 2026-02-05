# Daily Log

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
