import { openModal, closeModal } from '../utils.js';

/**
 * FilterBar.js - 模組化通用篩選列
 */

export function createFilterBarHTML(config) {
    const {
        prefix = '',
        batchSelect = false,
        filters = [],
        sort = null,
        viewToggle = false,
        extraMobileButtons = [],
        containerClass = 'flex items-center gap-3 mb-4 md:mb-8 overflow-x-auto no-scrollbar w-full pb-2'
    } = config;

    let html = `<div id="${prefix}filter-bar" class="${containerClass}">`;

    if (batchSelect) {
        html += `<button id="${prefix}batch-select-btn" class="hidden md:block flex-shrink-0 px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors">批次選取</button>`;
        html += `<button id="${prefix}batch-select-btn-mobile" class="md:hidden flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors">
                    <i data-lucide="check-square" class="w-3.5 h-3.5"></i> 批次
                 </button>`;
    }

    filters.forEach((filter, index) => {
        const needsDivider = index > 0;
        const dividerClass = needsDivider ? 'md:border-l md:border-border-color md:pl-4' : '';
        html += `<div class="flex-shrink-0 ${dividerClass}">`;

        if (filter.type === 'select') {
            html += `
            <div class="hidden md:flex items-center space-x-2 bg-transparent p-0">
                <span class="text-sm font-medium text-text-secondary whitespace-nowrap">${filter.label}:</span>
                <select id="${prefix}${filter.id}-filter" class="generic-filter-select bg-white border border-border-color rounded-lg pl-2 pr-8 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer hover:text-accent transition-colors" data-filter-id="${filter.id}">
                    ${filter.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
                </select>
            </div>`;
        } else if (filter.type === 'buttons') {
            html += `
            <div class="hidden md:flex items-center gap-1 rounded-lg bg-gray-100 p-1">
                ${filter.options.map(opt => `<button class="generic-filter-btn px-3 py-1.5 text-sm font-medium rounded-md transition-all ${opt.active ? 'bg-white shadow-sm text-text-primary' : 'text-text-secondary hover:text-text-primary'}" data-filter-id="${filter.id}" data-value="${opt.value}">${opt.label}</button>`).join('')}
            </div>`;
        } else if (filter.type === 'custom') {
            if (filter.customHTML) {
                html += `
                <div class="hidden md:block">
                    ${filter.customHTML}
                </div>`;
            }
            if (filter.mobileCustomHTML) {
                html += `
                <div class="md:hidden flex items-center">
                    ${filter.mobileCustomHTML}
                </div>`;
            }
        }

        if (!filter.hideOnMobile && filter.type !== 'custom') {
            html += `
            <button id="${prefix}mobile-${filter.id}-btn" 
                class="md:hidden flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-sm text-text-secondary border border-gray-200 whitespace-nowrap shadow-sm mobile-filter-trigger"
                data-filter-id="${filter.id}">
                <span>${filter.label}:</span> <span id="${prefix}mobile-${filter.id}-label" class="font-bold text-text-primary">${(filter.options && filter.options[0]) ? filter.options[0].label : '全部'}</span>
                <i data-lucide="chevron-down" class="w-3 h-3 ml-1"></i>
            </button>`;
        }

        html += `</div>`;
    });

    if (sort) {
        const dividerClass = filters.length > 0 ? 'md:border-l md:border-border-color md:pl-4' : '';
        html += `
        <div class="relative flex-shrink-0 ${dividerClass} hidden md:block" id="${prefix}sort-menu-container">
            <div class="flex items-center">
                <button id="${prefix}sort-menu-btn"
                    class="flex items-center gap-2 bg-white border border-border-color rounded-lg px-4 py-2 text-sm text-text-primary font-medium hover:border-accent focus:outline-none focus:ring-2 focus:ring-blue-300 whitespace-nowrap">
                    <span id="${prefix}sort-menu-label">排序: ${sort.options.find(o => o.value === sort.defaultVal)?.label || sort.options[0].label}</span>
                    <i data-lucide="chevron-down" class="w-4 h-4"></i>
                </button>
                <button id="${prefix}sort-direction-btn"
                    class="ml-2 p-2 bg-white border border-border-color rounded-lg text-text-primary hover:border-accent focus:outline-none focus:ring-2 focus:ring-blue-300" data-dir="${sort.defaultDir || 'desc'}">
                    <i data-lucide="arrow-${sort.defaultDir === 'asc' ? 'up' : 'down'}" class="w-4 h-4"></i>
                </button>
            </div>
            <div id="${prefix}sort-dropdown"
                class="hidden absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden text-left text-text-primary animate-fade-in-down">
                <div class="p-2">
                    ${sort.options.map(opt => `<button class="generic-sort-opt w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100" data-sort="${opt.value}">${opt.label}</button>`).join('')}
                </div>
            </div>
        </div>
        
        <div class="block md:hidden flex-shrink-0">
             <button id="${prefix}mobile-sort-btn" 
                class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-sm text-text-secondary border border-gray-200 whitespace-nowrap shadow-sm"
                data-filter-type="sort">
                <span>排序</span>
                <i data-lucide="arrow-down-up" class="w-3 h-3 ml-1"></i>
            </button>
        </div>
        `;
    }

    if (viewToggle || extraMobileButtons.length > 0) {
        html += `<div class="flex-1"></div>`;
    }

    if (viewToggle) {
        html += `
        <div class="flex bg-gray-100 p-1 rounded-lg flex-shrink-0">
            <button id="${prefix}grid-view-btn" class="view-btn active px-2 py-1 rounded shadow-sm bg-white"><i data-lucide="layout-grid" class="w-5 h-5"></i></button>
            <button id="${prefix}list-view-btn" class="view-btn px-2 py-1 rounded text-text-secondary hover:text-text-primary"><i data-lucide="list" class="w-5 h-5"></i></button>
        </div>`;
    }

    html += `</div>`;
    return html;
}

