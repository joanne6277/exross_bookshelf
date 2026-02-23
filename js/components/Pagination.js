/**
 * Pagination Component
 * 通用分頁元件，供書櫃各分頁（全部書籍、自訂書單、封存區）使用
 */

/**
 * 產生分頁列 HTML
 * @param {number} totalPages - 總頁數
 * @param {number} currentPage - 當前頁碼（1-indexed）
 * @param {string} paginationId - 分頁容器 ID（用於按鈕 data-attr）
 * @returns {string} HTML 字串
 */
export function createPaginationHTML(totalPages, currentPage, paginationId = '') {
    if (totalPages <= 0) return '';

    const maxVisiblePages = 5; // 最多顯示幾個頁碼按鈕
    let pages = [];

    if (totalPages <= maxVisiblePages) {
        // 全部顯示
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        // 顯示部分頁碼 + 省略號
        if (currentPage <= 3) {
            pages = [1, 2, 3, 4, '...', totalPages];
        } else if (currentPage >= totalPages - 2) {
            pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
        }
    }

    const prevDisabled = currentPage <= 1;
    const nextDisabled = currentPage >= totalPages;
    const idAttr = paginationId ? `data-pagination-id="${paginationId}"` : '';

    const pageButtons = pages.map(p => {
        if (p === '...') {
            return `<span class="pagination-ellipsis">…</span>`;
        }
        const isActive = p === currentPage;
        return `<button
            class="pagination-btn ${isActive ? 'pagination-btn--active' : ''}"
            data-page="${p}"
            ${idAttr}
            aria-label="第 ${p} 頁"
            ${isActive ? 'aria-current="page"' : ''}
        >${p}</button>`;
    }).join('');

    return `
    <nav class="pagination" aria-label="分頁導覽">
        <button
            class="pagination-btn pagination-btn--nav ${prevDisabled ? 'pagination-btn--disabled' : ''}"
            data-page="${currentPage - 1}"
            ${idAttr}
            ${prevDisabled ? 'disabled' : ''}
            aria-label="上一頁"
        >
            <i data-lucide="chevron-left" class="w-4 h-4"></i>
        </button>

        <div class="pagination-pages">
            ${pageButtons}
        </div>

        <button
            class="pagination-btn pagination-btn--nav ${nextDisabled ? 'pagination-btn--disabled' : ''}"
            data-page="${currentPage + 1}"
            ${idAttr}
            ${nextDisabled ? 'disabled' : ''}
            aria-label="下一頁"
        >
            <i data-lucide="chevron-right" class="w-4 h-4"></i>
        </button>
    </nav>`;
}

/**
 * 初始化分頁容器的點擊事件
 * @param {string} containerId - 分頁列容器的 element ID
 * @param {function} onPageChange - 頁碼變更回調 (newPage: number) => void
 */
export function initPagination(containerId, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 使用事件代理，避免重複綁定
    container.addEventListener('click', (e) => {
        const btn = e.target.closest('.pagination-btn');
        if (!btn || btn.disabled || btn.classList.contains('pagination-btn--disabled')) return;

        const page = parseInt(btn.dataset.page, 10);
        if (!isNaN(page) && page >= 1) {
            onPageChange(page);
        }
    });
}

/**
 * 重新渲染分頁列（更新 HTML，重新掛接圖示）
 * @param {string} containerId - 分頁列容器的 element ID
 * @param {number} totalPages
 * @param {number} currentPage
 */
export function renderPagination(containerId, totalPages, currentPage) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = createPaginationHTML(totalPages, currentPage, containerId);
    if (window.lucide) window.lucide.createIcons({ root: container });
}
