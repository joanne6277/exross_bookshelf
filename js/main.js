import { initRouter } from './router.js';
import { initUtils } from './utils.js';
import { initStoreFeature } from './features/store.js';
import { initBookshelfFeature, BOOKS_DATA, createBookCardHTML } from './features/bookshelf.js';
import { initBookmarkFeature } from './features/bookmark.js';
import { initReadingGoal } from './features/readingGoal.js';
import { initCollectionsFeature, getCollections, renameCollection, deleteCollection } from './features/collections.js';

export function renderBookshelfDetails(title) {
    let currentTitle = title;

    // 1. Switch view
    document.getElementById('view-books').classList.add('hidden');
    const bookshelfDetailsView = document.getElementById('view-bookshelf-details');
    bookshelfDetailsView.classList.remove('hidden');

    const headerEl = document.getElementById('bookshelf-header');
    
    // Function to set up the initial display state
    const setupDisplayState = (displayTitle) => {
        currentTitle = displayTitle;
        headerEl.innerHTML = `
            <h1 id="bookshelf-title" class="text-3xl font-bold text-text-primary">${displayTitle}</h1>
            <button id="edit-bookshelf-btn" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <i data-lucide="settings-2" class="w-5 h-5 text-gray-600"></i>
            </button>
        `;
        if (window.lucide) window.lucide.createIcons();
        
        document.getElementById('edit-bookshelf-btn').addEventListener('click', () => {
            setupEditState(currentTitle);
        });
    };

    // Function to set up the editing state
    const setupEditState = (titleToEdit) => {
        headerEl.innerHTML = `
            <input type="text" id="bookshelf-title-input" class="text-3xl font-bold text-text-primary bg-transparent border-b-2 border-accent focus:outline-none" value="${titleToEdit}">
            <button id="save-bookshelf-btn" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <i data-lucide="check" class="w-5 h-5 text-green-600"></i>
            </button>
            <button id="delete-bookshelf-btn" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <i data-lucide="trash-2" class="w-5 h-5 text-red-600"></i>
            </button>
        `;
        if (window.lucide) window.lucide.createIcons();
        document.getElementById('bookshelf-title-input').focus();
    };

    // 2. Render books for the collection
    const renderBooks = () => {
        const collections = getCollections();
        const bookGrid = document.getElementById('bookshelf-books-grid');
        const bookIds = collections[currentTitle]?.books || [];
        
        if (bookIds.length > 0) {
            const booksToRender = BOOKS_DATA.filter(book => bookIds.includes(book.id));
            bookGrid.innerHTML = booksToRender.map(createBookCardHTML).join('');
        } else {
            bookGrid.innerHTML = `<p class="text-text-secondary col-span-full">此書單沒有書籍。</p>`;
        }
    };
    
    // 3. Set initial content and render books
    setupDisplayState(currentTitle);
    renderBooks();

    // 4. Use event delegation for save/delete actions
    headerEl.addEventListener('click', (e) => {
        const saveBtn = e.target.closest('#save-bookshelf-btn');
        const deleteBtn = e.target.closest('#delete-bookshelf-btn');

        if (saveBtn) {
            const newTitle = document.getElementById('bookshelf-title-input').value.trim();
            if (newTitle && newTitle !== currentTitle) {
                if (renameCollection(currentTitle, newTitle)) {
                    setupDisplayState(newTitle);
                } else {
                    alert('書單名稱已存在或無效。');
                }
            } else {
                setupDisplayState(currentTitle); // Revert if title is empty or unchanged
            }
        }

        if (deleteBtn) {
            if (confirm(`確定要刪除「${currentTitle}」書單嗎？此操作無法復原。`)) {
                deleteCollection(currentTitle);
                
                // Switch back to the collections view
                bookshelfDetailsView.classList.add('hidden');
                document.getElementById('view-books').classList.remove('hidden');
                document.querySelector('.tab-btn[data-tab-target="collections"]').click();
            }
        }
    });
}

function initHomepageSlider() {
    const activityCarousel = new Swiper('.activity-carousel', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 16,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 24,
            },
        },
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Initialize Shared Utilities (Modals, Accordions)
    initUtils();

    // 3. Initialize Router (View Switching)
    initRouter();

    // 4. Initialize Features
    initStoreFeature();
    initBookshelfFeature();
    initBookmarkFeature();
    initHomepageSlider();
    initReadingGoal();
    initCollectionsFeature();

    console.log("App initialized successfully with module architecture.");
});