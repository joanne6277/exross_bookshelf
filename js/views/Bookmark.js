export function createBookmarkHTML() {
    return `
    <div id="view-bookmark" class="view-section hidden h-full">
        <div class="flex h-full rounded-2xl shadow-sm border border-border-color overflow-hidden bg-white">
            <!-- Left Sidebar (Desktop Only) -->
            <div
                class="hidden md:flex w-1/3 min-w-[300px] max-w-[400px] border-r border-border-color flex-col bg-gray-50">
                <div class="p-5 border-b border-border-color bg-white z-10">
                    <div class="flex justify-between items-center mb-4">
                        <h1 class="text-2xl font-bold text-text-primary">劃線筆記</h1><span
                            class="text-xs font-bold bg-accent-light text-accent px-2 py-1 rounded-full">共 5
                            本</span>
                    </div>
                    <div class="relative mb-3"><input type="text" id="bookmark-search-input-desktop"
                            placeholder="搜尋筆記內容..."
                            class="w-full border border-border-color rounded-lg py-2 px-3 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"><i
                            data-lucide="search"
                            class="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2"></i></div>
                    <div class="flex gap-2"><select
                            class="bg-white border border-border-color rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer flex-1">
                            <option>書單: 全部</option>
                            <option>我的最愛</option>
                            <option>工作必讀</option>
                            <option>週末休閒</option>
                        </select></div>
                </div>
                <div class="p-2 border-b border-border-color">
                    <div id="all-notes-btn"
                        class="book-index-item flex gap-3 p-3 rounded-lg cursor-pointer border-l-4 group transition-all active"
                        data-book-id="all">
                        <div class="w-12 h-16 rounded bg-gray-200 flex items-center justify-center">
                            <i data-lucide="inbox" class="w-6 h-6 text-gray-500"></i>
                        </div>
                        <div class="flex-1 flex flex-col justify-center">
                            <h3 class="text-sm font-bold text-text-primary mb-1">全部筆記</h3>
                            <div class="flex items-center justify-between text-xs text-text-secondary"><span>共 39
                                    則筆記</span></div>
                        </div>
                    </div>
                </div>
                <div id="book-notes-list" class="flex-1 overflow-y-auto p-2 space-y-1">
                    <!-- Book items injected by JS (bookmark.js) or static for now -->
                    <div class="book-index-item flex gap-3 p-3 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-white hover:shadow-sm group transition-all"
                        data-book-id="atomic"><img src="https://placehold.co/60x90/F59E0B/FFFFFF?text=Habits"
                            class="w-12 h-16 object-cover rounded shadow-sm group-hover:opacity-90">
                        <div class="flex-1 flex flex-col justify-center">
                            <h3 class="text-sm font-bold text-text-primary mb-1 line-clamp-1">原子習慣</h3>
                            <div class="flex items-center justify-between text-xs text-text-secondary"><span>12
                                    則筆記</span><span>剛剛</span></div>
                        </div>
                    </div>
                    <div class="book-index-item flex gap-3 p-3 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-white hover:shadow-sm group transition-all"
                        data-book-id="design"><img src="https://placehold.co/60x90/629BC1/FFFFFF?text=System"
                            class="w-12 h-16 object-cover rounded shadow-sm group-hover:opacity-90">
                        <div class="flex-1 flex flex-col justify-center">
                            <h3 class="text-sm font-bold text-text-primary mb-1 line-clamp-1">設計系統實戰</h3>
                            <div class="flex items-center justify-between text-xs text-text-secondary"><span>5
                                    則筆記</span><span>昨天</span></div>
                        </div>
                    </div>
                    <div class="book-index-item flex gap-3 p-3 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-white hover:shadow-sm group transition-all"
                        data-book-id="ux"><img src="https://placehold.co/60x90/48C774/FFFFFF?text=UX"
                            class="w-12 h-16 object-cover rounded shadow-sm group-hover:opacity-90">
                        <div class="flex-1 flex flex-col justify-center">
                            <h3 class="text-sm font-bold text-text-primary mb-1 line-clamp-1">UX 領導力</h3>
                            <div class="flex items-center justify-between text-xs text-text-secondary"><span>22
                                    則筆記</span><span>上週</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Content -->
            <div class="w-full md:w-2/3 flex-1 flex flex-col relative">
                <!-- Mobile Header -->
                <div class="md:hidden sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-border-color">
                    <div class="flex items-center justify-between p-4">
                        <h1 class="text-2xl font-bold text-text-primary flex-shrink-0">劃線筆記</h1>
                        <div class="relative flex-1 min-w-0 max-w-xs">
                            <input type="text" id="bookmark-search-input" placeholder="輸入書名或劃線筆記內容"
                                class="w-full border border-border-color rounded-lg py-2 px-3 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-shadow">
                            <i data-lucide="search"
                                class="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2"></i>
                        </div>
                    </div>
                    <div class="px-4 pb-3 overflow-x-auto no-scrollbar">
                        <div class="flex items-center gap-3">
                            <select
                                class="bg-white border border-border-color rounded-lg px-2 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer">
                                <option>書單: 全部</option>
                                <option>我的最愛</option>
                                <option>工作必讀</option>
                            </select>
                            <div class="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
                                <button class="note-filter-btn active px-3 py-1 text-sm"
                                    data-filter="all">全部</button>
                                <button class="note-filter-btn px-3 py-1 text-sm"
                                    data-filter="highlight">劃線</button>
                                <button class="note-filter-btn px-3 py-1 text-sm" data-filter="note">筆記</button>
                            </div>
                            <select
                                class="bg-white border border-border-color rounded-lg px-2 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer">
                                <option>排序: 最近</option>
                                <option>排序: 書名</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Desktop Header -->
                <div
                    class="hidden md:flex p-6 border-b border-border-color justify-between items-center bg-white z-10">
                    <div id="note-header-info">
                        <h2 class="text-2xl font-bold text-text-primary mb-1">搜尋結果</h2>
                        <p class="text-sm text-text-secondary">共 3 本書，39 則筆記</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <div id="note-filter-buttons" class="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
                            <button class="note-filter-btn active px-3 py-1 text-sm" data-filter="all">全部</button>
                            <button class="note-filter-btn px-3 py-1 text-sm" data-filter="highlight">劃線</button>
                            <button class="note-filter-btn px-3 py-1 text-sm" data-filter="note">筆記</button>
                        </div>
                        <select id="notes-sort-select"
                            class="bg-white border border-border-color rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer">
                            <option>排序: 最近新增</option>
                            <option>排序: 書名</option>
                            <option>排序: 頁碼</option>
                        </select>
                    </div>
                </div>
                <!-- Note Cards Container - will be populated by JS -->
                <div class="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-gray-50/50" id="note-content-area">
                    <!-- Dynamic Content -->
                </div>
            </div>
        </div>
    </div>
    `;
}
