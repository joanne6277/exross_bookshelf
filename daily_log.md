# Daily Log

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
