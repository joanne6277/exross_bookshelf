import { openModal, closeModal } from '../utils.js';
import { BOOKS_DATA } from '../data/books.js';
import { renderPagination, initPagination } from '../components/Pagination.js';

import { getCollections, toggleBookInCollection, addCollection } from './collections.js';
import { initFilterBarEvents } from '../components/FilterBar.js';
import { bookshelfFilterConfig, archiveFilterConfig } from '../views/Bookshelf.js';

let currentEditingBookIds = []; // Changed to array

// Helper: Check if all books in array are in the collection
function areAllBooksInCollection(collectionTitle, bookIds) {
    const collection = getCollections()[collectionTitle];
    if (!collection) return false;
    return bookIds.every(id => collection.books.includes(id));
}

export function isBookExpired(book) {
    if (book.type !== '教科書' || !book.expiryDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryParts = book.expiryDate.split(' ')[0].split('/');
    if (expiryParts.length === 3) {
        const expiry = new Date(expiryParts[0], expiryParts[1] - 1, expiryParts[2]);
        return expiry < today;
    }
    return false;
}

export function isBookManuallyArchived(book) {
    return book.isArchived === true;
}

export function filterArchivedBooks(books, filterType = 'all') {
    const archivedBooks = books.filter(book => isBookExpired(book) || isBookManuallyArchived(book));
    if (filterType === 'all') return archivedBooks;
    if (filterType === 'expired') return archivedBooks.filter(book => isBookExpired(book));
    if (filterType === 'archived') return archivedBooks.filter(book => isBookManuallyArchived(book));
    return archivedBooks;
}

// Helper: Check if a book is archived
export function isBookArchived(book) {
    if (book.isArchived) return true;
    if (book.type === '教科書' && book.expiryDate) {
        // Compare expiry date string (YYYY/MM/DD) with today
        // Simple string comparison works for ISO-like YYYY/MM/DD if no time involved, or just parsing
        // Let's parse to be safe.
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiryParts = book.expiryDate.split(' ')[0].split('/'); // Remove time if any
        if (expiryParts.length === 3) {
            const expiry = new Date(expiryParts[0], expiryParts[1] - 1, expiryParts[2]);
            if (expiry < today) return true;
        }
    }
    return false;
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

    // Archived Logic
    const isArchivedView = options.isArchivedView || false;
    const isExpired = isTextbook && isBookArchived(book); // Check validity again or reuse passed prop? Rely on helper.
    // However, if we are in archived view, we can assume it IS archived or expired.

    // Image Classes: If archived view, grayscale
    const imgClasses = `w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-110 ${isArchivedView ? 'grayscale' : ''}`;

    // Label Logic: Expired
    let topLabel = remainingTag;
    if (isArchivedView && isExpired) {
        topLabel = `<div class="absolute top-2 right-2 z-10"><span class="bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded-full border border-white/50 shadow-md">已過期</span></div>`;
    }

    return `
    <div class="book-item bg-secondary rounded-xl shadow-sm overflow-hidden flex flex-col border border-border-color md:hover:shadow-lg transition-all group relative cursor-pointer" data-book-id="${book.id}">
        <div class="absolute top-2 left-2 z-30 batch-checkbox hidden">
            <input type="checkbox" class="w-5 h-5 rounded text-accent focus:ring-accent cursor-pointer">
        </div>
        ${topLabel}
        <div class="relative overflow-hidden aspect-[2/3] viewer-trigger">
            <img src="${book.cover}" alt="${book.title}" class="${imgClasses}">
            <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                <div class="h-full" style="width: ${book.progress}%; background-color: var(--bg-accent);"></div>
            </div>
            <div class="absolute inset-0 bg-black/70 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hidden md:flex flex-col items-center justify-center gap-3 p-6 z-20 backdrop-blur-[2px] pointer-events-none md:group-hover:pointer-events-auto">
                ${isArchivedView
            ? (isExpired
                ? `<button class="mask-btn w-full py-2.5 rounded-lg shadow-md purchase-btn pointer-events-auto">購買連結</button>`
                : `<button class="mask-btn w-full py-2.5 rounded-lg shadow-md unarchive-btn pointer-events-auto">加入我的書櫃</button>`)
            : `<button class="mask-btn w-full py-2.5 rounded-lg shadow-md read-btn pointer-events-auto">立即閱讀</button>
                <button class="mask-btn w-full py-2.5 rounded-lg shadow-md shelf-btn pointer-events-auto">加入/移出書單</button>`}
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
            <div class="flex items-center gap-2 mt-2">
                <div class="w-full max-w-xs h-1 md:h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full bg-accent" style="width: ${book.progress}%; background-color: var(--bg-accent);"></div>
                </div>
                <span class="text-xs text-text-secondary font-medium flex-shrink-0">${book.progress}%</span>
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

    // Source badge (now in tag row, no mobile version needed)
    document.getElementById('modal-book-source').textContent = book.source;

    // Format badge (now in tag row, no mobile version needed)
    const formatEl = document.getElementById('modal-book-format');
    if (book.format) {
        if (formatEl) {
            formatEl.textContent = book.format;
            formatEl.classList.remove('hidden');
        }
    } else {
        if (formatEl) formatEl.classList.add('hidden');
    }

    // Audiobook Icon (now in tag row, no mobile version needed)
    const audioIcon = document.getElementById('modal-book-audiobook-icon');
    if (book.isAudiobook) {
        if (audioIcon) audioIcon.classList.remove('hidden');
    } else {
        if (audioIcon) audioIcon.classList.add('hidden');
    }

    // TTS (可朗讀) Icon
    const ttsIcon = document.getElementById('modal-book-tts-icon');
    if (book.isTTSEnabled) {
        if (ttsIcon) ttsIcon.classList.remove('hidden');
    } else {
        if (ttsIcon) ttsIcon.classList.add('hidden');
    }

    // New Teaching Resource Tag
    const newResourceTag = document.getElementById('modal-book-new-resource-tag');
    if (book.teachingResources && book.teachingResources.hasNew) {
        if (newResourceTag) newResourceTag.classList.remove('hidden');
    } else {
        if (newResourceTag) newResourceTag.classList.add('hidden');
    }

    // Remaining Time (stays on cover for textbooks)
    const isTextbook = book.type === '教科書';
    const remainingContainer = document.getElementById('modal-remaining-time-container');
    const remainingContainerMobile = document.getElementById('modal-remaining-time-container-mobile');
    const remainingEl = document.getElementById('modal-book-remaining');
    const remainingElMobile = document.getElementById('modal-book-remaining-mobile');

    if (isTextbook && book.remainingTime) {
        if (remainingContainer) remainingContainer.classList.remove('hidden');
        if (remainingContainerMobile) remainingContainerMobile.classList.remove('hidden');
        if (remainingEl) remainingEl.textContent = `剩餘 ${book.remainingTime}`;
        if (remainingElMobile) remainingElMobile.textContent = `剩餘 ${book.remainingTime}`;
    } else {
        if (remainingContainer) remainingContainer.classList.add('hidden');
        if (remainingContainerMobile) remainingContainerMobile.classList.add('hidden');
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

    // Helper to toggle visibility for desktop and mobile containers
    const toggleVisibility = (selector, visible) => {
        document.getElementById(selector)?.classList.toggle('hidden', !visible);
        document.getElementById(`${selector}-mobile`)?.classList.toggle('hidden', !visible);
    };

    toggleVisibility('modal-expiry-container', isTextbook);
    toggleVisibility('teaching-resources-container', isTextbook);

    if (isTextbook) {
        const expiryDateFormatted = book.expiryDate ? book.expiryDate.split(' ')[0] : '-';
        document.getElementById('modal-book-expiry').textContent = expiryDateFormatted;
        document.getElementById('modal-book-expiry-mobile').textContent = expiryDateFormatted;

        const resources = book.teachingResources;
        let contentHTML = '';
        if (resources) {
            if (resources.attachments && resources.attachments.length > 0) {
                contentHTML += '<h4 class="text-sm font-bold text-text-secondary mb-2 uppercase">附件</h4><div class="space-y-2">';
                resources.attachments.forEach(file => {
                    const newBadge = file.isNew ? '<span class="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm">NEW</span>' : '';
                    contentHTML += `<a href="${file.url}" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-border-color hover:bg-gray-100 transition-colors"><div class="flex items-center gap-3"><i data-lucide="file-text" class="w-5 h-5 text-text-secondary"></i><div><div class="font-medium text-text-primary">${file.name}</div><div class="text-xs text-text-secondary">${file.size}</div></div></div><div class="flex items-center gap-2">${newBadge}<i data-lucide="download" class="w-5 h-5 text-text-secondary"></i></div></a>`;
                });
                contentHTML += '</div>';
            }
            if (resources.links && resources.links.length > 0) {
                contentHTML += '<h4 class="text-sm font-bold text-text-secondary mt-4 mb-2 uppercase">參考連結</h4><div class="space-y-2">';
                resources.links.forEach(link => {
                    const newBadge = link.isNew ? '<span class="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm">NEW</span>' : '';
                    contentHTML += `<a href="${link.url}" target="_blank" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-border-color hover:bg-gray-100 transition-colors"><i data-lucide="link" class="w-5 h-5 text-text-secondary"></i><span class="font-medium text-text-primary">${link.title}</span><div class="flex items-center gap-2 ml-auto">${newBadge}<i data-lucide="arrow-up-right" class="w-4 h-4 text-text-secondary"></i></div></a>`;
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

    // --- Action Button Logic for Archived Books ---
    const isArchived = isBookArchived(book);
    const isExpiredTextbook = isTextbook && isArchived && !book.isArchived; // It's archived due to expiry, not manual flag

    // Toggle action button containers
    const actionsNormal = document.getElementById('modal-actions-normal');
    const actionsNormalMobile = document.getElementById('modal-actions-normal-mobile');
    const actionsArchived = document.getElementById('modal-actions-archived');
    const actionsArchivedMobile = document.getElementById('modal-actions-archived-mobile');
    const actionsExpired = document.getElementById('modal-actions-expired');
    const actionsExpiredMobile = document.getElementById('modal-actions-expired-mobile');

    // Hide all first
    [actionsNormal, actionsNormalMobile, actionsArchived, actionsArchivedMobile, actionsExpired, actionsExpiredMobile].forEach(el => {
        if (el) el.classList.add('hidden');
    });

    if (isExpiredTextbook) {
        // Expired Textbook -> Show Purchase Link
        if (actionsExpired) actionsExpired.classList.remove('hidden');
        if (actionsExpiredMobile) actionsExpiredMobile.classList.remove('hidden');
    } else if (book.isArchived) {
        // Manually Archived -> Show Unarchive/Add to Bookshelf
        if (actionsArchived) actionsArchived.classList.remove('hidden');
        if (actionsArchivedMobile) actionsArchivedMobile.classList.remove('hidden');
    } else {
        // Normal Book -> Show Normal Actions
        if (actionsNormal) actionsNormal.classList.remove('hidden');
        if (actionsNormalMobile) actionsNormalMobile.classList.remove('hidden');
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

export function initBookshelfBatchMode(prefix, gridViewId, listViewId) {
    const gridView = document.getElementById(gridViewId);
    const listView = document.getElementById(listViewId);

    // 批次選取 (簡易版：僅支援 Grid)
    const batchBtn = document.getElementById(`${prefix}batch-select-btn`);
    const batchBtnMobile = document.getElementById(`${prefix}batch-select-btn-mobile`);
    // Batch Action Bar Logic
    const batchBar = document.getElementById(`${prefix}batch-action-bar`);
    const batchSelectAllBtn = document.getElementById(`${prefix}batch-select-all-btn`);
    const batchAddBtn = document.getElementById(`${prefix}batch-add-to-playlist-btn`);
    const batchArchiveBtn = document.getElementById(`${prefix}batch-archive-btn`);
    const selectedCountEl = document.getElementById(`${prefix}selected-count`);

    let isBatchMode = false;
    let selectedCount = 0;

    const updateBatchUI = () => {
        const activeContainer = (gridView && !gridView.classList.contains('hidden')) ? gridView : listView;
        if (!activeContainer) return;

        const checkedBoxes = activeContainer.querySelectorAll('input[type="checkbox"]:checked');
        selectedCount = checkedBoxes.length;

        if (selectedCountEl) {
            selectedCountEl.textContent = `已選取 ${selectedCount} 本書`;
        }

        if (isBatchMode) {
            if (batchBar) batchBar.classList.remove('hidden');
        } else {
            if (batchBar) batchBar.classList.add('hidden');
        }

        document.body.classList.toggle('batch-mode-active', isBatchMode);
    };

    const toggleBatchMode = () => {
        isBatchMode = !isBatchMode;

        if (batchBtn) {
            batchBtn.classList.toggle('text-accent');
            batchBtn.classList.toggle('bg-accent/10');
        }
        if (batchBtnMobile) {
            batchBtnMobile.classList.toggle('text-accent');
            batchBtnMobile.classList.toggle('bg-accent/10');
        }

        [gridView, listView].forEach(container => {
            if (!container) return;

            const checkboxes = container.querySelectorAll('.batch-checkbox');
            checkboxes.forEach(cb => {
                cb.classList.toggle('hidden', !isBatchMode);
                cb.checked = false;
            });

            const bookItems = container.querySelectorAll('.book-item, .book-list-item');
            bookItems.forEach(item => {
                if (isBatchMode) {
                    item.classList.remove('group');
                } else {
                    item.classList.add('group');
                }
                item.classList.remove('ring-2', 'ring-accent');
            });
        });

        selectedCount = 0;
        updateBatchUI();
    };

    if (batchBtn) batchBtn.addEventListener('click', toggleBatchMode);
    if (batchBtnMobile) batchBtnMobile.addEventListener('click', toggleBatchMode);

    [gridView, listView].forEach(container => {
        if (!container) return;

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

        container.addEventListener('click', (e) => {
            if (!isBatchMode) return;
            const item = e.target.closest('.book-item') || e.target.closest('.book-list-item');
            if (!item) return;

            if (e.target.matches('input[type="checkbox"]')) return;

            const cb = item.querySelector('input[type="checkbox"]');
            if (cb) {
                cb.checked = !cb.checked;
                if (cb.checked) {
                    item.classList.add('ring-2', 'ring-accent');
                } else {
                    item.classList.remove('ring-2', 'ring-accent');
                }
                updateBatchUI();
            }
        });
    });

    if (batchSelectAllBtn) {
        batchSelectAllBtn.addEventListener('click', () => {
            const activeContainer = (gridView && !gridView.classList.contains('hidden')) ? gridView : listView;
            if (!activeContainer) return;

            const checkboxes = activeContainer.querySelectorAll('input[type="checkbox"]');
            const total = checkboxes.length;

            if (selectedCount === total) {
                checkboxes.forEach(cb => {
                    cb.checked = false;
                    const item = cb.closest('.book-item') || cb.closest('.book-list-item');
                    if (item) item.classList.remove('ring-2', 'ring-accent');
                });
                selectedCount = 0;
            } else {
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

    if (batchAddBtn) {
        batchAddBtn.addEventListener('click', () => {
            const activeContainer = (gridView && !gridView.classList.contains('hidden')) ? gridView : listView;
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

    if (batchArchiveBtn) {
        batchArchiveBtn.addEventListener('click', () => {
            const activeContainer = (gridView && !gridView.classList.contains('hidden')) ? gridView : listView;
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
            }
        });
    }

    return {
        resetBatchMode: () => {
            if (isBatchMode) toggleBatchMode();
        }
    };
}

// 4. 初始化功能
export function initBookshelfFeature() {
    // 渲染書籍
    const BOOKS_PER_PAGE = 24;  // Grid 每頁書數
    const BOOKS_PER_PAGE_LIST = 20; // List 每頁書數

    // 全部書籍 - 分頁狀態
    let allBooksCurrentPage = 1;

    let currentBooks = BOOKS_DATA.filter(b => !isBookArchived(b));
    const gridContainer = document.getElementById('all-books-grid');
    const listContainer = document.getElementById('all-books-list');

    const render = () => {
        const isListView = listContainer && !listContainer.classList.contains('hidden');
        const perPage = isListView ? BOOKS_PER_PAGE_LIST : BOOKS_PER_PAGE;
        const total = currentBooks.length;
        const totalPages = Math.max(1, Math.ceil(total / perPage));

        // 確保目前頁碼有效
        if (allBooksCurrentPage > totalPages) allBooksCurrentPage = totalPages;

        const start = (allBooksCurrentPage - 1) * perPage;
        const pageBooks = currentBooks.slice(start, start + perPage);

        if (gridContainer) gridContainer.innerHTML = pageBooks.map(b => createBookCardHTML(b)).join('');
        if (listContainer) listContainer.innerHTML = pageBooks.map(createBookListItemHTML).join('');

        // 渲染分頁列
        renderPagination('all-books-pagination', totalPages, allBooksCurrentPage);

        if (window.lucide) window.lucide.createIcons();
    };

    // 初始化全部書籍分頁點擊事件（只初始化一次）
    initPagination('all-books-pagination', (page) => {
        allBooksCurrentPage = page;
        render();
        // 捲動到書籍列表頂部
        document.getElementById('all-books')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // New: Render Archived Books with Filter Support
    let currentArchiveFilter = 'all';
    let currentArchiveView = 'grid';
    let archiveFilterInitialized = false;
    const ARCHIVE_PER_PAGE = 24;
    const ARCHIVE_PER_PAGE_LIST = 20;
    let archiveCurrentPage = 1;

    const renderArchivedBooks = (filterType = currentArchiveFilter) => {
        currentArchiveFilter = filterType;

        const filterContainer = document.getElementById('archive-filter-container');
        const gridContainer = document.getElementById('archived-grid');
        const listContainer = document.getElementById('archived-list');

        if (!gridContainer) return;

        // Initialize filter bar (only once)
        if (!archiveFilterInitialized) {
            initFilterBarEvents(archiveFilterConfig, (action, data) => {
                if (action === 'filter' && data.id === 'type') {
                    archiveCurrentPage = 1; // 篩選後重設頁碼
                    renderArchivedBooks(data.value);
                } else if (action === 'view') {
                    currentArchiveView = data;
                    archiveCurrentPage = 1;
                    if (gridContainer && listContainer) {
                        if (data === 'grid') {
                            gridContainer.classList.remove('hidden');
                            listContainer.classList.add('hidden');
                        } else {
                            gridContainer.classList.add('hidden');
                            listContainer.classList.remove('hidden');
                        }
                    }
                    renderArchivedBooks(currentArchiveFilter);
                }
            });

            archiveFilterInitialized = true;

            // 初始化封存區分頁點擊事件（只初始化一次）
            initPagination('archived-pagination', (page) => {
                archiveCurrentPage = page;
                renderArchivedBooks(currentArchiveFilter);
                document.getElementById('archived')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });

            if (window.lucide) window.lucide.createIcons();
        }

        // Filter archived books
        const archivedBooks = filterArchivedBooks(BOOKS_DATA, filterType);

        const isListView = currentArchiveView === 'list';
        const perPage = isListView ? ARCHIVE_PER_PAGE_LIST : ARCHIVE_PER_PAGE;
        const total = archivedBooks.length;
        const totalPages = Math.max(1, Math.ceil(total / perPage));
        if (archiveCurrentPage > totalPages) archiveCurrentPage = totalPages;

        const start = (archiveCurrentPage - 1) * perPage;
        const pageArchiveBooks = archivedBooks.slice(start, start + perPage);

        // Render Grid
        if (gridContainer) {
            gridContainer.innerHTML = pageArchiveBooks.length > 0
                ? pageArchiveBooks.map(b => createBookCardHTML(b, { isArchivedView: true })).join('')
                : '';
        }

        // Render List
        if (listContainer) {
            listContainer.innerHTML = pageArchiveBooks.length > 0
                ? pageArchiveBooks.map(createBookListItemHTML).join('')
                : '';
        }

        // Empty state
        if (archivedBooks.length === 0) {
            const emptyHTML = `<div class="text-center py-20 text-text-secondary col-span-full">暫無${filterType === 'expired' ? '已過期' : filterType === 'archived' ? '已封存' : '封存'}書籍</div>`;
            if (gridContainer && currentArchiveView === 'grid') {
                gridContainer.innerHTML = emptyHTML;
            } else if (listContainer && currentArchiveView === 'list') {
                listContainer.innerHTML = emptyHTML;
            }
        }

        // 渲染封存區分頁列
        renderPagination('archived-pagination', totalPages, archiveCurrentPage);

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
            currentBooks = BOOKS_DATA.filter(b => !isBookArchived(b));
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
        // Prevent viewer/details if in batch mode (handled by global class toggle in FilterBar)
        if (document.body.classList.contains('batch-mode-active')) return;

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

    // Archived containers event delegation
    const archivedGridContainer = document.getElementById('archived-grid');
    const archivedListContainer = document.getElementById('archived-list');
    if (archivedGridContainer) archivedGridContainer.addEventListener('click', handleBookClick);
    if (archivedListContainer) archivedListContainer.addEventListener('click', handleBookClick);

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

            if (targetId === 'archived') {
                renderArchivedBooks();
            }

            // Reset batch mode when leaving "All Books"
            if (targetId !== 'all-books') {
                if (filterControls && filterControls.resetBatchMode) {
                    filterControls.resetBatchMode();
                }
            }
        });
    });


    // 設定 All Books 篩選列功能
    // --- Filter Logic ---
    const allBooksDataSource = () => BOOKS_DATA.filter(b => !isBookArchived(b));

    // Setup generic filter logic
    const filterLogic = setupFilterLogic({
        containerId: 'all-books',
        dataSource: allBooksDataSource,
        render: (filteredBooks) => {
            currentBooks = filteredBooks;
            allBooksCurrentPage = 1; // 篩選後重設頁碼
            render();
        }
    });

    // 設定 All Books 篩選列功能 (UI & View toggle)
    const filterControls = initBookshelfBatchMode('', 'all-books-grid', 'all-books-list');

    initFilterBarEvents(bookshelfFilterConfig, (action, data) => {
        if (action === 'sort') {
            if (filterLogic) filterLogic.handleSort(data.type, data.direction);
        } else if (action === 'filter') {
            if (filterLogic) filterLogic.handleFilter(data.id, data.value);
        } else if (action === 'view') {
            const gridView = document.getElementById('all-books-grid');
            const listView = document.getElementById('all-books-list');
            if (gridView && listView) {
                if (data === 'grid') {
                    gridView.classList.remove('hidden');
                    listView.classList.add('hidden');
                } else {
                    gridView.classList.add('hidden');
                    listView.classList.remove('hidden');
                }
            }
            if (filterControls && filterControls.resetBatchMode) {
                filterControls.resetBatchMode();
            }
        }
    });

    // 初始化圖示
    if (window.lucide) window.lucide.createIcons();

    // Old mobile filter modal logic has been removed.

    // --- Bookshelf Search ---
    const searchInput = document.getElementById('bookshelf-search-input');
    const searchClearBtn = document.getElementById('bookshelf-search-clear');
    const searchResultsContainer = document.getElementById('bookshelf-search-results');
    const searchResultsGrid = document.getElementById('search-results-grid');
    const searchResultsInfo = document.getElementById('search-results-info');
    const searchResultsEmpty = document.getElementById('search-results-empty');
    const tabContent = document.getElementById('tab-content');
    const tabsContainer = document.getElementById('bookshelf-tabs-container');

    const performSearch = (query) => {
        const trimmed = query.trim().toLowerCase();

        if (!trimmed) {
            // 清空搜尋，恢復 tab 內容
            if (searchResultsContainer) searchResultsContainer.classList.add('hidden');
            if (tabContent) tabContent.classList.remove('hidden');
            if (tabsContainer) tabsContainer.classList.remove('hidden');
            if (searchClearBtn) searchClearBtn.classList.add('hidden');
            return;
        }

        // 顯示清除按鈕
        if (searchClearBtn) searchClearBtn.classList.remove('hidden');

        // 搜尋全部書籍（含封存）
        const results = BOOKS_DATA.filter(book => {
            return book.title.toLowerCase().includes(trimmed) ||
                book.author.toLowerCase().includes(trimmed);
        });

        // 隱藏 tab 內容，顯示搜尋結果
        if (tabContent) tabContent.classList.add('hidden');
        if (tabsContainer) tabsContainer.classList.add('hidden');
        if (searchResultsContainer) searchResultsContainer.classList.remove('hidden');

        if (results.length > 0) {
            if (searchResultsGrid) {
                searchResultsGrid.classList.remove('hidden');
                searchResultsGrid.innerHTML = results.map(b => createBookCardHTML(b, {
                    isArchivedView: isBookArchived(b)
                })).join('');
            }
            if (searchResultsEmpty) searchResultsEmpty.classList.add('hidden');
            if (searchResultsInfo) {
                searchResultsInfo.textContent = `找到 ${results.length} 本相關書籍`;
            }
        } else {
            if (searchResultsGrid) {
                searchResultsGrid.classList.add('hidden');
                searchResultsGrid.innerHTML = '';
            }
            if (searchResultsEmpty) searchResultsEmpty.classList.remove('hidden');
            if (searchResultsInfo) searchResultsInfo.textContent = '';
        }

        if (window.lucide) window.lucide.createIcons();
    };

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });
    }

    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                performSearch('');
                searchInput.focus();
            }
        });
    }

    // 搜尋結果點擊事件代理
    if (searchResultsGrid) {
        searchResultsGrid.addEventListener('click', handleBookClick);
    }
}

// 5. Reusable Filter Logic
export function setupFilterLogic({ containerId, dataSource, render }) {
    let activeFilters = {
        status: '全部',
        source: '全部',
        category: 'all',
        type: 'all'
    };

    let currentSortType = 'recently-read';
    let currentSortDirection = 'desc';

    const applySort = (books) => {
        const sorted = [...books];
        if (currentSortType === 'recently-read') {
            sorted.sort((a, b) => {
                const valA = a.lastRead || '';
                const valB = b.lastRead || '';
                return currentSortDirection === 'desc' ? valB.localeCompare(valA) : valA.localeCompare(valB);
            });
        } else if (currentSortType === 'purchase-date') {
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
            if (activeFilters.status !== '全部') {
                if (activeFilters.status === '未閱讀' && book.progress > 0) return false;
                if (activeFilters.status === '閱讀中' && (book.progress === 0 || book.progress === 100)) return false;
                if (activeFilters.status === '已讀完' && book.progress !== 100) return false;
            }

            if (activeFilters.source !== '全部' && activeFilters.source !== '全部來源') {
                if (!book.source.includes(activeFilters.source) && activeFilters.source !== book.source) {
                    let target = activeFilters.source;
                    if (target.includes('讀冊')) target = '讀冊';
                    if (target.includes('灰熊')) target = 'iRead';

                    if (book.source !== target && !target.includes(book.source)) return false;
                }
            }

            if (activeFilters.category !== 'all') {
                if (book.category !== activeFilters.category) return false;
            }

            if (activeFilters.type !== 'all') {
                if (activeFilters.type === 'audiobook') {
                    if (!book.isAudiobook) return false;
                } else if (activeFilters.type === 'tts') {
                    if (!book.isTTSEnabled) return false;
                } else {
                    if (book.type !== activeFilters.type) return false;
                }
            }

            return true;
        });

        const sortedAndFiltered = applySort(filtered);
        render(sortedAndFiltered);
    };

    return {
        handleSort: (sortType, direction) => {
            currentSortType = sortType;
            if (direction) currentSortDirection = direction;
            applyFilters();
        },
        handleFilter: (filterId, value) => {
            if (activeFilters.hasOwnProperty(filterId)) {
                activeFilters[filterId] = value;
                applyFilters();
            }
        },
        triggerFilter: applyFilters
    };
}