// js/components/personal-center/AccountSection.js
// 帳號管理區塊元件
import { openLoginView } from '../../views/Login.js';
import { updateHeaderLoginMode } from '../Header.js';

/**
 * 建立帳號管理區塊的 HTML
 * @returns {string} HTML string
 */
export function createAccountSectionHTML() {
    return `
        <div class="account-section">
            <div class="mb-6">
                <h2 class="text-xl font-bold text-text-primary mb-2">帳號管理</h2>
                <p class="text-sm text-text-secondary">管理您的書店帳號連結狀態</p>
            </div>
            
            <!-- 單一帳號登入模式視圖 -->
            <div id="single-mode-view" class="space-y-8 transition-all duration-300">
                <!-- 我的書店 -->
                <div class="space-y-4">
                    <h3 class="text-lg font-bold text-text-primary">目前的書店</h3>
                    <!-- 三民書局 (已連結) -->
                    <div class="store-card-large linked flex items-center justify-between p-4 rounded-xl border bg-green-50 border-green-200 cursor-pointer transition-all hover:shadow-md"
                         data-store-name="三民書局">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-lg font-bold text-green-600">
                                S
                            </div>
                            <div>
                                <p class="text-base font-bold text-text-primary">三民書局</p>
                            </div>
                        </div>
                        <button class="store-status-btn text-sm px-4 py-2 rounded-full font-medium transition-colors border border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                                data-base-text="登出" data-carrier-text="登出">
                            登出
                        </button>
                    </div>
                </div>

                <!-- 可切換書店 -->
                <div class="space-y-4">
                    <h3 class="text-lg font-bold text-text-primary">其他可切換的書店</h3>
                    <!-- 讀冊生活 -->
                    <div class="store-card-large flex items-center justify-between p-4 rounded-xl border bg-white cursor-pointer transition-all hover:shadow-md"
                         data-store-name="讀冊生活">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-600">
                                T
                            </div>
                            <div>
                                <p class="text-base font-bold text-text-primary">讀冊生活</p>
                            </div>
                        </div>
                        <button class="store-status-btn text-sm px-4 py-2 rounded-full font-medium transition-colors border border-gray-200 text-text-secondary hover:bg-[var(--bg-accent)] hover:text-white"
                                data-base-text="切換" data-carrier-text="切換">
                            切換
                        </button>
                    </div>

                    <!-- iRead 灰熊 -->
                    <div class="store-card-large flex items-center justify-between p-4 rounded-xl border bg-white cursor-pointer transition-all hover:shadow-md"
                         data-store-name="iRead 灰熊">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-lg font-bold text-yellow-600">
                                i
                            </div>
                            <div>
                                <p class="text-base font-bold text-text-primary">iRead 灰熊</p>
                            </div>
                        </div>
                        <button class="store-status-btn text-sm px-4 py-2 rounded-full font-medium transition-colors border border-gray-200 text-text-secondary hover:bg-[var(--bg-accent)] hover:text-white"
                                data-base-text="切換" data-carrier-text="切換">
                            切換
                        </button>
                    </div>
                </div>

                <!-- 裝置驗證入口 -->
                <div class="p-6 md:p-8 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i data-lucide="smartphone" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-lg font-bold text-text-primary mb-2">連結裝置</h3>
                    <p class="text-sm text-text-secondary mb-6 max-w-md mx-auto">
                        透過裝置登入，系統將會自動帶入您在各個合作書店的帳號，一次滿足多平台閱讀需求！
                    </p>
                    <button id="carrier-verify-btn" class="px-6 py-3 bg-[var(--bg-accent)] text-white rounded-full font-medium hover:bg-opacity-90 transition-all shadow-sm">
                        進行裝置驗證
                    </button>
                </div>
            </div>

            <!-- 裝置登入模式視圖 -->
            <div id="carrier-mode-view" class="hidden space-y-6 transition-all duration-300">
                <div class="flex items-center justify-between mb-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex-wrap gap-4">
                    <div class="flex items-center gap-3">
                        <i data-lucide="check-circle" class="w-5 h-5 text-blue-600 flex-shrink-0"></i>
                        <div>
                            <p class="text-sm font-bold text-blue-900">已連結裝置：iphone 17 pro</p>
                            <p class="text-xs text-blue-700">我們已為您同步以下書店帳號</p>
                        </div>
                    </div>
                    <button id="carrier-unlink-btn" class="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-full hover:bg-blue-50 transition-colors whitespace-nowrap">
                        解除連結
                    </button>
                </div>

                <!-- 這裡會顯示裝置帶入的書店列表 -->
                <div class="space-y-4">
                    <div class="store-card-large linked flex items-center justify-between p-4 rounded-xl border bg-green-50 border-green-200">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-lg font-bold text-green-600">
                                S
                            </div>
                            <div>
                                <p class="text-base font-bold text-text-primary">三民書局</p>
                                <p class="text-sm status-text text-green-600 font-medium">已透過裝置連結</p>
                            </div>
                        </div>
                        <span class="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium hidden md:inline-block">
                            驗證成功
                        </span>
                    </div>
                    <div class="store-card-large linked flex items-center justify-between p-4 rounded-xl border bg-gray-50 border-gray-200">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-600">
                                T
                            </div>
                            <div>
                                <p class="text-base font-bold text-text-primary">讀冊生活</p>
                                <p class="text-sm status-text text-green-600 font-medium">已透過裝置連結</p>
                            </div>
                        </div>
                        <span class="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium hidden md:inline-block">
                            驗證成功
                        </span>
                    </div>
                </div>
            </div>

            <!-- 說明區塊 -->
            <div class="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div class="flex gap-3">
                    <i data-lucide="info" class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"></i>
                    <div>
                        <p class="text-sm font-medium text-blue-800 mb-1">什麼是書店帳號連結？</p>
                        <p class="text-xs text-blue-600 leading-relaxed">
                            連結您在各書店的帳號後，即可在書紐 eXross 中閱讀您購買的電子書。
                            連結過程安全無虞，我們不會儲存您的書店密碼。
                        </p>
                    </div>
                </div>
            </div>

            <!-- QR Code 模擬視窗 -->
            <div id="qr-code-modal" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center backdrop-blur-sm transition-opacity opacity-0">
                <div class="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl transform scale-95 transition-all duration-300 text-center flex flex-col items-center">
                    <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i data-lucide="scan-line" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-xl font-bold text-text-primary mb-2">請掃描 QR Code</h3>
                    <p class="text-sm text-text-secondary mb-6">請使用您的行動裝置掃描下方 QR Code 進行驗證</p>
                    
                    <div class="bg-gray-50 p-6 rounded-2xl inline-block mb-6 border border-gray-100 flex items-center justify-center">
                        <i data-lucide="qr-code" class="w-40 h-40 text-gray-800"></i>
                    </div>
                    
                    <div class="flex gap-3 w-full">
                        <button id="qr-cancel-btn" class="flex-1 py-3 px-4 rounded-full border border-gray-200 text-text-secondary font-medium hover:bg-gray-50 transition-colors">
                            取消
                        </button>
                        <button id="qr-success-btn" class="flex-1 py-3 px-4 rounded-full bg-[var(--bg-accent)] text-white font-medium hover:bg-opacity-90 transition-colors">
                            模擬掃描成功
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 初始化帳號管理區塊的事件
 */
export function initAccountSectionEvents() {
    const container = document.getElementById('personal-center-content');
    if (!container) return;

    // Local state for Carrier Mode Link Status
    let isCarrierLinked = false;

    // Helper to update view based on Carrier status
    const singleView = container.querySelector('#single-mode-view');
    const carrierView = container.querySelector('#carrier-mode-view');

    const updateViewVisibility = () => {
        if (isCarrierLinked) {
            if (singleView) singleView.classList.add('hidden');
            if (carrierView) carrierView.classList.remove('hidden');
            updateHeaderLoginMode('carrier');
        } else {
            if (singleView) singleView.classList.remove('hidden');
            if (carrierView) carrierView.classList.add('hidden');
            updateHeaderLoginMode('single');
        }
    };

    // Initialize Header Mode based on default (Single Mode default demo)
    updateViewVisibility();

    // QR Code Modal Simulation
    const qrCodeModal = container.querySelector('#qr-code-modal');
    const qrCancelBtn = container.querySelector('#qr-cancel-btn');
    const qrSuccessBtn = container.querySelector('#qr-success-btn');
    const carrierVerifyBtn = container.querySelector('#carrier-verify-btn');
    const carrierUnlinkBtn = container.querySelector('#carrier-unlink-btn');

    if (carrierVerifyBtn) {
        carrierVerifyBtn.addEventListener('click', () => {
            // Show QR Code Modal
            qrCodeModal.classList.remove('hidden');
            // Trigger animation
            setTimeout(() => {
                qrCodeModal.classList.remove('opacity-0');
                const modalContent = qrCodeModal.querySelector('.bg-white');
                if (modalContent) {
                    modalContent.classList.remove('scale-95');
                    modalContent.classList.add('scale-100');
                }
            }, 10);

            // Re-render lucide icons inside modal if needed
            if (window.lucide) {
                window.lucide.createIcons({ root: qrCodeModal });
            }
        });
    }

    const closeQrModal = () => {
        qrCodeModal.classList.add('opacity-0');
        const modalContent = qrCodeModal.querySelector('.bg-white');
        if (modalContent) {
            modalContent.classList.remove('scale-100');
            modalContent.classList.add('scale-95');
        }
        setTimeout(() => {
            qrCodeModal.classList.add('hidden');
        }, 300);
    };

    if (qrCancelBtn) {
        qrCancelBtn.addEventListener('click', closeQrModal);
    }

    if (qrSuccessBtn) {
        qrSuccessBtn.addEventListener('click', () => {
            closeQrModal();

            // Simulate loading before success
            setTimeout(() => {
                isCarrierLinked = true;
                updateViewVisibility();
            }, 300);
        });
    }

    if (carrierUnlinkBtn) {
        carrierUnlinkBtn.addEventListener('click', () => {
            if (confirm('確定要解除連結裝置嗎？\n解除後將移除透過裝置同步的所有書店帳號。')) {
                isCarrierLinked = false;
                updateViewVisibility();
            }
        });
    }

    // Store card click events for single mode
    container.querySelectorAll('#single-mode-view .store-card-large').forEach(card => {
        const actionBtn = card.querySelector('.store-status-btn');
        if (actionBtn) {
            actionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const storeName = card.dataset.storeName;

                const isLinked = card.classList.contains('linked');
                if (isLinked) {
                    console.log(`[Account] Logging out from store: ${storeName}`);
                    alert(`回到登入前狀態：即將登出「${storeName}」...`);
                    openLoginView();
                } else {
                    console.log(`[Account] Switching to store: ${storeName}`);
                    alert(`回到登入前狀態：即將切換至「${storeName}」...`);
                    openLoginView();
                }
            });
        }
    });
}
