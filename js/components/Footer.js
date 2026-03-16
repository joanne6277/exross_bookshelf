// js/components/Footer.js

export function createFooterHTML() {
    return `
        <footer class="w-full bg-white border-t border-gray-100 py-8 mt-auto md:mb-0 mb-16">
            <div class="max-w-[1600px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-center gap-6">
                <div class="flex gap-6">
                    <a href="https://www.ebookxross.com" target="_blank" rel="noopener noreferrer" class="text-sm text-text-secondary hover:text-blue-600 transition-colors">
                        關於我們
                    </a>
                    <button id="footer-faq-btn" class="text-sm text-text-secondary hover:text-blue-600 transition-colors cursor-pointer outline-none">
                        常見問題
                    </button>
                    <button data-modal-target="issue-report-modal" class="text-sm text-text-secondary hover:text-blue-600 transition-colors cursor-pointer outline-none">
                        問題回報
                    </button>
                </div>
                <!-- 多語系切換選單 -->
                <div class="flex items-center gap-2">
                    <i data-lucide="globe" class="w-4 h-4 text-text-secondary"></i>
                    <select class="text-sm text-text-secondary bg-transparent border-none p-0 focus:ring-0 cursor-pointer outline-none hover:text-blue-600 transition-colors">
                        <option value="zh-TW">繁體中文</option>
                        <option value="en">English</option>
                        <option value="ja">日本語</option>
                    </select>
                </div>
            </div>
        </footer>
    `;
}
