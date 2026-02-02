export function createFilterBarHTML(prefix = '') {
    return `
    <div id="${prefix}filter-bar" class="flex items-center gap-3 mb-4 md:mb-8 overflow-x-auto no-scrollbar w-full pb-2">
        <button id="${prefix}batch-select-btn"
            class="flex-shrink-0 px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors">批次選取</button>

        <!-- Status Filter -->
        <div class="flex-shrink-0">
            <!-- Desktop -->
            <div class="hidden md:flex items-center space-x-2 bg-transparent p-0">
                <span class="text-sm font-medium text-text-secondary whitespace-nowrap">閱讀狀態:</span>
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
                <span>閱讀狀態:</span> <span id="${prefix}mobile-status-label" class="font-bold text-text-primary">全部</span>
                <i data-lucide="chevron-down" class="w-3 h-3 ml-1"></i>
            </button>
        </div>

        <!-- Source Filter -->
        <div class="flex-shrink-0 md:border-l md:border-border-color md:pl-4">
            <!-- Desktop -->
            <div class="hidden md:flex items-center space-x-2 bg-transparent p-0">
                <span class="text-sm font-medium text-text-secondary whitespace-nowrap">購書來源:</span>
                <select id="${prefix}source-filter"
                    class="bg-white border border-border-color rounded-lg pl-2 pr-8 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer hover:text-accent transition-colors">
                    <option>全部</option>
                    <option>TAAZE 讀冊</option>
                    <option>三民書局</option>
                    <option>iRead 灰熊</option>
                </select>
            </div>
            <!-- Mobile -->
            <button id="${prefix}mobile-source-btn" 
                class="md:hidden flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-sm text-text-secondary border border-gray-200 whitespace-nowrap shadow-sm"
                data-filter-type="source">
                <span>購書來源:</span> <span id="${prefix}mobile-source-label" class="font-bold text-text-primary">全部</span>
                <i data-lucide="chevron-down" class="w-3 h-3 ml-1"></i>
            </button>
        </div>

        <!-- Category Filter -->
        <div class="flex-shrink-0 md:border-l md:border-border-color md:pl-4">
           <!-- Desktop -->
            <div class="hidden md:flex items-center space-x-2 bg-transparent p-0">
                <span class="text-sm font-medium text-text-secondary whitespace-nowrap">分類:</span>
                <select id="${prefix}category-filter"
                    class="bg-white border border-border-color rounded-lg pl-2 pr-8 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer hover:text-accent transition-colors">
                    <option value="all">全部</option>
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
                <span>分類:</span> <span id="${prefix}mobile-category-label" class="font-bold text-text-primary">全部</span>
                <i data-lucide="chevron-down" class="w-3 h-3 ml-1"></i>
            </button>
        </div>

        <!-- Type Filter (Consolidated) -->
        <div class="flex-shrink-0 md:border-l md:border-border-color md:pl-4">
            <!-- Desktop -->
             <div class="hidden md:flex items-center space-x-2 bg-transparent p-0">
                 <span class="text-sm font-medium text-text-secondary whitespace-nowrap">書種:</span>
                 <select id="${prefix}type-filter"
                     class="bg-white border border-border-color rounded-lg pl-2 pr-8 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer hover:text-accent transition-colors">
                     <option value="all">全部</option>
                     <option value="中文書">中文書</option>
                     <option value="外文書">外文書</option>
                     <option value="教科書">教科書</option>
                     <option value="audiobook">有聲書</option>
                     <option value="tts">可朗讀</option>
                 </select>
             </div>
             <!-- Mobile -->
             <button id="${prefix}mobile-type-btn" 
                 class="md:hidden flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-sm text-text-secondary border border-gray-200 whitespace-nowrap shadow-sm"
                 data-filter-type="type">
                 <span>書種:</span> <span id="${prefix}mobile-type-label" class="font-bold text-text-primary">全部</span>
                 <i data-lucide="chevron-down" class="w-3 h-3 ml-1"></i>
             </button>
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
