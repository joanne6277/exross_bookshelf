import { openModal, closeModal } from '../utils.js';
import { renderBookshelfDetails } from '../main.js';

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
            <h3 class="playlist-name font-bold text-text-primary truncate mb-1">${title}</h3>
            <p class="text-sm text-text-secondary">${bookCount} 本書</p>
        </div>
    </div>`;
}

// --- RENDER ---
function renderCollections() {
    const playlistList = document.getElementById('playlist-list');
    if (!playlistList) return;

    // Clear existing collections, but keep the "add" button
    const addBtn = document.getElementById('add-playlist-card-btn');
    playlistList.innerHTML = '';
    playlistList.appendChild(addBtn);

    for (const title in collectionsData) {
        const collection = collectionsData[title];
        const cardHTML = createCollectionCardHTML(title, collection.books.length, collection.cover);
        addBtn.insertAdjacentHTML('afterend', cardHTML);
    }
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

// --- INITIALIZATION ---
function initCollectionsFeature() {
    const addPlaylistBtn = document.getElementById('add-playlist-card-btn');
    const playlistList = document.getElementById('playlist-list');
    const saveCollectionBtn = document.getElementById('save-collection-btn');
    const collectionNameInput = document.getElementById('collection-name-input');
    
    // Initial Render
    renderCollections();

    if (addPlaylistBtn && playlistList) {
        addPlaylistBtn.addEventListener('click', () => {
            collectionNameInput.value = '';
            openModal('add-collection-modal');
            collectionNameInput.focus();
        });

        playlistList.addEventListener('click', (e) => {
            const playlistItem = e.target.closest('.playlist-item');
            if (playlistItem && !playlistItem.id.includes('add-playlist')) {
                const title = playlistItem.dataset.collectionName;
                renderBookshelfDetails(title);
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
