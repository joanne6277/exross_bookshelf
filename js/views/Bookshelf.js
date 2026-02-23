import { createFilterBarHTML } from '../components/FilterBar.js';

export function createBookshelfHTML() {
    return `
    <div id="view-books" class="view-section hidden">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 gap-3 md:gap-0">
            <h1 class="text-3xl font-bold text-text-primary hidden md:block">我的書櫃</h1>
            <!-- Search Bar (層級提升，橫跨所有 tab) -->
            <div id="bookshelf-search-container" class="relative w-full md:w-64">
                <input id="bookshelf-search-input" type="text" placeholder="搜尋書名、作者..."
                    class="w-full border border-border-color rounded-lg py-2.5 md:py-2 px-3 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-shadow bg-white">
                <i data-lucide="search"
                    class="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2"></i>
                <button id="bookshelf-search-clear" class="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary hidden">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>
        </div>

        <!-- Search Results (搜尋結果模擬畫面) -->
        <div id="bookshelf-search-results" class="hidden">
            <div class="flex items-center justify-between mb-4">
                <p id="search-results-info" class="text-sm text-text-secondary"></p>
            </div>
            <div id="search-results-grid"
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-8">
            </div>
            <div id="search-results-empty" class="hidden text-center py-20">
                <i data-lucide="search-x" class="w-16 h-16 text-gray-300 mx-auto mb-4"></i>
                <p class="text-lg font-medium text-text-secondary">找不到相關書籍</p>
                <p class="text-sm text-text-secondary mt-1">請嘗試不同的關鍵字</p>
            </div>
        </div>

        <!-- Tab Navigation -->
        <div id="bookshelf-tabs-container" class="border-b border-border-color mb-8 overflow-x-auto">
            <nav class="flex space-x-8 -mb-px min-w-max"><button data-tab-target="all-books"
                    class="tab-btn py-4 px-2 border-b-2 border-transparent text-text-secondary font-medium hover:text-accent transition-all tab-active text-lg">全部書籍</button><button
                    data-tab-target="collections"
                    class="tab-btn py-4 px-2 border-b-2 border-transparent text-text-secondary font-medium hover:text-accent transition-all text-lg">自訂書單</button><button
                    data-tab-target="archived"
                    class="tab-btn py-4 px-2 border-b-2 border-transparent text-text-secondary font-medium hover:text-accent transition-all text-lg">封存區</button>
            </nav>
        </div>
        <div id="tab-content">
            <div id="all-books" class="tab-panel">
                ${createFilterBarHTML('')}

                <div id="all-books-grid"
                    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-8">
                </div>
                <div id="all-books-list" class="hidden space-y-4">
                </div>

                <!-- Pagination -->
                <div id="all-books-pagination" class="mt-8"></div>

                <!-- Batch Action Bar -->
                <div id="batch-action-bar"
                    class="hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl p-4 z-50">
                    <div
                        class="bg-white rounded-xl shadow-2xl border border-gray-100 flex items-center justify-between p-4">
                        <div class="flex items-center gap-4">
                            <button id="batch-select-all-btn" class="text-accent font-bold text-sm hover:underline">全選</button>
                            <span id="selected-count" class="text-sm font-bold">已選取 0 本書</span>
                        </div>
                        <div class="flex gap-4">
                            <button id="batch-add-to-playlist-btn"
                                class="px-4 py-2 bg-blue-100 text-black text-sm font-bold rounded-lg hover:bg-opacity-90">新增到自訂書單</button>
                            <button id="batch-archive-btn"
                                class="px-4 py-2 bg-gray-200 text-text-primary text-sm font-bold rounded-lg hover:bg-gray-300">移至封存區</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="collections" class="tab-panel hidden">
                <div id="collections-grid">
                    <div id="playlist-list"
                        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        <button id="add-playlist-card-btn"
                            class="bg-secondary rounded-xl shadow-sm overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-border-color hover:border-accent hover:shadow-lg transition-all group relative aspect-[2/3] text-text-secondary hover:text-accent">
                            <i data-lucide="plus-circle" class="w-12 h-12 mb-2"></i>
                            <span class="font-bold text-lg">新增書單</span>
                        </button>
                    </div>
                </div>
                <div id="collections-list" class="hidden space-y-4">
                    <button id="add-playlist-list-btn"
                        class="bg-secondary rounded-xl shadow-sm border-2 border-dashed border-border-color p-4 flex items-center gap-6 hover:shadow-md hover:border-accent transition-all text-text-secondary hover:text-accent w-full">
                        <div
                            class="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <i data-lucide="plus" class="w-8 h-8"></i>
                        </div>
                        <div class="flex-1 text-left">
                            <h3 class="font-bold text-lg">新增書單</h3>
                        </div>
                    </button>
                    <!-- Static collection item removed/moved to JS render or kept if needed. The original index.html had one static item '我的最愛' here. 
                         However, collections.js renders these dynamically. 
                         If I keep it, it might duplicate.
                         The original code in collections.js renders contents of playlist-list.
                         The static HTML had "我的最愛" in collections-list. 
                         Let's keep the static structure for 'collections-list' if the JS expects these containers.
                    -->
                    <div
                        class="playlist-list-item bg-secondary rounded-xl shadow-sm border border-border-color p-4 flex items-center gap-6 hover:shadow-md transition-all">
                        <div
                            class="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <i data-lucide="list-music" class="w-8 h-8 text-gray-400"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="font-bold text-lg text-text-primary">我的最愛</h3>
                            <p class="text-sm text-text-secondary">0 本書</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <button class="rename-playlist-btn p-2 rounded-full hover:bg-gray-100"><i
                                    data-lucide="edit-3" class="w-5 h-5 text-text-primary"></i></button>
                            <button class="delete-playlist-btn p-2 rounded-full hover:bg-gray-100"><i
                                    data-lucide="trash-2" class="w-5 h-5 text-red-500"></i></button>
                        </div>
                    </div>
                </div>
                <!-- Pagination -->
                <div id="collections-pagination" class="mt-8"></div>
            </div>
            <div id="archived" class="tab-panel hidden">
                <div id="archive-filter-container"></div>
                <div id="archived-grid"
                    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-8">
                </div>
                <div id="archived-list" class="hidden space-y-4">
                </div>
                <!-- Pagination -->
                <div id="archived-pagination" class="mt-8"></div>
            </div>
        </div>
    </div>
    `;
}
