import { openModal } from '../utils.js';
import { BOOK_NOTES_DATA } from './bookmark.js';

// 1. 書籍資料庫 (模擬)
export const BOOKS_DATA = [
    {
        id: 'design',
        title: '設計系統實戰',
        author: 'Author A',
        type: '教科書',
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
        lastRead: '2025/11/19'
    },
    {
        id: 'atomic',
        title: '原子習慣',
        author: 'James Clear',
        type: '中文書',
        cover: 'https://placehold.co/300x450/F59E0B/FFFFFF?text=Habits',
        progress: 71,
        remainingTime: '',
        publisher: "Business Weekly",
        publishDate: "2019/06/01",
        source: 'Kobo',
        description: '每天都進步1%，一年後你會進步37倍。細微改變帶來巨大成就的實證法則。',
        expiryDate: '',
        duration: '5 小時 20 分',
        lastRead: '2025/11/20'
    },
    {
        id: 'ux',
        title: 'UX 領導力',
        author: 'Author B',
        type: '外文書',
        cover: 'https://placehold.co/300x450/10B981/FFFFFF?text=UX',
        progress: 10,
        remainingTime: '',
        publisher: "Flag",
        publishDate: "2023/11/15",
        source: 'iRead',
        description: '探討設計主管如何帶領團隊，建立高效的設計文化與流程。',
        expiryDate: '',
        duration: '1 小時 05 分',
        lastRead: '2025/10/30'
    }
];

// 2. 生成 HTML 模板
export function createBookCardHTML(book) {
    const isTextbook = book.type === '教科書';
    const remainingTag = isTextbook && book.remainingTime 
        ? `<div class="absolute top-2 right-2 z-10"><span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border border-white/50 shadow-md">剩餘 ${book.remainingTime}</span></div>` 
        : '';

    const progressWidth = `${book.progress}%`;
    
    return `
    <div class="book-item bg-secondary rounded-xl shadow-sm overflow-hidden flex flex-col border border-border-color md:hover:shadow-lg transition-all group relative" data-book-id="${book.id}">
        <div class="absolute top-2 left-2 z-20 batch-checkbox hidden">
            <input type="checkbox" class="w-5 h-5 rounded text-accent focus:ring-accent">
        </div>
        ${remainingTag}
        <div class="relative overflow-hidden aspect-[2/3] info-trigger cursor-pointer">
            <img src="${book.cover}" alt="${book.title}" class="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-110">
            <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                <div class="h-full" style="width: ${book.progress}%; background-color: var(--bg-accent);"></div>
            </div>
            <div class="absolute inset-0 bg-black/70 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hidden md:flex flex-col items-center justify-center gap-3 p-6 z-20 backdrop-blur-[2px]">
                <button class="mask-btn w-full py-2.5 rounded-lg shadow-md read-btn">立即閱讀</button>
                <button class="mask-btn w-full py-2.5 rounded-lg shadow-md shelf-btn">加入書櫃</button>
                <button class="mask-btn w-full py-2.5 rounded-lg shadow-md info-btn">更多資訊</button>
            </div>
        </div>
        <div class="p-4 flex-1 flex flex-col relative">
            <h3 class="font-bold text-text-primary truncate mb-1 md:group-hover:text-accent cursor-pointer info-trigger">${book.title}</h3>
            <p class="text-sm text-text-secondary truncate">${book.author}</p>
        </div>
    </div>`;
}

function createBookListItemHTML(book) {
    const isTextbook = book.type === '教科書';
    const remainingText = isTextbook && book.remainingTime 
        ? `<div class="text-xs text-red-500 font-medium">剩餘 ${book.remainingTime}</div>` 
        : '';
    
    return `
    <div class="book-list-item bg-secondary rounded-xl shadow-sm border border-border-color p-3 gap-3 md:p-4 md:gap-6 flex items-center gap-6 hover:shadow-md transition-all" data-book-id="${book.id}">
        <img src="${book.cover}" alt="${book.title}" class="w-16 md:w-20 h-30 object-cover rounded-md shadow-sm flex-shrink-0 cursor-pointer info-trigger">
        <div class="flex-1 min-w-0 cursor-pointer info-trigger">
            <h3 class="font-bold text-base md:text-lg text-text-primary mb-1 hover:text-accent">${book.title}</h3>
            <p class="text-xs md:text-sm text-text-secondary mb-1">${book.author}</p>
            ${remainingText}
            <div class="w-full max-w-xs h-1 md:h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div class="h-full bg-accent" style="width: ${book.progress}%; background-color: var(--bg-accent);"></div>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <button class="p-1.5 md:p-2 rounded-full hover:bg-gray-100 info-btn"><i data-lucide="more-horizontal" class="w-5 h-5 text-text-primary"></i></button>
        </div>
    </div>`;
}

