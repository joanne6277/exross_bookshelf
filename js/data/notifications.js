export const NOTIFICATIONS_DATA = [
    {
        id: 1,
        title: '歡迎來到書紐 eXross',
        content: '感謝您註冊！開始探索您的專屬閱讀體驗吧。',
        date: '2025/11/01 09:00',
        isRead: true,
        type: 'success',
        category: 'system'
    },
    {
        id: 2,
        title: '書籍到期提醒',
        content: '您的教科書《Clean Code》將於 10 天後到期，請把握閱讀時間。',
        date: '2025/12/20 10:00',
        isRead: false,
        type: 'alert',
        category: 'expiry'
    },
    {
        id: 3,
        title: '新功能上線',
        content: '劃線筆記現在支援「分享」功能囉！您可以將筆記匯出成 Markdown 或分享給朋友。',
        date: '2026/01/15 14:30',
        isRead: false,
        type: 'info',
        category: 'system'
    },
    {
        id: 5,
        title: '租借即將到期',
        content: '您的《設計模式》將於 3 天後到期，如需延長請前往書櫃操作。',
        date: '2026/01/18 09:00',
        isRead: false,
        type: 'alert',
        category: 'expiry'
    }
];

// 通知分類定義
export const NOTIFICATION_CATEGORIES = [
    { id: 'all', label: '全部' },
    { id: 'system', label: '系統訊息' },
    { id: 'expiry', label: '到期提醒' }
];

