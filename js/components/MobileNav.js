export function createMobileNavHTML() {
    return `
    <nav id="mobile-bottom-nav" class="mobile-bottom-nav md:hidden fixed bottom-0 left-0 w-full h-16 flex z-50">
        <div class="mobile-nav-items flex w-full h-full justify-around items-center">
            <a href="#" data-view="homepage" class="nav-link active">
                <i data-lucide="home"></i>
                <span>首頁</span>
            </a>
            <a href="#" data-view="books" class="nav-link">
                <i data-lucide="book"></i>
                <span>書櫃</span>
            </a>
            <a href="#" data-view="bookmark" class="nav-link">
                <i data-lucide="highlighter"></i>
                <span>筆記</span>
            </a>
        </div>
    </nav>
    `;
}