// 3. 彈窗邏輯
function showBookDetails(bookId) {
    const book = BOOKS_DATA.find(b => b.id === bookId);
    if (!book) return;

    const authorText = book.publisher && book.publisher !== '-'
        ? `${book.author}, ${book.publisher}`
        : book.author;

    // --- Update elements for both mobile and desktop ---

    // Title and Author are shared
    document.getElementById('modal-book-title').textContent = book.title;
    document.getElementById('modal-book-author').textContent = authorText;

    // Cover image
    document.getElementById('modal-book-cover').src = book.cover;
    document.getElementById('modal-book-cover-mobile').src = book.cover;
    
    // Source badge
    document.getElementById('modal-book-source').textContent = book.source;
    document.getElementById('modal-book-source-mobile').textContent = book.source;

    // Bibliographic info
    document.getElementById('modal-book-pubdate').textContent = book.publishDate || '-';
    document.getElementById('modal-book-pubdate-mobile').textContent = book.publishDate || '-';
    document.getElementById('modal-book-duration').textContent = book.duration || '-';
    document.getElementById('modal-book-duration-mobile').textContent = book.duration || '-';
    document.getElementById('modal-book-lastread').textContent = book.lastRead || '-';
    document.getElementById('modal-book-lastread-mobile').textContent = book.lastRead || '-';
    
    // Description
    document.getElementById('modal-book-description').textContent = book.description;
    document.getElementById('modal-book-description-mobile').textContent = book.description;

    // --- Textbook-specific logic ---
    const isTextbook = book.type === '教科書';

    // Helper to toggle visibility for desktop and mobile containers
    const toggleVisibility = (selector, visible) => {
        document.getElementById(selector)?.classList.toggle('hidden', !visible);
        document.getElementById(`${selector}-mobile`)?.classList.toggle('hidden', !visible);
    };

    toggleVisibility('modal-expiry-container', isTextbook);
    toggleVisibility('teaching-resources-container', isTextbook);

    if (isTextbook) {
        document.getElementById('modal-book-expiry').textContent = book.expiryDate;
        document.getElementById('modal-book-expiry-mobile').textContent = book.expiryDate;

        const resources = book.teachingResources;
        let contentHTML = '';
        if (resources) {
            if (resources.attachments && resources.attachments.length > 0) {
                contentHTML += '<h4 class="text-sm font-bold text-text-secondary mb-2 uppercase">附件</h4><div class="space-y-2">';
                resources.attachments.forEach(file => {
                    contentHTML += `<a href="${file.url}" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-border-color hover:bg-gray-100 transition-colors"><div class="flex items-center gap-3"><i data-lucide="file-text" class="w-5 h-5 text-text-secondary"></i><div><div class="font-medium text-text-primary">${file.name}</div><div class="text-xs text-text-secondary">${file.size}</div></div></div><i data-lucide="download" class="w-5 h-5 text-text-secondary"></i></a>`;
                });
                contentHTML += '</div>';
            }
            if (resources.links && resources.links.length > 0) {
                contentHTML += '<h4 class="text-sm font-bold text-text-secondary mt-4 mb-2 uppercase">參考連結</h4><div class="space-y-2">';
                resources.links.forEach(link => {
                    contentHTML += `<a href="${link.url}" target="_blank" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-border-color hover:bg-gray-100 transition-colors"><i data-lucide="link" class="w-5 h-5 text-text-secondary"></i><span class="font-medium text-text-primary">${link.title}</span><i data-lucide="arrow-up-right" class="w-4 h-4 text-text-secondary ml-auto"></i></a>`;
                });
                contentHTML += '</div>';
            }
        }
        
        const desktopContent = document.getElementById('teaching-resources-content');
        const mobileContent = document.getElementById('teaching-resources-content-mobile');
        const finalHTML = contentHTML || '<p>無可用資源。</p>';
        if (desktopContent) desktopContent.innerHTML = finalHTML;
        if (mobileContent) mobileContent.innerHTML = finalHTML;
    }

    if(window.lucide) window.lucide.createIcons();
    openModal('book-info-modal');
}

