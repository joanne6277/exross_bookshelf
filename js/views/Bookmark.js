export function createBookmarkHTML() {
    return `
    <div id="view-bookmark" class="view-section hidden h-full">
        <div class="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-border-color overflow-hidden">
            
            <!-- 1. Global Header (Title + Search) -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b border-border-color bg-white z-20">
                <h1 class="text-2xl font-bold text-text-primary hidden md:block">劃線筆記</h1>
                
                <!-- Search Bar (Top Right) -->
                <div class="relative w-full md:w-1/3 max-w-sm">
                    <input type="text" id="bookmark-search-input-desktop" 
                           placeholder="搜尋書名或筆記內容..." 
                           class="w-full border border-border-color rounded-lg py-2 px-3 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-shadow">
                    <i data-lucide="search" class="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2"></i>
                </div>
            </div>

            <!-- 2. Main Layout (2 Columns) -->
            <div class="flex flex-1 overflow-hidden relative">
                
                <!-- Left Column (Sidebar) -->
                <div class="hidden md:flex w-1/3 min-w-[280px] max-w-[350px] border-r border-border-color flex-col bg-gray-50">
                    <!-- "All Notes" Button -->
                    <div class="p-3 border-b border-border-color bg-white">
                         <div id="all-notes-btn" 
                             class="book-index-item flex gap-3 p-3 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-gray-50 transition-all active" 
                             data-book-id="all">
                            <div class="w-10 h-14 rounded bg-accent/10 flex items-center justify-center flex-shrink-0">
                                <i data-lucide="layers" class="w-6 h-6 text-accent"></i>
                            </div>
                            <div class="flex-1 flex flex-col justify-center">
                                <h3 class="text-sm font-bold text-text-primary mb-1">全部筆記</h3>
                                <p class="text-xs text-text-secondary">查看所有書籍的劃線與筆記</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Scrollable Book List -->
                    <div id="book-notes-list" class="flex-1 overflow-y-auto p-3 space-y-1">
                        <!-- Book items injected by JS -->
                    </div>
                </div>

                <!-- Right Column (Content) -->
                <div class="w-full md:flex-1 min-w-0 flex flex-col bg-gray-50/30 relative">
                    
                    <!-- Desktop Filters Toolbar (hidden on mobile) -->
                    <div class="hidden md:flex p-4 border-b border-border-color bg-white items-center overflow-x-auto no-scrollbar gap-4 sticky top-0 z-10 whitespace-nowrap">

                        <!-- Batch Select Button (Desktop) -->
                        <button id="notes-batch-select-btn"
                            class="flex-shrink-0 px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors">批次選取</button>

                        <!-- Divider -->
                        <div class="h-6 w-px bg-gray-200 flex-shrink-0"></div>

                        <!-- Type Filters -->
                        <div class="flex items-center gap-1 rounded-lg bg-gray-100 p-1 flex-shrink-0">
                            <button class="note-filter-btn px-3 py-1.5 text-sm font-medium rounded-md transition-all" data-filter="highlight">劃線</button>
                            <button class="note-filter-btn px-3 py-1.5 text-sm font-medium rounded-md transition-all" data-filter="note">筆記</button>
                        </div>

                        <!-- Divider -->
                        <div class="h-6 w-px bg-gray-200 flex-shrink-0"></div>

                        <!-- Color Filter (Desktop) -->
                        <div class="flex items-center gap-2 flex-shrink-0">
                            <div class="relative" id="color-filter-dropdown-container">
                                <button id="color-filter-trigger"
                                    class="flex items-center gap-2 bg-white border border-border-color rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-300 hover:border-accent transition-colors min-w-[110px] justify-between">
                                    <div class="flex items-center gap-2">
                                        <div id="color-filter-preview" class="w-4 h-4 rounded-full border border-gray-300 bg-transparent relative overflow-hidden">
                                            <div class="absolute inset-0 bg-gradient-to-tr from-yellow-300 via-red-300 to-blue-300 opacity-80"></div>
                                        </div>
                                        <span id="color-filter-label">劃線顏色</span>
                                    </div>
                                    <i data-lucide="chevron-down" class="w-4 h-4 text-gray-400"></i>
                                </button>

                                <!-- Custom Dropdown Menu -->
                                <div id="color-filter-menu" class="hidden absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-1 overflow-hidden">
                                    <!-- Options generated by JS -->
                                </div>
                            </div>
                        </div>

                        <!-- Sort Menu (Desktop) -->
                        <div class="relative" id="notes-sort-menu-container">
                            <div class="flex items-center">
                                <button id="notes-sort-menu-btn"
                                    class="flex items-center gap-2 bg-white border border-border-color rounded-lg px-4 py-2 text-sm text-text-primary font-medium hover:border-accent focus:outline-none focus:ring-2 focus:ring-blue-300 whitespace-nowrap">
                                    <span id="notes-sort-menu-label">排序: 依新增時間</span>
                                    <i data-lucide="chevron-down" class="w-4 h-4"></i>
                                </button>
                                <button id="notes-sort-direction-btn"
                                    class="ml-2 p-2 bg-white border border-border-color rounded-lg text-text-primary hover:border-accent focus:outline-none focus:ring-2 focus:ring-blue-300">
                                    <i data-lucide="arrow-down" class="w-4 h-4"></i>
                                </button>
                            </div>
                            <div id="notes-sort-dropdown"
                                class="hidden absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 text-left text-text-primary">
                            </div>
                        </div>
                    </div>

                    <!-- Mobile Toolbar: 批次選取 | 篩選 | 書籍capsules | ... (同一行) -->
                    <div class="md:hidden flex p-3 border-b border-border-color bg-white items-center gap-2 sticky top-0 z-10 overflow-x-auto no-scrollbar">

                        <!-- Batch Select (Mobile) -->
                        <button id="notes-batch-select-btn-mobile"
                            class="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors">
                            <i data-lucide="check-square" class="w-3.5 h-3.5"></i>
                            批次
                        </button>

                        <!-- Filter Panel Button (Mobile) -->
                        <button id="mobile-filter-panel-btn"
                            class="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-white border border-border-color text-text-primary text-sm font-bold rounded-lg hover:border-accent transition-colors">
                            <i data-lucide="sliders-horizontal" class="w-3.5 h-3.5 text-accent"></i>
                            篩選
                        </button>

                        <!-- Divider -->
                        <div class="h-6 w-px bg-gray-200 flex-shrink-0"></div>

                        <!-- Book Capsules + More Button (injected by JS, same row) -->
                        <div id="mobile-book-capsules-container" class="flex gap-2 items-center flex-shrink-0">
                            <!-- Dynamic Capsules Injected by JS -->
                        </div>
                    </div>

                    <!-- Note Cards Container -->
                    <div id="note-content-area" class="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
                        <!-- Dynamic Content -->
                    </div>

                    <!-- Batch Action Bar -->
                    <div id="notes-batch-action-bar"
                        class="hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl p-4 z-50">
                        <div
                            class="bg-white rounded-xl shadow-2xl border border-gray-100 flex items-center justify-between p-4">
                            <div class="flex items-center gap-4">
                                <button id="notes-batch-select-all-btn" class="text-accent font-bold text-sm hover:underline">全選</button>
                                <span id="notes-selected-count" class="text-sm font-bold">已選取 0 則</span>
                            </div>
                            <div class="flex gap-3">
                                <button id="notes-batch-share-btn"
                                    class="px-4 py-2 bg-blue-100 text-black text-sm font-bold rounded-lg hover:bg-blue-200 flex items-center gap-1.5">
                                    <i data-lucide="share-2" class="w-4 h-4"></i>
                                    分享
                                </button>
                                <button id="notes-batch-delete-btn"
                                    class="px-4 py-2 bg-red-100 text-red-600 text-sm font-bold rounded-lg hover:bg-red-200 flex items-center gap-1.5">
                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                    刪除
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    `;
}
