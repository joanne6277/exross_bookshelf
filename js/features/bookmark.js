import { BOOKS_DATA } from '../data/books.js';
import { openModal, closeModal } from '../utils.js';

const state = {
    searchTerm: '',
    selectedBooks: new Set(),
    selectedTypes: new Set(),
    selectedColors: new Set(),
    sortType: 'date',
    sortDirection: 'desc'
};

export function initBookmarkFeature() {
    const container = document.getElementById('note-content-area');
    const sidebarList = document.getElementById('book-notes-list');
    const allNotesBtn = document.getElementById('all-notes-btn');
    const searchInputs = document.querySelectorAll('#bookmark-search-input-desktop'); // Use querySelectorAll if there's possibly a mobile one with same ID? View says unique ID, but safe to assume 1.
    const searchInput = document.getElementById('bookmark-search-input-desktop');
    const typeFilterButtons = document.querySelectorAll('.note-filter-btn');
    const colorFilterButtons = document.querySelectorAll('.color-filter-btn');
    const sortMenuBtn = document.getElementById('notes-sort-menu-btn');
    const sortDropdown = document.getElementById('notes-sort-dropdown');
    const sortDirBtn = document.getElementById('notes-sort-direction-btn');
    const mobileSortBtn = document.getElementById('mobile-notes-sort-btn');

    // Initial Render
    renderContent();

    // Init Mobile Sort
    initMobileSort(mobileSortBtn);

    // 1. Search Listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.searchTerm = e.target.value.toLowerCase().trim();
            renderContent();
        });
    }

    // 2. Sidebar "All Notes" Listener
    if (allNotesBtn) {
        allNotesBtn.addEventListener('click', () => {
            state.selectedBooks.clear();
            renderContent();
        });
    }

    // 3. Sidebar Book Item Listener (Delegation)
    if (sidebarList) {
        sidebarList.addEventListener('click', (e) => {
            const item = e.target.closest('.book-index-item');
            if (item) {
                const bookId = item.dataset.bookId;
                if (bookId) toggleBookSelection(bookId);
            }
        });
    }

    // 4. Type Filter
    typeFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            if (state.selectedTypes.has(filter)) {
                state.selectedTypes.delete(filter);
                btn.classList.remove('bg-gray-800', 'text-white');
                btn.classList.add('bg-gray-100', 'text-text-primary'); // Reset style
            } else {
                state.selectedTypes.add(filter);
                btn.classList.add('bg-gray-800', 'text-white');
                btn.classList.remove('bg-gray-100', 'text-text-primary');
            }
            renderContent();
        });
    });

    // 5. Color Filter
    colorFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            if (state.selectedColors.has(color)) {
                state.selectedColors.delete(color);
                btn.classList.remove('ring-2', 'ring-offset-1', 'ring-gray-400');
            } else {
                state.selectedColors.add(color);
                btn.classList.add('ring-2', 'ring-offset-1', 'ring-gray-400');
            }
            renderContent();
        });
    });

    // 6. Sort Menu
    if (sortMenuBtn && sortDropdown) {

        const renderDropdown = () => {
            const options = [
                { id: 'date', label: '依新增時間', icon: 'clock' },
                { id: 'title', label: '依書名', icon: 'book' },
                { id: 'page', label: '依閱讀位置', icon: 'bookmark' } // or file-text
            ];

            const html = options.map(opt => {
                const isActive = state.sortType === opt.id;
                const activeClass = isActive
                    ? 'bg-accent/10 text-accent font-bold'
                    : 'text-text-primary hover:bg-gray-50';

                return `
                    <button class="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${activeClass} first:rounded-t-xl last:rounded-b-xl"
                        data-sort="${opt.id}">
                        <span class="flex-1">${opt.label}</span>
                    </button>
                `;
            }).join('');

            sortDropdown.innerHTML = `<div class="">${html}</div>`;
            // Removed lucide creation as no icons are used

            // Re-bind listeners
            const sortButtons = sortDropdown.querySelectorAll('[data-sort]');
            sortButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // prevent bubbling to window click
                    const sortId = btn.dataset.sort;
                    const sortLabel = options.find(o => o.id === sortId)?.label;

                    state.sortType = sortId;
                    if (sortLabel) {
                        const labelEl = document.getElementById('notes-sort-menu-label');
                        if (labelEl) labelEl.textContent = `排序: ${sortLabel}`;
                    }

                    sortDropdown.classList.add('hidden');
                    renderContent();
                });
            });
        };

        sortMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = sortDropdown.classList.contains('hidden');

            if (!isHidden) {
                sortDropdown.classList.add('hidden');
            } else {
                // Render content fresh every time to show correct active state
                renderDropdown();
                sortDropdown.classList.remove('hidden');

                // Fixed Positioning
                const rect = sortMenuBtn.getBoundingClientRect();
                sortDropdown.style.position = 'fixed';
                sortDropdown.style.top = `${rect.bottom + 4}px`; // tighter gap
                sortDropdown.style.right = `${window.innerWidth - rect.right}px`;
                sortDropdown.style.left = 'auto';
                sortDropdown.style.minWidth = `${rect.width}px`; // Match button width at minimum
                sortDropdown.style.width = 'auto'; // allow expansion if needed, but min matches button
                sortDropdown.style.height = 'auto';
                sortDropdown.style.maxHeight = 'none';
                sortDropdown.style.overflow = 'visible';
                sortDropdown.style.zIndex = '9999';
                // Add soft shadow/border for popover feel
                sortDropdown.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
                sortDropdown.style.border = '1px solid rgba(0,0,0,0.05)';
            }
        });

        window.addEventListener('click', () => {
            if (!sortDropdown.classList.contains('hidden')) {
                sortDropdown.classList.add('hidden');
            }
        });

        window.addEventListener('resize', () => {
            if (!sortDropdown.classList.contains('hidden')) {
                sortDropdown.classList.add('hidden');
            }
        });
    }

    // 7. Sort Direction
    if (sortDirBtn) {
        sortDirBtn.addEventListener('click', () => {
            state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
            sortDirBtn.innerHTML = state.sortDirection === 'asc'
                ? `<i data-lucide="arrow-up" class="w-4 h-4"></i>`
                : `<i data-lucide="arrow-down" class="w-4 h-4"></i>`;
            if (window.lucide) window.lucide.createIcons({ root: sortDirBtn });
            renderContent();
        });
    }

    // 8. Note Actions (Share / Delete) - Delegation on Container
    // State for actions
    let noteToDelete = null;
    let currentShareBook = null;
    let currentShareNote = null;

    const generateShareContent = (format, book, note) => {
        if (!book || !note) return '';
        const title = book.title;
        const author = book.author;
        const year = book.publishDate ? book.publishDate.split('/')[0] : 'Unknown';
        const quote = note.quote || '';
        const comment = note.comment || '';
        // If EPUB, do not show page info
        const page = book.format === 'EPUB' ? '' : `P.${note.page}`;

        let content = '';

        // 1. Citation Info (Book Info) - TOP
        let citation = '';
        if (format === 'apa7') {
            citation = `${author}. (${year}). *${title}*. ${book.publisher || 'Publisher'}.`;
        } else if (format === 'apa6') {
            citation = `${author}. (${year}). *${title}*. ${book.publisher || 'Publisher'}.`;
        } else if (format === 'mla') {
            citation = `${author}. *${title}*. ${book.publisher || 'Publisher'}, ${year}.`;
        } else if (format === 'chicago') {
            citation = `${author}. *${title}*. ${book.publisher || 'Publisher'}, ${year}.`;
        } else {
            // General
            citation = `— 《${title}》, ${author}`;
            if (page) citation += `, ${page}`;
        }
        content += `${citation}\n\n`;

        // 2. Highlight (Quote) - MIDDLE
        if (quote) content += `> ${quote}\n\n`;

        // 3. Note (Comment) - BOTTOM
        if (comment) {
            content += `📝 筆記：\n${comment}\n`;
        }

        return content;
    };

    const updateSharePreview = () => {
        const formatSelect = document.getElementById('share-format-select');
        const previewArea = document.getElementById('share-content-preview');
        if (formatSelect && previewArea && currentShareBook && currentShareNote) {
            const content = generateShareContent(formatSelect.value, currentShareBook, currentShareNote);
            previewArea.value = content;
        }
    };

    if (container) {
        container.addEventListener('click', (e) => {
            const shareBtn = e.target.closest('.btn-share-note');
            const deleteBtn = e.target.closest('.btn-delete-note');

            if (shareBtn) {
                const bookId = shareBtn.dataset.bookId;
                const noteId = parseInt(shareBtn.dataset.noteId);

                const book = BOOKS_DATA.find(b => b.id === bookId);
                const note = book?.notes.find(n => n.id === noteId);

                if (book && note) {
                    currentShareBook = book;
                    currentShareNote = note;

                    // Reset Select
                    const formatSelect = document.getElementById('share-format-select');
                    if (formatSelect) {
                        formatSelect.value = 'general';
                        formatSelect.onchange = updateSharePreview;
                    }

                    updateSharePreview();
                    openModal('share-note-modal');
                }
            }

            if (deleteBtn) {
                const bookId = deleteBtn.dataset.bookId;
                const noteId = parseInt(deleteBtn.dataset.noteId);
                noteToDelete = { bookId, noteId };
                openModal('delete-note-modal');
            }
        });
    }

    // 9. Modal Action Listeners
    const confirmDeleteBtn = document.getElementById('confirm-delete-note-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.onclick = () => {
            if (noteToDelete) {
                const { bookId, noteId } = noteToDelete;
                const book = BOOKS_DATA.find(b => b.id === bookId);
                if (book) {
                    book.notes = book.notes.filter(n => n.id !== noteId);
                    renderContent();
                    closeModal('delete-note-modal');
                    noteToDelete = null;
                }
            }
        };
    }

    const shareCopyBtn = document.getElementById('share-copy-btn');
    if (shareCopyBtn) {
        shareCopyBtn.onclick = () => {
            const previewArea = document.getElementById('share-content-preview');
            if (!previewArea) return;

            const textToCopy = previewArea.value;

            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = shareCopyBtn.innerHTML;
                const originalBg = shareCopyBtn.style.backgroundColor;

                shareCopyBtn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> 已複製`;
                shareCopyBtn.style.backgroundColor = '#10B981'; // Green

                setTimeout(() => {
                    shareCopyBtn.innerHTML = originalText;
                    shareCopyBtn.style.backgroundColor = originalBg;
                    if (window.lucide) window.lucide.createIcons({ root: shareCopyBtn });
                }, 2000);
            }).catch(err => {
                console.error('Copy failed', err);
                alert('複製失敗，請手動複製。');
            });
        };
    }

    const shareExportBtn = document.getElementById('share-export-btn');
    if (shareExportBtn) {
        shareExportBtn.onclick = () => {
            const previewArea = document.getElementById('share-content-preview');
            if (!previewArea) return;

            const content = previewArea.value;
            const title = currentShareBook ? currentShareBook.title : 'note';

            const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `Note_${title.replace(/\s+/g, '_')}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };
    }
}

