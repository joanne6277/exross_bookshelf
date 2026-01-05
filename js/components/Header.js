const DROPDOWN_CONTENT = `
    <div class="p-5">
        <p class="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">連結書店帳號</p>
        <div class="space-y-3">
            <div class="store-card unlinked flex items-center justify-between p-3 rounded-lg border cursor-pointer"
                data-store-name="讀冊生活">
                <div class="flex items-center gap-3">
                    <div
                        class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                        T</div>
                    <div>
                        <p class="text-sm font-bold text-text-primary">讀冊生活</p>
                        <p class="text-xs status-text">未連結</p>
                    </div>
                </div><button
                    class="text-xs px-3 py-1.5 rounded-full font-medium transition-colors action-btn">連結</button>
            </div>
            <div class="store-card linked flex items-center justify-between p-3 rounded-lg border cursor-pointer"
                data-store-name="三民書局">
                <div class="flex items-center gap-3">
                    <div
                        class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-600">
                        S</div>
                    <div>
                        <p class="text-sm font-bold text-text-primary">三民書局</p>
                        <p class="text-xs status-text">已連結</p>
                    </div>
                </div><button
                    class="text-xs px-3 py-1.5 rounded-full font-medium transition-colors action-btn">管理</button>
            </div>
            <div id="store-iread"
                class="store-card unlinked flex items-center justify-between p-3 rounded-lg border cursor-pointer"
                data-store-id="iread" data-store-name="iRead 灰熊">
                <div class="flex items-center gap-3">
                    <div
                        class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-xs font-bold text-yellow-600">
                        i</div>
                    <div>
                        <p class="text-sm font-bold text-text-primary">iRead 灰熊</p>
                        <p class="text-xs status-text">未連結</p>
                    </div>
                </div><button
                    class="text-xs px-3 py-1.5 rounded-full font-medium transition-colors action-btn">連結</button>
            </div>
        </div>
    </div>
`;

export function createHeaderHTML() {
    return `
    <header id="desktop-header"
        class="desktop-header-container hidden md:flex sticky top-0 w-full h-16 items-center justify-between px-8 z-50 shadow-sm">
        <div class="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity logo-reload-btn">
            <span class="rounded-lg p-1.5 bg-accent/10 shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="20"
                    height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round" style="color: var(--bg-accent);">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg></span>
            <span class="text-2xl font-bold tracking-wide text-gray-700">書紐eXross</span>
        </div>

        <nav class="desktop-nav">
            <a href="#" data-view="homepage" class="nav-link active"><i data-lucide="home"
                    class="w-4 h-4"></i><span>首頁</span></a>
            <a href="#" data-view="books" class="nav-link"><i data-lucide="book"
                    class="w-4 h-4"></i><span>我的書櫃</span></a>
            <a href="#" data-view="bookmark" class="nav-link"><i data-lucide="highlighter"
                    class="w-4 h-4"></i><span>劃線筆記</span></a>
        </nav>

        <div class="flex items-center gap-4">
            <button class="p-2 rounded-full hover:bg-gray-100 transition-colors relative"><i data-lucide="bell"
                    class="w-5 h-5 text-gray-600"></i><span
                    class="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span></button>
            <div class="relative group">
                <button id="user-menu-btn-desktop"
                    class="rounded-full w-9 h-9 bg-gray-200 flex items-center justify-center overflow-hidden hover:bg-gray-300 transition-all border border-gray-200 user-menu-trigger">
                    <i data-lucide="user" class="w-5 h-5 text-gray-600"></i>
                </button>
                <div class="user-dropdown hidden absolute top-full right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden text-left text-text-primary animate-fade-in-down">
                    ${DROPDOWN_CONTENT}
                </div>
            </div>
        </div>
    </header>

    <header id="mobile-header"
        class="md:hidden fixed top-0 left-0 w-full h-14 bg-white/95 backdrop-blur border-b border-border-color flex items-center justify-between px-4 z-40 shadow-sm">
        <div class="flex items-center space-x-2 logo-reload-btn text-accent">
            <span class="rounded bg-accent/10 p-1"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                    stroke-linejoin="round" class="text-accent">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg></span>
            <span class="text-lg font-bold tracking-wide text-gray-700">書紐eXross</span>
        </div>
        <div class="flex items-center gap-3">
            <button class="relative"><i data-lucide="bell" class="w-5 h-5 text-gray-500"></i><span
                    class="absolute -top-0.5 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span></button>
            <div class="relative group">
                <button id="user-menu-btn-mobile"
                    class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-text-secondary user-menu-trigger">
                    <i data-lucide="user" class="w-4 h-4"></i>
                </button>
                <div class="user-dropdown hidden absolute top-full right-0 mt-3 w-80 max-w-[90vw] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden text-left text-text-primary animate-fade-in-down">
                    ${DROPDOWN_CONTENT}
                </div>
            </div>
        </div>
    </header>
    `;
}

export function initHeaderEvents() {
    // Logo reload
    const logoBtns = document.querySelectorAll('.logo-reload-btn');
    logoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.reload();
        });
    });

    // Handle user menu dropdowns
    // Use delegation or setup specific listeners for each trigger/dropdown pair
    // Since we wrapped them in relative containers with trigger and dropdown as siblings:
    const triggers = document.querySelectorAll('.user-menu-trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = trigger.parentElement.querySelector('.user-dropdown');

            // Close all other dropdowns first (optional, but cleaner)
            document.querySelectorAll('.user-dropdown').forEach(d => {
                if (d !== dropdown) d.classList.add('hidden');
            });

            if (dropdown) {
                dropdown.classList.toggle('hidden');
            }
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-dropdown') && !e.target.closest('.user-menu-trigger')) {
            document.querySelectorAll('.user-dropdown').forEach(d => {
                d.classList.add('hidden');
            });
        }
    });
}
