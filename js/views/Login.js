// js/views/Login.js
// 登入頁面 View

/**
 * 建立登入頁面的 HTML
 * @returns {string} HTML string
 */
export function createLoginHTML() {
    return `
        <section id="view-login" class="view-section hidden flex items-center justify-center min-h-screen w-full fixed inset-0 z-[100] bg-gray-50/90 backdrop-blur-sm overflow-y-auto pt-10 pb-10">
            <div class="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md animate-slide-up mx-auto relative overflow-hidden my-auto h-fit">
                
                <!-- 主登入選擇畫面 -->
                <div id="login-main-step" class="transition-all duration-300 transform translate-x-0 w-full">
                    <div class="text-center mb-8">
                        <div class="w-16 h-16 bg-[var(--bg-accent)] rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-accent/20">
                            <i data-lucide="book-open" class="w-8 h-8"></i>
                        </div>
                        <h1 class="text-2xl font-bold text-text-primary mb-2">歡迎來到書紐 eXross</h1>
                        <p class="text-sm text-text-secondary">數位閱讀的跨界樞紐</p>
                    </div>

                    <div class="space-y-4">
                        <div class="p-1 bg-gray-50 rounded-xl relative mb-6">
                            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span class="text-xs font-bold text-gray-400 bg-gray-50 px-2">請選擇登入方式</span>
                            </div>
                        </div>
                    
                        <button id="login-carrier-btn" class="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50/50 transition-all group">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                    <i data-lucide="smartphone" class="w-5 h-5"></i>
                                </div>
                                <div class="text-left">
                                    <p class="text-sm font-bold text-text-primary group-hover:text-green-900">載具登入 (多帳號)</p>
                                    <p class="text-xs text-text-secondary">綁定手機條碼，同步所有書櫃</p>
                                </div>
                            </div>
                            <i data-lucide="chevron-right" class="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors"></i>
                        </button>

                        <button id="login-single-btn" class="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-[var(--bg-accent)] hover:bg-blue-50/50 transition-all group">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <i data-lucide="store" class="w-5 h-5"></i>
                                </div>
                                <div class="text-left">
                                    <p class="text-sm font-bold text-text-primary group-hover:text-blue-900">單一書店登入</p>
                                    <p class="text-xs text-text-secondary">選擇一家合作書店進行認證</p>
                                </div>
                            </div>
                            <i data-lucide="chevron-right" class="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors"></i>
                        </button>
                    </div>
                    
                </div>

                <!-- 單一書店選擇畫面 -->
                <div id="login-store-step" class="transition-all duration-300 transform translate-x-full absolute top-0 left-0 w-full h-full p-6 md:p-10 bg-white hidden">
                    <div class="flex items-center gap-3 mb-6">
                        <button id="login-back-btn" class="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-text-secondary">
                            <i data-lucide="arrow-left" class="w-5 h-5"></i>
                        </button>
                        <h2 class="text-xl font-bold text-text-primary">選擇登入書店</h2>
                    </div>

                    <p class="text-sm text-text-secondary mb-6">請選擇您要登入的合作書店，我們將導向該書店進行安全認證。</p>
                    
                    <div class="space-y-3">
                        <button class="store-login-card w-full flex items-center p-4 rounded-xl border border-gray-200 hover:border-[var(--bg-accent)] hover:bg-gray-50 transition-all group" data-store="讀冊生活">
                            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-600 mr-4 group-hover:scale-105 transition-transform">
                                T
                            </div>
                            <div class="text-left flex-1">
                                <p class="text-base font-bold text-text-primary">讀冊生活</p>
                            </div>
                            <i data-lucide="external-link" class="w-4 h-4 text-gray-400 group-hover:text-[var(--bg-accent)] transition-colors"></i>
                        </button>
                        
                        <button class="store-login-card w-full flex items-center p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group" data-store="三民書局">
                            <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-lg font-bold text-green-600 mr-4 group-hover:scale-105 transition-transform">
                                S
                            </div>
                            <div class="text-left flex-1">
                                <p class="text-base font-bold text-text-primary">三民書局</p>
                            </div>
                            <i data-lucide="external-link" class="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors"></i>
                        </button>
                        
                        <button class="store-login-card w-full flex items-center p-4 rounded-xl border border-gray-200 hover:border-yellow-500 hover:bg-yellow-50 transition-all group" data-store="iRead 灰熊">
                            <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-lg font-bold text-yellow-600 mr-4 group-hover:scale-105 transition-transform">
                                i
                            </div>
                            <div class="text-left flex-1">
                                <p class="text-base font-bold text-text-primary">iRead 灰熊</p>
                            </div>
                            <i data-lucide="external-link" class="w-4 h-4 text-gray-400 group-hover:text-yellow-500 transition-colors"></i>
                        </button>
                    </div>
                </div>

            </div>
        </section>
    `;
}

