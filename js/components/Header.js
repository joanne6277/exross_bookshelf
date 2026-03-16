import { NOTIFICATIONS_DATA } from '../data/notifications.js';
import { openPersonalCenter } from '../views/PersonalCenter.js';
import { openLoginView } from '../views/Login.js';
import { getAuthState, logout } from '../features/auth.js';

function createNotificationDropdownHTML() {
    return `
        <div class="bg-white rounded-xl shadow-2xl border border-gray-100 w-80 max-h-[80vh] overflow-y-auto flex flex-col">
            <div class="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 class="text-sm font-bold text-text-primary">通知中心</h3>
                <a href="#" class="view-all-notifications-link text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium">
                    查看全部
                </a>
            </div>
            <div id="notification-list" class="divide-y divide-gray-50">
                ${NOTIFICATIONS_DATA.map(n => `
                    <div class="p-4 hover:bg-gray-50 transition-colors ${n.isRead ? 'opacity-70' : ''}">
                        <div class="flex gap-3 mb-1">
                            <div>
                                <h4 class="text-sm font-bold text-text-primary mb-1">${n.title}</h4>
                                <p class="text-xs text-text-secondary leading-relaxed mb-2">${n.content}</p>
                                <span class="text-[10px] text-gray-400 font-medium">${n.date}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

export function createHeaderHTML() {
    const unreadCount = NOTIFICATIONS_DATA.filter(n => !n.isRead).length;
    const badgeHTML = unreadCount > 0
        ? `<span id="notification-badge-desktop" class="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>`
        : '';
    const badgeHTMLMobile = unreadCount > 0
        ? `<span id="notification-badge-mobile" class="absolute -top-0.5 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>`
        : '';

    const notificationDropdown = `
        <div class="notification-dropdown hidden absolute top-full right-0 mt-3 z-50 animate-fade-in-down origin-top-right">
            ${createNotificationDropdownHTML()}
        </div>
    `;

    return `
    <header id="desktop-header"
        class="desktop-header-container hidden md:flex sticky top-0 w-full h-16 items-center justify-between px-8 z-50 shadow-sm">
        <div class="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity logo-reload-btn">
            <span class="rounded-lg p-1.5 bg-accent/10 shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="20"
                    height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round" style="color: var(--bg-accent);">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg></span>
            <span class="text-2xl font-bold tracking-wide text-gray-700">書紐eXross</span>
        </div>

        <nav class="desktop-nav">
            <a href="#" data-view="homepage" class="nav-link active"><i data-lucide="home"
                    class="w-4 h-4"></i><span>首頁</span></a>
            <a href="#" data-view="books" class="nav-link"><i data-lucide="book"
                    class="w-4 h-4"></i><span>我的書櫃</span></a>
            <a href="#" data-view="bookmark" class="nav-link"><i data-lucide="highlighter"
                    class="w-4 h-4"></i><span>劃線筆記</span></a>
        </nav>

        <div class="flex items-center gap-4">
            <div id="desktop-login-mode-container"></div>
            
            <div class="relative group">
                <button id="notification-btn-desktop" class="p-2 rounded-full hover:bg-gray-100 transition-colors relative notification-trigger">
                    <i data-lucide="bell" class="w-5 h-5 text-gray-600"></i>
                    ${badgeHTML}
                </button>
                ${notificationDropdown}
            </div>
            
            <button id="user-menu-btn-desktop"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all text-text-secondary hover:text-text-primary group">
                <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <i data-lucide="user" class="w-5 h-5"></i>
                </div>
                <span class="text-sm font-medium">帳號管理</span>
            </button>
        </div>
    </header>

    <header id="mobile-header"
        class="md:hidden fixed top-0 left-0 w-full h-14 bg-white/95 backdrop-blur border-b border-border-color flex items-center justify-between px-4 z-40 shadow-sm">
        <div class="flex items-center space-x-2 logo-reload-btn text-accent">
            <span class="rounded bg-accent/10 p-1"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                    stroke-linejoin="round" class="text-accent">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg></span>
            <span class="text-lg font-bold tracking-wide text-gray-700">書紐eXross</span>
        </div>
        <div class="flex items-center gap-3">
             <div class="relative group">
                <button id="notification-btn-mobile" class="relative p-1">
                    <i data-lucide="bell" class="w-5 h-5 text-gray-500"></i>
                    ${badgeHTMLMobile}
                </button>
            </div>

            <div class="relative group">
                <button id="user-menu-btn-mobile"
                    class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-text-secondary">
                    <i data-lucide="user" class="w-4 h-4"></i>
                </button>
            </div>
        </div>
    </header>
    `;
}

export function initHeaderEvents() {
    // Logo reload
    const logoBtns = document.querySelectorAll('.logo-reload-btn');
    logoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.reload();
        });
    });

    // Toggle Helper
    const toggleDropdown = (trigger, dropdownSelector) => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = trigger.parentElement.querySelector(dropdownSelector);

            // Close all other dropdowns
            document.querySelectorAll('.user-dropdown, .notification-dropdown').forEach(d => {
                if (d !== dropdown) d.classList.add('hidden');
            });

            if (dropdown) {
                dropdown.classList.toggle('hidden');

                // If it's notification dropdown, hide badge on open
                if (trigger.classList.contains('notification-trigger') && !dropdown.classList.contains('hidden')) {
                    const badgeDesktop = document.getElementById('notification-badge-desktop');
                    const badgeMobile = document.getElementById('notification-badge-mobile');
                    if (badgeDesktop) badgeDesktop.style.display = 'none';
                    if (badgeMobile) badgeMobile.style.display = 'none';

                    // Note: Real app would api call to mark as read here
                }
            }
        });
    };

    // User Menu Desktop (Direct Navigation)
    const userMenuBtnDesktop = document.getElementById('user-menu-btn-desktop');
    if (userMenuBtnDesktop) {
        userMenuBtnDesktop.addEventListener('click', () => {
            openPersonalCenter('account');
        });
    }

    // Notification Menu
    document.querySelectorAll('.notification-trigger').forEach(trigger => {
        toggleDropdown(trigger, '.notification-dropdown');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-dropdown') &&
            !e.target.closest('.notification-trigger')) {

            document.querySelectorAll('.notification-dropdown').forEach(d => {
                d.classList.add('hidden');
            });
        }
    });

    // View All Notifications Link
    document.querySelectorAll('.view-all-notifications-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Close notification dropdown
            document.querySelectorAll('.notification-dropdown').forEach(d => {
                d.classList.add('hidden');
            });

            // Open personal center with notifications section
            openPersonalCenter('notifications');
        });
    });

    // Mobile direct navigation
    const mobileNotifBtn = document.getElementById('notification-btn-mobile');
    if (mobileNotifBtn) {
        mobileNotifBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            // Hide badge on click
            const badgeMobile = document.getElementById('notification-badge-mobile');
            if (badgeMobile) badgeMobile.style.display = 'none';

            openPersonalCenter('notifications');
        });
    }

    const mobileUserBtn = document.getElementById('user-menu-btn-mobile');
    if (mobileUserBtn) {
        mobileUserBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openPersonalCenter('account');
        });
    }

    // Listen to global changes
    document.addEventListener('auth-state-changed', (e) => {
        const authState = e.detail;
        // Update mode tag
        updateHeaderLoginMode(authState);
    });

    // Initial display
    updateHeaderLoginMode(getAuthState());
}