function initMobileSort(btn) {
    if (!btn) return;

    btn.addEventListener('click', () => {
        const options = [
            { label: '依新增時間', value: 'date' },
            { label: '依書名', value: 'title' },
            { label: '依閱讀位置', value: 'page' }
        ];

        const handleMobileSortSelect = (val) => {
            if (val === state.sortType) {
                state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                state.sortType = val;
                // Default directions
                if (val === 'page') state.sortDirection = 'asc';
                else state.sortDirection = 'desc';
            }

            // Sync Desktop UI
            const sortLabel = document.getElementById('notes-sort-menu-label');
            const selectedOpt = options.find(o => o.value === state.sortType);
            if (sortLabel && selectedOpt) {
                sortLabel.textContent = `排序: ${selectedOpt.label}`;
            }

            // Sync Mobile Label
            const mobileLabel = document.getElementById('mobile-notes-sort-label');
            if (mobileLabel && selectedOpt) {
                mobileLabel.textContent = `排序: ${selectedOpt.label}`;
            }

            // Sync Direction Icon (Desktop)
            const sortDirBtn = document.getElementById('notes-sort-direction-btn');
            if (sortDirBtn) {
                sortDirBtn.innerHTML = state.sortDirection === 'asc'
                    ? `<i data-lucide="arrow-up" class="w-4 h-4"></i>`
                    : `<i data-lucide="arrow-down" class="w-4 h-4"></i>`;
                if (window.lucide) window.lucide.createIcons({ root: sortDirBtn });
            }

            renderContent();

            // Re-open/Update Sheet (to show updated direction/selection)
            openSheet('排序方式', options, handleMobileSortSelect, state.sortType, state.sortDirection);
        };

        openSheet('排序方式', options, handleMobileSortSelect, state.sortType, state.sortDirection);
    });
}

