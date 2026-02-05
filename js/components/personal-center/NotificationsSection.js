// js/components/personal-center/NotificationsSection.js
// 全部通知區塊元件

import { NOTIFICATIONS_DATA, NOTIFICATION_CATEGORIES } from '../../data/notifications.js';

/**
 * 取得通知類型的圖示與顏色
 * @param {string} type - 通知類型
 * @returns {object} icon name and color classes
 */
function getNotificationStyle(type) {
    switch (type) {
        case 'alert':
            return {
                icon: 'alert-circle',
                bgColor: 'bg-red-100',
                iconColor: 'text-red-500',
                borderColor: 'border-red-200'
            };
        case 'success':
            return {
                icon: 'check-circle',
                bgColor: 'bg-green-100',
                iconColor: 'text-green-500',
                borderColor: 'border-green-200'
            };
        default: // info
            return {
                icon: 'info',
                bgColor: 'bg-blue-100',
                iconColor: 'text-blue-500',
                borderColor: 'border-blue-200'
            };
    }
}

/**
 * 建立單一通知卡片的 HTML
 * @param {object} notification - 通知資料
 * @returns {string} HTML string
 */
function createNotificationCardHTML(notification) {
    const style = getNotificationStyle(notification.type);
    const unreadClass = notification.isRead ? 'opacity-70' : '';
    const unreadDot = notification.isRead ? '' : `
        <span class="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
    `;

    return `
        <div class="notification-card relative p-4 rounded-xl border ${style.borderColor} bg-white hover:shadow-md transition-all cursor-pointer ${unreadClass}"
            data-notification-id="${notification.id}" data-category="${notification.category}">
            ${unreadDot}
            <div class="flex gap-4">
                <div class="flex-shrink-0 w-10 h-10 ${style.bgColor} rounded-full flex items-center justify-center">
                    <i data-lucide="${style.icon}" class="w-5 h-5 ${style.iconColor}"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-bold text-text-primary mb-1 pr-4">${notification.title}</h4>
                    <p class="text-sm text-text-secondary leading-relaxed mb-2">${notification.content}</p>
                    <span class="text-xs text-gray-400 font-medium">${notification.date}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * 建立全部通知區塊的 HTML
 * @returns {string} HTML string
 */
export function createNotificationsSectionHTML() {
    // 按日期排序（最新在上）
    const sortedNotifications = [...NOTIFICATIONS_DATA].sort((a, b) => {
        return new Date(b.date.replace(/\//g, '-')) - new Date(a.date.replace(/\//g, '-'));
    });

    const unreadCount = sortedNotifications.filter(n => !n.isRead).length;

    // 建立篩選下拉選單
    const filterOptions = NOTIFICATION_CATEGORIES.map(cat =>
        `<option value="${cat.id}">${cat.label}</option>`
    ).join('');

    return `
        <div class="notifications-section">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 class="text-xl font-bold text-text-primary mb-2">全部通知</h2>
                    <p class="text-sm text-text-secondary notification-count-text">
                        共 ${sortedNotifications.length} 則通知
                        ${unreadCount > 0 ? `<span class="text-red-500 font-medium">（${unreadCount} 則未讀）</span>` : ''}
                    </p>
                </div>
                <div class="flex items-center gap-3">
                    <!-- 分類篩選下拉選單 -->
                    <select id="notification-filter" class="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent cursor-pointer">
                        ${filterOptions}
                    </select>
                    ${unreadCount > 0 ? `
                        <button id="mark-all-read-btn" class="text-sm px-4 py-2 rounded-full font-medium transition-colors bg-gray-100 text-text-secondary hover:bg-accent hover:text-white whitespace-nowrap">
                            全部標為已讀
                        </button>
                    ` : ''}
                </div>
            </div>
            
            <div id="notifications-list" class="space-y-3">
                ${sortedNotifications.map(n => createNotificationCardHTML(n)).join('')}
            </div>

            <div id="no-notifications-message" class="text-center py-12 hidden">
                <i data-lucide="bell-off" class="w-12 h-12 text-gray-300 mx-auto mb-4"></i>
                <p class="text-text-secondary">此分類目前沒有通知</p>
            </div>
        </div>
    `;
}

/**
 * 初始化全部通知區塊的事件
 */
export function initNotificationsSectionEvents() {
    const container = document.getElementById('personal-center-content');
    if (!container) return;

    // Filter dropdown
    const filterSelect = container.querySelector('#notification-filter');
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            const selectedCategory = e.target.value;
            filterNotifications(container, selectedCategory);
        });
    }

    // Mark all as read button
    const markAllBtn = container.querySelector('#mark-all-read-btn');
    if (markAllBtn) {
        markAllBtn.addEventListener('click', () => {
            // Mark all notifications as read
            NOTIFICATIONS_DATA.forEach(n => n.isRead = true);

            // Remove unread dots
            container.querySelectorAll('.notification-card').forEach(card => {
                card.classList.add('opacity-70');
                const dot = card.querySelector('.bg-red-500.rounded-full');
                if (dot) dot.remove();
            });

            // Update header count text
            const countText = container.querySelector('.notification-count-text');
            if (countText) {
                countText.innerHTML = `共 ${NOTIFICATIONS_DATA.length} 則通知`;
            }
            markAllBtn.remove();

            console.log('[Notifications] All marked as read');
        });
    }

    // Individual notification click
    container.querySelectorAll('.notification-card').forEach(card => {
        card.addEventListener('click', () => {
            const notificationId = parseInt(card.dataset.notificationId);
            const notification = NOTIFICATIONS_DATA.find(n => n.id === notificationId);

            if (notification && !notification.isRead) {
                notification.isRead = true;
                card.classList.add('opacity-70');
                const dot = card.querySelector('.bg-red-500.rounded-full');
                if (dot) dot.remove();
            }

            console.log(`[Notifications] Clicked notification ${notificationId}`);
        });
    });
}

/**
 * 根據分類篩選通知
 * @param {HTMLElement} container - 容器元素
 * @param {string} category - 分類 ID
 */
function filterNotifications(container, category) {
    const cards = container.querySelectorAll('.notification-card');
    const noMessage = container.querySelector('#no-notifications-message');
    let visibleCount = 0;

    cards.forEach(card => {
        const cardCategory = card.dataset.category;
        if (category === 'all' || cardCategory === category) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });

    // Show/hide empty message
    if (noMessage) {
        if (visibleCount === 0) {
            noMessage.classList.remove('hidden');
        } else {
            noMessage.classList.add('hidden');
        }
    }

    // Reinitialize icons for any newly visible cards
    if (window.lucide) window.lucide.createIcons();

    console.log(`[Notifications] Filtered by: ${category}, visible: ${visibleCount}`);
}
