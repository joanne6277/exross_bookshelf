import { openModal, closeModal } from '../utils.js';
import { BOOKS_DATA } from '../data/books.js';

import { getCollections, toggleBookInCollection, addCollection } from './collections.js';

let currentEditingBookIds = []; // Changed to array

// Helper: Check if all books in array are in the collection
function areAllBooksInCollection(collectionTitle, bookIds) {
    const collection = getCollections()[collectionTitle];
    if (!collection) return false;
    return bookIds.every(id => collection.books.includes(id));
}

function renderShelfModal(bookIdOrArray) {
    // Normalize to array
    if (Array.isArray(bookIdOrArray)) {
        currentEditingBookIds = bookIdOrArray;
    } else {
        currentEditingBookIds = [bookIdOrArray];
    }

    const container = document.getElementById('shelf-tags-container');
    if (!container) return;

    container.innerHTML = '';
    const collections = getCollections();

    // Render existing collections
    for (const title in collections) {
        // State: Check if ALL selected books are in this collection
        const isAllIn = areAllBooksInCollection(title, currentEditingBookIds);

        const btn = document.createElement('button');
        btn.className = `shelf-tag px-3 py-1.5 rounded-full border text-sm font-medium shadow-sm transition-all ${isAllIn ? 'selected bg-accent text-white border-accent' : 'bg-white text-text-secondary border-gray-300'}`;
        btn.dataset.selected = isAllIn;
        btn.dataset.collectionTitle = title;
        btn.innerHTML = isAllIn ? `<i data-lucide="check" class="w-3 h-3 mr-1 inline"></i>${title}` : title;

        btn.addEventListener('click', () => {
            const selected = btn.dataset.selected === 'true';
            btn.dataset.selected = !selected;

            // Visual toggle
            if (!selected) {
                btn.className = 'shelf-tag px-3 py-1.5 rounded-full border text-sm font-medium shadow-sm transition-all selected bg-accent text-white border-accent';
                btn.innerHTML = `<i data-lucide="check" class="w-3 h-3 mr-1 inline"></i>${title}`;
            } else {
                btn.className = 'shelf-tag px-3 py-1.5 rounded-full border text-sm font-medium shadow-sm transition-all bg-white text-text-secondary border-gray-300';
                btn.innerHTML = title;
            }
            if (window.lucide) window.lucide.createIcons();
        });

        container.appendChild(btn);
    }

    // Add "New Collection" button
    const addBtn = document.createElement('button');
    addBtn.className = "px-3 py-1.5 rounded-full border border-dashed border-gray-300 text-text-secondary text-sm hover:border-accent hover:text-accent transition-colors flex items-center gap-1";
    addBtn.innerHTML = `<i data-lucide="plus" class="w-3 h-3"></i> 新增`;
    addBtn.addEventListener('click', () => {
        const newTitle = prompt("請輸入新書單名稱：");
        if (newTitle && newTitle.trim()) {
            if (addCollection(newTitle.trim())) {
                renderShelfModal(currentEditingBookIds); // Re-render logic with same selection
            }
        }
    });
    container.appendChild(addBtn);

    if (window.lucide) window.lucide.createIcons();

    // Bind "Done" button
    const completeBtns = document.querySelectorAll('#add-shelf-modal button');
    completeBtns.forEach(btn => {
        if (btn.textContent.includes('完成')) {
            // Remove old handler via cloneNode is safer to prevent multiple saves if called repeatedly? 
            // For now, simple onclick replacement is OK as we re-render the modal content but the modal wrapper is static.
            // Wait, the "Done" button is in the modal wrapper (Modals.js), not rendered here.
            // So we MUST be careful not to stack listeners.
            btn.onclick = () => {
                saveShelfChanges();
                closeModal('add-shelf-modal');
            };
        }
    });
}

export function openShelfModalForBook(bookId) {
    renderShelfModal(bookId);
    openModal('add-shelf-modal');
}

function saveShelfChanges() {
    if (!currentEditingBookIds || currentEditingBookIds.length === 0) return;
    const container = document.getElementById('shelf-tags-container');
    const buttons = container.querySelectorAll('button[data-collection-title]');

    let changed = false;
    buttons.forEach(btn => {
        const title = btn.dataset.collectionTitle;
        const shouldBeIn = btn.dataset.selected === 'true';

        // Apply to ALL selected books
        currentEditingBookIds.forEach(bookId => {
            if (toggleBookInCollection(title, bookId, shouldBeIn)) {
                changed = true;
            }
        });
    });

    if (changed) {
        document.dispatchEvent(new CustomEvent('collection-updated'));
    }
}