/**
 * 初始化登入頁面事件
 */
export function initLoginEvents() {
    const view = document.getElementById('view-login');
    if (!view) return;

    const mainStep = view.querySelector('#login-main-step');
    const storeStep = view.querySelector('#login-store-step');

    // 單一書店登入模擬 -> 切換畫面
    const singleBtn = view.querySelector('#login-single-btn');
    if (singleBtn) {
        singleBtn.addEventListener('click', () => {
            mainStep.classList.remove('translate-x-0');
            mainStep.classList.add('-translate-x-full');

            storeStep.classList.remove('hidden');
            // Allow display: block to render before animating transform
            requestAnimationFrame(() => {
                storeStep.classList.remove('translate-x-full');
                storeStep.classList.add('translate-x-0');
            });
        });
    }

    // 返回上一步
    const backBtn = view.querySelector('#login-back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            storeStep.classList.remove('translate-x-0');
            storeStep.classList.add('translate-x-full');

            mainStep.classList.remove('-translate-x-full');
            mainStep.classList.add('translate-x-0');

            setTimeout(() => {
                storeStep.classList.add('hidden');
            }, 300);
        });
    }

    // 各家書店登入跳轉模擬
    view.querySelectorAll('.store-login-card').forEach(card => {
        card.addEventListener('click', () => {
            const storeName = card.dataset.store;
            alert(`即將導向「${storeName}」外站進行登入與授權...\n\n(Demo: 驗證成功，跳轉回首頁)`);

            // 重設視圖狀態
            storeStep.classList.add('hidden', 'translate-x-full');
            storeStep.classList.remove('translate-x-0');
            mainStep.classList.remove('-translate-x-full');
            mainStep.classList.add('translate-x-0');

            document.querySelector('.nav-link[data-view="homepage"]')?.click();
        });
    });

    // 載具登入模擬
    const carrierBtn = view.querySelector('#login-carrier-btn');
    if (carrierBtn) {
        carrierBtn.addEventListener('click', () => {
            alert('即將開啟「載具身分驗證」流程...\n\n(Demo: 驗證成功，跳轉回首頁)');
            document.querySelector('.nav-link[data-view="homepage"]')?.click();
        });
    }
}

/**
 * 開啟登入頁面
 */
export function openLoginView() {
    // 隱藏所有視圖
    document.querySelectorAll('.view-section').forEach(view => {
        view.classList.add('hidden');
    });

    // 顯示登入頁面
    const loginView = document.getElementById('view-login');
    if (loginView) {
        loginView.classList.remove('hidden');

        // Always reset to main step on open
        const mainStep = loginView.querySelector('#login-main-step');
        const storeStep = loginView.querySelector('#login-store-step');
        if (mainStep && storeStep) {
            storeStep.classList.add('hidden', 'translate-x-full');
            storeStep.classList.remove('translate-x-0');
            mainStep.classList.remove('-translate-x-full');
            mainStep.classList.add('translate-x-0');
        }
    }

    // 將 Navbar 和 Header 隱藏，使登入頁面獨立
    const desktopHeader = document.getElementById('desktop-header');
    const mobileHeader = document.getElementById('mobile-header');
    const mobileBottomNav = document.getElementById('mobile-bottom-nav');

    if (desktopHeader) desktopHeader.style.display = 'none';
    if (mobileHeader) mobileHeader.style.display = 'none';
    if (mobileBottomNav) mobileBottomNav.style.display = 'none';

    // 清除導覽列選中狀態
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    console.log('[Login] View opened.');
}
