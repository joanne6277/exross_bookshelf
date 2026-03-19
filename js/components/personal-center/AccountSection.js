// js/components/personal-center/AccountSection.js
// 帳號管理區塊元件

import { openLoginView } from '../../views/Login.js';
import { getAuthState, loginWithDevice, loginWithStore, logout } from '../../features/auth.js';
import { switchView } from '../../router.js';

// ──────────────────────────────────────────────────
// 常數
// ──────────────────────────────────────────────────

const QR_COUNTDOWN_SECONDS = 90;

/** 所有可切換的書店清單 */
const ALL_STORES = [
    { name: '三民書局',   initial: 'S', colorClass: 'bg-green-100 text-green-700 border-green-200 hover:border-green-400' },
    { name: '灰熊愛讀書', initial: 'i', colorClass: 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:border-yellow-400' },
];

// ──────────────────────────────────────────────────
// QR Code 計時器管理
// ──────────────────────────────────────────────────

let qrTimerInterval = null;
let qrTimeLeft = QR_COUNTDOWN_SECONDS;
let qrExpired = false;

function stopQrTimer() {
    if (qrTimerInterval) {
        clearInterval(qrTimerInterval);
        qrTimerInterval = null;
    }
}

/**
 * 啟動 QR Code 倒數計時器
 * @param {HTMLElement} container - 帳號管理 container
 */
function startQrTimer(container) {
    stopQrTimer();
    qrTimeLeft = QR_COUNTDOWN_SECONDS;
    qrExpired = false;
    updateQrDisplay(container);

    qrTimerInterval = setInterval(() => {
        qrTimeLeft--;
        if (qrTimeLeft <= 0) {
            qrTimeLeft = 0;
            qrExpired = true;
            stopQrTimer();
        }
        updateQrDisplay(container);
    }, 1000);
}

/**
 * 依目前計時狀態更新 QR Code 顯示區域的文字
 * @param {HTMLElement} container
 */
function updateQrDisplay(container) {
    const countdownEl = container.querySelector('#acct-qr-countdown');
    const statusEl    = container.querySelector('#acct-qr-status');
    const refreshBtn  = container.querySelector('#acct-qr-refresh-btn');
    const scanLine    = container.querySelector('#acct-qr-scan-line');
    const simulateBtn = container.querySelector('#acct-qr-simulate-btn');

    if (!countdownEl) return;

    if (qrExpired) {
        countdownEl.textContent = 'QR Code 已失效';
        if (statusEl) {
            statusEl.textContent = 'QR Code 已失效，請重新整理';
            statusEl.className = 'text-xs text-red-500 mt-2 font-medium';
        }
        if (scanLine) scanLine.style.display = 'none';
        if (simulateBtn) simulateBtn.disabled = true;
    } else {
        countdownEl.textContent = `QR Code 重整倒數: ${qrTimeLeft} 秒`;
        if (statusEl) {
            statusEl.textContent = '等待掃描中...'  ;
            statusEl.className = 'text-xs text-gray-400 mt-2 font-medium';
        }
        if (scanLine) scanLine.style.display = '';
        if (simulateBtn) simulateBtn.disabled = false;
    }
}

// ──────────────────────────────────────────────────
// HTML 產生器
// ──────────────────────────────────────────────────

/**
 * QR Code 區塊（single 模式 — 標題說明同步多家書櫃）
 */
function createQrBlockHTML() {
    return `
        <div class="acct-qr-block mt-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-100 text-center">
            <div class="flex items-center justify-center gap-2 mb-3">
                <i data-lucide="smartphone" class="w-5 h-5 text-[var(--bg-accent)]"></i>
                <h3 class="text-base font-bold text-text-primary">同步多家書櫃</h3>
            </div>
            <p class="text-xs text-text-secondary mb-5 max-w-sm mx-auto leading-relaxed">
                掃描下方 QR Code，即可一鍵升級為裝置登入模式，同步您在各書店購買的所有藏書。
            </p>

            <!-- QR Code 本體 -->
            <div class="inline-block relative mb-3">
                <div class="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 inline-block overflow-hidden relative" style="width:148px; height:148px;">
                    <i data-lucide="qr-code" class="w-full h-full text-gray-800"></i>
                    <!-- 掃描動畫線：與 Login.js 使用相同的 scan keyframe -->
                    <div id="acct-qr-scan-line"
                         class="absolute top-0 left-0 w-full h-[2px] bg-[var(--bg-accent)] shadow-[0_0_8px_2px_rgba(99,102,241,0.4)]"
                         style="animation: scan 2.5s ease-in-out infinite;">
                    </div>
                </div>
            </div>

            <!-- 倒數與狀態 -->
            <p id="acct-qr-countdown" class="text-xs text-gray-400 font-medium">
                QR Code 重整倒數: ${QR_COUNTDOWN_SECONDS} 秒
            </p>
            <p id="acct-qr-status" class="text-xs text-gray-400 mt-2 font-medium">
                等待掃描中...
            </p>

            <!-- 操作按鈕 -->
            <div class="flex items-center justify-center gap-3 mt-4">
                <button id="acct-qr-refresh-btn"
                        class="flex items-center gap-1.5 text-xs text-text-secondary hover:text-[var(--bg-accent)] transition-colors px-3 py-1.5 rounded-full hover:bg-blue-50 border border-gray-200">
                    <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
                    重新整理
                </button>
                <button id="acct-qr-simulate-btn"
                        class="flex items-center gap-1.5 text-xs text-white bg-[var(--bg-accent)] hover:bg-[var(--bg-accent-dark)] transition-colors px-4 py-1.5 rounded-full shadow-sm">
                    <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
                    模擬 App 掃描
                </button>
            </div>
        </div>
    `;
}

/**
 * 已連結書店清單（device 模式，唯讀 tag 形式）
 * @param {string[]} linkedStores
 */
function createLinkedStoreTagsHTML(linkedStores) {
    if (!linkedStores || linkedStores.length === 0) {
        return `<p class="text-sm text-text-secondary">尚無同步紀錄</p>`;
    }

    const tagColors = {
        '三民書局':   'bg-green-100 text-green-700 border-green-200',
        '讀冊生活':   'bg-blue-100 text-blue-700 border-blue-200',
        '灰熊愛讀書': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    };

    return `
        <div class="flex flex-wrap gap-2">
            ${linkedStores.map(n => {
                const name = (n === 'iRead 灰熊' || n === '灰熊') ? '灰熊愛讀書' : n;
                const color = tagColors[name] || 'bg-gray-100 text-gray-700 border-gray-200';
                return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${color}">
                    <i data-lucide="check" class="w-3.5 h-3.5"></i>${name}
                </span>`;
            }).join('')}
        </div>
    `;
}

/**
 * 切換書店區塊（single 模式專用）
 * 顯示所有書店選項，排除目前已登入的書店
 * @param {string} currentStore - 目前登入的書店名稱
 */
function createSwitchStoreBlockHTML(currentStore) {
    const othersHTML = ALL_STORES
        .filter(s => s.name !== currentStore)
        .map(s => `
            <button class="acct-switch-store-btn flex flex-col items-center justify-center p-3 rounded-xl border ${s.colorClass} transition-all group"
                    data-store="${s.name}">
                <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold mb-1.5 group-hover:scale-105 transition-transform ${s.colorClass.split(' ').slice(0,2).join(' ')}">
                    ${s.initial}
                </div>
                <p class="text-xs font-bold text-text-primary leading-tight text-center">${s.name}</p>
            </button>
        `).join('');

    return `
        <div class="p-5 bg-white rounded-xl border border-gray-200">
            <div class="flex items-center gap-2 mb-1">
                <i data-lucide="refresh-cw" class="w-4 h-4 text-text-secondary"></i>
                <h3 class="text-sm font-semibold text-text-primary">切換書店登入</h3>
            </div>
            <p class="text-xs text-text-secondary mb-4 leading-relaxed">
                切換後將以選擇的書店帳號重新登入（單一書店模式）。
            </p>
            <div class="grid grid-cols-3 gap-2">
                ${othersHTML}
            </div>
        </div>
    `;
}

// ──────────────────────────────────────────────────
// 三種狀態的主要 HTML
// ──────────────────────────────────────────────────

/**
 * 未登入狀態 HTML
 */
function createLoggedOutHTML() {
    return `
        <div class="acct-view-loggedout animate-fade-in-up space-y-6">

            <!-- 狀態標頭 -->
            <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <i data-lucide="user" class="w-5 h-5 text-gray-500"></i>
                </div>
                <div>
                    <p class="text-sm font-medium text-text-secondary">目前登入方式</p>
                    <p class="text-base font-bold text-text-primary">未登入</p>
                </div>
            </div>

            <!-- 說明文字 -->
            <p class="text-sm text-text-secondary">
                登入後即可管理您的書店帳號連結，享受跨書店閱讀體驗。
            </p>

            <!-- 使用書店帳號連結 -->
            <div class="p-5 bg-white rounded-xl border border-gray-200">
                <div class="flex items-center gap-2 mb-3">
                    <i data-lucide="book-open" class="w-5 h-5 text-[var(--bg-accent)]"></i>
                    <h3 class="text-base font-semibold text-text-primary">使用其他書店帳號連結</h3>
                </div>
                <p class="text-xs text-text-secondary mb-4 leading-relaxed">
                    透過書店帳號的 OAuth 授權，安全地連結您在各書店的書櫃。
                </p>
                <button id="acct-goto-login-btn"
                        class="w-full py-2.5 px-4 bg-[var(--bg-accent)] hover:bg-[var(--bg-accent-dark)] text-white text-sm font-semibold rounded-full transition-colors shadow-sm">
                    前往登入頁面
                </button>
            </div>

            <!-- QR Code 區塊 -->
            ${createQrBlockHTML()}
        </div>
    `;
}

/**
 * 書店帳號登入 (single) 狀態 HTML
 * @param {Object} authState
 */
function createSingleModeHTML(authState) {
    let primaryStore = authState.linkedStores[0] || '書店';

    // [正名兼容層] 確保若 LocalStorage 存有舊名稱時，顯示為正確的新名稱
    if (primaryStore === 'iRead 灰熊' || primaryStore === '灰熊') {
        primaryStore = '灰熊愛讀書';
    }

    const linkedList = authState.linkedStores.map(name => {
        return (name === 'iRead 灰熊' || name === '灰熊') ? '灰熊愛讀書' : name;
    }).join('、');

    return `
        <div class="acct-view-single animate-fade-in-up space-y-6">

            <!-- 區塊一：目前登入方式 (FR-ACCT-01) -->
            <div class="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <i data-lucide="store" class="w-5 h-5 text-green-600"></i>
                </div>
                <div>
                    <p class="text-sm font-medium text-text-secondary">目前登入方式</p>
                    <p class="text-base font-bold text-text-primary">透過 ${primaryStore} 帳號登入</p>
                </div>
            </div>

            <!-- 區塊二：切換書店 (FR-ACCT-SWITCH) -->
            ${createSwitchStoreBlockHTML(primaryStore)}

            <!-- 區塊三：同步多家書櫃 QR Code (FR-ACCT-02) -->
            ${createQrBlockHTML()}

            <!-- 登出按鈕 (FR-ACCT-03) -->
            <div class="pt-2 border-t border-gray-100">
                <button id="acct-logout-btn"
                        class="w-full py-2.5 px-4 bg-white hover:bg-red-50 text-red-600 border border-red-300 hover:border-red-400 text-sm font-bold rounded-full transition-colors"
                        aria-label="安全登出帳號">
                    <span class="flex items-center justify-center gap-2">
                        <i data-lucide="log-out" class="w-4 h-4"></i>
                        登出
                    </span>
                </button>
            </div>

        </div>
    `;
}

/**
 * 裝置登入 (device) 狀態 HTML
 * @param {Object} authState
 */
function createDeviceModeHTML(authState) {
    const tagsHTML = createLinkedStoreTagsHTML(authState.linkedStores);

    return `
        <div class="acct-view-device animate-fade-in-up space-y-6">

            <!-- 狀態標頭 (FR-ACCT-04) -->
            <div class="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 relative overflow-hidden">
                <div class="absolute right-0 top-0 w-24 h-24 bg-blue-200/40 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl pointer-events-none"></div>
                <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md relative z-10">
                    <i data-lucide="smartphone" class="w-5 h-5 text-white"></i>
                </div>
                <div class="relative z-10">
                    <p class="text-sm font-medium text-blue-700">目前登入方式</p>
                    <p class="text-base font-bold text-blue-900">透過信任裝置登入</p>
                </div>
            </div>

            <!-- 已連結書店清單（唯讀 tag，FR-ACCT-05）-->
            <div class="p-5 bg-white rounded-xl border border-gray-200">
                <div class="flex items-center gap-2 mb-4">
                    <i data-lucide="link" class="w-4 h-4 text-text-secondary"></i>
                    <h3 class="text-sm font-semibold text-text-primary">您已透過 App 連結以下書店</h3>
                </div>
                ${tagsHTML}
                <p class="text-xs text-text-secondary mt-4 leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <i data-lucide="info" class="w-3.5 h-3.5 inline-block mr-1 text-blue-400"></i>
                    書店連結由 App 端管理，如需變更請至書紐 App 操作。
                </p>
            </div>

            <!-- 解除裝置連結（FR-ACCT-06）-->
            <div class="pt-2 border-t border-gray-100">
                <button id="acct-unlink-btn"
                        class="w-full py-2.5 px-4 bg-white hover:bg-red-50 text-red-600 border border-red-300 hover:border-red-400 text-sm font-bold rounded-full transition-colors"
                        aria-label="解除此裝置的信任連結">
                    <span class="flex items-center justify-center gap-2">
                        <i data-lucide="unlink" class="w-4 h-4"></i>
                        解除此裝置連結
                    </span>
                </button>
            </div>

        </div>
    `;
}

// ──────────────────────────────────────────────────
// 公開介面
// ──────────────────────────────────────────────────

/**
 * 建立帳號管理區塊的初始 HTML（佔位容器）
 * @returns {string} HTML string
 */
export function createAccountSectionHTML() {
    return `<div id="account-section-container"></div>`;
}

/**
 * 依目前 authState 動態渲染帳號管理內容
 */
export function renderAccountSection() {
    const container = document.getElementById('account-section-container');
    if (!container) return;

    // 切換頁面時停止舊計時器
    stopQrTimer();

    const authState = getAuthState();
    let innerHTML = '';

    if (!authState.isLoggedIn || authState.loginMethod === 'null') {
        innerHTML = createLoggedOutHTML();
    } else if (authState.loginMethod === 'single') {
        innerHTML = createSingleModeHTML(authState);
    } else if (authState.loginMethod === 'device') {
        innerHTML = createDeviceModeHTML(authState);
    } else {
        innerHTML = createLoggedOutHTML();
    }

    container.innerHTML = `
        <div class="account-section">
            <div class="mb-6">
                <h2 class="text-xl font-bold text-text-primary mb-1">帳號管理</h2>
                <p class="text-sm text-text-secondary">管理您的書店帳號連結狀態</p>
            </div>
            ${innerHTML}

            <!-- 說明區塊 -->
            <div class="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div class="flex gap-3">
                    <i data-lucide="info" class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5"></i>
                    <div>
                        <p class="text-sm font-medium text-gray-700 mb-1">什麼是書店帳號連結？</p>
                        <p class="text-xs text-gray-500 leading-relaxed">
                            連結您在各書店的帳號後，即可在書紐 eXross 中閱讀您購買的電子書。
                            連結過程安全無虞，我們不會儲存您的書店密碼。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 重繪 lucide icons
    if (window.lucide) {
        window.lucide.createIcons({ root: container });
    }

    // 啟動 QR Code 計時器（若需要）
    const needsQr = !authState.isLoggedIn ||
                    authState.loginMethod === 'null' ||
                    authState.loginMethod === 'single';
    if (needsQr) {
        startQrTimer(container);
    }

    // 綁定事件
    bindInternalEvents(container);
}

