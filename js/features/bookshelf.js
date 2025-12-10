import { openModal } from '../utils.js';

export function initBookshelfFeature() {
    // 1. Tab Switching
    const tabs = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab-target');
            // Hide all
            panels.forEach(p => p.classList.add('hidden'));
            tabs.forEach(t => t.classList.remove('tab-active'));
            // Show target
            document.getElementById(targetId)?.classList.remove('hidden');
            tab.classList.add('tab-active');
        });
    });

    // 2. View Mode (Grid/List)
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');
    const gridView = document.getElementById('all-books-grid');
    const listView = document.getElementById('all-books-list');
    
    // Also for collections
    const colGridView = document.getElementById('collections-grid');
    const colListView = document.getElementById('collections-list');

    if (gridBtn && listBtn) {
        gridBtn.addEventListener('click', () => {
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
            if(gridView) gridView.classList.remove('hidden');
            if(listView) listView.classList.add('hidden');
            if(colGridView) colGridView.classList.remove('hidden');
            if(colListView) colListView.classList.add('hidden');
        });

        listBtn.addEventListener('click', () => {
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
            if(gridView) gridView.classList.add('hidden');
            if(listView) listView.classList.remove('hidden');
            if(colGridView) colGridView.classList.add('hidden');
            if(colListView) colListView.classList.remove('hidden');
        });
    }

    // 3. Batch Selection
    const batchBtn = document.getElementById('batch-select-btn');
    const batchBar = document.getElementById('batch-action-bar');
    const countSpan = document.getElementById('selected-count');
    const allBooksContainer = document.getElementById('all-books');
    let isBatchMode = false;
    let selectedBooks = [];

    if (batchBtn && allBooksContainer) {
        batchBtn.addEventListener('click', () => {
            isBatchMode = !isBatchMode;
            batchBar.classList.toggle('hidden');
            
            // Toggle visual state on books
            const items = document.querySelectorAll('.book-item');
            items.forEach(item => {
                const cb = item.querySelector('.batch-checkbox');
                if(cb) cb.classList.toggle('hidden');
                item.classList.toggle('group'); // Disable hover effect in batch mode
            });

            if (isBatchMode) {
                batchBtn.textContent = '完成';
                batchBtn.classList.replace('bg-blue-500', 'bg-gray-500');
            } else {
                batchBtn.textContent = '批次選取';
                batchBtn.classList.replace('bg-gray-500', 'bg-blue-500');
                // Reset selection
                selectedBooks = [];
                items.forEach(item => {
                    const cb = item.querySelector('input[type="checkbox"]');
                    if(cb) cb.checked = false;
                    item.classList.remove('ring-2', 'ring-accent', 'ring-offset-2');
                });
                updateCount();
            }
        });

        allBooksContainer.addEventListener('click', (e) => {
            if (!isBatchMode) return;
            const item = e.target.closest('.book-item');
            if (!item) return;

            const checkbox = item.querySelector('input[type="checkbox"]');
            if (checkbox) {
                // Toggle check if clicked outside checkbox itself
                if (e.target !== checkbox) checkbox.checked = !checkbox.checked;

                if (checkbox.checked) {
                    selectedBooks.push(item);
                    item.classList.add('ring-2', 'ring-accent', 'ring-offset-2');
                } else {
                    selectedBooks = selectedBooks.filter(i => i !== item);
                    item.classList.remove('ring-2', 'ring-accent', 'ring-offset-2');
                }
                updateCount();
            }
        });
    }

    function updateCount() {
        if(countSpan) countSpan.textContent = `已選取 ${selectedBooks.length} 本書`;
    }

    // Batch Action Handlers
    document.getElementById('batch-add-to-playlist-btn')?.addEventListener('click', () => {
        if (selectedBooks.length > 0) openModal('add-shelf-modal');
        else alert('請先選取書籍');
    });

    // 4. Sort Dropdown
    initSortDropdown();
}

function initSortDropdown() {
    const btn = document.getElementById('sort-menu-btn');
    const dropdown = document.getElementById('sort-dropdown');
    const label = document.getElementById('sort-menu-label');

    if (btn && dropdown) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        });

        window.addEventListener('click', (e) => {
            if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });

        dropdown.querySelectorAll('button').forEach(opt => {
            opt.addEventListener('click', () => {
                label.textContent = '排序: ' + opt.textContent;
                dropdown.classList.add('hidden');
            });
        });
    }
}