import { initRouter } from './router.js';
import { initUtils } from './utils.js';
import { initStoreFeature } from './features/store.js';
import { initBookshelfFeature } from './features/bookshelf.js';
import { initBookmarkFeature } from './features/bookmark.js';

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

    console.log("App initialized successfully with module architecture.");
});