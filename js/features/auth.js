// js/features/auth.js
// 授權與狀態管理模組

/**
 * 系統狀態模型 (FR-LOGIN)
 * isLoggedIn: Boolean - 是否已登入
 * loginMethod: String - 登入方式：'null'（未登入）/ 'single'（書店帳號）/ 'device'（裝置）
 * linkedStores: Array[String] - 已連結的書店名稱清單
 */

const STORAGE_KEY = 'exross_auth_state';

// 預設狀態
const DEFAULT_STATE = {
    isLoggedIn: false,
    loginMethod: 'null',
    linkedStores: []
};

let authState = { ...DEFAULT_STATE };

/**
 * 載入持久化狀態
 */
function loadState() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            authState = { ...DEFAULT_STATE, ...JSON.parse(stored) };
        }
    } catch (e) {
        console.error('Failed to load auth state from local storage', e);
    }
}

/**
 * 儲存狀態並觸發事件
 */
function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
        // 觸發自訂事件通知其他元件更新
        document.dispatchEvent(new CustomEvent('auth-state-changed', {
            detail: getAuthState()
        }));
    } catch (e) {
        console.error('Failed to save auth state to local storage', e);
    }
}

/**
 * 取得目前狀態副本
 */
export function getAuthState() {
    return { ...authState };
}

/**
 * 快速查詢是否已登入
 * @returns {boolean}
 */
export function isLoggedIn() {
    return authState.isLoggedIn === true;
}

/**
 * 單一書店登入 (single)
 * @param {string} storeName - 書店名稱
 */
export function loginWithStore(storeName) {
    authState.isLoggedIn = true;
    authState.loginMethod = 'single';
    // 確保書店名稱不重複加入
    if (!authState.linkedStores.includes(storeName)) {
        authState.linkedStores.push(storeName);
    }
    saveState();
}

/**
 * 裝置登入 (device)
 * @param {Array<string>} stores - 裝置帶入的書店清單
 */
export function loginWithDevice(stores = []) {
    authState.isLoggedIn = true;
    authState.loginMethod = 'device';
    // 合併並去重
    const merged = new Set([...authState.linkedStores, ...stores]);
    // 若原先已是 single 登入並有首選書店，此時會一併保留
    authState.linkedStores = Array.from(merged); 
    saveState();
}

/**
 * 登出 / 解除連結
 */
export function logout() {
    authState = { ...DEFAULT_STATE };
    saveState();
}

/**
 * 初始化認證模組
 */
export function initAuthFeature() {
    loadState();
    // 發送初始事件，讓剛載入的頁面元件可以取得狀態
    setTimeout(() => {
        document.dispatchEvent(new CustomEvent('auth-state-changed', {
            detail: getAuthState()
        }));
    }, 0);
    console.log('[Auth] Initialized with state:', authState);
}