export function initFilterBarEvents(config, callback) {
    const { prefix = '', filters = [], sort = null, viewToggle = false } = config;

    const selectElements = document.querySelectorAll(`select.generic-filter-select[id^="${prefix}"]`);
    selectElements.forEach(select => {
        select.addEventListener('change', (e) => {
            const filterId = e.target.getAttribute('data-filter-id');
            const value = e.target.value;
            const labelEl = document.getElementById(`${prefix}mobile-${filterId}-label`);
            if (labelEl) {
                const optLabel = e.target.options[e.target.selectedIndex].text;
                labelEl.textContent = optLabel;
            }
            callback('filter', { id: filterId, value });
        });
    });

    const filterButtons = document.querySelectorAll(`button.generic-filter-btn[id^="${prefix}"]`);
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filterId = e.target.getAttribute('data-filter-id');
            const value = e.target.getAttribute('data-value');

            const groupBtns = document.querySelectorAll(`button.generic-filter-btn[data-filter-id="${filterId}"][id^="${prefix}"]`);
            groupBtns.forEach(b => {
                b.classList.remove('bg-white', 'shadow-sm', 'text-text-primary');
                b.classList.add('text-text-secondary');
            });
            e.target.classList.add('bg-white', 'shadow-sm', 'text-text-primary');
            e.target.classList.remove('text-text-secondary');

            callback('filter', { id: filterId, value });
        });
    });

    const openSheet = (title, options, onSelect, currentValue, currentDirection = null) => {
        const sheet = document.getElementById('mobile-filter-sheet');
        const sheetTitle = document.getElementById('mobile-sheet-title');
        const sheetOptions = document.getElementById('mobile-sheet-options');

        if (!sheet || !sheetTitle || !sheetOptions) return;

        sheetTitle.textContent = title;
        sheetOptions.innerHTML = '';

        options.forEach(opt => {
            const btn = document.createElement('button');
            const isSelected = opt.value === currentValue || opt.label === currentValue;

            let iconHtml = '';
            if (isSelected) {
                if (currentDirection) {
                    iconHtml = currentDirection === 'asc' ? '<i data-lucide="arrow-up" class="w-4 h-4"></i>' : '<i data-lucide="arrow-down" class="w-4 h-4"></i>';
                } else {
                    iconHtml = '<i data-lucide="check" class="w-4 h-4"></i>';
                }
            }

            btn.className = "w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors " + (isSelected ? "bg-accent/10 text-accent font-bold" : "text-text-primary hover:bg-gray-50");
            btn.innerHTML = "<span>" + opt.label + "</span>" + iconHtml;

            btn.onclick = () => {
                onSelect(opt.value);
                if (!currentDirection) {
                    closeModal('mobile-filter-sheet');
                }
            };
            sheetOptions.appendChild(btn);
        });

        if (window.lucide) window.lucide.createIcons();
        openModal('mobile-filter-sheet');
    };

    filters.forEach(filter => {
        if (filter.hideOnMobile) return;
        const mobileBtn = document.getElementById(`${prefix}mobile-${filter.id}-btn`);
        if (mobileBtn) {
            mobileBtn.addEventListener('click', () => {
                const select = document.getElementById(`${prefix}${filter.id}-filter`);
                const currentVal = select ? select.value : filter.options[0].value;

                openSheet(`篩選${filter.label}`, filter.options, (val) => {
                    if (select) {
                        select.value = val;
                        select.dispatchEvent(new Event('change'));
                    } else {
                        const label = document.getElementById(`${prefix}mobile-${filter.id}-label`);
                        const selectedOpt = filter.options.find(o => o.value === val);
                        if (label && selectedOpt) label.textContent = selectedOpt.label;
                        callback('filter', { id: filter.id, value: val });
                    }
                }, currentVal);
            });
        }
    });

    if (sort) {
        let currentSort = sort.defaultVal || sort.options[0].value;
        let currentDir = sort.defaultDir || 'desc';

        const sortBtn = document.getElementById(`${prefix}sort-menu-btn`);
        const sortDropdown = document.getElementById(`${prefix}sort-dropdown`);
        const dirBtn = document.getElementById(`${prefix}sort-direction-btn`);

        if (sortBtn && sortDropdown) {
            sortBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                sortDropdown.classList.toggle('hidden');
            });
            document.addEventListener('click', () => {
                sortDropdown.classList.add('hidden');
            });

            const sortOpts = sortDropdown.querySelectorAll('.generic-sort-opt');
            sortOpts.forEach(opt => {
                opt.addEventListener('click', (e) => {
                    currentSort = e.target.getAttribute('data-sort');
                    currentDir = 'desc';

                    const sortLabel = document.getElementById(`${prefix}sort-menu-label`);
                    if (sortLabel) sortLabel.textContent = `排序: ${e.target.textContent}`;

                    if (dirBtn) {
                        dirBtn.setAttribute('data-dir', currentDir);
                        dirBtn.innerHTML = '<i data-lucide="arrow-down" class="w-4 h-4"></i>';
                        if (window.lucide) window.lucide.createIcons({ root: dirBtn });
                    }

                    callback('sort', { type: currentSort, direction: currentDir });
                });
            });
        }

        if (dirBtn) {
            dirBtn.addEventListener('click', () => {
                currentDir = currentDir === 'asc' ? 'desc' : 'asc';
                dirBtn.setAttribute('data-dir', currentDir);
                dirBtn.innerHTML = '<i data-lucide="arrow-' + (currentDir === 'asc' ? 'up' : 'down') + '" class="w-4 h-4"></i>';
                if (window.lucide) window.lucide.createIcons({ root: dirBtn });
                callback('sort', { type: currentSort, direction: currentDir });
            });
        }

        const mobileSortBtn = document.getElementById(`${prefix}mobile-sort-btn`);
        if (mobileSortBtn) {
            mobileSortBtn.addEventListener('click', () => {
                const handleMobileSortSelect = (val) => {
                    if (val === currentSort) {
                        currentDir = currentDir === 'asc' ? 'desc' : 'asc';
                    } else {
                        currentSort = val;
                        currentDir = 'desc';
                    }

                    const sortLabel = document.getElementById(`${prefix}sort-menu-label`);
                    const selectedOpt = sort.options.find(o => o.value === currentSort);
                    if (sortLabel && selectedOpt) sortLabel.textContent = `排序: ${selectedOpt.label}`;

                    if (dirBtn) {
                        dirBtn.setAttribute('data-dir', currentDir);
                        dirBtn.innerHTML = '<i data-lucide="arrow-' + (currentDir === 'asc' ? 'up' : 'down') + '" class="w-4 h-4"></i>';
                        if (window.lucide) window.lucide.createIcons({ root: dirBtn });
                    }

                    callback('sort', { type: currentSort, direction: currentDir });
                    openSheet('排序方式', sort.options, handleMobileSortSelect, currentSort, currentDir);
                };

                openSheet('排序方式', sort.options, handleMobileSortSelect, currentSort, currentDir);
            });
        }
    }

    if (viewToggle) {
        const gridBtn = document.getElementById(`${prefix}grid-view-btn`);
        const listBtn = document.getElementById(`${prefix}list-view-btn`);

        if (gridBtn && listBtn) {
            gridBtn.addEventListener('click', () => {
                gridBtn.classList.add('bg-white', 'shadow-sm');
                gridBtn.classList.remove('text-text-secondary');
                listBtn.classList.remove('bg-white', 'shadow-sm');
                listBtn.classList.add('text-text-secondary');
                callback('view', 'grid');
            });

            listBtn.addEventListener('click', () => {
                listBtn.classList.add('bg-white', 'shadow-sm');
                listBtn.classList.remove('text-text-secondary');
                gridBtn.classList.remove('bg-white', 'shadow-sm');
                gridBtn.classList.add('text-text-secondary');
                callback('view', 'list');
            });
        }
    }
}
