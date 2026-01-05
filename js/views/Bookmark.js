export function createBookmarkHTML() {
    return `
    <div id="view-bookmark" class="view-section hidden h-full">
        <div class="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-border-color overflow-hidden">
            
            <!-- 1. Global Header (Title + Search) -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-5 border-b border-border-color bg-white z-20 gap-4 md:gap-0">
                <h1 class="text-2xl font-bold text-text-primary">劃線筆記</h1>
                
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
                    
                    <!-- Unified Scrollable Filters Toolbar -->
                    <div class="p-3 md:p-4 border-b border-border-color bg-white flex items-center overflow-x-auto no-scrollbar gap-4 sticky top-0 z-10 whitespace-nowrap">
                        
                        <!-- Type Filters -->
                        <div class="flex items-center gap-1 rounded-lg bg-gray-100 p-1 flex-shrink-0">
                            <button class="note-filter-btn px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition-all" data-filter="highlight">劃線</button>
                            <button class="note-filter-btn px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition-all" data-filter="note">筆記</button>
                        </div>

                        <!-- Divider -->
                        <div class="h-6 w-px bg-gray-200 flex-shrink-0"></div>

                        <!-- Color Filter -->
                        <div class="flex items-center gap-2 flex-shrink-0">
                            <div id="color-filter-container" class="flex gap-1.5 items-center">
                                <!-- Removed 'All' button as per request -->
                                <button class="color-filter-btn w-5 h-5 rounded-full border border-yellow-300 bg-yellow-100 hover:scale-110 transition-transform" data-color="yellow" title="黃色"></button>
                                <button class="color-filter-btn w-5 h-5 rounded-full border border-green-300 bg-green-100 hover:scale-110 transition-transform" data-color="green" title="綠色"></button>
                                <button class="color-filter-btn w-5 h-5 rounded-full border border-blue-300 bg-blue-100 hover:scale-110 transition-transform" data-color="blue" title="藍色"></button>
                                <button class="color-filter-btn w-5 h-5 rounded-full border border-red-300 bg-red-100 hover:scale-110 transition-transform" data-color="red" title="紅色"></button>
                                <button class="color-filter-btn w-5 h-5 rounded-full border border-purple-300 bg-purple-100 hover:scale-110 transition-transform" data-color="purple" title="紫色"></button>
                            </div>
                        </div>
                        
                        <!-- Sort Menu (Desktop) -->
                        <div class="relative hidden md:block" id="notes-sort-menu-container">
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

                         <!-- Sort Button (Mobile) -->
                        <button id="mobile-notes-sort-btn" class="md:hidden flex items-center gap-1 bg-white px-3 py-1.5 rounded-full text-sm text-text-secondary border border-gray-200 whitespace-nowrap shadow-sm">
                            <span id="mobile-notes-sort-label">排序：依新增時間</span>
                            <i data-lucide="chevron-down" class="w-3 h-3 ml-1"></i>
                        </button>
                    </div>

                    <!-- Note Cards Container -->
                    <div id="note-content-area" class="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
                        <!-- Dynamic Content -->
                    </div>

                </div>
            </div>
        </div>
    </div>
    `;
}
