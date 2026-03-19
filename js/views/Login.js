// js/views/Login.js
// 登入頁面 View

import { loginWithDevice, loginWithStore } from '../features/auth.js';
import { switchView } from '../router.js';
import { openPersonalCenter } from './PersonalCenter.js';

/**
 * 建立登入頁面的 HTML
 * @returns {string} HTML string
 */
export function createLoginHTML() {
    return `
        <section id="view-login" class="view-section hidden fixed inset-0 z-[100] bg-gray-50/90 backdrop-blur-sm overflow-y-auto">
            <div class="min-h-screen w-full flex flex-col md:flex-row items-center justify-center p-4 md:p-10 gap-0 md:gap-16 lg:gap-24">

                <!-- 手機版整合容器 (Desktop 使用 contents 解除限制) -->
                <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-gray-100">

                    <!-- 右側：登入卡片 (Mobile Top, Desktop Right) -->
                <div class="bg-white p-6 md:p-10 relative overflow-hidden h-fit">
                
                    <div class="text-center mb-6">
                        <div class="w-14 h-14 bg-[var(--bg-accent)] rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-accent/20">
                            <i data-lucide="book-open" class="w-7 h-7"></i>
                        </div>
                        <h1 class="text-2xl font-bold text-text-primary mb-2">登入書紐 eXross</h1>
                        <p class="text-sm text-text-secondary">請選擇您的登入方式</p>
                    </div>

                    <!-- App 掃碼登入區塊 -->
                    <div class="mb-6">
                        <div class="flex items-center gap-2 mb-3">
                            <i data-lucide="smartphone" class="w-5 h-5 text-gray-500"></i>
                            <h2 class="text-sm font-bold text-text-primary">使用書紐 App 掃碼登入</h2>
                        </div>
                        <div class="bg-gray-50 p-4 border border-gray-100 rounded-2xl">
                            <div class="flex flex-col sm:flex-row items-center gap-4">
                                <!-- QR Code 容器 -->
                                <div class="relative bg-white p-2 rounded-xl shadow-sm border border-gray-200 w-[140px] h-[140px] flex-shrink-0 flex items-center justify-center group overflow-hidden cursor-pointer" id="login-qr-container">
                                    <i data-lucide="qr-code" class="w-full h-full text-gray-800 opacity-90"></i>
                                    <!-- 掃描動畫線 -->
                                    <div id="login-qr-scan-line" class="absolute top-0 left-0 w-full h-[2px] bg-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.5)] animate-[scan_2.5s_ease-in-out_infinite]"></div>
                                    
                                    <!-- 模擬掃描成功按鈕區 -->
                                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div class="text-white text-xs font-bold px-2 py-1 bg-[var(--bg-accent)] rounded-lg">點擊模擬掃描</div>
                                    </div>

                                    <!-- 失效遮罩 -->
                                    <div id="login-qr-expired-overlay" class="absolute inset-0 bg-white/80 flex flex-col items-center justify-center hidden">
                                        <i data-lucide="refresh-cw" class="w-8 h-8 text-gray-400 mb-1"></i>
                                    </div>
                                </div>
                                <!-- 說明文字與狀態 -->
                                <div class="flex-1 text-center sm:text-left flex flex-col justify-center">
                                    <p class="text-xs text-text-secondary leading-relaxed mb-3">開啟書紐 eXross App 掃描下方 QR Code，即可同步匯入您在各書店已購買的所有電子書</p>
                                    
                                    <div class="flex items-center justify-center sm:justify-start gap-2 mb-2">
                                        <span id="login-qr-status" class="text-xs font-bold text-gray-500 px-2 py-1 bg-gray-100 rounded-full">等待掃描中...</span>
                                    </div>
                                    
                                    <div class="flex items-center justify-center sm:justify-start gap-2">
                                        <span class="text-xs text-text-secondary font-medium">重整倒數:</span>
                                        <span id="login-qr-countdown" class="text-xs font-bold text-gray-800 w-8">90 秒</span>
                                        <button id="login-qr-refresh-btn" class="ml-1 p-1 text-gray-400 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-200" title="重新整理 QR Code">
                                            <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 分隔線 -->
                    <div class="flex items-center gap-4 my-6">
                        <div class="h-px bg-gray-200 flex-1"></div>
                        <span class="text-xs font-medium text-gray-400">或</span>
                        <div class="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <!-- 書店帳號登入區塊 -->
                    <div>
                        <div class="flex items-center gap-2 mb-3">
                            <i data-lucide="library" class="w-5 h-5 text-gray-500"></i>
                            <h2 class="text-sm font-bold text-text-primary">使用書店帳號登入</h2>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-3">
                            <button class="store-login-card flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group" data-store="三民書局">
                                <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-600 mb-2 group-hover:scale-105 transition-transform">
                                    S
                                </div>
                                <p class="text-sm font-bold text-text-primary">三民書局</p>
                            </button>

                            <button class="store-login-card flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 hover:border-yellow-500 hover:bg-yellow-50 transition-all group" data-store="灰熊愛讀書">
                                <div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-sm font-bold text-yellow-600 mb-2 group-hover:scale-105 transition-transform">
                                    i
                                </div>
                                <p class="text-sm font-bold text-text-primary">灰熊愛讀書</p>
                            </button>
                        </div>
                    </div>

                    <!-- 登入問題引導 -->
                    <div class="mt-8 text-center">
                        <button id="login-help-btn" class="text-xs text-text-secondary hover:text-accent hover:underline transition-all flex items-center justify-center gap-1 mx-auto">
                            <i data-lucide="help-circle" class="w-3 h-3"></i>
                            登入有問題？
                        </button>
                    </div>

                </div>
                </div> <!-- 結束整合容器 -->
            </div>

            <!-- 登入問題小對話窗 -->
            <div id="login-help-modal" class="hidden fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px]">
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-xs overflow-hidden animate-scale-in">
                    <div class="p-4 border-b border-gray-50 flex justify-between items-center">
                        <h3 class="font-bold text-sm text-text-primary">登入幫助</h3>
                        <button id="close-login-help" class="text-gray-400 hover:text-gray-600">
                            <i data-lucide="x" class="w-4 h-4"></i>
                        </button>
                    </div>
                    <div class="p-4 space-y-4">
                        <div class="space-y-1">
                            <p class="text-xs font-bold text-accent">QR Code 無法掃描？</p>
                            <p class="text-[11px] text-text-secondary leading-relaxed">請確保書紐 App 已更新至最新版本，並檢查鏡頭是否清晰。若持續失敗，請嘗試「重新整理」QR Code。</p>
                        </div>
                        <div class="space-y-1">
                            <p class="text-xs font-bold text-accent">書店帳號登入失敗？</p>
                            <p class="text-[11px] text-text-secondary leading-relaxed">請確認您在該書店的帳號密碼正確。部分書店可能需要您先在原站完成手機驗證或信箱認證。</p>
                        </div>
                        <div class="space-y-1">
                            <p class="text-xs font-bold text-accent">找不到已購書籍？</p>
                            <p class="text-[11px] text-text-secondary leading-relaxed">初次登入後同步可能需要 1-2 分鐘。若仍未顯示，請確認您已正確連結該書籍所屬的書店帳號。</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                @keyframes scan {
                    0%, 100% { transform: translateY(0); opacity: 0; }
                    10%, 90% { opacity: 1; }
                    50% { transform: translateY(140px); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scaleIn 0.2s ease-out;
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            </style>
        </section>
    `;
}