// 2. 生成 HTML 模板
// 2. 生成 HTML 模板
export function createBookCardHTML(book, options = {}) {
    const isTextbook = book.type === '教科書';
    const remainingTag = isTextbook && book.remainingTime
        ? `<div class="absolute top-2 right-2 z-10"><span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border border-white/50 shadow-md">剩餘 ${book.remainingTime}</span></div>`
        : '';

    return `
    <div class="book-item bg-secondary rounded-xl shadow-sm overflow-hidden flex flex-col border border-border-color md:hover:shadow-lg transition-all group relative cursor-pointer" data-book-id="${book.id}">
        <div class="absolute top-2 left-2 z-30 batch-checkbox hidden">
            <input type="checkbox" class="w-5 h-5 rounded text-accent focus:ring-accent cursor-pointer">
        </div>
        ${remainingTag}
        <div class="relative overflow-hidden aspect-[2/3] viewer-trigger">
            <img src="${book.cover}" alt="${book.title}" class="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-110">
            <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                <div class="h-full" style="width: ${book.progress}%; background-color: var(--bg-accent);"></div>
            </div>
            <div class="absolute inset-0 bg-black/70 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hidden md:flex flex-col items-center justify-center gap-3 p-6 z-20 backdrop-blur-[2px] pointer-events-none md:group-hover:pointer-events-auto">
                <button class="mask-btn w-full py-2.5 rounded-lg shadow-md read-btn pointer-events-auto">立即閱讀</button>
                <button class="mask-btn w-full py-2.5 rounded-lg shadow-md shelf-btn pointer-events-auto">加入/移出書單</button>
            </div>
        </div>
        <div class="p-4 flex-1 flex flex-col relative">
            <div class="flex justify-between items-start mb-1">
                 <h3 class="font-bold text-text-primary truncate md:group-hover:text-accent flex-1 viewer-trigger">${book.title}</h3>
                 <button class="p-1 rounded-full hover:bg-gray-200 text-text-secondary transition-colors z-20 info-btn -mt-1 -mr-2">
                    <i data-lucide="more-vertical" class="w-5 h-5"></i>
                 </button>
            </div>
            <p class="text-sm text-text-secondary truncate mb-2 viewer-trigger">${book.author}</p>
            <div class="mt-auto flex justify-between text-[10px] text-text-secondary font-medium viewer-trigger"><span>${book.progress}%</span></div>
        </div>
    </div>`;
}