/**
 * 更新 Header 的登入模式顯示
 * @param {object} authState 
 */
export function updateHeaderLoginMode(authState) {
    const defaultTag = document.getElementById('desktop-login-mode-tag');
    const container = document.getElementById('desktop-login-mode-container');
    
    if (!container) return;

    // 清除舊狀態
    if (defaultTag) defaultTag.remove();
    container.innerHTML = '';

    if (!authState.isLoggedIn || authState.loginMethod === 'null') {
        return; // 未登入不顯示標籤
    }

    // 更新 Tag HTML
    let tagHtml = '';
    
    if (authState.loginMethod === 'device') {
        tagHtml = `
            <div id="desktop-login-mode-tag" class="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full">
                <i data-lucide="smartphone" class="w-4 h-4 text-green-500"></i>
                <span class="text-xs font-bold text-green-700">裝置登入模式</span>
            </div>
        `;
    } else if (authState.loginMethod === 'single' && authState.linkedStores.length > 0) {
        // 取第一個作為主要顯示
        const primaryStoreStr = authState.linkedStores[0];
        tagHtml = `
            <div id="desktop-login-mode-tag" class="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full">
                <i data-lucide="store" class="w-4 h-4 text-green-500"></i>
                <span class="text-xs font-bold text-green-700">${primaryStoreStr}登入</span>
            </div>
        `;
    }

    container.innerHTML = tagHtml;
    if (window.lucide) {
        window.lucide.createIcons({ root: container });
    }
}