/**
 * 初始化登入頁面事件
 */
export function initLoginEvents() {
    const view = document.getElementById('view-login');
    if (!view) return;

    // 各家書店登入跳轉模擬
    view.querySelectorAll('.store-login-card').forEach(card => {
        card.addEventListener('click', () => {
            const storeName = card.dataset.store;
            
            // 模擬導向外站並回傳成功
            console.log(`[Login] Redirecting to ${storeName} for auth...`);
            
            // 寫入授權狀態 (Single Mode)
            loginWithStore(storeName);

            // 切換至首頁
            setTimeout(() => {
                switchView('homepage');
            }, 300);
        });
    });

    // QR Code 相關邏輯
    const qrContainer = view.querySelector('#login-qr-container');
    const qrSuccessBtn = view.querySelector('.absolute.inset-0.bg-black\\/40'); // 模擬點擊區塊
    const qrCountdownSpan = view.querySelector('#login-qr-countdown');
    const qrRefreshBtn = view.querySelector('#login-qr-refresh-btn');
    const qrStatus = view.querySelector('#login-qr-status');
    const qrScanLine = view.querySelector('#login-qr-scan-line');
    const qrExpiredOverlay = view.querySelector('#login-qr-expired-overlay');

    let countdownTimer = null;
    let timeLeft = 90;

    const startCountdown = () => {
        clearInterval(countdownTimer);
        timeLeft = 90;
        qrCountdownSpan.textContent = `${timeLeft} 秒`;
        qrContainer.classList.remove('opacity-50', 'pointer-events-none');
        qrScanLine.style.display = 'block';
        qrExpiredOverlay.classList.add('hidden');
        qrStatus.textContent = '等待掃描中...';
        qrStatus.classList.replace('text-red-500', 'text-gray-500');
        qrStatus.classList.replace('bg-red-50', 'bg-gray-100');

        countdownTimer = setInterval(() => {
            timeLeft--;
            qrCountdownSpan.textContent = `${timeLeft} 秒`;
            
            if (timeLeft <= 0) {
                clearInterval(countdownTimer);
                expireQrCode();
            }
        }, 1000);
    };

    const expireQrCode = () => {
        qrContainer.classList.add('opacity-50', 'pointer-events-none');
        qrScanLine.style.display = 'none';
        qrExpiredOverlay.classList.remove('hidden');
        qrStatus.textContent = '已失效，請重整';
        qrStatus.classList.replace('text-gray-500', 'text-red-500');
        qrStatus.classList.replace('bg-gray-100', 'bg-red-50');
    };

    if (qrRefreshBtn) {
        qrRefreshBtn.addEventListener('click', () => {
            // 簡單旋轉動畫
            qrRefreshBtn.classList.add('animate-spin');
            setTimeout(() => qrRefreshBtn.classList.remove('animate-spin'), 500);
            startCountdown();
        });
    }

    if (qrSuccessBtn) {
        qrSuccessBtn.addEventListener('click', () => {
            if (timeLeft <= 0) return;
            
            clearInterval(countdownTimer);
            qrStatus.textContent = '掃描成功！登入中...';
            qrStatus.classList.replace('text-gray-500', 'text-green-600');
            qrStatus.classList.replace('bg-gray-100', 'bg-green-100');
            qrScanLine.style.display = 'none';
            
            setTimeout(() => {
                // 模擬已連結設備，並帶入幾家書店
                loginWithDevice(['三民書局', '讀冊生活']);
                switchView('homepage');
            }, 800);
        });
    }

    // 登入幫助對話窗邏輯
    const helpBtn = view.querySelector('#login-help-btn');
    const helpModal = view.querySelector('#login-help-modal');
    const closeHelpBtn = view.querySelector('#close-login-help');
    const goToFaqBtn = helpModal.querySelector('button.text-blue-600');

    if (helpBtn && helpModal) {
        helpBtn.addEventListener('click', () => {
            helpModal.classList.remove('hidden');
        });

        const hideModal = () => helpModal.classList.add('hidden');

        closeHelpBtn.addEventListener('click', hideModal);
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) hideModal();
        });
    }

    // 啟動頁面時若登入頁面顯示，應該啟動倒數
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (!view.classList.contains('hidden')) {
                    startCountdown();
                } else {
                    clearInterval(countdownTimer);
                }
            }
        });
    });
    observer.observe(view, { attributes: true });

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
