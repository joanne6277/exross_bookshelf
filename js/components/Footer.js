// js/components/Footer.js

export function createFooterHTML() {
    return `
        <footer class="w-full bg-white border-t border-gray-100 py-8 mt-auto md:mb-0 mb-16">
            <div class="max-w-[1600px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-center gap-6">
                <a href="https://www.ebookxross.com" target="_blank" rel="noopener noreferrer" class="text-sm text-text-secondary hover:text-blue-600 transition-colors">
                    關於我們
                </a>
                <a href="mailto:service@ebookxross.com" class="text-sm text-text-secondary hover:text-blue-600 transition-colors">
                    客服信箱
                </a>
            </div>
        </footer>
    `;
}
