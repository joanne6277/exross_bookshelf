import { BOOKS_DATA } from '../data/books.js';
import { openModal, closeModal } from '../utils.js';
import { bookmarkFilterConfig } from '../views/Bookmark.js';
import { initFilterBarEvents } from '../components/FilterBar.js';

const state = {
    searchTerm: '',
    selectedBooks: new Set(),
    selectedType: 'all', // Changed from selectedTypes Set
    selectedColor: 'all',
    sortType: 'date',
    sortDirection: 'desc',
    isBatchMode: false,
    selectedNotes: new Set()
};

export function initBookmarkFeature() {
    const container = document.getElementById('note-content-area');
    const sidebarList = document.getElementById('book-notes-list');
    const allNotesBtn = document.getElementById('all-notes-btn');
    const searchInput = document.getElementById('bookmark-search-input-desktop');
    const typeFilterButtons = document.querySelectorAll('.note-filter-btn');
    const colorDropdownContainer = document.getElementById('color-filter-dropdown-container');
    const colorTrigger = document.getElementById('color-filter-trigger');
    const colorMenu = document.getElementById('color-filter-menu');
    const sortMenuBtn = document.getElementById('notes-sort-menu-btn');
    const sortDropdown = document.getElementById('notes-sort-dropdown');
    const sortDirBtn = document.getElementById('notes-sort-direction-btn');

    // Initial Render
    renderContent();

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

    const updateColorFilterState = () => {
        const isNoteOnly = state.selectedType === 'note';

        if (colorTrigger) {
            if (isNoteOnly) {
                colorTrigger.disabled = true;
                colorTrigger.classList.add('opacity-50', 'cursor-not-allowed');
                state.selectedColor = 'all';
                renderColorDropdownUI();
            } else {
                colorTrigger.disabled = false;
                colorTrigger.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    };

    // 初始化 FilterBar 泛用事件
    initFilterBarEvents(bookmarkFilterConfig, (action, data) => {
        if (action === 'filter') {
            if (data.id === 'type') {
                state.selectedType = data.value;
                updateColorFilterState();
                renderContent();
            }
        } else if (action === 'sort') {
            state.sortType = data.type;
            state.sortDirection = data.direction;
            renderContent();
        }
    });


    // 5. Custom Color Filter Dropdown Logic
    const colors = [
        { value: 'all', label: '全部顏色', hex: null },
        { value: 'pink', label: '粉色', hex: '#EA8192' },
        { value: 'blue', label: '藍色', hex: '#86E7D0' },
        { value: 'purple', label: '紫色', hex: '#B881E7' },
        { value: 'yellow', label: '黃色', hex: '#FFF500' }
    ];

    const colorSwatchStyle = (c) =>
        c.hex
            ? `background-color:${c.hex};opacity:0.5;`
            : `background:linear-gradient(135deg,#EA8192 0%,#86E7D0 40%,#B881E7 70%,#FFF500 100%);opacity:0.6;`;

    const renderColorDropdownUI = () => {
        // Update Trigger
        const selected = colors.find(c => c.value === state.selectedColor) || colors[0];
        const previewEl = document.getElementById('color-filter-preview');
        const labelEl = document.getElementById('color-filter-label');

        if (previewEl) {
            previewEl.innerHTML = `<div class="absolute inset-0 rounded-full" style="${colorSwatchStyle(selected)}"></div>`;
        }
        if (labelEl) {
            labelEl.textContent = selected.label;
        }

        // Render Menu Items
        if (colorMenu) {
            colorMenu.innerHTML = colors.map(c => {
                const isSelected = c.value === state.selectedColor;
                return `
                    <button class="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-primary hover:bg-gray-50 rounded-lg transition-colors ${isSelected ? 'bg-gray-50 font-medium' : ''}"
                        data-value="${c.value}">
                        <div class="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0" style="${colorSwatchStyle(c)}"></div>
                        <span>${c.label}</span>
                        ${isSelected ? '<i data-lucide="check" class="w-4 h-4 ml-auto text-accent"></i>' : ''}
                    </button>
                `;
            }).join('');

            if (window.lucide) window.lucide.createIcons({ root: colorMenu });

            // Add Click Listeners to Options
            colorMenu.querySelectorAll('button').forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    state.selectedColor = btn.dataset.value;
                    renderColorDropdownUI();
                    renderContent();
                    colorMenu.classList.add('hidden');
                };
            });
        }
    };

    if (colorTrigger && colorMenu) {
        // Init UI
        renderColorDropdownUI();

        // Toggle Menu
        colorTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (colorTrigger.disabled) return;

            // Mobile: Open Sheet
            if (window.innerWidth < 768) {
                const sheetOptions = colors.map(c => ({
                    value: c.value,
                    label: `<span class="inline-block w-4 h-4 rounded-full border border-gray-300 ${c.bg} align-middle mr-2 opacity-80"></span>${c.label}`
                }));

                const handleColorSelect = (val) => {
                    state.selectedColor = val;
                    renderColorDropdownUI();
                    renderContent();
                    // Sheet closes automatically via internal logic usually, but let's check openSheet 
                    // openSheet calls onSelect then doesn't auto-close? 
                    // looking at openSheet code: `btn.onclick = () => { onSelect(opt.value); ... }` 
                    // It doesn't seem to close explicitly in the provided snippet? 
                    // Wait, earlier snippet: 
                    // btn.onclick = () => { onSelect(opt.value); import('../utils.js').then(({ closeModal }) => { closeModal('mobile-filter-sheet'); }); };
                    // actually openSheet in bookmark.js (lines 599+) logic:
                    /* 
                    btn.onclick = () => {
                        onSelect(opt.value);
                        // Don't close immediately if sorting logic handles re-open (toggle behavior)
                    };
                    */
                    // The sort logic re-opens sheet. For color, we want to close.
                    // I should probably use a dedicated openColorSheet or ensure openSheet closes.
                    // Existing openSheet implementation (lines 599+) does NOT close modal.
                    // I will import closeModal and close it here.
                    import('../utils.js').then(({ closeModal }) => {
                        closeModal('mobile-filter-sheet');
                    });
                };

                // Reuse openSheet but we need to ensure it supports HTML in label (it does)
                openSheet('劃線顏色', sheetOptions, handleColorSelect, state.selectedColor);
                return;
            }

            // Desktop: Dropdown
            const isHidden = colorMenu.classList.contains('hidden');
            if (!isHidden) {
                colorMenu.classList.add('hidden');
            } else {
                colorMenu.classList.remove('hidden');

                // Fixed Positioning Logic
                const rect = colorTrigger.getBoundingClientRect();
                colorMenu.style.position = 'fixed';
                colorMenu.style.top = `${rect.bottom + 8}px`; // slightly more gap
                colorMenu.style.left = `${rect.left}px`;
                colorMenu.style.width = `${Math.max(rect.width, 150)}px`; // Min width 150px
                colorMenu.style.zIndex = '9999';

                // Ensure it doesn't go off-screen right
                if (rect.left + colorMenu.offsetWidth > window.innerWidth) {
                    colorMenu.style.left = 'auto';
                    colorMenu.style.right = '16px'; // 16px padding from right edge
                }
            }
        });

        // Close when clicking outside
        window.addEventListener('click', (e) => {
            if (!colorMenu.classList.contains('hidden') && !colorTrigger.contains(e.target) && !colorMenu.contains(e.target)) {
                colorMenu.classList.add('hidden');
            }
        });

        // Close on window resize
        window.addEventListener('resize', () => {
            if (!colorMenu.classList.contains('hidden')) {
                colorMenu.classList.add('hidden');
            }
        });
    }

    // 5.1 Mobile Color Sheet Binding
    const mobileColorBtn = document.getElementById('mobile-color-btn');
    if (mobileColorBtn) {
        mobileColorBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (colorTrigger && colorTrigger.disabled) return;

            const sheetOptions = colors.map(c => ({
                value: c.value,
                label: `<span class="inline-block w-4 h-4 rounded-full border border-gray-300 align-middle mr-2 opacity-80" style="${colorSwatchStyle(c)}"></span>${c.label}`
            }));

            const handleColorSelect = (val) => {
                state.selectedColor = val;
                renderColorDropdownUI();
                renderContent();
                // Close modal
                import('../utils.js').then(({ closeModal }) => {
                    closeModal('mobile-filter-sheet');
                });
            };

            openSheet('劃線顏色', sheetOptions, handleColorSelect, state.selectedColor);
        });
    }

    // (保留供其它擴充用)
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
        // Helper: Collapse all expanded cards
        const collapseAllCards = () => {
            container.querySelectorAll('.note-card[data-expanded="true"]').forEach(card => {
                collapseCard(card);
            });
        };

        // Helper: Expand a card
        const expandCard = (card) => {
            card.dataset.expanded = 'true';
            card.classList.add('ring-2', 'ring-accent/30');

            const expandBtn = card.querySelector('.btn-toggle-expand');
            const noteDisplayReadonly = card.querySelector('.note-display-readonly');
            const noteEditArea = card.querySelector('.note-edit-area');
            const actionBar = card.querySelector('.note-action-bar');

            if (expandBtn) expandBtn.classList.add('hidden');
            if (noteDisplayReadonly) noteDisplayReadonly.classList.add('hidden');
            if (noteEditArea) noteEditArea.classList.remove('hidden');
            if (actionBar) actionBar.classList.remove('hidden');
            if (actionBar) actionBar.classList.add('flex');
        };

        // Helper: Collapse a card
        const collapseCard = (card) => {
            card.dataset.expanded = 'false';
            card.classList.remove('ring-2', 'ring-accent/30');

            const expandBtn = card.querySelector('.btn-toggle-expand');
            const noteDisplayReadonly = card.querySelector('.note-display-readonly');
            const noteEditArea = card.querySelector('.note-edit-area');
            const actionBar = card.querySelector('.note-action-bar');
            const textarea = card.querySelector('.note-edit-textarea');

            if (expandBtn) expandBtn.classList.remove('hidden');
            if (noteDisplayReadonly) noteDisplayReadonly.classList.remove('hidden');
            if (noteEditArea) noteEditArea.classList.add('hidden');
            if (actionBar) actionBar.classList.add('hidden');
            if (actionBar) actionBar.classList.remove('flex');

            // Restore original value on collapse (cancel behavior)
            if (textarea) {
                const bookId = card.dataset.bookId;
                const noteId = parseInt(card.dataset.noteId);
                const book = BOOKS_DATA.find(b => b.id === bookId);
                const note = book?.notes.find(n => n.id === noteId);
                if (note) {
                    textarea.value = note.comment || '';
                }
            }
        };

        container.addEventListener('click', (e) => {
            const toggleBtn = e.target.closest('.btn-toggle-expand');
            const cancelBtn = e.target.closest('.btn-cancel-edit');
            const saveBtn = e.target.closest('.btn-save-edit');
            const shareBtn = e.target.closest('.btn-share-note');
            const deleteBtn = e.target.closest('.btn-delete-note');

            // Toggle Expand/Collapse
            if (toggleBtn) {
                e.stopPropagation();
                const card = toggleBtn.closest('.note-card');
                if (!card) return;

                const isExpanded = card.dataset.expanded === 'true';

                if (isExpanded) {
                    collapseCard(card);
                } else {
                    // Collapse any other expanded card first
                    collapseAllCards();
                    expandCard(card);
                }
                return;
            }

            // Cancel Edit
            if (cancelBtn) {
                e.stopPropagation();
                const card = cancelBtn.closest('.note-card');
                if (card) collapseCard(card);
                return;
            }

            // Save Edit
            if (saveBtn) {
                e.stopPropagation();
                const card = saveBtn.closest('.note-card');
                if (!card) return;

                const bookId = card.dataset.bookId;
                const noteId = parseInt(card.dataset.noteId);
                const textarea = card.querySelector('.note-edit-textarea');
                const newComment = textarea?.value?.trim() || '';

                // Update data
                const book = BOOKS_DATA.find(b => b.id === bookId);
                const note = book?.notes.find(n => n.id === noteId);
                if (note) {
                    note.comment = newComment;
                    // Re-render to show updated content
                    renderContent();
                }
                return;
            }

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
        shareExportBtn.onclick = async () => {
            const previewArea = document.getElementById('share-content-preview');
            if (!previewArea) return;

            const content = previewArea.value;
            const title = currentShareBook ? currentShareBook.title : 'note';

            // Check for Mobile (width < 768px) and Native Share Support
            const isMobile = window.innerWidth < 768;

            if (isMobile && navigator.share) {
                try {
                    await navigator.share({
                        title: `筆記分享: ${title}`,
                        text: content
                    });
                } catch (err) {
                    console.log('Share canceled or failed', err);
                }
            } else {
                // Desktop: Download as .md
                const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `Note_${title.replace(/\s+/g, '_')}.md`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        };
    }

    // 10. Batch Mode Logic
    const batchBtn = document.getElementById('notes-batch-select-btn');           // Desktop
    const batchBtnMobile = document.getElementById('notes-batch-select-btn-mobile'); // Mobile
    const batchBar = document.getElementById('notes-batch-action-bar');
    const batchSelectAllBtn = document.getElementById('notes-batch-select-all-btn');
    const batchShareBtn = document.getElementById('notes-batch-share-btn');
    const batchDeleteBtn = document.getElementById('notes-batch-delete-btn');
    const selectedCountEl = document.getElementById('notes-selected-count');

    const updateBatchUI = () => {
        if (selectedCountEl) {
            selectedCountEl.textContent = `已選取 ${state.selectedNotes.size} 則`;
        }
        if (batchBar) {
            batchBar.classList.toggle('hidden', !state.isBatchMode);
        }
    };

    const toggleBatchMode = (btn) => {
        state.isBatchMode = !state.isBatchMode;
        state.selectedNotes.clear();
        if (btn) {
            btn.classList.toggle('ring-2', state.isBatchMode);
            btn.classList.toggle('ring-offset-2', state.isBatchMode);
        }
        updateBatchUI();
        renderContent();
    };

    if (batchBtn) {
        batchBtn.addEventListener('click', () => toggleBatchMode(batchBtn));
    }
    if (batchBtnMobile) {
        batchBtnMobile.addEventListener('click', () => toggleBatchMode(batchBtnMobile));
    }

    // Select All Logic
    if (batchSelectAllBtn) {
        batchSelectAllBtn.addEventListener('click', () => {
            const allCheckboxes = container.querySelectorAll('.note-batch-checkbox');
            const allNoteIds = Array.from(allCheckboxes).map(cb => cb.dataset.noteKey);

            if (state.selectedNotes.size === allNoteIds.length) {
                // Deselect All
                state.selectedNotes.clear();
                allCheckboxes.forEach(cb => {
                    cb.checked = false;
                    cb.closest('.note-card')?.classList.remove('ring-2', 'ring-accent');
                });
            } else {
                // Select All
                allNoteIds.forEach(key => state.selectedNotes.add(key));
                allCheckboxes.forEach(cb => {
                    cb.checked = true;
                    cb.closest('.note-card')?.classList.add('ring-2', 'ring-accent');
                });
            }
            updateBatchUI();
        });
    }

    // Checkbox Click Delegation
    if (container) {
        container.addEventListener('change', (e) => {
            if (e.target.classList.contains('note-batch-checkbox')) {
                const noteKey = e.target.dataset.noteKey;
                const card = e.target.closest('.note-card');

                if (e.target.checked) {
                    state.selectedNotes.add(noteKey);
                    card?.classList.add('ring-2', 'ring-accent');
                } else {
                    state.selectedNotes.delete(noteKey);
                    card?.classList.remove('ring-2', 'ring-accent');
                }
                updateBatchUI();
            }
        });
    }

    // Batch Share Logic
    if (batchShareBtn) {
        batchShareBtn.addEventListener('click', () => {
            if (state.selectedNotes.size === 0) {
                alert('請先選取筆記！');
                return;
            }

            // Collect all selected notes
            let combinedContent = '';
            state.selectedNotes.forEach(key => {
                const [bookId, noteId] = key.split(':');
                const book = BOOKS_DATA.find(b => b.id === bookId);
                const note = book?.notes.find(n => n.id === parseInt(noteId));

                if (book && note) {
                    const page = book.format === 'EPUB' ? '' : `P.${note.page}`;
                    let citation = `— 《${book.title}》, ${book.author}`;
                    if (page) citation += `, ${page}`;

                    if (note.quote) combinedContent += `> ${note.quote}\n`;
                    combinedContent += `${citation}\n`;
                    if (note.comment) combinedContent += `📝 筆記：${note.comment}\n`;
                    combinedContent += '\n---\n\n';
                }
            });

            // Update share modal
            const previewArea = document.getElementById('share-content-preview');
            if (previewArea) {
                previewArea.value = combinedContent;
            }
            openModal('share-note-modal');
        });
    }

    // Batch Delete Logic
    if (batchDeleteBtn) {
        batchDeleteBtn.addEventListener('click', () => {
            if (state.selectedNotes.size === 0) {
                alert('請先選取筆記！');
                return;
            }

            if (confirm(`確定要刪除這 ${state.selectedNotes.size} 則筆記嗎？`)) {
                state.selectedNotes.forEach(key => {
                    const [bookId, noteId] = key.split(':');
                    const book = BOOKS_DATA.find(b => b.id === bookId);
                    if (book) {
                        book.notes = book.notes.filter(n => n.id !== parseInt(noteId));
                    }
                });

                state.selectedNotes.clear();
                updateBatchUI();
                renderContent();
            }
        });
    }
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

function renderMobileBookCapsules(booksWithNotes) {
    const container = document.getElementById('mobile-book-capsules-container');
    if (!container) return;

    // Hide if searching (capsule container is already inside mobile-only toolbar)
    if (state.searchTerm) {
        container.innerHTML = '';
        return;
    }

    if (booksWithNotes.length === 0) {
        container.innerHTML = '<span class="text-xs text-text-secondary">尚無書籍筆記</span>';
        return;
    }

    const maxVisible = 5;
    const visibleBooks = booksWithNotes.slice(0, maxVisible);
    const hasMore = booksWithNotes.length > maxVisible;

    // Capsule style matching search result capsules (with book cover)
    let html = visibleBooks.map(book => {
        const isActive = state.selectedBooks.has(book.id);
        const bgClass = isActive
            ? 'bg-accent/10 shadow-md ring-2 ring-accent ring-offset-1'
            : 'bg-white border border-border-color';

        return `
            <div class="flex-shrink-0 py-1 px-0.5">
                <button class="mobile-book-capsule flex items-center gap-2 pl-1 pr-3 py-1 ${bgClass} rounded-full shadow-sm transition-all group" data-book-id="${book.id}">
                    <div class="w-6 h-8 bg-gray-200 rounded overflow-hidden relative border border-white/20">
                        <img src="${book.cover}" class="w-full h-full object-cover">
                        ${!isActive ? '<div class="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>' : ''}
                    </div>
                    <span class="text-sm font-bold text-text-primary">${book.title.length > 6 ? book.title.substring(0, 6) + '...' : book.title}</span>
                </button>
            </div>
        `;
    }).join('');

    if (hasMore) {
        html += `
            <div class="flex-shrink-0 py-1 px-0.5">
                <button id="mobile-book-capsule-more" class="flex items-center justify-center px-4 py-3 bg-gray-100 border border-gray-200 rounded-full text-sm font-bold text-text-secondary hover:bg-gray-200 transition-colors">
                    ...
                </button>
            </div>
        `;
    }

    container.innerHTML = html;

    // Bind Click Events
    container.querySelectorAll('.mobile-book-capsule').forEach(btn => {
        btn.onclick = () => {
            const bookId = btn.dataset.bookId;
            toggleBookSelection(bookId);
        };
    });

    // "..." Button: Open Drawer with all books as capsules (multi-select)
    const moreBtn = document.getElementById('mobile-book-capsule-more');
    if (moreBtn) {
        moreBtn.onclick = () => {
            openBookCapsuleSheet(booksWithNotes);
        };
    }
}

function openBookCapsuleSheet(booksWithNotes) {
    const sheet = document.getElementById('mobile-filter-sheet');
    const sheetTitle = document.getElementById('mobile-sheet-title');
    const sheetOptions = document.getElementById('mobile-sheet-options');

    if (!sheet || !sheetTitle || !sheetOptions) return;

    sheetTitle.textContent = '選擇書籍';

    const renderSheetCapsules = () => {
        sheetOptions.innerHTML = `
            <div class="flex flex-wrap gap-2 p-2">
                ${booksWithNotes.map(book => {
            const isActive = state.selectedBooks.has(book.id);
            const bgClass = isActive
                ? 'bg-accent/10 shadow-md ring-2 ring-accent ring-offset-1'
                : 'bg-white border border-border-color';

            return `
                        <button class="sheet-book-capsule flex items-center gap-2 pl-1 pr-3 py-1 ${bgClass} rounded-full shadow-sm transition-all group" data-book-id="${book.id}">
                            <div class="w-6 h-8 bg-gray-200 rounded overflow-hidden relative border border-white/20">
                                <img src="${book.cover}" class="w-full h-full object-cover">
                                ${!isActive ? '<div class="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>' : ''}
                            </div>
                            <span class="text-sm font-bold text-text-primary">${book.title}</span>
                        </button>
                    `;
        }).join('')}
            </div>
            <div class="mt-4 pt-3 border-t border-gray-100 flex gap-2 px-2">
                <button id="sheet-clear-selection" class="flex-1 py-2.5 px-4 rounded-lg border border-gray-200 bg-gray-50 text-text-primary text-sm font-bold hover:bg-gray-100 transition-colors">
                    清除選擇
                </button>
                <button id="sheet-confirm-selection" class="flex-1 py-2.5 px-4 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors">
                    確認
                </button>
            </div>
        `;

        // Bind capsule clicks (toggle selection, re-render)
        sheetOptions.querySelectorAll('.sheet-book-capsule').forEach(btn => {
            btn.onclick = () => {
                const bookId = btn.dataset.bookId;
                if (state.selectedBooks.has(bookId)) {
                    state.selectedBooks.delete(bookId);
                } else {
                    state.selectedBooks.add(bookId);
                }
                renderSheetCapsules(); // Re-render to update selection state
            };
        });

        // Clear Selection
        const clearBtn = document.getElementById('sheet-clear-selection');
        if (clearBtn) {
            clearBtn.onclick = () => {
                state.selectedBooks.clear();
                renderSheetCapsules();
            };
        }

        // Confirm and Close
        const confirmBtn = document.getElementById('sheet-confirm-selection');
        if (confirmBtn) {
            confirmBtn.onclick = () => {
                renderContent();
                closeModal('mobile-filter-sheet');
            };
        }
    };

    renderSheetCapsules();
    openModal('mobile-filter-sheet');
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

    // UPDATE MOBILE BOOK CAPSULES
    renderMobileBookCapsules(booksWithNotes);

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

        // Color Filter (Single-select)
        if (state.selectedColor !== 'all') {
            const noteColor = note.color || 'yellow';
            if (state.selectedColor !== noteColor) return false;
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
    const rawComment = note.comment || '';

    return `
        <div class="note-card bg-white p-5 rounded-xl shadow-sm border border-border-color relative group hover:shadow-md transition-all"
            data-book-id="${note.bookId}" data-note-id="${note.id}" data-expanded="false">
            
            <!-- Top Row: Batch Checkbox + Book Title + Expand Toggle -->
            <div class="flex items-start gap-3">
                <!-- Batch Checkbox -->
                <div class="note-batch-checkbox-wrapper flex-shrink-0 self-center ${state.isBatchMode ? '' : 'hidden'}">
                    <input type="checkbox" 
                        class="note-batch-checkbox w-5 h-5 rounded text-accent focus:ring-accent cursor-pointer"
                        data-note-key="${note.bookId}:${note.id}"
                        ${state.selectedNotes.has(`${note.bookId}:${note.id}`) ? 'checked' : ''}>
                </div>
                
                <!-- Color indicator bar -->
                <div class="absolute left-0 top-6 bottom-6 w-1.5 ${styles.border} rounded-r-full"></div>
                
                <div class="flex-1 pl-2">
                    <!-- Header -->
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex flex-col flex-1">
                            <span class="text-xs text-text-secondary font-medium mb-0.5 block md:hidden">${note.bookTitle}</span>
                            <a href="#" class="text-xs font-bold text-text-secondary hover:text-accent hover:underline mb-0.5 hidden md:block" data-book-link="${note.bookId}">${note.bookTitle}</a>
                        </div>
                    </div>

                    <!-- Quote -->
                    ${note.quote ? `
                    <blockquote class="text-base text-text-primary leading-relaxed mb-3 font-medium relative">
                        <span class="absolute -left-3 -top-1 text-2xl text-gray-300 font-serif">"</span>
                        <span class="${styles.highlight} px-1 rounded box-decoration-clone leading-loose py-0.5">${checkQuote}</span>
                    </blockquote>` : ''}

                    <!-- Note Display (Collapsed State) -->
                    ${isNote && note.comment ? `
                    <div class="note-display-readonly mt-3 p-3 bg-gray-50 rounded-lg border border-transparent">
                        <span class="block text-xs font-bold text-gray-500 mb-1">筆記</span>
                        <p class="text-sm text-gray-800">${checkComment}</p>
                    </div>` : ''}

                    <!-- Note Edit Area (Expanded State - Hidden by default) -->
                    <div class="note-edit-area hidden mt-3">
                        <label class="block text-xs font-bold text-gray-500 mb-2">編輯筆記</label>
                        <textarea class="note-edit-textarea w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none transition-all"
                            rows="3" placeholder="輸入筆記...">${rawComment}</textarea>
                    </div>

                    <!-- Footer -->
                    <div class="flex items-center justify-between text-xs text-text-secondary mt-3 pt-3 border-t border-gray-100">
                        <div class="flex items-center gap-3">
                            <span class="flex items-center gap-1"><i data-lucide="file-text" class="w-3 h-3"></i> ${note.bookFormat === 'EPUB' ? note.page + '%' : 'P.' + note.page}</span>
                            <span>${note.date.split(' ')[0]}</span>
                        </div>
                        
                        <!-- Actions Container -->
                        <div class="flex items-center">
                             <!-- Expand Toggle (Visible when collapsed) -->
                            <button class="btn-toggle-expand p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-text-secondary hover:text-accent" title="編輯筆記">
                                <i data-lucide="square-pen" class="w-4 h-4 pointer-events-none"></i>
                            </button>

                            <!-- Expanded Action Bar (Hidden by default) -->
                            <div class="note-action-bar hidden items-center gap-2">
                                <button class="btn-cancel-edit px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                    取消
                                </button>
                                <button class="btn-save-edit px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                                    儲存
                                </button>
                                <div class="w-px h-5 bg-gray-200 mx-1"></div>
                                <button class="btn-share-note p-1.5 rounded-lg hover:bg-gray-100 text-text-secondary hover:text-accent transition-colors" data-book-id="${note.bookId}" data-note-id="${note.id}" title="分享">
                                    <i data-lucide="share-2" class="w-4 h-4 pointer-events-none"></i>
                                </button>
                                <button class="btn-delete-note p-1.5 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-500 transition-colors" data-book-id="${note.bookId}" data-note-id="${note.id}" title="刪除">
                                    <i data-lucide="trash-2" class="w-4 h-4 pointer-events-none"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}
