// js/views/Login.js
// 登入頁面 View

/**
 * 建立登入頁面的 HTML
 * @returns {string} HTML string
 */
export function createLoginHTML() {
    return `
        <section id="view-login" class="view-section hidden fixed inset-0 z-[100] bg-gray-50/90 backdrop-blur-sm overflow-y-auto">
            <div class="min-h-screen w-full flex flex-col md:flex-row items-center justify-center p-4 md:p-10 gap-0 md:gap-16 lg:gap-24">

                <!-- 手機版整合容器 (Desktop 使用 contents 解除限制) -->
                <div class="w-full max-w-md md:max-w-none flex flex-col md:contents bg-white md:bg-transparent rounded-3xl md:rounded-none shadow-2xl md:shadow-none overflow-hidden my-8 md:my-0 border border-gray-100 md:border-none">

                    <!-- 左側：App 下載引導區塊 (手機版呈現於卡片底部) -->
                    <div class="w-full md:max-w-lg text-center md:text-left order-2 md:order-1 animate-slide-up bg-gray-50/60 md:bg-transparent px-6 py-8 md:p-0 border-t border-gray-100 md:border-none relative">

                    <!-- 品牌 Logo (手機版隱藏，避免與登入卡片重複) -->
                    <div class="hidden md:flex items-center gap-3 justify-center md:justify-start mb-6">
                        <div class="w-12 h-12 bg-[var(--bg-accent)] rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
                            <i data-lucide="book-open" class="w-6 h-6"></i>
                        </div>
                        <span class="text-2xl font-bold text-text-primary">書紐 eXross</span>
                    </div>

                    <!-- 主標題 -->
                    <h1 class="text-xl md:text-4xl font-extrabold text-text-primary mb-3 md:mb-4 leading-tight">
                        一個 App，<br class="hidden md:block">看遍多家書城的書
                    </h1>
                    <p class="text-sm md:text-base text-text-secondary mb-6 md:mb-8 leading-relaxed max-w-sm mx-auto md:mx-0">
                        下載書紐 App，整合灰熊愛讀書、讀冊、三民等多家書城帳號，隨時隨地享受跨平台閱讀體驗。
                    </p>

                    <!-- 功能亮點 (手機版隱藏) -->
                    <div class="hidden md:flex flex-col gap-3 mb-8 max-w-sm mx-auto md:mx-0">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <i data-lucide="library" class="w-4 h-4 text-blue-600"></i>
                            </div>
                            <span class="text-sm text-text-primary">多家書城帳號一鍵整合</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <i data-lucide="book-marked" class="w-4 h-4 text-green-600"></i>
                            </div>
                            <span class="text-sm text-text-primary">跨平台劃線筆記同步</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <i data-lucide="smartphone" class="w-4 h-4 text-purple-600"></i>
                            </div>
                            <span class="text-sm text-text-primary">離線閱讀，隨時隨地享受書籍</span>
                        </div>
                    </div>

                    <!-- 下載按鈕 -->
                    <div class="flex flex-wrap gap-4 justify-center md:justify-start">
                        <!-- App Store -->
                        <div class="flex items-center gap-2">
                            <button onclick="alert('即將前往 App Store 下載頁面...')" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg flex-1">
                                <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                                <div class="text-left">
                                    <div class="text-[10px] leading-none opacity-80">Download on the</div>
                                    <div class="text-sm font-bold leading-tight">App Store</div>
                                </div>
                            </button>
                            <div class="hidden md:flex p-1.5 bg-white rounded-xl shadow-sm border border-gray-200" title="掃描下載 iOS 版">
                                <i data-lucide="qr-code" class="w-8 h-8 text-gray-800"></i>
                            </div>
                        </div>

                        <!-- Google Play -->
                        <div class="flex items-center gap-2">
                            <button onclick="alert('即將前往 Google Play 下載頁面...')" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg flex-1">
                                <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 0 1 0 1.38l-2.302 2.302L15.396 12l2.302-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302L5.864 2.658z"/></svg>
                                <div class="text-left">
                                    <div class="text-[10px] leading-none opacity-80">GET IT ON</div>
                                    <div class="text-sm font-bold leading-tight">Google Play</div>
                                </div>
                            </button>
                            <div class="hidden md:flex p-1.5 bg-white rounded-xl shadow-sm border border-gray-200" title="掃描下載 Android 版">
                                <i data-lucide="qr-code" class="w-8 h-8 text-gray-800"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 右側：登入卡片 (Mobile Top, Desktop Right) -->
                <div class="bg-white p-6 md:p-10 md:rounded-2xl md:shadow-xl md:border md:border-gray-100 w-full md:max-w-md animate-slide-up relative overflow-hidden order-1 md:order-2 h-fit">
                
                    <!-- 主登入選擇畫面 -->
                    <div id="login-main-step" class="transition-all duration-300 transform translate-x-0 w-full">
                        <div class="text-center mb-8">
                            <div class="w-16 h-16 bg-[var(--bg-accent)] rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-accent/20 md:hidden">
                                <i data-lucide="book-open" class="w-8 h-8"></i>
                            </div>
                            <h1 class="text-2xl font-bold text-text-primary mb-2">歡迎來到書紐 eXross</h1>
                            <p class="text-sm text-text-secondary">數位閱讀的跨界樞紐</p>
                        </div>

                        <div class="space-y-4">
                            <div class="p-1 bg-gray-50 rounded-xl relative mb-6">
                                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span class="text-xs font-bold text-gray-400 bg-gray-50 px-2">請選擇網頁版登入方式</span>
                                </div>
                            </div>
                        
                            <button id="login-carrier-btn" class="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50/50 transition-all group">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                        <i data-lucide="smartphone" class="w-5 h-5"></i>
                                    </div>
                                    <div class="text-left">
                                        <p class="text-sm font-bold text-text-primary group-hover:text-green-900">裝置登入 (多書店)</p>
                                        <p class="text-xs text-text-secondary">綁定裝置，同步所有書櫃</p>
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
                </div> <!-- 結束整合容器 -->
            </div>

            <!-- QR Code 掃描彈窗 -->
            <div id="login-qr-modal" class="fixed inset-0 bg-black/60 z-[110] hidden flex items-center justify-center backdrop-blur-sm transition-opacity opacity-0">
                <div class="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl transform scale-95 transition-all duration-300 text-center flex flex-col items-center">
                    <div class="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i data-lucide="scan-line" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-xl font-bold text-text-primary mb-2">請掃描 QR Code</h3>
                    <p class="text-sm text-text-secondary mb-6">請使用書紐 App 掃描下方 QR Code<br>以完成裝置登入驗證</p>
                    
                    <div class="bg-gray-50 p-6 rounded-2xl inline-block mb-6 border border-gray-100 flex items-center justify-center">
                        <i data-lucide="qr-code" class="w-40 h-40 text-gray-800"></i>
                    </div>
                    
                    <div class="flex gap-3 w-full">
                        <button id="login-qr-cancel-btn" class="flex-1 py-3 px-4 rounded-full border border-gray-200 text-text-secondary font-medium hover:bg-gray-50 transition-colors">
                            取消
                        </button>
                        <button id="login-qr-success-btn" class="flex-1 py-3 px-4 rounded-full bg-[var(--bg-accent)] text-white font-medium hover:bg-opacity-90 transition-colors">
                            模擬掃描成功
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

    // 載具登入 -> 開啟 QR Code 掃描彈窗
    const carrierBtn = view.querySelector('#login-carrier-btn');
    const qrModal = document.getElementById('login-qr-modal');
    const qrCancelBtn = document.getElementById('login-qr-cancel-btn');
    const qrSuccessBtn = document.getElementById('login-qr-success-btn');

    const openQrModal = () => {
        if (!qrModal) return;
        qrModal.classList.remove('hidden');
        // Trigger animation
        setTimeout(() => {
            qrModal.classList.remove('opacity-0');
            const modalContent = qrModal.querySelector('.bg-white');
            if (modalContent) {
                modalContent.classList.remove('scale-95');
                modalContent.classList.add('scale-100');
            }
        }, 10);
        // Re-render lucide icons inside modal if needed
        if (window.lucide) {
            window.lucide.createIcons({ root: qrModal });
        }
    };

    const closeQrModal = () => {
        if (!qrModal) return;
        qrModal.classList.add('opacity-0');
        const modalContent = qrModal.querySelector('.bg-white');
        if (modalContent) {
            modalContent.classList.remove('scale-100');
            modalContent.classList.add('scale-95');
        }
        setTimeout(() => {
            qrModal.classList.add('hidden');
        }, 300);
    };

    if (carrierBtn) {
        carrierBtn.addEventListener('click', openQrModal);
    }

    if (qrCancelBtn) {
        qrCancelBtn.addEventListener('click', closeQrModal);
    }

    if (qrSuccessBtn) {
        qrSuccessBtn.addEventListener('click', () => {
            closeQrModal();
            setTimeout(() => {
                document.querySelector('.nav-link[data-view="homepage"]')?.click();
            }, 300);
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