export function createBookListItemHTML(book) {
    const isTextbook = book.type === '教科書';
    const remainingText = isTextbook && book.remainingTime
        ? `<div class="text-xs text-red-500 font-medium">剩餘 ${book.remainingTime}</div>`
        : '';

    return `
    <div class="book-list-item bg-secondary rounded-xl shadow-sm border border-border-color p-3 gap-3 md:p-4 md:gap-6 flex items-center gap-6 hover:shadow-md transition-all group relative cursor-pointer" data-book-id="${book.id}">
        <div class="batch-checkbox hidden flex-shrink-0">
            <input type="checkbox" class="w-5 h-5 rounded text-accent focus:ring-accent cursor-pointer">
        </div>
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
export function showBookDetails(bookId) {
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

    // Format badge
    const formatEl = document.getElementById('modal-book-format');
    const formatElMobile = document.getElementById('modal-book-format-mobile');
    if (book.format) {
        if (formatEl) {
            formatEl.textContent = book.format;
            formatEl.classList.remove('hidden');
        }
        if (formatElMobile) {
            formatElMobile.textContent = book.format;
            formatElMobile.classList.remove('hidden');
        }
    } else {
        if (formatEl) formatEl.classList.add('hidden');
        if (formatElMobile) formatElMobile.classList.add('hidden');
    }

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

    if (window.lucide) window.lucide.createIcons();
    openModal('book-info-modal');

    // Bind "Add to Shelf" buttons in the detail modal
    const addShelfBtn = document.getElementById('modal-btn-add-shelf');
    const addShelfBtnMobile = document.getElementById('modal-btn-add-shelf-mobile');

    const handleAddShelf = () => {
        renderShelfModal(bookId);
        openModal('add-shelf-modal');
    };

    if (addShelfBtn) {
        addShelfBtn.onclick = handleAddShelf;
    }
    if (addShelfBtnMobile) {
        addShelfBtnMobile.onclick = handleAddShelf;
    }
}

export function initFilterBar(prefix, gridViewId, listViewId, onSort) {
    console.log(`[FilterBar] Initializing for prefix: "${prefix}"`);

    let localSortType = 'recently-read';
    let localSortDirection = 'desc';

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

    // --- Mobile Filter Logic ---
    const mobileStatusBtn = document.getElementById(`${prefix}mobile-status-btn`);
    const mobileSourceBtn = document.getElementById(`${prefix}mobile-source-btn`);
    const mobileCategoryBtn = document.getElementById(`${prefix}mobile-category-btn`);
    const mobileSortBtn = document.getElementById(`${prefix}mobile-sort-btn`);

    // Enhanced openSheet to support direction
    const openSheet = (title, options, onSelect, currentValue, currentDirection = null) => {
        const sheet = document.getElementById('mobile-filter-sheet');
        const sheetTitle = document.getElementById('mobile-sheet-title');
        const sheetOptions = document.getElementById('mobile-sheet-options');

        if (!sheet || !sheetTitle || !sheetOptions) return;

        sheetTitle.textContent = title;
        sheetOptions.innerHTML = '';

        options.forEach(opt => {
            const btn = document.createElement('button');
            const isSelected = opt.value === currentValue || opt.label === currentValue;

            let iconHtml = '';
            if (isSelected) {
                if (currentDirection) {
                    // Sort Mode: Show Arrow
                    iconHtml = currentDirection === 'asc'
                        ? '<i data-lucide="arrow-up" class="w-4 h-4"></i>'
                        : '<i data-lucide="arrow-down" class="w-4 h-4"></i>';
                } else {
                    // Normal Mode: Show Check
                    iconHtml = '<i data-lucide="check" class="w-4 h-4"></i>';
                }
            }

            btn.className = `w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${isSelected ? 'bg-accent/10 text-accent font-bold' : 'text-text-primary hover:bg-gray-50'}`;
            btn.innerHTML = `<span>${opt.label}</span>${iconHtml}`;

            btn.onclick = () => {
                onSelect(opt.value);
                // Only close if NOT in sort toggling mode
                if (currentDirection) {
                    // Sort Mode: Do not close. 
                    // The handler (onSelect) is responsible for refreshing the UI (re-calling openSheet).
                } else {
                    closeModal('mobile-filter-sheet');
                }
            };
            sheetOptions.appendChild(btn);
        });

        if (window.lucide) window.lucide.createIcons();
        openModal('mobile-filter-sheet');
    };

    // 1. Status
    if (mobileStatusBtn) {
        mobileStatusBtn.addEventListener('click', () => {
            const select = document.getElementById(`${prefix}status-filter`);
            const currentVal = select ? select.value : '全部';
            const options = Array.from(select ? select.options : []).map(o => ({ label: o.text, value: o.value }));

            openSheet('篩選狀態', options, (val) => {
                if (select) {
                    select.value = val;
                    select.dispatchEvent(new Event('change'));
                    const label = document.getElementById(`${prefix}mobile-status-label`);
                    if (label) label.textContent = val;
                }
            }, currentVal);
        });
    }

    // 2. Source
    if (mobileSourceBtn) {
        mobileSourceBtn.addEventListener('click', () => {
            const select = document.getElementById(`${prefix}source-filter`);
            const currentVal = select ? select.value : '全部來源';
            const options = Array.from(select ? select.options : []).map(o => ({ label: o.text, value: o.value }));

            openSheet('篩選來源', options, (val) => {
                if (select) {
                    select.value = val;
                    select.dispatchEvent(new Event('change'));
                    const label = document.getElementById(`${prefix}mobile-source-label`);
                    if (label) label.textContent = val;
                }
            }, currentVal);
        });
    }

    // 3. Category
    if (mobileCategoryBtn) {
        mobileCategoryBtn.addEventListener('click', () => {
            const select = document.getElementById(`${prefix}category-filter`);
            const currentVal = select ? select.value : 'all';
            // Need check map because value vs label can differ
            const options = Array.from(select ? select.options : []).map(o => ({ label: o.text, value: o.value }));

            openSheet('篩選類別', options, (val) => {
                if (select) {
                    select.value = val;
                    select.dispatchEvent(new Event('change'));
                    // Find selected option label
                    const selectedOpt = Array.from(select.options).find(o => o.value === val);
                    const label = document.getElementById(`${prefix}mobile-category-label`);
                    if (label && selectedOpt) label.textContent = selectedOpt.text;
                }
            }, currentVal);
        });
    }

    // 4. Sort (Updated)
    if (mobileSortBtn) {
        mobileSortBtn.addEventListener('click', () => {
            const options = [
                { label: '最近閱讀', value: 'recently-read' },
                { label: '最近取得', value: 'purchase-date' },
                { label: '書名', value: 'title' },
                { label: '出版日期', value: 'publish-date' }
            ];

            const handleMobileSortSelect = (val) => {
                if (val === localSortType) {
                    // Toggle direction
                    localSortDirection = localSortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    // New type, default desc
                    localSortType = val;
                    localSortDirection = 'desc';
                }

                // Update Desktop UI (Sort Button Text)
                const sortLabel = document.getElementById(`${prefix}sort-menu-label`);
                const selectedOpt = options.find(o => o.value === localSortType);
                if (sortLabel && selectedOpt) {
                    sortLabel.textContent = `排序: ${selectedOpt.label}`;
                }

                // Update Desktop Direction Button
                const dirBtn = document.getElementById(`${prefix}sort-direction-btn`);
                if (dirBtn) {
                    const icon = dirBtn.querySelector('i');
                    if (icon) {
                        // Lucide icons are replaced, so we toggle innerHTML or class?
                        // Re-creating is safer if icon lib is generic.
                        // Or using class replace if lucide is active (lucide uses specific svg).
                        // Simplest: replace innerHTML with new lucide data attribute and call createIcons? 
                        // No, lucide.createIcons() scans entire DOM or specific root.
                        // Just replace innerHTML.
                        dirBtn.innerHTML = localSortDirection === 'asc'
                            ? `<i data-lucide="arrow-up" class="w-4 h-4"></i>`
                            : `<i data-lucide="arrow-down" class="w-4 h-4"></i>`;
                        if (window.lucide) window.lucide.createIcons({ root: dirBtn });
                    }
                }

                if (onSort) onSort(localSortType, localSortDirection);

                // Re-render sheet to show updated arrow without closing
                openSheet('排序方式', options, handleMobileSortSelect, localSortType, localSortDirection);
            };

            openSheet('排序方式', options, handleMobileSortSelect, localSortType, localSortDirection);
        });
    }

    // 批次選取 (簡易版：僅支援 Grid)
    const batchBtn = document.getElementById(`${prefix}batch-select-btn`);
    // Batch Action Bar Logic
    const batchBar = document.getElementById(`${prefix}batch-action-bar`);
    const batchSelectAllBtn = document.getElementById(`${prefix}batch-select-all-btn`);
    const batchAddBtn = document.getElementById(`${prefix}batch-add-to-playlist-btn`);
    const batchArchiveBtn = document.getElementById(`${prefix}batch-archive-btn`);
    const selectedCountEl = document.getElementById(`${prefix}selected-count`);

    let isBatchMode = false;
    let selectedCount = 0;

    // Helper to toggle batch UI
    const updateBatchUI = () => {
        // Recalculate count
        const activeContainer = !gridView.classList.contains('hidden') ? gridView : listView;
        if (!activeContainer) return;

        const checkedBoxes = activeContainer.querySelectorAll('input[type="checkbox"]:checked');
        selectedCount = checkedBoxes.length;

        if (selectedCountEl) {
            selectedCountEl.textContent = `已選取 ${selectedCount} 本書`;
        }

        // Show/Hide Batch Bar
        if (isBatchMode) {
            if (batchBar) batchBar.classList.remove('hidden');
        } else {
            if (batchBar) batchBar.classList.add('hidden');
        }

        // Disable hover effects if in batch mode (optional UX choice)
        // document.body.classList.toggle('batch-mode-active', isBatchMode);
    };

    if (batchBtn) {
        batchBtn.addEventListener('click', () => {
            isBatchMode = !isBatchMode;

            // Toggle Visuals
            batchBtn.classList.toggle('text-accent');
            batchBtn.classList.toggle('bg-accent/10'); // Add active bg

            // Handle BOTH Grid and List views
            // We need to target the containers for THIS prefix/view specifically?
            // Actually, calling initFilterBar with 'details-' passes the specific grid/list views.
            // So 'gridView' and 'listView' are already scoped to the view we want if we passed them correctly?
            // Wait, initFilterBar assumes global IDs for 'all-books-grid' etc inside it?
            // Let's check initFilterBar definition.
            // It selects:
            // const gridView = document.getElementById(`${prefix}books-grid`) || document.getElementById('all-books-grid');
            // const listView = document.getElementById(`${prefix}books-list`) || document.getElementById('all-books-list');
            // So if prefix is set, it selects specific grids.

            [gridView, listView].forEach(container => {
                if (!container) return;

                const checkboxes = container.querySelectorAll('.batch-checkbox');
                checkboxes.forEach(cb => {
                    cb.classList.toggle('hidden', !isBatchMode);
                    cb.checked = false; // Reset checking when toggling
                });

                // Toggle 'group' class (Grid uses it for hover overlay)
                // If batch mode ON -> remove group (disable hover)
                // If batch mode OFF -> add group
                const bookItems = container.querySelectorAll('.book-item, .book-list-item');
                bookItems.forEach(item => {
                    if (isBatchMode) {
                        item.classList.remove('group'); // Disable hover
                    } else {
                        item.classList.add('group'); // Enable hover
                    }
                    item.classList.remove('ring-2', 'ring-accent');
                });
            });

            selectedCount = 0;
            updateBatchUI();
        });

        // Delegate Checkbox Click
        // Attach listener to containers
        [gridView, listView].forEach(container => {
            if (!container) return;
            // Remove previous listeners if any (to avoid duplicates if re-inited)? 
            // Simple way: rely on clean init or replace node. For now, just add.
            // Better: Check if already attached? Hard to do.
            // Assuming initFilterBar is called once per view lifecycle or view is static.

            container.addEventListener('change', (e) => {
                if (e.target.matches('input[type="checkbox"]')) {
                    const cb = e.target;
                    const item = cb.closest('.book-item') || cb.closest('.book-list-item');

                    if (cb.checked) {
                        if (item) item.classList.add('ring-2', 'ring-accent');
                    } else {
                        if (item) item.classList.remove('ring-2', 'ring-accent');
                    }
                    updateBatchUI();
                }
            });

            // Handle click on card in batch mode to toggle checkbox
            container.addEventListener('click', (e) => {
                if (!isBatchMode) return;
                const item = e.target.closest('.book-item') || e.target.closest('.book-list-item');
                if (!item) return;

                // If clicked strictly on checkbox or its label, let it be.
                if (e.target.matches('input[type="checkbox"]')) return;

                // Toggle checkbox
                const cb = item.querySelector('input[type="checkbox"]');
                if (cb) {
                    cb.checked = !cb.checked;
                    // Trigger change event manually if needed or just update UI
                    if (cb.checked) {
                        item.classList.add('ring-2', 'ring-accent');
                    } else {
                        item.classList.remove('ring-2', 'ring-accent');
                    }
                    updateBatchUI();
                }
            });
        });

        // Select All Logic
        if (batchSelectAllBtn) {
            batchSelectAllBtn.addEventListener('click', () => {
                // Determine active container
                const activeContainer = !gridView.classList.contains('hidden') ? gridView : listView;
                if (!activeContainer) return;

                const checkboxes = activeContainer.querySelectorAll('input[type="checkbox"]');
                const total = checkboxes.length;

                if (selectedCount === total) {
                    // Deselect All
                    checkboxes.forEach(cb => {
                        cb.checked = false;
                        const item = cb.closest('.book-item') || cb.closest('.book-list-item');
                        if (item) item.classList.remove('ring-2', 'ring-accent');
                    });
                    selectedCount = 0;
                } else {
                    // Select All
                    checkboxes.forEach(cb => {
                        cb.checked = true;
                        const item = cb.closest('.book-item') || cb.closest('.book-list-item');
                        if (item) item.classList.add('ring-2', 'ring-accent');
                    });
                    selectedCount = total;
                }
                updateBatchUI();
            });
        }

        // Batch Add Logic
        if (batchAddBtn) {
            batchAddBtn.addEventListener('click', () => {
                const activeContainer = !gridView.classList.contains('hidden') ? gridView : listView;
                if (!activeContainer) return;

                const selectedIds = Array.from(activeContainer.querySelectorAll('input[type="checkbox"]:checked'))
                    .map(cb => {
                        const item = cb.closest('.book-item') || cb.closest('.book-list-item');
                        return item.dataset.bookId;
                    });

                if (selectedIds.length === 0) {
                    alert('請先選取書籍！');
                    return;
                }

                renderShelfModal(selectedIds);
                openModal('add-shelf-modal');
            });
        }

        // Batch Archive Logic
        if (batchArchiveBtn) {
            batchArchiveBtn.addEventListener('click', () => {
                const activeContainer = !gridView.classList.contains('hidden') ? gridView : listView;
                if (!activeContainer) return;

                const selectedIds = Array.from(activeContainer.querySelectorAll('input[type="checkbox"]:checked'))
                    .map(cb => {
                        const item = cb.closest('.book-item') || cb.closest('.book-list-item');
                        return item.dataset.bookId;
                    });

                if (selectedIds.length === 0) {
                    alert('請先選取書籍！');
                    return;
                }

                if (confirm(`確定要封存這 ${selectedIds.length} 本書嗎？`)) {
                    alert(`[Feature Stub]\n已將 ${selectedIds.length} 本書移至封存區。`);
                    // In real app, call archive API and re-render
                }
            });
        }
    }

    // 排序下拉選單
    const sortBtn = document.getElementById(`${prefix}sort-menu-btn`);
    const sortDropdown = document.getElementById(`${prefix}sort-dropdown`);
    const sortLabel = document.getElementById(`${prefix}sort-menu-label`);
    const sortDirBtn = document.getElementById(`${prefix}sort-direction-btn`); // New

    // Desktop Direction Button Logic
    if (sortDirBtn) {
        sortDirBtn.addEventListener('click', () => {
            localSortDirection = localSortDirection === 'asc' ? 'desc' : 'asc';

            // Update Icon
            sortDirBtn.innerHTML = localSortDirection === 'asc'
                ? `<i data-lucide="arrow-up" class="w-4 h-4"></i>`
                : `<i data-lucide="arrow-down" class="w-4 h-4"></i>`;
            if (window.lucide) window.lucide.createIcons({ root: sortDirBtn });

            if (onSort) onSort(localSortType, localSortDirection);
        });
    }

    if (sortBtn && sortDropdown) {
        sortBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            // Toggle visibility
            const isHidden = sortDropdown.classList.contains('hidden');
            if (!isHidden) {
                sortDropdown.classList.add('hidden');
            } else {
                sortDropdown.classList.remove('hidden');

                // Apply fixed positioning
                const rect = sortBtn.getBoundingClientRect();

                // Calculate position: align right edge of dropdown with right edge of button
                // Default width of dropdown is w-48 (12rem = 192px)
                const dropdownWidth = 192;

                sortDropdown.style.position = 'fixed';
                sortDropdown.style.top = `${rect.bottom + 4}px`;
                sortDropdown.style.left = `${rect.right - dropdownWidth}px`;
                sortDropdown.style.width = `${dropdownWidth}px`; // Ensure width is explicit
                sortDropdown.style.zIndex = '100';
                sortDropdown.style.right = 'auto'; // Override css right:0
            }
        });

        window.addEventListener('click', (e) => {
            if (!sortBtn.contains(e.target) && !sortDropdown.contains(e.target)) {
                sortDropdown.classList.add('hidden');
            }
        });

        // Handle scrolling and resizing to close dropdown (simple way to handle fixed pos detachment)
        window.addEventListener('scroll', () => {
            if (!sortDropdown.classList.contains('hidden')) {
                sortDropdown.classList.add('hidden');
            }
        }, true);

        window.addEventListener('resize', () => {
            if (!sortDropdown.classList.contains('hidden')) {
                sortDropdown.classList.add('hidden');
            }
        });

        // 排序項目點擊事件
        const sortItems = sortDropdown.querySelectorAll('[data-sort]');

        sortItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const sortType = item.dataset.sort;
                const sortName = item.textContent;

                localSortType = sortType;
                // Reset direction to desc on type change? Or keep?
                // Let's reset to desc for consistency.
                localSortDirection = 'desc';

                // Update Icon
                if (sortDirBtn) {
                    sortDirBtn.innerHTML = `<i data-lucide="arrow-down" class="w-4 h-4"></i>`;
                    if (window.lucide) window.lucide.createIcons({ root: sortDirBtn });
                }

                // 更新按鈕文字
                if (sortLabel) {
                    sortLabel.textContent = `排序: ${sortName}`;
                }

                // 執行排序回調
                if (onSort) {
                    onSort(localSortType, localSortDirection);
                }

                // 關閉選單
                sortDropdown.classList.add('hidden');
            });
        });
    }
}

// 4. 初始化功能
export function initBookshelfFeature() {
    // 渲染書籍
    let currentBooks = [...BOOKS_DATA];
    const gridContainer = document.getElementById('all-books-grid');
    const listContainer = document.getElementById('all-books-list');

    const render = () => {
        if (gridContainer) gridContainer.innerHTML = currentBooks.map(createBookCardHTML).join('');
        if (listContainer) listContainer.innerHTML = currentBooks.map(createBookListItemHTML).join('');
        if (window.lucide) window.lucide.createIcons();
    };

    render();

    let currentSortType = 'recently-read'; // Default sort

    // 排序邏輯
    const handleSort = (sortType) => {
        currentSortType = sortType;
        if (sortType === 'recently-read') {
            // 用 readingTime 或 lastRead，這裡假設 lastRead
            currentBooks.sort((a, b) => (b.lastRead || '').localeCompare(a.lastRead || ''));
        } else if (sortType === 'purchase-date') {
            // 恢復預設順序
            currentBooks = [...BOOKS_DATA];
        } else if (sortType === 'title') {
            currentBooks.sort((a, b) => a.title.localeCompare(b.title, 'zh-Hant'));
        } else if (sortType === 'publish-date') {
            currentBooks.sort((a, b) => (b.publishDate || '').localeCompare(a.publishDate || ''));
        }
        render();
    };

    // 事件代理：處理點擊 (Grid & List 通用)
    // 事件代理：處理點擊 (Grid & List 通用)
    const handleBookClick = (e) => {
        const target = e.target;
        const card = target.closest('.book-item') || target.closest('.book-list-item');
        if (!card) return;
        const bookId = card.dataset.bookId;

        // 1. 加入書單
        if (target.closest('.shelf-btn')) {
            renderShelfModal(bookId); // Render dynamic content
            openModal('add-shelf-modal');
            e.stopPropagation();
            return;
        }

        // 2. 更多資訊 (選單按鈕)
        if (target.closest('.info-btn')) {
            showBookDetails(bookId);
            e.stopPropagation();
            return;
        }

        // 3. 閱讀器 logic
        const isMobile = window.innerWidth < 768; // MD breakpoint
        const isListMode = card.classList.contains('book-list-item');

        if (target.closest('.read-btn')) {
            console.log(`[Viewer Prototype] Opening book ${bookId}...`);
            alert(`[Viewer Prototype]\n正在開啟閱讀器：${bookId}`);
            return;
        }

        // 只要不是上面的按鈕 (batch, info, shelf, read)，都視為打開閱讀器
        // 規則：Mobile 或 List View 允許點擊整張卡片。Desktop Grid View 僅允許點擊 read-btn (已在上方處理)。
        if (!target.closest('.batch-checkbox') && !target.closest('.info-btn') && !target.closest('.shelf-btn')) {
            if (isMobile || isListMode) {
                console.log(`[Viewer Prototype] Opening book ${bookId}...`);
                alert(`[Viewer Prototype]\n正在開啟閱讀器：${bookId}`);
            }
        }
    };

    if (gridContainer) gridContainer.addEventListener('click', handleBookClick);
    if (listContainer) listContainer.addEventListener('click', handleBookClick);

    // Tab 切換
    const tabs = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');
    const searchContainer = document.getElementById('bookshelf-search-container');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab-target');
            panels.forEach(p => p.classList.add('hidden'));
            tabs.forEach(t => t.classList.remove('tab-active'));
            document.getElementById(targetId)?.classList.remove('hidden');
            tab.classList.add('tab-active');

            // Toggle search bar visibility
            if (searchContainer) {
                if (targetId === 'all-books') {
                    searchContainer.classList.remove('hidden');
                } else {
                    searchContainer.classList.add('hidden');
                    // Reset batch mode when leaving "All Books"
                    if (filterControls && filterControls.resetBatchMode) {
                        filterControls.resetBatchMode();
                    }
                }
            }
        });
    });


    // 設定 All Books 篩選列功能
    // --- Filter Logic ---
    const allBooksDataSource = () => BOOKS_DATA;

    // Setup generic filter logic
    const filterLogic = setupFilterLogic({
        containerId: 'all-books',
        dataSource: allBooksDataSource,
        render: (filteredBooks) => {
            currentBooks = filteredBooks;
            render();
        }
    });

    // 設定 All Books 篩選列功能 (UI & View toggle)
    // Pass a callback that forwards the sort request to our filter logic
    const filterControls = initFilterBar('', 'all-books-grid', 'all-books-list', (sortType, direction) => {
        if (filterLogic) filterLogic.handleSort(sortType, direction);
    });


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
            if (defaultSort) defaultSort.checked = true;

            const defaultSource = document.querySelector('input[name="mobile-source"][value="all"]');
            if (defaultSource) defaultSource.checked = true;

            // 重設 Chips
            document.querySelectorAll('.mobile-filter-chip').forEach(c => {
                c.classList.remove('bg-accent/10', 'text-accent', 'border-accent', 'active');
                c.classList.add('text-text-secondary');
            });
            const defaultStatus = document.querySelector('.mobile-filter-chip[data-value="all"]');
            if (defaultStatus) defaultStatus.classList.add('bg-accent/10', 'text-accent', 'border-accent', 'active');

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
            if (modal) modal.classList.add('hidden');

            // 可選：顯示一個 Toast 或 Console 訊息
            console.log("Filters applied!");
        });
    }
}

// 5. Reusable Filter Logic
export function setupFilterLogic({ containerId, dataSource, render }) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Selects
    // Assumption: Order is Status, Source, Category. 
    const statusSelect = container.querySelector(`select[id$="status-filter"]`) || container.querySelector('select:nth-of-type(1)');
    const sourceSelect = container.querySelector(`select[id$="source-filter"]`) || container.querySelector('select:nth-of-type(2)');
    const categorySelect = container.querySelector(`select[id$="category-filter"]`) || container.querySelector('select:nth-of-type(3)');

    const typeButtons = container.querySelectorAll('.filter-toggle');

    let activeFilters = {
        status: '全部',
        source: '全部來源',
        category: 'all',
        types: new Set()
    };

    let currentSortType = 'recently-read';
    let currentSortDirection = 'desc'; // 'asc' or 'desc'

    // Sort Logic Wrapper
    const applySort = (books) => {
        const sorted = [...books];
        if (currentSortType === 'recently-read') {
            sorted.sort((a, b) => {
                const valA = a.lastRead || '';
                const valB = b.lastRead || '';
                return currentSortDirection === 'desc' ? valB.localeCompare(valA) : valA.localeCompare(valB);
            });
        } else if (currentSortType === 'purchase-date') {
            // Default order (usually) - assuming data is already in default order or we have a date field?
            // Books data doesn't have explicit purchase date. Using original index or fallback.
            if (currentSortDirection === 'asc') sorted.reverse();
        } else if (currentSortType === 'title') {
            sorted.sort((a, b) => {
                return currentSortDirection === 'asc'
                    ? a.title.localeCompare(b.title, 'zh-Hant')
                    : b.title.localeCompare(a.title, 'zh-Hant');
            });
        } else if (currentSortType === 'publish-date') {
            sorted.sort((a, b) => {
                const valA = a.publishDate || '';
                const valB = b.publishDate || '';
                return currentSortDirection === 'desc' ? valB.localeCompare(valA) : valA.localeCompare(valB);
            });
        }
        return sorted;
    };

    const applyFilters = () => {
        const fullData = dataSource();
        let filtered = fullData.filter(book => {
            // Context: Status
            if (activeFilters.status !== '全部') {
                if (activeFilters.status === '未閱讀' && book.progress > 0) return false;
                if (activeFilters.status === '閱讀中' && (book.progress === 0 || book.progress === 100)) return false;
                if (activeFilters.status === '已讀完' && book.progress !== 100) return false;
            }

            // Context: Source
            if (activeFilters.source !== '全部來源') {
                if (!book.source.includes(activeFilters.source) && activeFilters.source !== book.source) {
                    let target = activeFilters.source;
                    if (target.includes('讀冊')) target = '讀冊';
                    if (target.includes('灰熊')) target = 'iRead';

                    if (book.source !== target && !target.includes(book.source)) return false;
                }
            }

            // Context: Category
            if (activeFilters.category !== 'all') {
                if (book.category !== activeFilters.category) return false;
            }

            // Context: Type
            if (activeFilters.types.size > 0) {
                if (!activeFilters.types.has(book.type)) return false;
            }

            return true;
        });

        const sortedAndFiltered = applySort(filtered);
        render(sortedAndFiltered);
    };

    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            activeFilters.category = e.target.value;
            applyFilters();
        });
    }

    if (statusSelect) {
        statusSelect.addEventListener('change', (e) => {
            activeFilters.status = e.target.value;
            applyFilters();
        });
    }

    if (sourceSelect) {
        sourceSelect.addEventListener('change', (e) => {
            activeFilters.source = e.target.value;
            applyFilters();
        });
    }

    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');

            // Old Style: bg-accent text-white
            // New Style: bg-accent/10 text-accent font-bold border-accent
            // Remove old toggles
            // btn.classList.toggle('bg-accent');
            // btn.classList.toggle('text-white');

            // Toggle New Styles
            btn.classList.toggle('bg-accent/10');
            btn.classList.toggle('text-accent');
            btn.classList.toggle('font-bold');
            btn.classList.toggle('border-accent'); // Ensure border is visible

            // Revert state classes
            // When INACTIVE: bg-white text-text-secondary border-border-color
            // When ACTIVE: bg-accent/10 text-accent border-accent

            // We need to handle the removal of inactive classes carefully or just toggle them?
            // "bg-white" vs "bg-accent/10" -> if we add bg-accent/10, bg-white might still be there. 
            // In Tailwind, later classes usually win or specific ones. 
            // But let's be clean.

            if (btn.classList.contains('active')) {
                btn.classList.remove('bg-white', 'text-text-secondary', 'border-border-color');
                btn.classList.add('bg-accent/10', 'text-accent', 'border-accent', 'font-bold');
            } else {
                btn.classList.add('bg-white', 'text-text-secondary', 'border-border-color');
                btn.classList.remove('bg-accent/10', 'text-accent', 'border-accent', 'font-bold');
            }

            const type = btn.textContent.trim();
            if (activeFilters.types.has(type)) {
                activeFilters.types.delete(type);
            } else {
                activeFilters.types.add(type);
            }
            applyFilters();
        });
    });

    return {
        handleSort: (sortType, direction) => {
            currentSortType = sortType;
            if (direction) currentSortDirection = direction;
            applyFilters();
        },
        triggerFilter: applyFilters
    };

    return {
        resetBatchMode: () => {
            if (isBatchMode) {
                // Trigger click to toggle off
                if (batchBtn) batchBtn.click();
            } else {
                // Ensure UI is clean even if flag is false (e.g. if forcibly hidden)
                // However, clicking button is the safest way to trigger the full teardown logic.
            }
            // Double check: if batch bar is visible but isBatchMode is false (the bug state), force hide
            if (!isBatchMode && batchBar && !batchBar.classList.contains('hidden')) {
                batchBar.classList.add('hidden');
            }
        }
    };
}