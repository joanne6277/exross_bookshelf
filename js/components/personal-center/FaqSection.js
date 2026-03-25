// js/components/personal-center/FaqSection.js
// 常見問題區塊元件

const FAQ_CATEGORIES = [
    { id: 'all', name: '全部問題' },
    { id: 'account', name: '帳號與同步' },
    { id: 'feature', name: '功能與操作' },
    { id: 'troubleshoot', name: '障礙排除' }
];

const FAQ_DATA = [
    {
        category: 'account',
        question: "如何同步不同書店的書籍？",
        answer: "您可以使用「裝置登入模式」，透過書紐 App 掃描 QR Code 完成驗證。連結成功後，系統會自動整合您在讀冊生活、三民書局及灰熊愛讀書等平台的購書紀錄。"
    },
    {
        category: 'feature',
        question: "劃線筆記可以匯出嗎？",
        answer: "目前系統支援在網頁端查看與編輯劃線筆記。進階的匯出功能（如 PDF 或 Notion 同步）預計在未來的版本更新中推出，敬請期待。"
    },
    {
        category: 'troubleshoot',
        question: "為什麼我的書籍封面顯示不出來？",
        answer: "封面顯示異常通常與網路連線或書店伺服器回應有關。您可以嘗試重新整理頁面，或檢查該書籍在原購書平台的狀態是否正常。"
    },
    {
        category: 'account',
        question: "如何更改密碼？",
        answer: "您可以在「個人中心」的「帳號管理」頁面中，點選前往原書店平台進行密碼修改。"
    },
    {
        category: 'feature',
        question: "支援哪些閱讀裝置？",
        answer: "書紐支援手機、平板及多數主流操作系統網頁瀏覽器，包括 iOS、Android、Windows 及 macOS 上的 Chrome、Safari、Edge 等。"
    },
    {
        category: 'troubleshoot',
        question: "如果掃描 QR Code 失敗怎麼辦？",
        answer: "請確保您的網路連線狀態穩定且光線充足。如果 QR Code 已過期（超過90秒），請點擊「重新整理」以取得新的條碼並再次掃描。"
    }
];

export function createFaqSectionHTML() {
    return `
        <div class="faq-section animate-fade-in">
            <div class="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 class="text-xl font-bold text-text-primary mb-2">常見問題</h2>
                    <p class="text-sm text-text-secondary">在這裡您可以找到關於使用帳號、同步及功能的快速解答。</p>
                </div>
                <!-- 新增分類下拉選單 -->
                <div class="w-full md:w-48 flex-shrink-0">
                    <select id="faq-category-select" class="w-full bg-white border border-gray-200 text-text-primary text-sm rounded-lg focus:ring-accent focus:border-accent block p-2.5 outline-none transition-colors cursor-pointer hover:border-accent/50">
                        ${FAQ_CATEGORIES.map(cat => `
                            <option value="${cat.id}">${cat.name}</option>
                        `).join('')}
                    </select>
                </div>
            </div>

            <div class="space-y-4 relative" id="faq-list-container">
                ${renderFaqList('all')}
            </div>
        </div>
    `;
}

// 抽取渲染列表的方法供選單切換時呼叫
function renderFaqList(categoryId) {
    const filteredData = categoryId === 'all' 
        ? FAQ_DATA 
        : FAQ_DATA.filter(item => item.category === categoryId);

    if (filteredData.length === 0) {
        return `<div class="text-center py-8 text-text-secondary">目前沒有相關問題。</div>`;
    }

    return filteredData.map((item, index) => {
        const categoryName = FAQ_CATEGORIES.find(c => c.id === item.category)?.name || '未分類';
        return `
            <div class="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all cursor-pointer group faq-item" data-index="${index}">
                <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md whitespace-nowrap">${categoryName}</span>
                        </div>
                        <h3 class="font-bold text-text-primary group-hover:text-accent transition-colors flex items-center gap-2">
                            <span class="flex-shrink-0 w-6 h-6 bg-accent/10 text-accent rounded-full flex items-center justify-center text-xs font-serif italic">Q</span>
                            ${item.question}
                        </h3>
                        <div class="faq-answer hidden mt-4 pl-8 text-sm text-text-secondary leading-relaxed border-t border-gray-50 pt-4">
                            <div class="flex gap-2">
                                <span class="flex-shrink-0 font-bold text-green-500">A:</span>
                                <p>${item.answer}</p>
                            </div>
                        </div>
                    </div>
                    <i data-lucide="chevron-down" class="w-5 h-5 text-gray-400 transition-transform group-[.active]:rotate-180 mt-1"></i>
                </div>
            </div>
        `;
    }).join('');
}

export function initFaqSectionEvents() {
    bindFaqItemsEvents();

    const categorySelect = document.getElementById('faq-category-select');
    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            const container = document.getElementById('faq-list-container');
            if (container) {
                container.innerHTML = renderFaqList(e.target.value);
                // 重新載入 lucide icons (因為列表是被動態寫入的)
                if (window.lucide && window.lucide.createIcons) {
                    window.lucide.createIcons();
                }
                // 重綁問答點擊事件
                bindFaqItemsEvents();
            }
        });
    }
}

function bindFaqItemsEvents() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');
            
            // 關閉其他已開啟的項目
            document.querySelectorAll('.faq-item').forEach(other => {
                other.classList.remove('active');
                if (other.querySelector('.faq-answer')) {
                    other.querySelector('.faq-answer').classList.add('hidden');
                }
            });

            // 如果原本是未開啟狀態，則將其打開
            if (!isActive && answer) {
                item.classList.add('active');
                answer.classList.remove('hidden');
            }
        });
    });
}
