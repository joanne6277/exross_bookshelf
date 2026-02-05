// js/features/readingGoal.js
// 閱讀目標功能（狀態管理與事件）

// 預設值
const DEFAULT_GOAL = 60;
const DEFAULT_PROGRESS = 45; // 模擬數據：今日已閱讀時間

// State
let state = {
    goal: DEFAULT_GOAL,
    current: DEFAULT_PROGRESS
};

// Event Target for broadcasting updates
const eventBus = new EventTarget();

/**
 * 初始化閱讀目標功能
 * 讀取 localStorage 並觸發一次初始更新
 */
export function initReadingGoal() {
    loadState();

    // 監聽來自其他元件的更新請求（如果有的話）
    window.addEventListener('storage', (e) => {
        if (e.key === 'reading-goal-data') {
            loadState();
            notifyUpdate();
        }
    });

    // 初始更新 DOM (如果首頁已經 render)
    updateHomepageUI();
}

function loadState() {
    const saved = localStorage.getItem('reading-goal-data');
    if (saved) {
        try {
            state = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse reading goal data', e);
        }
    } else {
        saveState();
    }
}

function saveState() {
    localStorage.setItem('reading-goal-data', JSON.stringify(state));
    notifyUpdate();
}

function notifyUpdate() {
    // 觸發自定義事件通知 UI 更新
    eventBus.dispatchEvent(new CustomEvent('reading-goal-updated', { detail: state }));
    // 同時直接嘗試更新首頁 UI (因為首頁常駐)
    updateHomepageUI();
}

/**
 * 更新首頁的閱讀目標 UI
 */
function updateHomepageUI() {
    const currentEl = document.getElementById('current-reading-time');
    const totalEl = document.getElementById('total-reading-goal');
    const progressBar = document.getElementById('reading-progress-bar');
    const progressText = document.getElementById('reading-progress-text');

    if (!currentEl || !totalEl || !progressBar || !progressText) return;

    currentEl.textContent = state.current;
    totalEl.textContent = state.goal;

    const percentage = Math.min(Math.round((state.current / state.goal) * 100), 100);
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `已達成 ${percentage}%`;
}

// API
export const readingGoalStore = {
    get state() { return { ...state }; },

    setGoal(newGoal) {
        if (newGoal > 0) {
            state.goal = newGoal;
            saveState();
        }
    },

    setCurrent(newCurrent) {
        if (newCurrent >= 0) {
            state.current = newCurrent;
            saveState();
        }
    },

    // 訂閱變更
    subscribe(callback) {
        const handler = (e) => callback(e.detail);
        eventBus.addEventListener('reading-goal-updated', handler);
        return () => eventBus.removeEventListener('reading-goal-updated', handler);
    }
};
