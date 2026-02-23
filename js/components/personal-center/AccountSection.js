// js/components/personal-center/AccountSection.js
// 帳號管理區塊元件

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
            
            <div class="space-y-4">
                <!-- 讀冊生活 -->
                <div class="store-card-large unlinked flex items-center justify-between p-4 rounded-xl border bg-white cursor-pointer transition-all hover:shadow-md"
                    data-store-name="讀冊生活">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-600">
                            T
                        </div>
                        <div>
                            <p class="text-base font-bold text-text-primary">讀冊生活</p>
                            <p class="text-sm status-text text-text-secondary">未連結</p>
                        </div>
                    </div>
                    <button class="text-sm px-4 py-2 rounded-full font-medium transition-colors action-btn bg-gray-100 text-text-secondary hover:bg-accent hover:text-white">
                        連結
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
                            <p class="text-sm status-text text-green-600 font-medium">已連結</p>
                        </div>
                    </div>
                    <button class="text-sm px-4 py-2 rounded-full font-medium transition-colors action-btn border border-green-500 text-green-600 hover:bg-green-500 hover:text-white">
                        登出
                    </button>
                </div>

                <!-- iRead 灰熊 -->
                <div class="store-card-large unlinked flex items-center justify-between p-4 rounded-xl border bg-white cursor-pointer transition-all hover:shadow-md"
                    id="store-iread-large" data-store-id="iread" data-store-name="iRead 灰熊">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-lg font-bold text-yellow-600">
                            i
                        </div>
                        <div>
                            <p class="text-base font-bold text-text-primary">iRead 灰熊</p>
                            <p class="text-sm status-text text-text-secondary">未連結</p>
                        </div>
                    </div>
                    <button class="text-sm px-4 py-2 rounded-full font-medium transition-colors action-btn bg-gray-100 text-text-secondary hover:bg-accent hover:text-white">
                        連結
                    </button>
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

    // Store card click events
    container.querySelectorAll('.store-card-large').forEach(card => {
        const actionBtn = card.querySelector('.action-btn');
        if (actionBtn) {
            actionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const storeName = card.dataset.storeName;
                const isLinked = card.classList.contains('linked');

                if (isLinked) {
                    console.log(`[Account] Managing store: ${storeName}`);
                    alert(`正在開啟「${storeName}」的帳號管理...`);
                } else {
                    console.log(`[Account] Linking store: ${storeName}`);
                    alert(`正在連結「${storeName}」帳號...`);
                }
            });
        }
    });
}
