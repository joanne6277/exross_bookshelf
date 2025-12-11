import { openModal } from '../utils.js';
import { BOOK_NOTES_DATA } from './bookmark.js';

// 1. 書籍資料庫 (模擬)
const BOOKS_DATA = [
    {
        id: 'design',
        title: '設計系統實戰',
        author: 'Author A',
        cover: 'https://placehold.co/300x450/629BC1/FFFFFF?text=System',
        progress: 45,
        remainingTime: '5 天 10 小時',
        publisher: "O'Reilly Media",
        publishDate: "2024/05/20",
        source: '讀冊',
        description: '本書深入淺出地介紹了如何從零開始建置一套完整的設計系統，適合設計師與工程師閱讀。',
        expiryDate: '2025/12/09 10:00',
        duration: '12 小時 30 分',
        lastRead: '2025/11/19'
    },
    {
        id: 'atomic',
        title: '原子習慣',
        author: 'James Clear',
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
function createBookCardHTML(book) {
    const remainingTag = book.remainingTime 
        ? `<div class="absolute top-2 right-2 z-10"><span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border border-white/50 shadow-md">剩餘 ${book.remainingTime}</span></div>` 
        : '';

    const progressWidth = `${book.progress}%`;
    
    return `
    <div class="book-item bg-secondary rounded-xl shadow-sm overflow-hidden flex flex-col border border-border-color hover:shadow-lg transition-all group relative" data-book-id="${book.id}">
        <div class="absolute top-2 left-2 z-20 batch-checkbox hidden">
            <input type="checkbox" class="w-5 h-5 rounded text-accent focus:ring-accent">
        </div>
        ${remainingTag}
        <div class="relative overflow-hidden aspect-[2/3]">
            <img src="${book.cover}" alt="${book.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
            <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                <div class="h-full" style="width: ${book.progress}%; background-color: var(--bg-accent);"></div>
            </div>
            <div class="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-6 z-20 backdrop-blur-[2px]">
                <button class="mask-btn w-full py-2.5 rounded-lg shadow-md read-btn">立即閱讀</button>
                <button class="mask-btn w-full py-2.5 rounded-lg shadow-md shelf-btn">加入書櫃</button>
                <button class="mask-btn w-full py-2.5 rounded-lg shadow-md info-btn">更多資訊</button>
            </div>
        </div>
        <div class="p-4 flex-1 flex flex-col relative">
            <h3 class="font-bold text-text-primary truncate mb-1 group-hover:text-accent cursor-pointer info-trigger">${book.title}</h3>
            <p class="text-sm text-text-secondary truncate">${book.author}</p>
        </div>
    </div>`;
}

function createBookListItemHTML(book) {
    const remainingText = book.remainingTime 
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

    // 基本資訊
    document.getElementById('modal-book-title').textContent = book.title;
    document.getElementById('modal-book-author').textContent = book.author;
    document.getElementById('modal-book-cover').src = book.cover;
    document.getElementById('modal-book-source').textContent = book.source;
    document.getElementById('modal-book-publisher').textContent = book.publisher || '-';
    document.getElementById('modal-book-pubdate').textContent = book.publishDate || '-';
    document.getElementById('modal-book-duration').textContent = book.duration || '-';
    document.getElementById('modal-book-lastread').textContent = book.lastRead || '-';
    document.getElementById('modal-book-description').textContent = book.description;

    // 到期日
    const expiryEl = document.getElementById('modal-book-expiry');
    const expiryContainer = document.getElementById('modal-expiry-container');
    if (book.expiryDate) {
        expiryEl.textContent = book.expiryDate;
        expiryContainer.classList.remove('hidden');
    } else {
        expiryContainer.classList.add('hidden');
    }

    // 劃線筆記
    const notesContainer = document.getElementById('notes-content');
    const notesCountSpan = document.getElementById('modal-notes-count');
    const bookNotes = BOOK_NOTES_DATA.find(b => b.bookId === bookId);

    if (bookNotes && bookNotes.notes.length > 0) {
        notesCountSpan.textContent = bookNotes.notes.length;
        notesContainer.innerHTML = bookNotes.notes.map(note => {
            const isNote = note.type === 'note';
            const badgeClass = isNote ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
            const label = isNote ? '筆記' : '劃線';
            return `
            <div class="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm hover:bg-gray-100 transition-colors">
                <div class="flex items-center gap-2 mb-2">
                    <span class="${badgeClass} text-xs font-bold px-1.5 py-0.5 rounded">${label}</span>
                    <span class="text-text-secondary text-xs">Page ${note.page}</span>
                    <span class="text-text-secondary text-xs ml-auto">${note.date.split(' ')[0]}</span>
                </div>
                <blockquote class="text-text-primary font-medium mb-2 border-l-2 border-gray-300 pl-2 leading-relaxed">"${note.quote}"</blockquote>
                ${isNote && note.comment ? `<div class="text-xs text-text-secondary bg-white p-2 rounded border border-gray-100 flex gap-2"><i data-lucide="message-square" class="w-3 h-3 flex-shrink-0"></i><span>${note.comment}</span></div>` : ''}
            </div>`;
        }).join('');
    } else {
        notesCountSpan.textContent = '0';
        notesContainer.innerHTML = '<div class="text-center py-4 text-text-secondary text-sm">此書尚無劃線筆記</div>';
    }

    if(window.lucide) window.lucide.createIcons();
    openModal('book-info-modal');
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

    // 視圖切換 (Grid/List)
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');
    const gridView = document.getElementById('all-books-grid');
    const listView = document.getElementById('all-books-list');

    if (gridBtn && listBtn) {
        gridBtn.addEventListener('click', () => {
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
            gridView?.classList.remove('hidden');
            listView?.classList.add('hidden');
        });

        listBtn.addEventListener('click', () => {
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
            gridView?.classList.add('hidden');
            listView?.classList.remove('hidden');
        });
    }

    // 批次選取 (簡易版：僅支援 Grid)
    const batchBtn = document.getElementById('batch-select-btn');
    const batchBar = document.getElementById('batch-action-bar');
    const countSpan = document.getElementById('selected-count');
    let isBatchMode = false;
    let selectedCount = 0;

    if (batchBtn && gridContainer) {
        batchBtn.addEventListener('click', () => {
            isBatchMode = !isBatchMode;
            batchBar.classList.toggle('hidden');
            
            const checkboxes = gridContainer.querySelectorAll('.batch-checkbox');
            checkboxes.forEach(cb => cb.classList.toggle('hidden'));

            if (isBatchMode) {
                batchBtn.textContent = '完成';
                batchBtn.classList.replace('bg-blue-500', 'bg-gray-500');
            } else {
                batchBtn.textContent = '批次選取';
                batchBtn.classList.replace('bg-gray-500', 'bg-blue-500');
                // 重置
                gridContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    cb.checked = false;
                    cb.closest('.book-item').classList.remove('ring-2', 'ring-accent');
                });
                selectedCount = 0;
                if(countSpan) countSpan.textContent = `已選取 0 本書`;
            }
        });

        gridContainer.addEventListener('change', (e) => {
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

    // 初始化圖示
    if (window.lucide) window.lucide.createIcons();
    initSortDropdown();
}
    // 5. 排序下拉選單
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

function initSortDropdown() {
    const btn = document.getElementById('sort-menu-btn');
    const dropdown = document.getElementById('sort-dropdown');
    if (btn && dropdown) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        });
        window.addEventListener('click', (e) => {
            if (!btn.contains(e.target) && !dropdown.contains(e.target)) dropdown.classList.add('hidden');
        });
    }
}