// 1. 書籍資料庫 (模擬)
export const BOOKS_DATA = [
    {
        id: 'design',
        title: '設計系統實戰',
        author: 'Author A',
        type: '教科書',
        category: '設計',
        cover: 'https://placehold.co/300x450/629BC1/FFFFFF?text=System',
        progress: 45,
        remainingTime: '5 天 10 小時',
        publisher: "O'Reilly Media",
        publishDate: "2024/05/20",
        source: '讀冊',
        description: '本書深入淺出地介紹了如何從零開始建置一套完整的設計系統，適合設計師與工程師閱讀。',
        expiryDate: '2025/12/09 10:00',
        teachingResources: {
            attachments: [
                { name: '課程大綱.pdf', size: '1.2 MB', url: '#' },
                { name: '補充教材.zip', size: '15 MB', url: '#' }
            ],
            links: [
                { title: '官方 Figma 設計稿', url: '#' },
                { title: '參考範例網站', url: '#' }
            ]
        },
        duration: '12 小時 30 分',
        lastRead: '2025/11/19',
        format: 'PDF'
    },
    {
        id: 'atomic',
        title: '原子習慣',
        author: 'James Clear',
        type: '中文書',
        category: '商業',
        cover: 'https://placehold.co/300x450/F59E0B/FFFFFF?text=Habits',
        progress: 71,
        remainingTime: '',
        publisher: "Business Weekly",
        publishDate: "2019/06/01",
        source: 'Kobo',
        description: '每天都進步1%，一年後你會進步37倍。細微改變帶來巨大成就的實證法則。',
        expiryDate: '',
        duration: '5 小時 20 分',
        lastRead: '2025/11/20',
        format: 'EPUB'
    },
    {
        id: 'ux',
        title: 'UX 領導力',
        author: 'Author B',
        type: '外文書',
        category: '設計',
        cover: 'https://placehold.co/300x450/10B981/FFFFFF?text=UX',
        progress: 10,
        remainingTime: '',
        publisher: "Flag",
        publishDate: "2023/11/15",
        source: 'iRead',
        description: '探討設計主管如何帶領團隊，建立高效的設計文化與流程。',
        expiryDate: '',
        duration: '1 小時 05 分',
        lastRead: '2025/10/30',
        format: 'EPUB'
    }
];
