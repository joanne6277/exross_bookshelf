import { createFilterBarHTML } from '../components/FilterBar.js';
import { bookshelfFilterConfig } from './Bookshelf.js';

export function createBookDetailsHTML() {
    return `
    <div id="view-bookshelf-details" class="view-section hidden">
        <div class="flex items-center justify-between mb-6">
            <div id="bookshelf-header" class="flex items-center gap-4">
                <h1 id="bookshelf-title" class="text-3xl font-bold text-text-primary"></h1>
                <!-- Icons will be injected here -->
            </div>
        </div>
        <div id="bookshelf-details-filter-bar"
            class="flex items-center gap-3 mb-4 md:mb-8 overflow-x-auto no-scrollbar w-full pb-2">
             ${createFilterBarHTML({ ...bookshelfFilterConfig, prefix: 'details-' })}
        </div>
        <div id="bookshelf-books-grid"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-8">
            <!-- Book cards will be injected here -->
        </div>
        <div id="bookshelf-books-list" class="hidden space-y-4">
            <!-- Book list items will be injected here -->
        </div>

        <!-- Batch Action Bar -->
        <div id="details-batch-action-bar"
            class="hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl p-4 z-50">
            <div
                class="bg-white rounded-xl shadow-2xl border border-gray-100 flex items-center justify-between p-4">
                <div class="flex items-center gap-4">
                    <button id="details-batch-select-all-btn" class="text-accent font-bold text-sm hover:underline">全選</button>
                    <span id="details-selected-count" class="text-sm font-bold">已選取 0 本書</span>
                </div>
                <div class="flex gap-4">
                    <button id="details-batch-add-to-playlist-btn"
                        class="px-4 py-2 bg-blue-100 text-black text-sm font-bold rounded-lg hover:bg-opacity-90">新增到自訂書單</button>
                    <button id="details-batch-archive-btn"
                        class="px-4 py-2 bg-gray-200 text-text-primary text-sm font-bold rounded-lg hover:bg-gray-300">移至封存區</button>
                </div>
            </div>
        </div>
    </div>
    `;
}
