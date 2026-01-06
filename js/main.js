import { initRouter } from './router.js';
import { initUtils } from './utils.js';
import { initStoreFeature } from './features/store.js';
import { initBookshelfFeature, initFilterBar, createBookCardHTML, createBookListItemHTML, setupFilterLogic, showBookDetails, openShelfModalForBook, isBookArchived } from './features/bookshelf.js';
import { BOOKS_DATA } from './data/books.js';
import { initBookmarkFeature } from './features/bookmark.js';
import { initReadingGoal } from './features/readingGoal.js';
import { initCollectionsFeature, getCollections, renameCollection, deleteCollection, removeBookFromCollection } from './features/collections.js';

// Components
import { createHeaderHTML, initHeaderEvents } from './components/Header.js';
import { createMobileNavHTML } from './components/MobileNav.js';
import { createModalsHTML } from './components/Modals.js';

// Views
import { createHomepageHTML } from './views/Homepage.js';
import { createBookshelfHTML } from './views/Bookshelf.js';
import { createBookmarkHTML } from './views/Bookmark.js';
import { createBookDetailsHTML } from './views/BookDetails.js';

let activeCollectionTitle = '';
let detailsFilterLogic;

function initDetailsView() {
    const dataSource = () => {
        if (!activeCollectionTitle) return [];
        const collections = getCollections();
        const collection = collections[activeCollectionTitle];
        if (!collection) return [];
        return BOOKS_DATA.filter(book => collection.books.includes(book.id) && !isBookArchived(book));
    };

    const render = (books) => {
        const bookGrid = document.getElementById('bookshelf-books-grid');
        const bookList = document.getElementById('bookshelf-books-list');

        if (books.length > 0) {
            if (bookGrid) {
                // Unified button for all views (Add/Manage)
                bookGrid.innerHTML = books.map(book => createBookCardHTML(book)).join('');
            }
            if (bookList) {
                bookList.innerHTML = books.map(book => createBookListItemHTML(book)).join('');
            }
        } else {
            if (bookGrid) bookGrid.innerHTML = `<p class="text-text-secondary col-span-full">此書單目前沒有書籍。</p>`;
            if (bookList) bookList.innerHTML = `<p class="text-text-secondary">此書單目前沒有書籍。</p>`;
        }

        if (window.lucide) window.lucide.createIcons();
    };

    detailsFilterLogic = setupFilterLogic({
        containerId: 'view-bookshelf-details',
        dataSource: dataSource,
        render: render
    });

    // Listen for global collection updates to refresh view
    document.addEventListener('collection-updated', () => {
        if (!document.getElementById('view-bookshelf-details').classList.contains('hidden')) {
            if (detailsFilterLogic) detailsFilterLogic.triggerFilter();
        }
    });

    initFilterBar('details-', 'bookshelf-books-grid', 'bookshelf-books-list', (sortType) => {
        if (detailsFilterLogic) detailsFilterLogic.handleSort(sortType);
    });

    // Event Delegation for Details View (Grid Click)
    const grid = document.getElementById('bookshelf-books-grid');
    if (grid) {
        grid.addEventListener('click', (e) => {
            if (document.body.classList.contains('batch-mode-active')) return;
            const target = e.target;
            const card = target.closest('.book-item');
            if (!card) return;
            const bookId = card.dataset.bookId;

            // 1. Manage Shelf (Unified)
            if (target.closest('.shelf-btn')) {
                e.stopPropagation();
                openShelfModalForBook(bookId);
                return;
            }

            // 2. Show Details (Menu Btn)
            if (target.closest('.info-btn')) {
                e.stopPropagation();
                showBookDetails(bookId);
                return;
            }

            // 3. Open Viewer
            const isMobile = window.innerWidth < 768;

            if (target.closest('.read-btn')) {
                console.log(`[Viewer Prototype] Opening book ${bookId}...`);
                alert(`[Viewer Prototype]\n正在開啟閱讀器：${bookId}`);
                return;
            }

            // 只要不是上面的按鈕 (shelf-btn handled below or ignored for now)
            if (!target.closest('.batch-checkbox') && !target.closest('.info-btn') && !target.closest('.shelf-btn') && !target.closest('.read-btn')) {
                if (isMobile) {
                    console.log(`[Viewer Prototype] Opening book ${bookId}...`);
                    alert(`[Viewer Prototype]\n正在開啟閱讀器：${bookId}`);
                }
            }
        });
    }
}

