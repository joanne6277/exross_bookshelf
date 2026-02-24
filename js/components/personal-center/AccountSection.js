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
            
            <!-- 登入模式選擇 -->
            <div class="mb-6 bg-gray-50 p-1 rounded-xl flex gap-2 w-full md:w-fit">
                <button class="mode-btn flex-1 md:w-auto px-6 py-2 rounded-lg text-sm font-medium transition-all text-text-secondary hover:text-text-primary hover:bg-white/50" data-mode="carrier">
                    載具登入 (多帳號)
                </button>
                <button class="mode-btn flex-1 md:w-auto px-6 py-2 rounded-lg text-sm font-medium transition-all bg-white shadow-sm text-text-primary" data-mode="single">
                    單一書店登入
                </button>
            </div>
            
            <!-- 單一帳號登入模式內容 -->
            <div id="single-mode-content" class="space-y-4 transition-all duration-300">
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
                            data-base-text="切換" data-carrier-text="登入">
                        切換
                    </button>
                </div>

                <!-- 三民書局 (已連結範例) -->
                <div class="store-card-large linked flex items-center justify-between p-4 rounded-xl border bg-green-50 border-green-200 cursor-pointer transition-all hover:shadow-md"
                     data-store-name="三民書局">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-lg font-bold text-green-600">
                            S
                        </div>
                        <div>
                            <p class="text-base font-bold text-text-primary">三民書局</p>
                            <p class="text-sm status-text text-green-600 font-medium">目前的書店</p>
                        </div>
                    </div>
                    <button class="store-status-btn text-sm px-4 py-2 rounded-full font-medium transition-colors border border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                            data-base-text="登出" data-carrier-text="登入">
                        登出
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
                            data-base-text="切換" data-carrier-text="登入">
                        切換
                    </button>
                </div>
            </div>

            <!-- 載具登入模式內容 -->
            <div id="carrier-mode-content" class="hidden space-y-6 transition-all duration-300">
                <!-- 未綁定載具的狀態 -->
                <div class="carrier-unlinked-view p-6 md:p-8 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i data-lucide="smartphone" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-lg font-bold text-text-primary mb-2">連結 手機條碼載具</h3>
                    <p class="text-sm text-text-secondary mb-6 max-w-md mx-auto">
                        透過載具登入，系統將會自動帶入您在各個合作書店的帳號，一次滿足多平台閱讀需求！
                    </p>
                    <button id="carrier-verify-btn" class="px-6 py-3 bg-[var(--bg-accent)] text-white rounded-full font-medium hover:bg-opacity-90 transition-all shadow-sm">
                        進行載具驗證
                    </button>
                </div>

                <!-- 已綁定載具的狀態 (隱藏) -->
                <div class="carrier-linked-view hidden">
                    <div class="flex items-center justify-between mb-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex-wrap gap-4">
                        <div class="flex items-center gap-3">
                            <i data-lucide="check-circle" class="w-5 h-5 text-blue-600 flex-shrink-0"></i>
                            <div>
                                <p class="text-sm font-bold text-blue-900">已連結載具：iphone 17 pro</p>
                                <p class="text-xs text-blue-700">我們已為您同步以下書店帳號</p>
                            </div>
                        </div>
                        <button id="carrier-unlink-btn" class="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-full hover:bg-blue-50 transition-colors whitespace-nowrap">
                            解除連結
                        </button>
                    </div>

                    <!-- 這裡會顯示載具帶入的書店列表 -->
                    <div class="space-y-4">
                        <div class="store-card-large linked flex items-center justify-between p-4 rounded-xl border bg-green-50 border-green-200">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-lg font-bold text-green-600">
                                    S
                                </div>
                                <div>
                                    <p class="text-base font-bold text-text-primary">三民書局</p>
                                    <p class="text-sm status-text text-green-600 font-medium">已透過載具連結</p>
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
                                    <p class="text-sm status-text text-green-600 font-medium">已透過載具連結</p>
                                </div>
                            </div>
                            <span class="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium hidden md:inline-block">
                                驗證成功
                            </span>
                        </div>
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

    // Helper to update Single Mode buttons based on Carrier status
    const updateSingleModeButtons = () => {
        const storeBtns = container.querySelectorAll('.store-status-btn');
        storeBtns.forEach(btn => {
            if (isCarrierLinked) {
                // 如果載具已連結，所有店鋪按鈕變成「登入」
                btn.textContent = btn.dataset.carrierText;
                // 重置所有按鈕樣式為主要登入按鈕樣式
                btn.className = 'store-status-btn text-sm px-4 py-2 rounded-full font-medium transition-colors bg-[var(--bg-accent)] text-white hover:bg-opacity-90';
            } else {
                // 如果載具未連結，恢復為原本「切換」或「登出」
                btn.textContent = btn.dataset.baseText;
                // 還原按鈕樣式
                if (btn.dataset.baseText === '登出') {
                    btn.className = 'store-status-btn text-sm px-4 py-2 rounded-full font-medium transition-colors border border-red-500 text-red-600 hover:bg-red-500 hover:text-white';
                } else {
                    btn.className = 'store-status-btn text-sm px-4 py-2 rounded-full font-medium transition-colors border border-gray-200 text-text-secondary hover:bg-[var(--bg-accent)] hover:text-white';
                }
            }
        });
    };

    // Initialize Header Mode based on default (Single Mode default demo)
    updateHeaderLoginMode('single');

    // Mode Toggle Events
    const modeBtns = container.querySelectorAll('.mode-btn');
    const singleContent = container.querySelector('#single-mode-content');
    const carrierContent = container.querySelector('#carrier-mode-content');

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;

            // Update button styles
            modeBtns.forEach(b => {
                b.classList.remove('bg-white', 'shadow-sm', 'text-text-primary');
                b.classList.add('text-text-secondary', 'hover:text-text-primary', 'hover:bg-white/50');
            });
            btn.classList.add('bg-white', 'shadow-sm', 'text-text-primary');
            btn.classList.remove('text-text-secondary', 'hover:text-text-primary', 'hover:bg-white/50');

            // Toggle contents
            if (mode === 'single') {
                singleContent.classList.remove('hidden');
                carrierContent.classList.add('hidden');
            } else {
                singleContent.classList.add('hidden');
                carrierContent.classList.remove('hidden');
            }
        });
    });

    // Carrier Verify Simulation
    const carrierVerifyBtn = container.querySelector('#carrier-verify-btn');
    const carrierUnlinkedView = container.querySelector('.carrier-unlinked-view');
    const carrierLinkedView = container.querySelector('.carrier-linked-view');
    const carrierUnlinkBtn = container.querySelector('#carrier-unlink-btn');

    if (carrierVerifyBtn) {
        carrierVerifyBtn.addEventListener('click', () => {
            alert('正在進行手機條碼載具驗證...\n驗證成功後將自動帶入對應書店帳號！');
            carrierUnlinkedView.classList.add('hidden');
            carrierLinkedView.classList.remove('hidden');

            isCarrierLinked = true;
            updateHeaderLoginMode('carrier');
            updateSingleModeButtons();
        });
    }

    if (carrierUnlinkBtn) {
        carrierUnlinkBtn.addEventListener('click', () => {
            if (confirm('確定要解除連結手機條碼載具嗎？\n解除後將移除透過載具同步的所有書店帳號。')) {
                carrierUnlinkedView.classList.remove('hidden');
                carrierLinkedView.classList.add('hidden');

                isCarrierLinked = false;
                // 恢復為預設 Single
                updateHeaderLoginMode('single');
                updateSingleModeButtons();
            }
        });
    }

    // Store card click events
    container.querySelectorAll('#single-mode-content .store-card-large').forEach(card => {
        const actionBtn = card.querySelector('.store-status-btn');
        if (actionBtn) {
            actionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const storeName = card.dataset.storeName;

                if (isCarrierLinked) {
                    // 載具登入模式下 單一書店都變成 「登入」
                    console.log(`[Account] Logging in via Single Mode to store: ${storeName}`);
                    alert(`前往「${storeName}」登入頁面...`);
                    openLoginView();
                    return;
                }

                // 以下為原有的 單一登入模式 邏輯
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
