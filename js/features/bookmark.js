// Mock Data for bookmarks
export const BOOK_NOTES_DATA = [
    {
        bookId: 'atomic',
        title: '原子習慣',
        author: 'James Clear',
        totalNotes: 12,
        notes: [
            { id: 1, type: 'note', page: 45, date: '2025/11/10 14:30', quote: '你採取的每一個行動，都是投票給你想要成為的那個人。你不必變得完美，但每一次的投票都是在強化你的身分認同。', comment: '這句話提醒我，每天的小選擇都會累積成未來的自己。要更注意自己的習慣。' },
            { id: 2, type: 'highlight', page: 112, date: '2025/11/08 09:00', quote: '習慣是自我改善的複利。' }
        ]
    },
    {
        bookId: 'design',
        title: '設計系統實戰',
        author: 'Author A',
        totalNotes: 5,
        notes: [
            { id: 3, type: 'highlight', page: 23, date: '2025/11/09 09:15', quote: '目標是關於你想要達到的結果，系統是關於導致這些結果的過程。' }
        ]
    },
    {
        bookId: 'ux',
        title: 'UX 領導力',
        author: 'Author B',
        totalNotes: 22,
        notes: [
            { id: 4, type: 'note', page: 88, date: '2025/10/20 16:20', quote: '好的領導者不是告訴別人做什麼，而是移除障礙。', comment: '專案管理的重要心法。' }
        ]
    }
];

export function initBookmarkFeature() {
    const container = document.getElementById('note-content-area');
    const header = document.getElementById('note-header-info');
    const sidebarItems = document.querySelectorAll('.book-index-item');
    const searchInputs = document.querySelectorAll('#bookmark-search-input, #mobile-bookmark-search');
    const filterButtons = document.querySelectorAll('.note-filter-btn');

    // 1. Initial Render (All notes)
    renderNotes('all');

    // 2. Sidebar Click Handlers
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            // Active State
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const bookId = item.dataset.bookId;
            renderNotes(bookId);
        });
    });

    // 3. Search Handler for both inputs
    searchInputs.forEach(input => {
            if (input) {
                input.addEventListener('input', (e) => {
                    const term = e.target.value.toLowerCase().trim();
                    
                    // [關鍵] 同步另一個輸入框的值 (這樣切換視窗大小時才不會清空)
                    searchInputs.forEach(otherInput => {
                        if (otherInput !== input) otherInput.value = term;
                    });

                    filterNotesBySearch(term);
                });
            }
        });
// 4. [修改] Filter Buttons Logic (狀態同步)
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterType = btn.dataset.filter;

            // [關鍵] 不只移除當前按鈕 active，而是移除所有按鈕的 active，再把「同類型」的按鈕都加上 active
            filterButtons.forEach(b => b.classList.remove('active', 'bg-white', 'text-text-primary', 'shadow-sm'));
            
            // 找出所有相同 filter 類型的按鈕 (Mobile + Desktop) 並設為激活狀態
            const sameTypeButtons = document.querySelectorAll(`.note-filter-btn[data-filter="${filterType}"]`);
            sameTypeButtons.forEach(activeBtn => {
                activeBtn.classList.add('active');
                // 如果你的 CSS 依賴 utility classes 來做 active 樣式，這裡可能需要手動加回
                // 參考 components.css 的 .active 定義
            });
            
            // 執行篩選
            const cards = container.querySelectorAll('.note-card');
            cards.forEach(card => {
                if (filterType === 'all' || card.dataset.type === filterType) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // --- Core Render Function ---
    function renderNotes(bookId) {
        if (!container) return;
        container.innerHTML = ''; // Clear current

        let displayNotes = [];

        if (bookId === 'all') {
            BOOK_NOTES_DATA.forEach(book => {
                book.notes.forEach(note => {
                    displayNotes.push({ ...note, bookTitle: book.title, bookId: book.bookId });
                });
            });
        } else {
            const book = BOOK_NOTES_DATA.find(b => b.bookId === bookId);
            if (book) {
                displayNotes = book.notes.map(n => ({ ...n, bookTitle: book.title, bookId: book.bookId }));
            }
        }

        // Render Cards
        displayNotes.forEach(note => {
            const cardHTML = createNoteCard(note);
            container.innerHTML += cardHTML;
        });
        
        // Re-init icons for new content
        if(window.lucide) window.lucide.createIcons();
    }

    function createNoteCard(note) {
        const isNote = note.type === 'note';
        const badgeColor = isNote ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
        const typeLabel = isNote ? '筆記' : '劃線';
        
        return `
        <div class="note-card bg-white p-4 md:p-6 rounded-xl shadow-sm border border-border-color relative group hover:shadow-md transition-all mb-6" data-type="${note.type}">
            <div class="absolute top-2 right-2 z-10">
                <span class="${badgeColor} text-xs font-bold px-2 py-1 rounded-full">${typeLabel}</span>
            </div>
            <div class="absolute left-0 top-6 bottom-6 w-1 bg-accent rounded-r-full"></div>
            <div class="pl-4">
                <div class="text-accent font-bold mb-2 block md:hidden">${note.bookTitle}</div>
                <a href="#" class="text-sm font-bold text-accent hover:underline mb-2 block hidden md:block" data-book-link="${note.bookId}">${note.bookTitle}</a>
                <blockquote class="text-lg text-text-primary leading-relaxed mb-4 font-medium">"${note.quote}"</blockquote>
                ${isNote && note.comment ? `
                <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p class="text-sm text-yellow-800">${note.comment}</p>
                </div>` : ''}
                <div class="flex items-center justify-between text-xs text-text-secondary mt-4 pt-4 border-t border-gray-50">
                    <div class="flex items-center gap-2"><span class="bg-gray-100 px-2 py-1 rounded flex items-center gap-1"><i data-lucide="file-text" class="w-3 h-3"></i> Page ${note.page}</span><span>${note.date}</span></div>
                    <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button class="hover:text-accent"><i data-lucide="share-2" class="w-4 h-4"></i></button><button class="hover:text-red-500"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div>
                </div>
            </div>
        </div>`;
    }

    function filterNotesBySearch(term) {
        const cards = container.querySelectorAll('.note-card');
        cards.forEach(card => {
            const textContent = card.innerText.toLowerCase();
            if (textContent.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        // Do not update header on search for mobile-first design
    }
}