export function initFilterBar(prefix, gridViewId, listViewId) {
    // 視圖切換 (Grid/List)
    const gridBtn = document.getElementById(`${prefix}grid-view-btn`);
    const listBtn = document.getElementById(`${prefix}list-view-btn`);
    const gridView = document.getElementById(gridViewId);
    const listView = document.getElementById(listViewId);

    if (gridBtn && listBtn && gridView && listView) {
        gridBtn.addEventListener('click', () => {
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
            gridView.classList.remove('hidden');
            listView.classList.add('hidden');
        });

        listBtn.addEventListener('click', () => {
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
            gridView.classList.add('hidden');
            listView.classList.remove('hidden');
        });
    }

    // 批次選取 (簡易版：僅支援 Grid)
    const batchBtn = document.getElementById(`${prefix}batch-select-btn`);
    const batchBar = document.getElementById('batch-action-bar'); // Note: batch bar is global
    const countSpan = document.getElementById('selected-count');
    let isBatchMode = false;
    let selectedCount = 0;

    if (batchBtn && gridView) {
        batchBtn.addEventListener('click', () => {
            isBatchMode = !isBatchMode;
            batchBar.classList.toggle('hidden');
            
            const checkboxes = gridView.querySelectorAll('.batch-checkbox');
            checkboxes.forEach(cb => cb.classList.toggle('hidden'));

            if (isBatchMode) {
                batchBtn.textContent = '完成';
                batchBtn.classList.replace('bg-blue-500', 'bg-gray-500');
            } else {
                batchBtn.textContent = '批次選取';
                batchBtn.classList.replace('bg-gray-500', 'bg-blue-500');
                // 重置
                gridView.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    cb.checked = false;
                    cb.closest('.book-item').classList.remove('ring-2', 'ring-accent');
                });
                selectedCount = 0;
                if(countSpan) countSpan.textContent = `已選取 0 本書`;
            }
        });

        gridView.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                const item = e.target.closest('.book-item');
                if (e.target.checked) {
                    item.classList.add('ring-2', 'ring-accent');
                    selectedCount++;
                } else {
                    item.classList.remove('ring-2', 'ring-accent');
                    selectedCount--;
                }
                if(countSpan) countSpan.textContent = `已選取 ${selectedCount} 本書`;
            }
        });
    }

    // 排序下拉選單
    const sortBtn = document.getElementById(`${prefix}sort-menu-btn`);
    const sortDropdown = document.getElementById(`${prefix}sort-dropdown`);
    if (sortBtn && sortDropdown) {
        sortBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sortDropdown.classList.toggle('hidden');
        });
        // A global click listener is tricky here. If we add one for each filter bar, we'll have multiple.
        // For simplicity, this might need a more robust solution later, but for now, we'll add it.
        window.addEventListener('click', (e) => {
            if (!sortBtn.contains(e.target) && !sortDropdown.contains(e.target)) {
                sortDropdown.classList.add('hidden');
            }
        });
    }
}

