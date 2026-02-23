import { openModal, closeModal } from '../utils.js';
import { renderBookshelfDetails } from '../main.js';
import { renderPagination, initPagination } from '../components/Pagination.js';

// --- DATA ---
let collectionsData = {
    "我的最愛": { books: ["atomic", "ux"], cover: "https://placehold.co/300x450/629BC1/FFFFFF?text=我的最愛" },
    "工作必讀": { books: ["design"], cover: "https://placehold.co/300x450/F59E0B/FFFFFF?text=工作必讀" },
};

function getBookCount(collectionName) {
    return collectionsData[collectionName]?.books.length || 0;
}

// --- HTML FACTORY ---
function createCollectionCardHTML(title, bookCount, cover) {
    return `
    <div class="playlist-item bg-secondary rounded-xl shadow-sm overflow-hidden flex flex-col border border-border-color hover:shadow-lg transition-all group relative cursor-pointer" data-collection-name="${title}">
        <div class="relative overflow-hidden aspect-[2/3]">
            <img src="${cover}" alt="${title} Playlist Cover" class="w-full h-full object-cover transition-transform duration-500">
        </div>
        <div class="p-4 flex-1 flex flex-col relative">
            <div class="flex justify-between items-start mb-1">
                <h3 class="playlist-name font-bold text-text-primary truncate flex-1 pr-2">${title}</h3>
                <button class="p-1.5 rounded-full hover:bg-gray-100 text-text-secondary hover:text-text-primary collection-menu-btn -mt-1 -mr-1">
                    <i data-lucide="more-horizontal" class="w-5 h-5"></i>
                </button>
            </div>
            <p class="text-sm text-text-secondary">${bookCount} 本書</p>
        </div>
    </div>`;
}

// --- RENDER ---
const COLLECTIONS_PER_PAGE = 18;
let collectionsCurrentPage = 1;

function renderCollections() {
    const playlistList = document.getElementById('playlist-list');
    if (!playlistList) return;

    // Clear existing collections, but keep the "add" button
    const addBtn = document.getElementById('add-playlist-card-btn');
    playlistList.innerHTML = '';
    playlistList.appendChild(addBtn);

    const allTitles = Object.keys(collectionsData);
    const totalPages = Math.max(1, Math.ceil(allTitles.length / COLLECTIONS_PER_PAGE));
    if (collectionsCurrentPage > totalPages) collectionsCurrentPage = totalPages;

    const start = (collectionsCurrentPage - 1) * COLLECTIONS_PER_PAGE;
    const pageTitles = allTitles.slice(start, start + COLLECTIONS_PER_PAGE);

    for (const title of pageTitles) {
        const collection = collectionsData[title];
        const cardHTML = createCollectionCardHTML(title, collection.books.length, collection.cover);
        addBtn.insertAdjacentHTML('afterend', cardHTML);
    }

    // 渲染分頁列
    renderPagination('collections-pagination', totalPages, collectionsCurrentPage);
    if (window.lucide) window.lucide.createIcons();
}

// --- DATA MANAGEMENT ---
export function getCollections() {
    return collectionsData;
}

export function addCollection(title) {
    if (!collectionsData[title]) {
        collectionsData[title] = { books: [], cover: `https://placehold.co/300x450/8A9EAD/FFFFFF?text=${encodeURIComponent(title)}` };
        renderCollections();
        return true;
    }
    return false;
}

export function renameCollection(oldTitle, newTitle) {
    if (oldTitle !== newTitle && !collectionsData[newTitle]) {
        collectionsData[newTitle] = collectionsData[oldTitle];
        delete collectionsData[oldTitle];
        renderCollections();
        return true;
    }
    return false;
}

export function deleteCollection(title) {
    if (collectionsData[title]) {
        delete collectionsData[title];
        renderCollections();
        return true;
    }
    return false;
}

// Returns true if state changed
export function toggleBookInCollection(title, bookId, shouldBeIn) {
    const collection = collectionsData[title];
    if (!collection) return false;

    const index = collection.books.indexOf(bookId);
    const isIn = index > -1;

    if (shouldBeIn && !isIn) {
        collection.books.push(bookId);
        renderCollections();
        return true;
    } else if (!shouldBeIn && isIn) {
        collection.books.splice(index, 1);
        renderCollections();
        return true;
    }
    return false;
}

export function removeBookFromCollection(title, bookId) {
    return toggleBookInCollection(title, bookId, false);
}

// --- INITIALIZATION ---
function initCollectionsFeature() {
    const addPlaylistBtn = document.getElementById('add-playlist-card-btn');
    const playlistList = document.getElementById('playlist-list');
    const saveCollectionBtn = document.getElementById('save-collection-btn');
    const collectionNameInput = document.getElementById('collection-name-input');

    // Initial Render
    renderCollections();

    // 初始化自訂書單分頁點擊事件
    initPagination('collections-pagination', (page) => {
        collectionsCurrentPage = page;
        renderCollections();
        document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Edit Modal Elements
    const editModalId = 'edit-collection-modal';
    const editNameInput = document.getElementById('edit-collection-name-input');
    const saveEditBtn = document.getElementById('save-edit-collection-btn');
    const deleteCollectionBtn = document.getElementById('delete-collection-btn');
    let currentEditingCollection = null;

    if (addPlaylistBtn && playlistList) {
        addPlaylistBtn.addEventListener('click', () => {
            collectionNameInput.value = '';
            openModal('add-collection-modal');
            collectionNameInput.focus();
        });

        playlistList.addEventListener('click', (e) => {
            const target = e.target;
            const playlistItem = target.closest('.playlist-item');

            // Handle Menu Button Click
            if (target.closest('.collection-menu-btn')) {
                e.preventDefault();
                e.stopPropagation();

                if (!playlistItem) return;
                const title = playlistItem.dataset.collectionName;
                currentEditingCollection = title;

                if (editNameInput) {
                    editNameInput.value = title;
                    openModal(editModalId);
                }
                return;
            }

            if (playlistItem && !playlistItem.id.includes('add-playlist')) {
                const title = playlistItem.dataset.collectionName;
                renderBookshelfDetails(title);
            }
        });
    }

    // Edit Modal Actions
    if (saveEditBtn && editNameInput) {
        saveEditBtn.addEventListener('click', () => {
            const newTitle = editNameInput.value.trim();
            if (currentEditingCollection && newTitle && newTitle !== currentEditingCollection) {
                if (renameCollection(currentEditingCollection, newTitle)) {
                    closeModal(editModalId);
                    currentEditingCollection = null;
                } else {
                    alert('名稱重複或無效！');
                }
            } else if (newTitle === currentEditingCollection) {
                closeModal(editModalId);
            }
        });
    }

    if (deleteCollectionBtn) {
        deleteCollectionBtn.addEventListener('click', () => {
            if (currentEditingCollection) {
                if (confirm(`確定要刪除「${currentEditingCollection}」嗎？此動作無法復原。`)) {
                    deleteCollection(currentEditingCollection);
                    closeModal(editModalId);
                    currentEditingCollection = null;
                }
            }
        });
    }

    if (saveCollectionBtn && collectionNameInput) {
        const saveAction = () => {
            const playlistName = collectionNameInput.value.trim();
            if (playlistName) {
                if (addCollection(playlistName)) {
                    closeModal('add-collection-modal');
                } else {
                    alert('書單名稱已存在！');
                }
            }
        };

        saveCollectionBtn.addEventListener('click', saveAction);
        collectionNameInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') saveAction();
        });
    }
}

export { initCollectionsFeature };
