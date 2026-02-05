import { NOTIFICATIONS_DATA } from '../data/notifications.js';
import { openPersonalCenter } from '../views/PersonalCenter.js';

const DROPDOWN_CONTENT = `
    <div class="p-5">
        <div class="mb-4">
            <p class="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">主帳號</p>
            <div class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <span class="text-sm font-medium text-gray-700">[灰熊] abcd123@gmail.com</span>
            </div>
        </div>
        
        <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
                <p class="text-xs font-bold text-text-secondary uppercase tracking-wider">已連結書店</p>
                <button id="btn-link-other-accounts" class="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center gap-1">
                    連結其他帳號
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </button>
            </div>
            <div class="flex flex-wrap gap-2">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    [讀冊]
                </span>
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    [三民]
                </span>
            </div>
        </div>
    </div>
`;

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

function getNotificationColor(type) {
    switch (type) {
        case 'alert': return 'bg-red-500';
        case 'success': return 'bg-green-500';
        default: return 'bg-blue-500';
    }
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
            <div class="relative group">
                <button id="notification-btn-desktop" class="p-2 rounded-full hover:bg-gray-100 transition-colors relative notification-trigger">
                    <i data-lucide="bell" class="w-5 h-5 text-gray-600"></i>
                    ${badgeHTML}
                </button>
                ${notificationDropdown}
            </div>
            
            <div class="relative group">
                <button id="user-menu-btn-desktop"
                    class="rounded-full w-9 h-9 bg-gray-200 flex items-center justify-center overflow-hidden hover:bg-gray-300 transition-all border border-gray-200 user-menu-trigger">
                    <i data-lucide="user" class="w-5 h-5 text-gray-600"></i>
                </button>
                <div class="user-dropdown hidden absolute top-full right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden text-left text-text-primary animate-fade-in-down">
                    ${DROPDOWN_CONTENT}
                </div>
            </div>
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
                <button id="notification-btn-mobile" class="relative notification-trigger">
                    <i data-lucide="bell" class="w-5 h-5 text-gray-500"></i>
                    ${badgeHTMLMobile}
                </button>
                <div class="notification-dropdown hidden absolute top-full right-[-50px] mt-3 z-50 animate-fade-in-down origin-top-right max-w-[90vw]">
                     ${createNotificationDropdownHTML()}
                </div>
            </div>

            <div class="relative group">
                <button id="user-menu-btn-mobile"
                    class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-text-secondary user-menu-trigger">
                    <i data-lucide="user" class="w-4 h-4"></i>
                </button>
                <div class="user-dropdown hidden absolute top-full right-0 mt-3 w-80 max-w-[90vw] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden text-left text-text-primary animate-fade-in-down">
                    ${DROPDOWN_CONTENT}
                </div>
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

    // User Menu
    document.querySelectorAll('.user-menu-trigger').forEach(trigger => {
        toggleDropdown(trigger, '.user-dropdown');
    });

    // Notification Menu
    document.querySelectorAll('.notification-trigger').forEach(trigger => {
        toggleDropdown(trigger, '.notification-dropdown');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-dropdown') &&
            !e.target.closest('.notification-dropdown') &&
            !e.target.closest('.user-menu-trigger') &&
            !e.target.closest('.notification-trigger')) {

            document.querySelectorAll('.user-dropdown, .notification-dropdown').forEach(d => {
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

    // Link Other Accounts Button
    const linkOtherAccountsBtns = document.querySelectorAll('#btn-link-other-accounts');
    linkOtherAccountsBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Close user dropdown
            document.querySelectorAll('.user-dropdown').forEach(d => {
                d.classList.add('hidden');
            });

            // Open personal center with account section
            openPersonalCenter('account');
        });
    });
}