/**
 * 初始化帳號管理區塊（在 PersonalCenter 中呼叫）
 */
export function initAccountSectionEvents() {
    renderAccountSection();

    // 監聽全局 auth 狀態變更，自動重新渲染
    document.addEventListener('auth-state-changed', () => {
        const curContainer = document.getElementById('account-section-container');
        if (curContainer && curContainer.closest('.view-section:not(.hidden)')) {
            renderAccountSection();
        }
    });
}

// ──────────────────────────────────────────────────
// 事件綁定
// ──────────────────────────────────────────────────

/**
 * 綁定動態 DOM 的內部事件
 * @param {HTMLElement} container
 */
function bindInternalEvents(container) {

    // ---- 前往登入頁（未登入狀態）----
    const gotoLoginBtn = container.querySelector('#acct-goto-login-btn');
    if (gotoLoginBtn) {
        gotoLoginBtn.addEventListener('click', () => {
            openLoginView();
        });
    }

    // ---- QR Code：重新整理 ----
    const refreshBtn = container.querySelector('#acct-qr-refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            startQrTimer(container);
        });
    }

    // ---- QR Code：模擬掃描（升級為 device 登入，並跳回首頁）----
    const simulateBtn = container.querySelector('#acct-qr-simulate-btn');
    if (simulateBtn) {
        simulateBtn.addEventListener('click', () => {
            if (qrExpired) return;

            // 更新掃描中狀態
            const statusEl = container.querySelector('#acct-qr-status');
            if (statusEl) {
                statusEl.textContent = '掃描成功！驗證裝置授權中...';
                statusEl.className = 'text-xs text-[var(--bg-accent)] mt-2 font-medium';
            }
            simulateBtn.disabled = true;

            // 模擬延遲後升級為 device 登入，並跳轉首頁
            setTimeout(() => {
                stopQrTimer();
                const authState = getAuthState();
                const appStores = authState.linkedStores.length > 0
                    ? authState.linkedStores
                    : ['三民書局', '讀冊生活'];
                loginWithDevice(appStores);
                // 切換為裝置登入模式後跳回首頁
                switchView('homepage');
            }, 1200);
        });
    }

    // ---- 切換書店（single 模式）----
    container.querySelectorAll('.acct-switch-store-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const storeName = btn.dataset.store;
            if (!storeName) return;

            if (confirm(`確定要切換至「${storeName}」帳號登入嗎？`)) {
                loginWithStore(storeName);
                // auth-state-changed 事件會觸發帳號管理區塊自動重新渲染
            }
        });
    });

    // ---- 登出（single 模式，FR-ACCT-03）----
    const logoutBtn = container.querySelector('#acct-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('確定要安全登出您的帳號嗎？')) {
                stopQrTimer();
                logout();
                openLoginView();
            }
        });
    }

    // ---- 解除裝置連結（device 模式，FR-ACCT-06）----
    const unlinkBtn = container.querySelector('#acct-unlink-btn');
    if (unlinkBtn) {
        unlinkBtn.addEventListener('click', () => {
            if (confirm('確定要解除此裝置的信任連結嗎？解除後需重新登入。')) {
                stopQrTimer();
                logout();
                openLoginView();
            }
        });
    }
}
