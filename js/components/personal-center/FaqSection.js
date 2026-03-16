// js/components/personal-center/FaqSection.js
// 常見問題區塊元件

const FAQ_DATA = [
    {
        question: "如何同步不同書店的書籍？",
        answer: "您可以使用「裝置登入模式」，透過書紐 App 掃描 QR Code 完成驗證。連結成功後，系統會自動整合您在讀冊生活、三民書局及灰熊愛讀書等平台的購書紀錄。"
    },
    {
        question: "劃線筆記可以匯出嗎？",
        answer: "目前系統支援在網頁端查看與編輯劃線筆記。進階的匯出功能（如 PDF 或 Notion 同步）預計在未來的版本更新中推出，敬請期待。"
    },
    {
        question: "為什麼我的書籍封面顯示不出來？",
        answer: "封面顯示異常通常與網路連線或書店伺服器回應有關。您可以嘗試重新整理頁面，或檢查該書籍在原購書平台的狀態是否正常。"
    }
];

export function createFaqSectionHTML() {
    return `
        <div class="faq-section animate-fade-in">
            <div class="mb-6">
                <h2 class="text-xl font-bold text-text-primary mb-2">常見問題</h2>
                <p class="text-sm text-text-secondary">在這裡您可以找到關於使用帳號、同步及功能的快速解答。</p>
            </div>

            <div class="space-y-4">
                ${FAQ_DATA.map((item, index) => `
                    <div class="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all cursor-pointer group faq-item" data-index="${index}">
                        <div class="flex items-start justify-between gap-4">
                            <div class="flex-1">
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
                            <i data-lucide="chevron-down" class="w-5 h-5 text-gray-400 transition-transform group-[.active]:rotate-180"></i>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="mt-10 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                <p class="text-sm text-text-secondary mb-3">沒找到您的問題？</p>
                <button class="px-6 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors shadow-sm">
                    聯絡技術支援
                </button>
            </div>
        </div>
    `;
}

export function initFaqSectionEvents() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');
            
            // 關閉其他已開啟的
            document.querySelectorAll('.faq-item').forEach(other => {
                other.classList.remove('active');
                other.querySelector('.faq-answer').classList.add('hidden');
            });

            if (!isActive) {
                item.classList.add('active');
                answer.classList.remove('hidden');
            }
        });
    });
}
