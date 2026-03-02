export function createModalsHTML() {
    return `
    <!-- Book Info Modal -->
    <div id="book-info-modal" class="modal-overlay hidden fixed inset-0 z-50 flex items-center justify-center p-4"
        data-modal-close="book-info-modal">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden modal-content"
            onclick="event.stopPropagation()">
            <div class="flex justify-between items-start p-6 border-b border-border-color bg-gray-50">
                <div>
                    <h2 id="modal-book-title" class="text-2xl font-bold text-text-primary mb-1">標題載入中...</h2>
                    <a href="#" id="modal-book-author" class="text-accent font-medium hover:underline">---</a>
                </div>
                <button data-modal-close="book-info-modal" class="text-text-secondary hover:text-text-primary p-1"><i
                        data-lucide="x" class="w-6 h-6"></i></button>
            </div>

            <!-- Tag Row -->
            <div id="modal-tag-row" class="flex flex-wrap gap-2 px-6 py-3 border-b border-border-color bg-white">
                <span id="modal-book-source" class="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">來源</span>
                <span id="modal-book-format" class="bg-gray-800 text-white text-xs font-bold px-2.5 py-1 rounded-full hidden">EPUB</span>
                <span id="modal-book-audiobook-icon" class="bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full hidden flex items-center gap-1"><i data-lucide="volume-2" class="w-3 h-3"></i> 有聲書</span>
                <span id="modal-book-tts-icon" class="bg-teal-500 text-white text-xs font-bold px-2.5 py-1 rounded-full hidden flex items-center gap-1"><i data-lucide="speech" class="w-3 h-3"></i> 可朗讀</span>
                <span id="modal-book-new-resource-tag" class="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full hidden">有教學資源</span>
            </div>

            <div class="flex-1 overflow-y-auto p-6">

                <div class="flex flex-col gap-y-6">

                    <!-- Mobile-only Top Section -->

                    <div class="flex md:hidden flex-row gap-4">

                        <div class="w-3/5 flex-shrink-0 relative">

                            <img id="modal-book-cover-mobile" src="" alt="Book Cover"
                                class="w-full rounded-lg shadow-md">

                            <!-- Remaining Time Tag (stays on cover) -->
                            <div id="modal-remaining-time-container-mobile" class="absolute top-2 right-2 z-10 hidden">
                                <span id="modal-book-remaining-mobile" class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border border-white/50 shadow-md">剩餘時間</span>
                            </div>

                        </div>

                        <div id="modal-actions-normal-mobile" class="grid grid-rows-[60px_60px_60px] gap-4 content-start">

                            <button
                                class="flex-1 py-3 px-4 rounded-lg text-white font-bold shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                style="background-color: var(--bg-accent);"><i data-lucide="book-open"
                                    class="w-5 h-5"></i> 立即閱讀</button>

                            <button id="modal-btn-add-shelf-mobile"
                                class="flex-1 py-3 px-4 rounded-lg border border-border-color text-text-primary font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"><i
                                    data-lucide="plus" class="w-5 h-5"></i> 加入書單</button>

                            <button
                                class="flex-1 py-3 px-4 rounded-lg bg-red-500 text-white font-bold shadow-sm hover:bg-red-600 transition-opacity flex items-center justify-center gap-2"><i
                                    data-lucide="archive" class="w-5 h-5"></i> 封存</button>

                        </div>

                        <!-- Archived (Manual) Actions -->
                        <div id="modal-actions-archived-mobile" class="hidden grid grid-rows-[60px] gap-4 content-start">
                            <button id="modal-btn-unarchive-mobile"
                                class="flex-1 py-3 px-4 rounded-lg text-white font-bold shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                style="background-color: var(--bg-accent);"><i data-lucide="archive-restore"
                                    class="w-5 h-5"></i> 加入我的書櫃</button>
                        </div>

                        <!-- Expired Textbook Actions -->
                        <div id="modal-actions-expired-mobile" class="hidden grid grid-rows-[60px] gap-4 content-start">
                            <button id="modal-btn-purchase-mobile"
                                class="flex-1 py-3 px-4 rounded-lg text-white font-bold shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                style="background-color: var(--bg-accent);"><i data-lucide="external-link"
                                    class="w-5 h-5"></i> 購買連結</button>
                        </div>

                    </div>

                    <!-- Desktop-only Layout -->

                    <div class="hidden md:flex flex-row gap-8">

                        <div class="w-full md:w-1/3 flex-shrink-0 relative">

                            <img id="modal-book-cover" src="" alt="Book Cover" class="w-full rounded-lg shadow-md">

                            <!-- Remaining Time Tag (stays on cover) -->
                            <div id="modal-remaining-time-container" class="absolute top-2 right-2 z-10 hidden">
                                <span id="modal-book-remaining" class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border border-white/50 shadow-md">剩餘時間</span>
                            </div>

                        </div>

                        <div class="w-full md:w-2/3 flex flex-col">

                            <div class="grid grid-cols-2 gap-y-4 text-sm mb-8">

                                <div><span class="text-text-secondary block mb-1">出版日期</span><span
                                        id="modal-book-pubdate" class="text-text-primary font-medium">-</span></div>

                                <div><span class="text-text-secondary block mb-1">閱讀時數</span><span
                                        id="modal-book-duration" class="text-text-primary font-medium">-</span></div>

                                <div><span class="text-text-secondary block mb-1">上次閱讀</span><span
                                        id="modal-book-lastread" class="text-text-primary font-medium">-</span></div>

                                <div id="modal-expiry-container"><span
                                        class="text-text-secondary block mb-1 text-red-500 font-bold">到期日</span><span
                                        id="modal-book-expiry" class="text-text-primary font-medium">-</span></div>

                            </div>

                            <div id="modal-actions-normal" class="flex gap-4 mb-8">

                                <button
                                    class="flex-[0.5] py-3 px-4 rounded-lg text-white font-bold shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    style="background-color: var(--bg-accent);"><i data-lucide="book-open"
                                        class="w-5 h-5"></i> 立即閱讀</button>

                                <button id="modal-btn-add-shelf"
                                    class="flex-[0.5] py-3 px-4 rounded-lg border border-border-color text-text-primary font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"><i
                                        data-lucide="plus" class="w-5 h-5"></i>加入書單</button>

                                <button
                                    class="flex-[0.4] py-3 px-4 rounded-lg bg-red-500 text-white font-bold shadow-sm hover:bg-red-600 transition-opacity flex items-center justify-center gap-2"><i
                                        data-lucide="archive" class="w-5 h-5"></i> 封存</button>

                            </div>

                            <!-- Archived (Manual) Actions -->
                            <div id="modal-actions-archived" class="hidden flex gap-4 mb-8">
                                <button id="modal-btn-unarchive"
                                    class="flex-1 py-3 px-4 rounded-lg text-white font-bold shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    style="background-color: var(--bg-accent);"><i data-lucide="archive-restore"
                                        class="w-5 h-5"></i> 加入我的書櫃</button>
                            </div>

                            <!-- Expired Textbook Actions -->
                            <div id="modal-actions-expired" class="hidden flex gap-4 mb-8">
                                <button id="modal-btn-purchase"
                                    class="flex-1 py-3 px-4 rounded-lg text-white font-bold shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    style="background-color: var(--bg-accent);"><i data-lucide="external-link"
                                        class="w-5 h-5"></i> 購買連結</button>
                            </div>

                            <div class="border-t border-border-color pt-4">

                                <div id="teaching-resources-container" class="hidden">

                                    <button data-accordion-target="teaching-resources-content"
                                        class="w-full flex justify-between items-center py-3 text-text-primary font-bold hover:text-accent transition-colors"><span>教學資源</span><i
                                            data-lucide="chevron-down"
                                            class="w-5 h-5 transition-transform"></i></button>

                                    <div id="teaching-resources-content"
                                        class="hidden pl-2 text-sm text-text-secondary space-y-2 pb-4">

                                        <p>教學資源內容待補</p>

                                    </div>

                                </div>

                                <div class="mb-2">

                                    <button data-accordion-target="toc-content"
                                        class="w-full flex justify-between items-center py-3 text-text-primary font-bold hover:text-accent transition-colors"><span>目錄
                                            (Table of Contents)</span><i data-lucide="chevron-down"
                                            class="w-5 h-5 transition-transform"></i></button>

                                    <div id="toc-content"
                                        class="hidden pl-2 text-sm text-text-secondary space-y-2 pb-4">

                                        <a href="#"
                                            class="block hover:text-accent py-1 border-b border-dashed border-gray-200">載入中...</a>

                                    </div>

                                </div>



                                <div>

                                    <button data-accordion-target="desc-content"
                                        class="w-full flex justify-between items-center py-3 text-text-primary font-bold hover:text-accent transition-colors"><span>內容簡介</span><i
                                            data-lucide="chevron-down"
                                            class="w-5 h-5 transition-transform"></i></button>

                                    <div id="desc-content"
                                        class="hidden pl-2 text-sm text-text-secondary leading-relaxed pb-4">

                                        <p id="modal-book-description">載入中...</p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    <!-- Common Info for Mobile -->

                    <div class="md:hidden">

                        <div class="grid grid-cols-2 gap-y-4 text-sm mb-8">

                            <div><span class="text-text-secondary block mb-1">出版日期</span><span
                                    id="modal-book-pubdate-mobile" class="text-text-primary font-medium">-</span></div>

                            <div><span class="text-text-secondary block mb-1">閱讀時數</span><span
                                    id="modal-book-duration-mobile" class="text-text-primary font-medium">-</span></div>

                            <div><span class="text-text-secondary block mb-1">上次閱讀</span><span
                                    id="modal-book-lastread-mobile" class="text-text-primary font-medium">-</span></div>

                            <div id="modal-expiry-container-mobile"><span
                                    class="text-text-secondary block mb-1 text-red-500 font-bold">到期日</span><span
                                    id="modal-book-expiry-mobile" class="text-text-primary font-medium">-</span></div>

                        </div>

                        <div class="border-t border-border-color pt-4">

                            <div id="teaching-resources-container-mobile" class="hidden">

                                <button data-accordion-target="teaching-resources-content-mobile"
                                    class="w-full flex justify-between items-center py-3 text-text-primary font-bold hover:text-accent transition-colors"><span>教學資源</span><i
                                        data-lucide="chevron-down" class="w-5 h-5 transition-transform"></i></button>

                                <div id="teaching-resources-content-mobile"
                                    class="hidden pl-2 text-sm text-text-secondary space-y-2 pb-4">

                                    <p>教學資源內容待補</p>

                                </div>

                            </div>

                            <div class="mb-2">

                                <button data-accordion-target="toc-content-mobile"
                                    class="w-full flex justify-between items-center py-3 text-text-primary font-bold hover:text-accent transition-colors"><span>目錄
                                        (Table of Contents)</span><i data-lucide="chevron-down"
                                        class="w-5 h-5 transition-transform"></i></button>

                                <div id="toc-content-mobile"
                                    class="hidden pl-2 text-sm text-text-secondary space-y-2 pb-4">

                                    <a href="#"
                                        class="block hover:text-accent py-1 border-b border-dashed border-gray-200">載入中...</a>

                                </div>

                            </div>

                            <div>

                                <button data-accordion-target="desc-content-mobile"
                                    class="w-full flex justify-between items-center py-3 text-text-primary font-bold hover:text-accent transition-colors"><span>內容簡介</span><i
                                        data-lucide="chevron-down" class="w-5 h-5 transition-transform"></i></button>

                                <div id="desc-content-mobile"
                                    class="hidden pl-2 text-sm text-text-secondary leading-relaxed pb-4">

                                    <p id="modal-book-description-mobile">載入中...</p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    </div>

    <!-- Add to Shelf Modal -->
    <div id="add-shelf-modal" class="modal-overlay hidden fixed inset-0 z-[60] flex items-center justify-center p-4"
        data-modal-close="add-shelf-modal">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden modal-content"
            onclick="event.stopPropagation()">
            <div class="flex justify-between items-center p-4 border-b border-border-color bg-gray-50">
                <h3 class="text-lg font-bold text-text-primary">加入自訂書單</h3>
                <button data-modal-close="add-shelf-modal" class="text-text-secondary hover:text-text-primary"><i
                        data-lucide="x" class="w-5 h-5"></i></button>
            </div>
            <div class="p-4 space-y-4">
                <p class="text-xs text-text-secondary leading-relaxed">請選擇要加入的書單（可多選）。</p>
                <div>
                    <div class="flex flex-wrap gap-2" id="shelf-tags-container">
                        <!-- Dynamic Content -->
                    </div>
                </div>
            </div>
            <div class="p-4 border-t border-border-color bg-gray-50 flex justify-end">
                <button data-modal-close="add-shelf-modal"
                    class="px-6 py-2 rounded-lg text-white font-bold shadow-sm hover:opacity-90 transition-opacity"
                    style="background-color: var(--bg-accent);">完成</button>
            </div>
        </div>
    </div>

    <!-- Add Collection Modal -->
    <div id="add-collection-modal"
        class="modal-overlay hidden fixed inset-0 z-[60] flex items-center justify-center p-4"
        data-modal-close="add-collection-modal">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden modal-content"
            onclick="event.stopPropagation()">
            <div class="flex justify-between items-center p-4 border-b border-border-color bg-gray-50">
                <h3 class="text-lg font-bold text-text-primary">新增書單</h3>
                <button data-modal-close="add-collection-modal" class="text-text-secondary hover:text-text-primary"><i
                        data-lucide="x" class="w-5 h-5"></i></button>
            </div>
            <div class="p-4 space-y-4">
                <input type="text" id="collection-name-input" placeholder="請輸入書單名稱"
                    class="w-full border border-border-color rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-shadow">
            </div>
            <div class="p-4 border-t border-border-color bg-gray-50 flex justify-end gap-2">
                <button data-modal-close="add-collection-modal"
                    class="px-4 py-2 bg-gray-200 text-text-primary text-sm font-bold rounded-lg hover:bg-gray-300">取消</button>
                <button id="save-collection-btn"
                    class="px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600">儲存</button>
            </div>
        </div>
    </div>

    <!-- Edit Collection Modal -->
    <div id="edit-collection-modal"
        class="modal-overlay hidden fixed inset-0 z-[60] flex items-center justify-center p-4"
        data-modal-close="edit-collection-modal">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden modal-content"
            onclick="event.stopPropagation()">
            <div class="flex justify-between items-center p-4 border-b border-border-color bg-gray-50">
                <h3 class="text-lg font-bold text-text-primary">編輯/刪除書單</h3>
                <button data-modal-close="edit-collection-modal" class="text-text-secondary hover:text-text-primary"><i
                        data-lucide="x" class="w-5 h-5"></i></button>
            </div>
            <div class="p-4 space-y-4">
                <div>
                   <label class="block text-sm font-bold text-text-secondary mb-1">書單名稱</label>
                   <input type="text" id="edit-collection-name-input"
                    class="w-full border border-border-color rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-shadow">
                </div>
            </div>
            <div class="p-4 border-t border-border-color bg-gray-50 flex justify-between gap-2">
                <button id="delete-collection-btn"
                    class="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600">刪除書單</button>
                <button id="save-edit-collection-btn"
                    class="px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600">重新命名</button>
            </div>
        </div>
    </div>

    <!-- Mobile Filter & Sort Modal -->
    <div id="mobile-filter-modal"
        class="modal-overlay hidden fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4"
        data-modal-close="mobile-filter-modal">
        <div class="bg-white w-full h-[85vh] sm:h-auto sm:max-w-md sm:rounded-xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden modal-content animate-slide-up"
            onclick="event.stopPropagation()">

            <div class="flex justify-between items-center p-4 border-b border-border-color bg-gray-50">
                <h3 class="text-lg font-bold text-text-primary flex items-center gap-2">
                    <i data-lucide="sliders-horizontal" class="w-5 h-5 text-accent"></i> 篩選與排序
                </h3>
                <button data-modal-close="mobile-filter-modal" class="text-text-secondary hover:text-text-primary p-1">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>

            <div class="flex-1 overflow-y-auto p-5 space-y-6">
                <section>
                    <h4 class="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider">排序方式</h4>
                    <div class="grid grid-cols-2 gap-3">
                        <label class="cursor-pointer">
                            <input type="radio" name="mobile-sort" value="recently-read" class="peer sr-only" checked>
                            <div
                                class="p-3 rounded-lg border border-border-color text-center text-sm font-medium text-text-primary peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-accent transition-all">
                                最近閱讀
                            </div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="radio" name="mobile-sort" value="purchase-date" class="peer sr-only">
                            <div
                                class="p-3 rounded-lg border border-border-color text-center text-sm font-medium text-text-primary peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-accent transition-all">
                                最近取得
                            </div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="radio" name="mobile-sort" value="title" class="peer sr-only">
                            <div
                                class="p-3 rounded-lg border border-border-color text-center text-sm font-medium text-text-primary peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-accent transition-all">
                                書名
                            </div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="radio" name="mobile-sort" value="publish-date" class="peer sr-only">
                            <div
                                class="p-3 rounded-lg border border-border-color text-center text-sm font-medium text-text-primary peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-accent transition-all">
                                出版日期
                            </div>
                        </label>
                    </div>
                </section>

                <hr class="border-gray-100">
                <section>
                    <h4 class="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider">閱讀狀態</h4>
                    <div class="flex flex-wrap gap-2">
                        <button
                            class="mobile-filter-chip px-4 py-2 rounded-full border border-border-color text-sm font-medium bg-white text-text-primary hover:border-accent active"
                            data-group="status" data-value="all">全部</button>
                        <button
                            class="mobile-filter-chip px-4 py-2 rounded-full border border-border-color text-sm font-medium bg-white text-text-secondary hover:border-accent"
                            data-group="status" data-value="unread">未閱讀</button>
                        <button
                            class="mobile-filter-chip px-4 py-2 rounded-full border border-border-color text-sm font-medium bg-white text-text-secondary hover:border-accent"
                            data-group="status" data-value="reading">閱讀中</button>
                        <button
                            class="mobile-filter-chip px-4 py-2 rounded-full border border-border-color text-sm font-medium bg-white text-text-secondary hover:border-accent"
                            data-group="status" data-value="finished">已讀完</button>
                    </div>
                </section>

                <section>
                    <h4 class="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider">書籍來源</h4>
                    <div class="space-y-2">
                        <label
                            class="flex items-center gap-3 p-3 rounded-lg border border-border-color cursor-pointer hover:bg-gray-50">
                            <input type="radio" name="mobile-source" value="all"
                                class="w-4 h-4 text-accent focus:ring-accent" checked>
                            <span class="text-sm font-medium text-text-primary">全部來源</span>
                        </label>
                        <label
                            class="flex items-center gap-3 p-3 rounded-lg border border-border-color cursor-pointer hover:bg-gray-50">
                            <input type="radio" name="mobile-source" value="taaze"
                                class="w-4 h-4 text-accent focus:ring-accent">
                            <span class="text-sm font-medium text-text-primary">TAAZE 讀冊</span>
                        </label>
                        <label
                            class="flex items-center gap-3 p-3 rounded-lg border border-border-color cursor-pointer hover:bg-gray-50">
                            <input type="radio" name="mobile-source" value="sanmin"
                                class="w-4 h-4 text-accent focus:ring-accent">
                            <span class="text-sm font-medium text-text-primary">三民書局</span>
                        </label>
                        <label
                            class="flex items-center gap-3 p-3 rounded-lg border border-border-color cursor-pointer hover:bg-gray-50">
                            <input type="radio" name="mobile-source" value="iread"
                                class="w-4 h-4 text-accent focus:ring-accent">
                            <span class="text-sm font-medium text-text-primary">iRead 灰熊</span>
                        </label>
                    </div>
                </section>

                <section>
                    <h4 class="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider">類型篩選 (多選)</h4>
                    <div class="flex flex-wrap gap-2">
                        <button
                            class="mobile-toggle-btn px-4 py-2 rounded-lg border border-border-color text-sm font-medium text-text-secondary bg-white hover:text-accent hover:border-accent transition-all flex items-center gap-2">
                            <span>中文書</span>
                        </button>
                        <button
                            class="mobile-toggle-btn px-4 py-2 rounded-lg border border-border-color text-sm font-medium text-text-secondary bg-white hover:text-accent hover:border-accent transition-all flex items-center gap-2">
                            <span>外文書</span>
                        </button>
                        <button
                            class="mobile-toggle-btn px-4 py-2 rounded-lg border border-border-color text-sm font-medium text-text-secondary bg-white hover:text-accent hover:border-accent transition-all flex items-center gap-2">
                            <span>教科書</span>
                        </button>
                    </div>
                </section>
            </div>

            <div
                class="p-4 border-t border-border-color bg-white flex gap-3 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button id="mobile-filter-reset"
                    class="flex-1 py-3 px-4 rounded-lg border border-border-color text-text-primary font-bold hover:bg-gray-50 transition-colors">
                    清除重設
                </button>
                <button id="mobile-filter-apply"
                    class="flex-[2] py-3 px-4 rounded-lg text-white font-bold shadow-sm hover:opacity-90 transition-opacity"
                    style="background-color: var(--bg-accent);">
                    確認套用
                </button>
            </div>
        </div>
    </div>
    <!-- Mobile Filter Bottom Sheet -->
    <div id="mobile-filter-sheet" class="modal-overlay hidden fixed inset-0 z-[70] flex flex-col justify-end" 
         data-modal-close="mobile-filter-sheet">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 transition-opacity"></div>
        
        <!-- Sheet Content -->
        <div class="bg-white w-full rounded-t-2xl p-4 transform transition-transform duration-300 translate-y-full flex flex-col max-h-[70vh]"
             onclick="event.stopPropagation()">
            <div class="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                <h3 id="mobile-sheet-title" class="text-lg font-bold text-text-primary">篩選</h3>
                <button data-modal-close="mobile-filter-sheet" class="p-2 bg-gray-100 rounded-full text-text-secondary hover:bg-gray-200">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            
            <div id="mobile-sheet-options" class="flex-1 overflow-y-auto space-y-2 pb-6">
                <!-- Dynamic Options Injected Here -->
            </div>
        </div>
    </div>
    <!-- Bookmark Filter Drawer (Mobile) -->
    <div id="bookmark-filter-drawer" class="modal-overlay hidden fixed inset-0 z-[70] flex flex-col justify-end"
         data-modal-close="bookmark-filter-drawer">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 transition-opacity"></div>

        <!-- Sheet Content -->
        <div class="bg-white w-full rounded-t-2xl transform transition-transform duration-300 flex flex-col max-h-[80vh]"
             onclick="event.stopPropagation()">
            <!-- Header -->
            <div class="flex justify-between items-center p-4 border-b border-gray-100">
                <h3 class="text-lg font-bold text-text-primary flex items-center gap-2">
                    <i data-lucide="sliders-horizontal" class="w-5 h-5 text-accent"></i>
                    篩選與排序
                </h3>
                <button data-modal-close="bookmark-filter-drawer" class="p-2 bg-gray-100 rounded-full text-text-secondary hover:bg-gray-200">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <!-- Scrollable Body -->
            <div class="flex-1 overflow-y-auto p-5 space-y-6">

                <!-- Section 1: 類型 -->
                <section>
                    <h4 class="text-xs font-bold text-text-secondary mb-3 uppercase tracking-wider">顯示類型</h4>
                    <div class="flex gap-2">
                        <button class="bfd-type-btn flex-1 py-2.5 px-4 rounded-xl border text-sm font-bold transition-all" data-type="highlight">
                            <span class="flex items-center justify-center gap-1.5">
                                <i data-lucide="highlighter" class="w-3.5 h-3.5"></i> 劃線
                            </span>
                        </button>
                        <button class="bfd-type-btn flex-1 py-2.5 px-4 rounded-xl border text-sm font-bold transition-all" data-type="note">
                            <span class="flex items-center justify-center gap-1.5">
                                <i data-lucide="pencil-line" class="w-3.5 h-3.5"></i> 筆記
                            </span>
                        </button>
                    </div>
                </section>

                <!-- Section 2: 顏色 -->
                <section id="bfd-color-section">
                    <h4 class="text-xs font-bold text-text-secondary mb-3 uppercase tracking-wider">劃線顏色</h4>
                    <div class="flex flex-wrap gap-2" id="bfd-color-options">
                        <!-- Injected by JS -->
                    </div>
                </section>

                <!-- Section 3: 排序 -->
                <section>
                    <h4 class="text-xs font-bold text-text-secondary mb-3 uppercase tracking-wider">排序方式</h4>
                    <div class="grid grid-cols-3 gap-2" id="bfd-sort-options">
                        <!-- Injected by JS: buttons with ↑/↓ arrows -->
                    </div>
                </section>
            </div>

            <!-- Footer -->
            <div class="p-4 border-t border-gray-100 bg-white flex gap-3">
                <button id="bfd-reset-btn" class="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-text-primary font-bold hover:bg-gray-50 transition-colors text-sm">
                    清除重設
                </button>
                <button id="bfd-apply-btn" class="flex-[2] py-3 px-4 rounded-xl text-white font-bold shadow-sm hover:opacity-90 transition-opacity text-sm"
                        style="background-color: var(--bg-accent);">
                    套用
                </button>
            </div>
        </div>
    </div>

    <!-- Share Note Modal -->
    <div id="share-note-modal" class="modal-overlay hidden fixed inset-0 z-[80] flex items-center justify-center p-4"
         data-modal-close="share-note-modal">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden modal-content"
             onclick="event.stopPropagation()">
            <div class="flex justify-between items-center p-4 border-b border-border-color bg-gray-50">
                <h3 class="text-lg font-bold text-text-primary">分享筆記</h3>
                <button data-modal-close="share-note-modal" class="text-text-secondary hover:text-text-primary">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            <div class="p-5 space-y-5">
                <!-- Content Preview -->
                <div>
                    <label class="block text-sm font-bold text-text-secondary mb-2">內容預覽</label>
                    <textarea id="share-content-preview" 
                        class="w-full h-48 border border-border-color rounded-xl p-4 text-text-primary text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-accent transition-shadow bg-gray-50"
                        readonly></textarea>
                </div>

                <!-- Format Selection -->
                <div>
                   <label class="block text-sm font-bold text-text-secondary mb-1">學術引用格式</label>
                   <select id="share-format-select" class="w-full border border-border-color rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-shadow bg-white">
                       <option value="general">無</option>
                       <option value="apa7">APA 7th Edition</option>
                       <option value="apa6">APA 6th Edition</option>
                       <option value="mla">MLA</option>
                       <option value="chicago">Chicago</option>
                   </select>
                </div>
            </div>
            <div class="p-4 border-t border-border-color bg-gray-50 flex gap-3">
                <button id="share-copy-btn" class="flex-1 py-3 rounded-lg text-white font-bold shadow-md hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        style="background-color: var(--bg-accent);">
                    <i data-lucide="copy" class="w-4 h-4"></i> 複製
                </button>
                <button id="share-export-btn" class="flex-1 py-3 rounded-lg border border-border-color text-text-primary font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                    <i data-lucide="share-2" class="w-4 h-4"></i>分享
                </button>
            </div>
        </div>
    </div>

    <!-- Delete Note Confirmation Modal -->
    <div id="delete-note-modal" class="modal-overlay hidden fixed inset-0 z-[80] flex items-center justify-center p-4"
         data-modal-close="delete-note-modal">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-xs overflow-hidden modal-content"
             onclick="event.stopPropagation()">
            <div class="p-6 text-center">
                <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="trash-2" class="w-6 h-6 text-red-500"></i>
                </div>
                <h3 class="text-xl font-bold text-text-primary mb-2">刪除筆記</h3>
                <p class="text-text-secondary text-sm leading-relaxed">確定要刪除這則筆記嗎？<br>此動作無法復原。</p>
            </div>
            <div class="flex border-t border-border-color">
                <button data-modal-close="delete-note-modal" 
                        class="flex-1 py-3 text-text-secondary font-bold hover:bg-gray-50 transition-colors">
                    取消
                </button>
                <div class="w-px bg-border-color"></div>
                <button id="confirm-delete-note-btn" 
                        class="flex-1 py-3 text-red-500 font-bold hover:bg-red-50 transition-colors">
                    確認刪除
                </button>
            </div>
        </div>
    </div>
    `;
}