function openSheet(title, options, onSelect, currentValue, currentDirection = null) {
    const sheet = document.getElementById('mobile-filter-sheet');
    const sheetTitle = document.getElementById('mobile-sheet-title');
    const sheetOptions = document.getElementById('mobile-sheet-options');

    if (!sheet || !sheetTitle || !sheetOptions) return;

    sheetTitle.textContent = title;
    sheetOptions.innerHTML = '';

    options.forEach(opt => {
        const btn = document.createElement('button');
        const isSelected = opt.value === currentValue;

        let iconHtml = '';
        if (isSelected && currentDirection) {
            iconHtml = currentDirection === 'asc'
                ? '<i data-lucide="arrow-up" class="w-4 h-4"></i>'
                : '<i data-lucide="arrow-down" class="w-4 h-4"></i>';
        }

        btn.className = `w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${isSelected ? 'bg-accent/10 text-accent font-bold' : 'text-text-primary hover:bg-gray-50'}`;
        btn.innerHTML = `<span>${opt.label}</span>${iconHtml}`;

        btn.onclick = () => {
            onSelect(opt.value);
            // Don't close immediately if sorting logic handles re-open (toggle behavior)
        };
        sheetOptions.appendChild(btn);
    });

    if (window.lucide) window.lucide.createIcons();
    openModal('mobile-filter-sheet');
}

