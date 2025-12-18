import { BOOKS_DATA } from '../data/books.js';

export function initBookmarkFeature() {
    const container = document.getElementById('note-content-area');
    const sidebarList = document.getElementById('book-notes-list');
    const allNotesBtn = document.getElementById('all-notes-btn');
    const searchInputs = document.querySelectorAll('#bookmark-search-input-desktop');
    const typeFilterButtons = document.querySelectorAll('.note-filter-btn');
    const colorFilterButtons = document.querySelectorAll('.color-filter-btn');
    const sortSelect = document.getElementById('notes-sort-select');

    // Filter books that actually have notes
    const booksWithNotes = BOOKS_DATA.filter(book => book.notes && book.notes.length > 0);

    // State
    let state = {
        selectedBooks: new Set(), // Multi-select: Set of Strings (Book IDs)
        selectedColors: new Set(), // Multi-select: Set of Strings (Colors)
        selectedTypes: new Set(), // Multi-select: Set of Strings ('highlight', 'note', 'mixed')
        searchTerm: '',
        sort: 'date_desc',
    };

    // 1. Initial Render
    renderSidebar(booksWithNotes);
    renderContent();

    // 2. Event Listeners

    // Sidebar: Book Selection
    if (sidebarList) {
        sidebarList.removeEventListener('click', handleSidebarClick);
        sidebarList.addEventListener('click', handleSidebarClick);
    }

    function handleSidebarClick(e) {
        const item = e.target.closest('.book-index-item');
        if (!item) return;

        const bookId = item.dataset.bookId;
        toggleBookSelection(bookId);
    }

    // Sidebar: "All Notes"
    if (allNotesBtn) {
        allNotesBtn.addEventListener('click', () => {
            state.selectedBooks.clear();
            updateSidebarActiveState();
            renderContent();
        });
    }

    // Helper: Toggle Selection
    function toggleBookSelection(bookId) {
        if (state.selectedBooks.has(bookId)) {
            state.selectedBooks.delete(bookId);
        } else {
            state.selectedBooks.add(bookId);
        }
        updateSidebarActiveState();
        renderContent();
    }

    // Search Handlers
    searchInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase().trim();
                state.searchTerm = term;
                renderContent();
            });
        }
    });

    // Type Filter
    typeFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterType = btn.dataset.filter;

            if (state.selectedTypes.has(filterType)) {
                state.selectedTypes.delete(filterType);
            } else {
                state.selectedTypes.add(filterType);
            }

            // UI Update
            updateTypeFilterUI();
            renderContent();
        });
    });

    function updateTypeFilterUI() {
        typeFilterButtons.forEach(btn => {
            const type = btn.dataset.filter;

            if (state.selectedTypes.has(type)) {
                btn.classList.add('active', 'bg-white', 'text-text-primary', 'shadow-sm');
                btn.classList.remove('text-text-secondary', 'hover:bg-gray-200');
            } else {
                btn.classList.remove('active', 'bg-white', 'text-text-primary', 'shadow-sm');
                btn.classList.add('text-text-secondary', 'hover:bg-gray-200');
            }
        });
    }

    // Color Filter (Multi-select)
    colorFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            if (!color || color === 'all') return; // Should not happen if 'all' button is removed, but safe check

            if (state.selectedColors.has(color)) {
                state.selectedColors.delete(color);
            } else {
                state.selectedColors.add(color);
            }

            // UI Update
            updateColorFilterUI();

            renderContent();
        });
    });

    function updateColorFilterUI() {
        colorFilterButtons.forEach(b => {
            const c = b.dataset.color;
            if (state.selectedColors.has(c)) {
                b.classList.add('ring-2', 'ring-accent', 'ring-offset-1');
                b.style.opacity = '1';
            } else {
                b.classList.remove('ring-2', 'ring-accent', 'ring-offset-1');
                // Optional: Reduce opacity if others are selected? 
                // Let's keep distinct opacity for unselected if set is not empty to guide user?
                // Or just ring is enough. User didn't request dimming.
                b.style.opacity = state.selectedColors.size > 0 ? '0.5' : '1';
            }
        });
    }

    // Sort Select
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            state.sort = e.target.value;
            renderContent();
        });
    }

    // --- Core Logic ---

    function renderSidebar(booksToRender) {
        if (!sidebarList) return;

        if (booksToRender.length === 0) {
            sidebarList.innerHTML = `<div class="p-3 text-xs text-text-secondary text-center">無相關書籍</div>`;
            return;
        }

        sidebarList.innerHTML = booksToRender.map(book => `
            <div class="book-index-item flex gap-3 p-3 rounded-lg cursor-pointer border-l-4 border-transparent hover:bg-white hover:shadow-sm group transition-all"
                data-book-id="${book.id}">
                <img src="${book.cover}" class="w-12 h-16 object-cover rounded shadow-sm group-hover:opacity-90">
                <div class="flex-1 flex flex-col justify-center">
                    <h3 class="text-sm font-bold text-text-primary mb-1 line-clamp-1 group-hover:text-accent transition-colors">${book.title}</h3>
                    <div class="flex items-center justify-between text-xs text-text-secondary">
                        <span>${book.notes.length} 則筆記</span>
                    </div>
                </div>
            </div>
        `).join('');

        updateSidebarActiveState();
    }

    function updateSidebarActiveState() {
        const allItems = document.querySelectorAll('.book-index-item');
        // Reset Logic
        allItems.forEach(item => {
            item.classList.remove('active', 'bg-white', 'shadow-sm', 'border-accent');
            item.classList.add('border-transparent');
        });

        // "All Notes" Active State
        const allNotesBtnEl = document.getElementById('all-notes-btn');
        if (state.selectedBooks.size === 0) {
            allNotesBtnEl?.classList.add('active', 'bg-white', 'shadow-sm', 'border-accent');
            allNotesBtnEl?.classList.remove('border-transparent');
        } else {
            // Individual Items Active State
            state.selectedBooks.forEach(id => {
                const el = sidebarList?.querySelector(`.book-index-item[data-book-id="${id}"]`);
                if (el) {
                    el.classList.add('active', 'bg-white', 'shadow-sm', 'border-accent');
                    el.classList.remove('border-transparent');
                }
            });
        }
    }

    function renderContent() {
        if (!container) return;
        container.innerHTML = '';

        // 1. Data Preparation
        let filteredBooks = [];
        let sourceNotes = [];

        // Calculate Filtered Books for Sidebar/Capsules (Search Context)
        if (state.searchTerm) {
            const term = state.searchTerm;
            filteredBooks = booksWithNotes.filter(book => {
                if (book.title.toLowerCase().includes(term)) return true;
                const hasMatchingNote = book.notes.some(note =>
                    note.quote.toLowerCase().includes(term) ||
                    (note.comment && note.comment.toLowerCase().includes(term))
                );
                return hasMatchingNote;
            });
        } else {
            filteredBooks = booksWithNotes;
        }

        // UPDATE SIDEBAR 
        renderSidebar(filteredBooks);

        // 2. Prepare Notes (Multi-select Logic)
        if (state.selectedBooks.size === 0) {
            // All Books
            booksWithNotes.forEach(book => {
                book.notes.forEach(note => {
                    sourceNotes.push({ ...note, bookTitle: book.title, bookId: book.id, bookFormat: book.format });
                });
            });
        } else {
            // Selected Books Only
            booksWithNotes.forEach(book => {
                if (state.selectedBooks.has(book.id)) {
                    book.notes.forEach(note => {
                        sourceNotes.push({ ...note, bookTitle: book.title, bookId: book.id, bookFormat: book.format });
                    });
                }
            });
        }

        let resultNotes = sourceNotes.filter(note => {
            // Type Filter
            if (state.selectedTypes.size === 1) {
                const hasQuote = note.quote && note.quote.trim().length > 0;
                const hasComment = note.comment && note.comment.trim().length > 0;

                if (state.selectedTypes.has('highlight')) {
                    // Exclusive Highlight: Quote only, no comment
                    return hasQuote && !hasComment;
                }
                if (state.selectedTypes.has('note')) {
                    // Exclusive Note: Comment only, no quote
                    return !hasQuote && hasComment;
                }
            }
            // If size is 0 (None) or 2 (Both), show everything (Highight + Note + Mixed)
            // Implicitly 'return true' for type filter, continue to other filters.

            // Color Filter (Multi-select)
            if (state.selectedColors.size > 0) {
                const noteColor = note.color || 'yellow';
                if (!state.selectedColors.has(noteColor)) return false;
            }

            // Search Filter
            if (state.searchTerm) {
                const term = state.searchTerm;
                const matchQuote = note.quote && note.quote.toLowerCase().includes(term);
                const matchComment = note.comment && note.comment.toLowerCase().includes(term);
                const matchBookTitle = note.bookTitle.toLowerCase().includes(term);

                if (!matchQuote && !matchComment && !matchBookTitle) return false;
            }

            return true;
        });

        // 4. Sort
        resultNotes.sort((a, b) => {
            if (state.sort === 'page_asc') {
                return a.page - b.page;
            } else if (state.sort === 'date_asc') {
                return new Date(a.date) - new Date(b.date);
            } else {
                return new Date(b.date) - new Date(a.date);
            }
        });

        // 5. Render UI

        // A. Mobile Search Capsules
        if (state.searchTerm && filteredBooks.length > 0) {
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'flex gap-2 mb-6 overflow-x-auto pb-2 md:hidden no-scrollbar';

            tagsContainer.innerHTML = filteredBooks.map(book => {
                const isActive = state.selectedBooks.has(book.id);
                // Styles
                const bgClass = isActive ? 'bg-accent text-text-primary shadow-md ring-2 ring-accent ring-offset-1' : 'bg-white border border-border-color';
                const textClass = 'text-text-primary';

                return `
                <div class="book-filter-tag-wrapper flex-shrink-0 py-1 px-0.5">
                    <button class="book-filter-tag flex items-center gap-2 pl-1 pr-3 py-1 ${bgClass} rounded-full shadow-sm transition-all group" data-book-id="${book.id}">
                        <div class="w-6 h-8 bg-gray-200 rounded overflow-hidden relative border border-white/20">
                            <img src="${book.cover}" class="w-full h-full object-cover">
                            ${!isActive ? '<div class="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>' : ''}
                        </div>
                        <span class="text-sm font-bold ${textClass}">${book.title}</span>
                    </button>
                </div>
            `}).join('');

            container.appendChild(tagsContainer);

            const tagButtons = tagsContainer.querySelectorAll('.book-filter-tag');
            tagButtons.forEach(tag => {
                tag.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const targetBookId = tag.dataset.bookId;
                    toggleBookSelection(targetBookId);
                });
            });
        }

        // B. Note Cards
        if (resultNotes.length > 0) {
            const notesHTML = resultNotes.map(note => createNoteCard(note, state.searchTerm)).join('');
            container.insertAdjacentHTML('beforeend', notesHTML);
        } else {
            const emptyHTML = `
                <div class="flex flex-col items-center justify-center py-12 text-text-secondary opacity-60">
                    <i data-lucide="search-x" class="w-12 h-12 mb-2"></i>
                    <p>沒有找到符合條件的筆記</p>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', emptyHTML);
        }

        if (window.lucide) window.lucide.createIcons();
    }

    function highlightText(text, term) {
        if (!term) return text;
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 text-text-primary px-0.5 rounded">$1</mark>');
    }

    function createNoteCard(note, searchTerm) {
        const isNote = note.type === 'note';
        const badgeColor = isNote ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800';
        const typeLabel = isNote ? '筆記' : '劃線';

        const colorMap = {
            'yellow': { border: 'border-yellow-400', highlight: 'bg-yellow-100' },
            'green': { border: 'border-green-400', highlight: 'bg-green-100' },
            'blue': { border: 'border-blue-400', highlight: 'bg-blue-100' },
            'red': { border: 'border-red-400', highlight: 'bg-red-100' },
            'purple': { border: 'border-purple-400', highlight: 'bg-purple-100' },
        };
        const noteColor = note.color || 'yellow';
        const styles = colorMap[noteColor] || colorMap['yellow'];

        const checkQuote = highlightText(note.quote, searchTerm);
        const checkComment = isNote && note.comment ? highlightText(note.comment, searchTerm) : '';

        return `
        <div class="note-card bg-white p-5 rounded-xl shadow-sm border border-border-color relative group hover:shadow-md transition-all">
            <div class="absolute left-0 top-6 bottom-6 w-1.5 ${styles.border} rounded-r-full"></div>
            
            <div class="pl-5">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex flex-col">
                        <span class="text-xs text-text-secondary font-medium mb-0.5 block md:hidden">${note.bookTitle}</span> 
                        <a href="#" class="text-xs font-bold text-text-secondary hover:text-accent hover:underline mb-0.5 hidden md:block" data-book-link="${note.bookId}">${note.bookTitle}</a>
                    </div>
                </div>

                ${note.quote ? `
                <blockquote class="text-base text-text-primary leading-relaxed mb-3 font-medium relative">
                    <span class="absolute -left-3 -top-1 text-2xl text-gray-300 font-serif">"</span>
                    <span class="${styles.highlight} px-1 rounded box-decoration-clone leading-loose py-0.5">${checkQuote}</span>
                </blockquote>` : ''}

                ${isNote && note.comment ? `
                <div class="mt-3 p-3 bg-gray-50 rounded-lg border border-transparent">
                    <span class="block text-xs font-bold text-gray-500 mb-1">筆記</span>
                    <p class="text-sm text-gray-800">${checkComment}</p>
                </div>` : ''}

            <div class="flex items-center justify-between text-xs text-text-secondary mt-3 pt-3 border-t border-gray-50">
                <div class="flex items-center gap-3">
                    <span class="flex items-center gap-1"><i data-lucide="file-text" class="w-3 h-3"></i> ${note.bookFormat === 'EPUB' ? note.page + '%' : 'P.' + note.page}</span>
                    <span>${note.date.split(' ')[0]}</span>
                </div>
                    <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button class="hover:text-accent p-1"><i data-lucide="share-2" class="w-4 h-4"></i></button>
                        <button class="hover:text-red-500 p-1"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </div>
                </div>
            </div>
        </div>`;
    }
}