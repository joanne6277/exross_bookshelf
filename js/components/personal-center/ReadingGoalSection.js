// js/components/personal-center/ReadingGoalSection.js
// 閱讀目標設定區塊元件

import { readingGoalStore } from '../../features/readingGoal.js';

/**
 * 建立閱讀目標設定區塊的 HTML
 * @returns {string} HTML string
 */
export function createReadingGoalSectionHTML() {
    const { goal, current } = readingGoalStore.state;
    const percentage = Math.min(Math.round((current / goal) * 100), 100);

    return `
        <div class="reading-goal-section">
            <div class="mb-6">
                <h2 class="text-xl font-bold text-text-primary mb-2">閱讀目標設定</h2>
                <p class="text-sm text-text-secondary">設定您的每日閱讀目標，培養持續閱讀的習慣。</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- 左側：當前進度展示 -->
                <div class="bg-secondary rounded-xl p-6 border border-border-color">
                    <h3 class="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                        <i data-lucide="target" class="w-5 h-5 text-accent"></i>
                        今日進度
                    </h3>
                    
                    <div class="flex items-baseline space-x-2 mb-4">
                        <span class="text-5xl font-bold tracking-tight text-accent current-val">${current}</span>
                        <span class="text-lg text-text-secondary font-medium">/ <span class="goal-val">${goal}</span> 分鐘</span>
                    </div>

                    <div class="w-full bg-gray-200 rounded-full h-4 mb-3 overflow-hidden">
                        <div class="progress-bar h-4 rounded-full transition-all duration-1000 bg-accent"
                            style="width: ${percentage}%;"></div>
                    </div>
                    <p class="text-sm text-text-secondary text-right font-medium progress-text">已達成 ${percentage}%</p>
                </div>

                <!-- 右側：設定表單 -->
                <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <h3 class="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                        <i data-lucide="settings-2" class="w-5 h-5 text-gray-600"></i>
                        調整目標
                    </h3>
                    
                    <div class="space-y-6">
                        <div>
                            <label for="goal-input" class="block text-sm font-medium text-text-secondary mb-2">
                                每日目標分鐘數
                            </label>
                            <div class="flex items-center gap-4">
                                <button class="adjust-btn minus p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
                                    <i data-lucide="minus" class="w-4 h-4"></i>
                                </button>
                                <input type="number" id="goal-input" value="${goal}" min="1" max="1440"
                                    class="w-full text-center border-b-2 border-gray-200 py-2 text-2xl font-bold text-text-primary focus:outline-none focus:border-accent bg-transparent transition-colors">
                                <button class="adjust-btn plus p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
                                    <i data-lucide="plus" class="w-4 h-4"></i>
                                </button>
                            </div>
                            <p class="text-xs text-gray-400 mt-2 text-center">建議設定 30-60 分鐘</p>
                        </div>

                        <div class="pt-4 border-t border-gray-50">
                            <button id="save-goal-btn" class="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-sm hover:bg-blue-700 transition-all hover:shadow-md active:scale-[0.98]">
                                儲存設定
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 激勵區塊 (裝飾性) -->
            <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="p-4 bg-orange-50 rounded-xl border border-orange-100 text-center">
                    <div class="text-2xl font-bold text-orange-500 mb-1">🔥 12</div>
                    <div class="text-xs text-orange-700 font-medium">連續達成天數</div>
                </div>
                <div class="p-4 bg-purple-50 rounded-xl border border-purple-100 text-center">
                    <div class="text-2xl font-bold text-purple-500 mb-1">📚 32</div>
                    <div class="text-xs text-purple-700 font-medium">本月閱讀書籍</div>
                </div>
                <div class="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                    <div class="text-2xl font-bold text-blue-500 mb-1">2,450</div>
                    <div class="text-xs text-blue-700 font-medium">總閱讀分鐘</div>
                </div>
                <div class="p-4 bg-green-50 rounded-xl border border-green-100 text-center">
                    <div class="text-2xl font-bold text-green-500 mb-1">Top 5%</div>
                    <div class="text-xs text-green-700 font-medium">閱讀排名</div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 初始化閱讀目標區塊的事件
 */
export function initReadingGoalSectionEvents() {
    const container = document.getElementById('personal-center-content');
    if (!container) return;

    const input = container.querySelector('#goal-input');
    const saveBtn = container.querySelector('#save-goal-btn');
    const minusBtn = container.querySelector('.adjust-btn.minus');
    const plusBtn = container.querySelector('.adjust-btn.plus');

    if (input && minusBtn && plusBtn) {
        minusBtn.addEventListener('click', () => {
            let val = parseInt(input.value) || 0;
            if (val > 5) input.value = val - 5;
        });

        plusBtn.addEventListener('click', () => {
            let val = parseInt(input.value) || 0;
            input.value = val + 5;
        });
    }

    if (saveBtn && input) {
        saveBtn.addEventListener('click', () => {
            const newGoal = parseInt(input.value);
            if (newGoal && newGoal > 0) {
                // 更新 Store
                readingGoalStore.setGoal(newGoal);

                // Show feedback
                const originalText = saveBtn.textContent;
                saveBtn.textContent = '已儲存！';
                saveBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                saveBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');

                setTimeout(() => {
                    saveBtn.textContent = originalText;
                    saveBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
                    saveBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
                }, 2000);

                // Update local UI immediately (though store subscription handles it too)
                updateLocalUI(container);
            } else {
                alert('請輸入有效的目標數值');
            }
        });
    }

    // Subscribe to store updates to keep UI in sync
    // (In case updates happen from elsewhere or we want reactive UI)
    const unsubscribe = readingGoalStore.subscribe((state) => {
        // Find container again as it might be re-rendered? 
        // No, init is called after render.
        // But if we switch sections, this listener might leak if not careful.
        // However, PersonalCenter.js re-renders HTML on switch, so old elements die.
        // We should safeguard.
        if (!document.contains(container)) {
            unsubscribe();
            return;
        }
        updateLocalUI(container);
    });
}

function updateLocalUI(container) {
    const { goal, current } = readingGoalStore.state;
    const percentage = Math.min(Math.round((current / goal) * 100), 100);

    const goalValInDisplay = container.querySelector('.goal-val');
    const currentValInDisplay = container.querySelector('.current-val');
    const progressBar = container.querySelector('.progress-bar');
    const progressText = container.querySelector('.progress-text');
    const input = container.querySelector('#goal-input');

    if (goalValInDisplay) goalValInDisplay.textContent = goal;
    if (currentValInDisplay) currentValInDisplay.textContent = current;
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `已達成 ${percentage}%`;

    // Update input if it's not currently focused (to avoid disturbing user typing)
    if (input && document.activeElement !== input) {
        input.value = goal;
    }
}
