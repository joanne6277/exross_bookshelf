export function createFilterBarHTML(prefix = '') {
    // Ensure prefix has a trailing hyphen if not empty and not already having one, 
    // but usually we pass like 'details-' or 'all-books-'.
    // Existing IDs in main view were mixed. 
    // Let's standardise: 
    // Status -> ${prefix}status-filter
    // Source -> ${prefix}source-filter
    // Category -> ${prefix}category-filter
    // Sort -> ${prefix}sort-menu-btn etc.

    // Note: The original index.html didn't have IDs for status/source in the main view (all-books),
    // but it DID have ids for details view.
    // To make this work with existing logic (setupFilterLogic), we need to ensure the JS selects the right elements.
    // setupFilterLogic selects by containerId, then queries.
    // So if we add IDs, it won't hurt, but we must ensure classes match what css expects if any.

    return `
    <div id="${prefix}filter-bar" class="flex items-center gap-3 mb-4 md:mb-8 overflow-x-auto no-scrollbar w-full pb-2">
        <button id="${prefix}batch-select-btn"
            class="flex-shrink-0 px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors">批次選取</button>

        <!-- Status Filter -->
        <div class="flex-shrink-0">
            <!-- Desktop -->
            <div class="hidden md:flex items-center space-x-2 bg-transparent p-0">
                <span class="text-sm font-medium text-text-secondary whitespace-nowrap">狀態:</span>
                <select id="${prefix}status-filter"
                    class="bg-white border border-border-color rounded-lg pl-2 pr-8 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer hover:text-accent transition-colors">
                    <option>全部</option>
                    <option>未閱讀</option>
                    <option>閱讀中</option>
                    <option>已讀完</option>
                </select>
            </div>
            <!-- Mobile -->
            <button id="${prefix}mobile-status-btn" 
                class="md:hidden flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-sm text-text-secondary border border-gray-200 whitespace-nowrap shadow-sm"
                data-filter-type="status">
                <span>狀態:</span> <span id="${prefix}mobile-status-label" class="font-bold text-text-primary">全部</span>
                <i data-lucide="chevron-down" class="w-3 h-3 ml-1"></i>
            </button>
        </div>

        <!-- Source Filter -->
        <div class="flex-shrink-0 md:border-l md:border-border-color md:pl-4">
            <!-- Desktop -->
            <div class="hidden md:flex items-center space-x-2 bg-transparent p-0">
                <span class="text-sm font-medium text-text-secondary whitespace-nowrap">來源:</span>
                <select id="${prefix}source-filter"
                    class="bg-white border border-border-color rounded-lg pl-2 pr-8 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer hover:text-accent transition-colors">
                    <option>全部來源</option>
                    <option>TAAZE 讀冊</option>
                    <option>三民書局</option>
                    <option>iRead 灰熊</option>
                </select>
            </div>
            <!-- Mobile -->
            <button id="${prefix}mobile-source-btn" 
                class="md:hidden flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-sm text-text-secondary border border-gray-200 whitespace-nowrap shadow-sm"
                data-filter-type="source">
                <span>來源:</span> <span id="${prefix}mobile-source-label" class="font-bold text-text-primary">全部來源</span>
                <i data-lucide="chevron-down" class="w-3 h-3 ml-1"></i>
            </button>
        </div>

        <!-- Category Filter -->
        <div class="flex-shrink-0 md:border-l md:border-border-color md:pl-4">
           <!-- Desktop -->
            <div class="hidden md:flex items-center space-x-2 bg-transparent p-0">
                <span class="text-sm font-medium text-text-secondary whitespace-nowrap">類別:</span>
                <select id="${prefix}category-filter"
                    class="bg-white border border-border-color rounded-lg pl-2 pr-8 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer hover:text-accent transition-colors">
                    <option value="all">全部類別</option>
                    <option value="商業">商業</option>
                    <option value="文學">文學</option>
                    <option value="設計">設計</option>
                    <option value="科技">科技</option>
                </select>
            </div>
            <!-- Mobile -->
            <button id="${prefix}mobile-category-btn" 
                class="md:hidden flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-sm text-text-secondary border border-gray-200 whitespace-nowrap shadow-sm"
                data-filter-type="category">
                <span>類別:</span> <span id="${prefix}mobile-category-label" class="font-bold text-text-primary">全部類別</span>
                <i data-lucide="chevron-down" class="w-3 h-3 ml-1"></i>
            </button>
        </div>

        <div class="flex items-center space-x-2 flex-shrink-0 md:border-l md:border-border-color md:pl-4">
            <button
                class="${prefix === 'details-' ? 'details-' : ''}filter-toggle px-3 py-1.5 rounded-md text-sm bg-white border border-border-color text-text-secondary hover:text-accent hover:border-accent transition-all whitespace-nowrap">中文書</button>
            <button
                class="${prefix === 'details-' ? 'details-' : ''}filter-toggle px-3 py-1.5 rounded-md text-sm bg-white border border-border-color text-text-secondary hover:text-accent hover:border-accent transition-all whitespace-nowrap">外文書</button>
            <button
                class="${prefix === 'details-' ? 'details-' : ''}filter-toggle px-3 py-1.5 rounded-md text-sm bg-white border border-border-color text-text-secondary hover:text-accent hover:border-accent transition-all whitespace-nowrap">教科書</button>
        </div>



        <!-- Sort Menu -->
        <div class="relative flex-shrink-0 md:border-l md:border-border-color md:pl-4 hidden md:block"
            id="${prefix}sort-menu-container">
            <div class="flex items-center">
                <button id="${prefix}sort-menu-btn"
                    class="flex items-center gap-2 bg-white border border-border-color rounded-lg px-4 py-2 text-sm text-text-primary font-medium hover:border-accent focus:outline-none focus:ring-2 focus:ring-blue-300 whitespace-nowrap">
                    <span id="${prefix}sort-menu-label">排序: 最近閱讀</span>
                    <i data-lucide="chevron-down" class="w-4 h-4"></i>
                </button>
                <button id="${prefix}sort-direction-btn"
                    class="ml-2 p-2 bg-white border border-border-color rounded-lg text-text-primary hover:border-accent focus:outline-none focus:ring-2 focus:ring-blue-300">
                    <i data-lucide="arrow-down" class="w-4 h-4"></i>
                </button>
            </div>
            <div id="${prefix}sort-dropdown"
                class="hidden absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden text-left text-text-primary animate-fade-in-down">
                <div class="p-2">
                    <button class="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
                        data-sort="recently-read">最近閱讀</button>
                    <button class="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
                        data-sort="purchase-date">最近取得</button>
                    <button class="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
                        data-sort="title">書名</button>
                    <button class="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
                        data-sort="publish-date">出版日期</button>
                </div>
            </div>
        </div>

        <!-- Mobile Sort Button -->
        <div class="block md:hidden flex-shrink-0">
             <button id="${prefix}mobile-sort-btn" 
                class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-sm text-text-secondary border border-gray-200 whitespace-nowrap shadow-sm"
                data-filter-type="sort">
                <span>排序</span>
                <i data-lucide="arrow-down-up" class="w-3 h-3 ml-1"></i>
            </button>
        </div>
        <div class="flex-1"></div>
        <div class="flex bg-gray-100 p-1 rounded-lg">
            <button id="${prefix}grid-view-btn" class="view-btn active"><i data-lucide="layout-grid"
                    class="w-5 h-5"></i></button>
            <button id="${prefix}list-view-btn" class="view-btn"><i data-lucide="list"
                    class="w-5 h-5"></i></button>
        </div>
    </div>
    `;
}