// 4. 初始化功能
export function initBookshelfFeature() {
    // 渲染書籍
    const gridContainer = document.getElementById('all-books-grid');
    const listContainer = document.getElementById('all-books-list');

    if (gridContainer) gridContainer.innerHTML = BOOKS_DATA.map(createBookCardHTML).join('');
    if (listContainer) listContainer.innerHTML = BOOKS_DATA.map(createBookListItemHTML).join('');

    // 事件代理：處理點擊 (Grid & List 通用)
    const handleBookClick = (e) => {
        const target = e.target;
        // 加入書櫃按鈕
        if (target.closest('.shelf-btn')) {
            openModal('add-shelf-modal');
            e.stopPropagation();
            return;
        }
        // 更多資訊 / 書名 / 封面
        if (target.closest('.info-btn') || target.closest('.info-trigger')) {
            const card = target.closest('.book-item') || target.closest('.book-list-item');
            if (card) showBookDetails(card.dataset.bookId);
            e.stopPropagation();
        }
    };

    if (gridContainer) gridContainer.addEventListener('click', handleBookClick);
    if (listContainer) listContainer.addEventListener('click', handleBookClick);

    // Tab 切換
    const tabs = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab-target');
            panels.forEach(p => p.classList.add('hidden'));
            tabs.forEach(t => t.classList.remove('tab-active'));
            document.getElementById(targetId)?.classList.remove('hidden');
            tab.classList.add('tab-active');
        });
    });

    // 設定 All Books 篩選列功能
    initFilterBar('', 'all-books-grid', 'all-books-list');

    // 初始化圖示
    if (window.lucide) window.lucide.createIcons();
    
    // --- Mobile Filter Modal Logic ---
    const mobileFilterTrigger = document.getElementById('mobile-filter-trigger');
    
    if (mobileFilterTrigger) {
        mobileFilterTrigger.addEventListener('click', () => {
            openModal('mobile-filter-modal');
        });
    }

    // 處理 Filter Chips (單選邏輯: 閱讀狀態)
    document.querySelectorAll('.mobile-filter-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            const group = e.target.dataset.group;
            // 移除同組其他按鈕的 active 樣式
            document.querySelectorAll(`.mobile-filter-chip[data-group="${group}"]`).forEach(c => {
                c.classList.remove('bg-accent/10', 'text-accent', 'border-accent', 'active');
                c.classList.add('text-text-secondary');
            });
            // 加上自己的 active 樣式
            e.target.classList.add('bg-accent/10', 'text-accent', 'border-accent', 'active');
            e.target.classList.remove('text-text-secondary');
        });
    });

    // 處理 Toggle Buttons (多選邏輯: 類型)
    document.querySelectorAll('.mobile-toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const button = e.currentTarget;
            button.classList.toggle('active');
            
            if (button.classList.contains('active')) {
                button.classList.add('bg-accent', 'text-white', 'border-accent');
                button.classList.remove('bg-white', 'text-text-secondary', 'hover:text-accent');
            } else {
                button.classList.remove('bg-accent', 'text-white', 'border-accent');
                button.classList.add('bg-white', 'text-text-secondary', 'hover:text-accent');
            }
        });
    });

    // 處理重設按鈕
    const resetBtn = document.getElementById('mobile-filter-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // 重設 Radio
            const defaultSort = document.querySelector('input[name="mobile-sort"][value="recently-read"]');
            if(defaultSort) defaultSort.checked = true;
            
            const defaultSource = document.querySelector('input[name="mobile-source"][value="all"]');
            if(defaultSource) defaultSource.checked = true;

            // 重設 Chips
            document.querySelectorAll('.mobile-filter-chip').forEach(c => {
                c.classList.remove('bg-accent/10', 'text-accent', 'border-accent', 'active');
                c.classList.add('text-text-secondary');
            });
            const defaultStatus = document.querySelector('.mobile-filter-chip[data-value="all"]');
            if(defaultStatus) defaultStatus.classList.add('bg-accent/10', 'text-accent', 'border-accent', 'active');

            // 重設 Toggles
            document.querySelectorAll('.mobile-toggle-btn').forEach(b => {
                b.classList.remove('active', 'bg-accent', 'text-white', 'border-accent');
                b.classList.add('bg-white', 'text-text-secondary');
            });
        });
    }

    // 處理套用按鈕
    const applyBtn = document.getElementById('mobile-filter-apply');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                // 這裡可以加入實際的篩選邏輯，目前先關閉視窗
                const modal = document.getElementById('mobile-filter-modal');
                if(modal) modal.classList.add('hidden');
                
                // 可選：顯示一個 Toast 或 Console 訊息
                console.log("Filters applied!");
            });
        }
    }