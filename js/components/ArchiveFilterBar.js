/**
 * Archive Filter Bar Component
 * 封存區專用的篩選列
 */

export function createArchiveFilterBarHTML(prefix = 'archive-') {
    return `
    <div id="${prefix}filter-bar" class="flex items-center gap-3 mb-6 overflow-x-auto no-scrollbar w-full pb-2">
        <!-- Archive Type Filter -->
        <div class="flex-shrink-0">
            <!-- Desktop -->
            <div class="hidden md:flex items-center space-x-2 bg-transparent p-0">
                <span class="text-sm font-medium text-text-secondary whitespace-nowrap">類型:</span>
                <select id="${prefix}type-filter"
                    class="bg-white border border-border-color rounded-lg pl-2 pr-8 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer hover:text-accent transition-colors">
                    <option value="all">全部</option>
                    <option value="expired">已過期</option>
                    <option value="archived">已封存</option>
                </select>
            </div>
            <!-- Mobile -->
            <button id="${prefix}mobile-type-btn" 
                class="md:hidden flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-sm text-text-secondary border border-gray-200 whitespace-nowrap shadow-sm"
                data-filter-type="archive-type">
                <span>類型:</span> <span id="${prefix}mobile-type-label" class="font-bold text-text-primary">全部</span>
                <i data-lucide="chevron-down" class="w-3 h-3 ml-1"></i>
            </button>
        </div>

        <div class="flex-1"></div>

        <!-- View Toggle -->
        <div class="flex bg-gray-100 p-1 rounded-lg">
            <button id="${prefix}grid-view-btn" class="view-btn active"><i data-lucide="layout-grid"
                    class="w-5 h-5"></i></button>
            <button id="${prefix}list-view-btn" class="view-btn"><i data-lucide="list"
                    class="w-5 h-5"></i></button>
        </div>
    </div>
    `;
}

/**
 * Initialize Archive Filter Bar logic
 * @param {Object} options - Configuration options
 * @param {string} options.prefix - ID prefix for elements
 * @param {Function} options.onFilterChange - Callback when filter changes, receives filter value
 * @param {Function} options.onViewChange - Callback when view changes, receives 'grid' or 'list'
 */
export function initArchiveFilterBar(options = {}) {
    const prefix = options.prefix || 'archive-';
    const onFilterChange = options.onFilterChange || (() => { });
    const onViewChange = options.onViewChange || (() => { });

    // Desktop Filter
    const typeSelect = document.getElementById(`${prefix}type-filter`);
    if (typeSelect) {
        typeSelect.addEventListener('change', (e) => {
            onFilterChange(e.target.value);
        });
    }

    // Mobile Filter Button
    const mobileTypeBtn = document.getElementById(`${prefix}mobile-type-btn`);
    if (mobileTypeBtn) {
        mobileTypeBtn.addEventListener('click', () => {
            const select = document.getElementById(`${prefix}type-filter`);
            const currentVal = select ? select.value : 'all';
            const options = [
                { label: '全部', value: 'all' },
                { label: '已過期', value: 'expired' },
                { label: '已封存', value: 'archived' }
            ];

            openArchiveFilterSheet('類型', options, (val) => {
                if (select) {
                    select.value = val;
                    select.dispatchEvent(new Event('change'));
                    const label = document.getElementById(`${prefix}mobile-type-label`);
                    const selectedOpt = options.find(o => o.value === val);
                    if (label && selectedOpt) label.textContent = selectedOpt.label;
                }
            }, currentVal);
        });
    }

    // View Toggle
    const gridBtn = document.getElementById(`${prefix}grid-view-btn`);
    const listBtn = document.getElementById(`${prefix}list-view-btn`);

    if (gridBtn && listBtn) {
        gridBtn.addEventListener('click', () => {
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
            onViewChange('grid');
        });

        listBtn.addEventListener('click', () => {
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
            onViewChange('list');
        });
    }
}

/**
 * Helper: Open bottom sheet for mobile filter selection
 * Uses the existing mobile-filter-sheet modal
 */
function openArchiveFilterSheet(title, options, onSelect, currentValue) {
    // Reuse the global mobile-filter-sheet defined in Modals.js
    const sheet = document.getElementById('mobile-filter-sheet');
    const sheetTitle = document.getElementById('mobile-sheet-title');
    const sheetOptions = document.getElementById('mobile-sheet-options');

    if (!sheet || !sheetTitle || !sheetOptions) return;

    sheetTitle.textContent = title;
    sheetOptions.innerHTML = '';

    options.forEach(opt => {
        const btn = document.createElement('button');
        const isSelected = opt.value === currentValue;

        btn.className = `w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${isSelected ? 'bg-accent/10 text-accent font-bold' : 'text-text-primary hover:bg-gray-50'}`;
        btn.innerHTML = `<span>${opt.label}</span>${isSelected ? '<i data-lucide="check" class="w-4 h-4"></i>' : ''}`;

        btn.onclick = () => {
            onSelect(opt.value);
            // Import dynamically to avoid circular dependency
            import('../utils.js').then(({ closeModal }) => {
                closeModal('mobile-filter-sheet');
            });
        };
        sheetOptions.appendChild(btn);
    });

    if (window.lucide) window.lucide.createIcons();

    // Import dynamically to avoid circular dependency
    import('../utils.js').then(({ openModal }) => {
        openModal('mobile-filter-sheet');
    });
}

/**
 * Helper functions for filtering archived books
 */

/**
 * Check if a book is expired (textbook with past expiry date)
 * @param {Object} book - Book object
 * @returns {boolean}
 */
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

/**
 * Check if a book is manually archived
 * @param {Object} book - Book object
 * @returns {boolean}
 */
export function isBookManuallyArchived(book) {
    return book.isArchived === true;
}

/**
 * Filter archived books by type
 * @param {Array} books - Array of book objects
 * @param {string} filterType - 'all', 'expired', or 'archived'
 * @returns {Array} Filtered books
 */
export function filterArchivedBooks(books, filterType = 'all') {
    // First, filter only truly archived books (either expired or manually archived)
    const archivedBooks = books.filter(book => {
        return isBookExpired(book) || isBookManuallyArchived(book);
    });

    if (filterType === 'all') {
        return archivedBooks;
    } else if (filterType === 'expired') {
        return archivedBooks.filter(book => isBookExpired(book));
    } else if (filterType === 'archived') {
        return archivedBooks.filter(book => isBookManuallyArchived(book));
    }

    return archivedBooks;
}