export function renderBookshelfDetails(title) {
    activeCollectionTitle = title;
    let currentTitle = title;

    // 1. Switch view
    document.getElementById('view-books').classList.add('hidden');
    const bookshelfDetailsView = document.getElementById('view-bookshelf-details');
    bookshelfDetailsView.classList.remove('hidden');

    const headerEl = document.getElementById('bookshelf-header');

    // Function to set up the initial display state
    const setupDisplayState = (displayTitle) => {
        currentTitle = displayTitle;
        // Use flex layout to position items
        headerEl.className = 'flex items-center justify-between w-full';
        headerEl.innerHTML = `
            <div class="flex items-center gap-2">
                <button id="back-from-details-btn" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <i data-lucide="arrow-left" class="w-5 h-5 text-gray-600"></i>
                </button>
                <h1 id="bookshelf-title" class="text-2xl md:text-3xl font-bold text-text-primary">${displayTitle}</h1>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    };

    // 3. Set initial content and render books
    setupDisplayState(currentTitle);

    // Initialize Batch/Filter Bar for Details View
    // logic: filter, sort, and batch actions need to be bound to 'details-' elements
    // We reuse the same logic callback structure as main view, but context is different (scoped by active collection title via filter logic)

    // Ensure filter logic is active for details
    if (detailsFilterLogic) {
        detailsFilterLogic.triggerFilter();
    }

    // 4. Use event delegation for actions (reuse existing listener logic or simple re-attach)
    // The previous implementation used event delegation on headerEl. Since headerEl is permanent in the view (it is just rewritten innerHTML), we can attach listener once in initDetailsView?
    // BUT headerEl is re-rendered by setupDisplayState.
    // Let's keep the logic here for simplicity, but we need to ensure we don't duplicate listeners if renderBookshelfDetails is called multiple times.
    // Actually, headerEl is part of the View which is created ONCE in main.js.
    // So 'document.getElementById('bookshelf-header')' returns the same element always.
    // If we attach 'click' listener to it here, we add a NEW listener every time we open details. This is bad (memory leak / multiple triggers).

    // BETTER APPROACH: Move event delegation to initDetailsView!
    // But setupDisplayState is local here.
    // Let's allow delegation in initDetailsView to handle standard actions, and pass callbacks?
    // Or just check if listener is attached?
    // Simplest fix: define the handler outside and remove/add, or use a flag.
    // Or better: The actions (back, save, delete) depend on 'currentTitle' closure.
    // We can attach the listener to the view container `#view-bookshelf-details` ONCE in initDetailsView, and handle events bubbling up.

    // For now, I will keep it simple and maybe slightly "leaky" or use a cleaner named function to remove listener if I could.
    // Actually, I can clear listeners by cloning node? No that breaks references.
    // Let's move the event listener to initDetailsView and use a module-level variable for current details context if needed, OR just look at the DOM input value.
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

function initGlobalListeners(headerEl) {
    // Moved from renderBookshelfDetails to avoid duplicate listeners
    const container = document.getElementById('view-bookshelf-details');

    container.addEventListener('click', (e) => {
        const saveBtn = e.target.closest('#save-bookshelf-btn');
        const deleteBtn = e.target.closest('#delete-bookshelf-btn');
        const cancelBtn = e.target.closest('#cancel-edit-btn');
        const backBtn = e.target.closest('#back-from-details-btn');

        // We need currentTitle. It is stored in activeCollectionTitle module var.

        if (backBtn) {
            document.getElementById('view-bookshelf-details').classList.add('hidden');
            document.getElementById('view-books').classList.remove('hidden');
            const tabBtn = document.querySelector('.tab-btn[data-tab-target="collections"]');
            if (tabBtn) tabBtn.click();
            return;
        }

        if (cancelBtn) {
            // We need to re-render header in display mode.
            // renderBookshelfDetails(activeCollectionTitle) acts like setupDisplayState essentially.
            renderBookshelfDetails(activeCollectionTitle);
            return;
        }

        if (saveBtn) {
            const input = document.getElementById('bookshelf-title-input');
            if (!input) return;
            const newTitle = input.value.trim();
            if (newTitle && newTitle !== activeCollectionTitle) {
                if (renameCollection(activeCollectionTitle, newTitle)) {
                    renderBookshelfDetails(newTitle); // This updates activeCollectionTitle
                } else {
                    alert('書單名稱已存在或無效。');
                }
            } else {
                renderBookshelfDetails(activeCollectionTitle);
            }
        }

        if (deleteBtn) {
            if (confirm(`確定要刪除「${activeCollectionTitle}」書單嗎？此操作無法復原。`)) {
                deleteCollection(activeCollectionTitle);
                document.getElementById('view-bookshelf-details').classList.add('hidden');
                document.getElementById('view-books').classList.remove('hidden');
                const tabBtn = document.querySelector('.tab-btn[data-tab-target="collections"]');
                if (tabBtn) tabBtn.click();
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    if (!app) {
        console.error("App container not found!");
        return;
    }

    // 1. Initial Layout Rendering
    app.innerHTML = `
        ${createHeaderHTML()}
        ${createMobileNavHTML()}
        <main id="main-content" class="flex-1 overflow-y-auto bg-primary p-4 pt-20 pb-24 md:p-8 md:pt-8 md:pb-8 scroll-smooth w-full max-w-[1600px] mx-auto h-screen">
            ${createHomepageHTML()}
            ${createBookshelfHTML()}
            ${createBookmarkHTML()}
            ${createBookDetailsHTML()}
        </main>
        ${createModalsHTML()}
    `;

    // 2. Initialize Shared Utilities (Modals, Accordions)
    initUtils();

    // Initialize Header Events
    initHeaderEvents();

    // 3. Initialize Router (View Switching)
    initRouter();

    // 4. Initialize Features
    // Note: These must run AFTER HTML injection
    if (window.lucide) {
        window.lucide.createIcons();
    }

    initStoreFeature();
    initBookshelfFeature();
    initBookmarkFeature();
    initHomepageSlider();
    initReadingGoal();
    initCollectionsFeature();
    initDetailsView();
    initGlobalListeners(); // Attach the delegating listener for details view

    // Fix: Router expects 'view-section' classes to handle switching. 
    // They are included in component HTMLs.

    console.log("App initialized successfully with module architecture.");
});