function toggleBookSelection(bookId) {
    // Multi-select logic: Toggle
    if (state.selectedBooks.has(bookId)) {
        state.selectedBooks.delete(bookId);
    } else {
        state.selectedBooks.add(bookId);
    }
    renderContent();
}

function updateSidebarActiveState() {
    const sidebarList = document.getElementById('book-notes-list');
    const allNotesBtn = document.getElementById('all-notes-btn');
    const allItems = document.querySelectorAll('.book-index-item');

    // Reset Logic
    allItems.forEach(item => {
        // Don't kill the base classes, just toggle active ones
        item.classList.remove('active', 'bg-white', 'shadow-sm', 'border-accent');
        item.classList.add('border-transparent');
    });

    // "All Notes" Active State
    if (state.selectedBooks.size === 0) {
        if (allNotesBtn) {
            allNotesBtn.classList.add('active', 'bg-white', 'shadow-sm', 'border-accent');
            allNotesBtn.classList.remove('border-transparent');
        }
    } else {
        // Individual Items Active State
        state.selectedBooks.forEach(id => {
            // Check if element exists (it might be filtered out visually in sidebar, but we still track selection)
            // But here we only update visible items in sidebar
            const el = sidebarList?.querySelector(`.book-index-item[data-book-id="${id}"]`);
            if (el) {
                el.classList.add('active', 'bg-white', 'shadow-sm', 'border-accent');
                el.classList.remove('border-transparent');
            }
        });
    }
}

// --- Core Logic ---

function renderSidebar(booksToRender) {
    const sidebarList = document.getElementById('book-notes-list'); // Assuming sidebarList is accessible or passed
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

function renderContent() {
    const container = document.getElementById('note-content-area');
    if (!container) return;
    container.innerHTML = '';

    const booksWithNotes = BOOKS_DATA.filter(book => book.notes && book.notes.length > 0);

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
        // All Books (filtered by search term at book level if needed? No, search term filters Notes directly below)
        // But if we have a search term, we should only show notes from the 'filteredBooks' that matched? 
        // Or show all notes that match search term across ALL books?
        // Usually: Show all matching notes.
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
        let diff = 0;
        if (state.sortType === 'page') {
            diff = a.page - b.page;
        } else if (state.sortType === 'title') {
            diff = a.bookTitle.localeCompare(b.bookTitle, 'zh-Hant');
        } else {
            // date
            diff = new Date(a.date) - new Date(b.date);
        }

        return state.sortDirection === 'asc' ? diff : -diff;
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
    // const badgeColor = isNote ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'; // Unused
    // const typeLabel = isNote ? '筆記' : '劃線'; // Unused

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
                        <button class="hover:text-accent p-1 btn-share-note" data-book-id="${note.bookId}" data-note-id="${note.id}" title="分享">
                            <i data-lucide="share-2" class="w-4 h-4 pointer-events-none"></i>
                        </button>
                        <button class="hover:text-red-500 p-1 btn-delete-note" data-book-id="${note.bookId}" data-note-id="${note.id}" title="刪除">
                            <i data-lucide="trash-2" class="w-4 h-4 pointer-events-none"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
}
