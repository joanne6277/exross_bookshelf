import { initRouter } from './router.js';
import { initUtils } from './utils.js';
import { initStoreFeature } from './features/store.js';
import { initBookshelfFeature } from './features/bookshelf.js';
import { initBookmarkFeature } from './features/bookmark.js';
import { initReadingGoal } from './features/readingGoal.js';

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

    console.log("App initialized successfully with module architecture.");
});