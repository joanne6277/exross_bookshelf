// js/views/PersonalCenter.js
// 個人中心主頁面 View

import { createAccountSectionHTML, initAccountSectionEvents } from '../components/personal-center/AccountSection.js';
import { createNotificationsSectionHTML, initNotificationsSectionEvents } from '../components/personal-center/NotificationsSection.js';


// 區塊定義（可擴充）
const SECTIONS = [
    { id: 'account', label: '帳號管理', icon: 'user-circle', createHTML: createAccountSectionHTML, initEvents: initAccountSectionEvents },
    { id: 'notifications', label: '全部通知', icon: 'bell', createHTML: createNotificationsSectionHTML, initEvents: initNotificationsSectionEvents },
];

let currentSectionId = 'account';

/**
 * 建立個人中心頁面的 HTML
 * @returns {string} HTML string
 */
export function createPersonalCenterHTML() {
    return `
        <section id="view-personal-center" class="view-section hidden">
            <!-- Header -->
            <div class="personal-center-header flex items-center gap-4 mb-6">
                <button id="personal-center-back-btn" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <i data-lucide="arrow-left" class="w-5 h-5 text-gray-600"></i>
                </button>
                <h1 class="text-2xl md:text-3xl font-bold text-text-primary">個人中心</h1>
            </div>

            <!-- Main Layout -->
            <div class="personal-center-layout flex flex-col md:flex-row gap-6">
                <!-- Navigation Sidebar (Desktop) / Tab Bar (Mobile) -->
                <nav class="personal-center-nav">
                    <!-- Mobile: Horizontal scroll tabs -->
                    <div class="md:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        ${SECTIONS.map(section => `
                            <button class="nav-tab flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                                ${section.id === currentSectionId ? 'bg-[var(--bg-accent)] text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'}"
                                data-section="${section.id}">
                                <i data-lucide="${section.icon}" class="w-4 h-4"></i>
                                <span>${section.label}</span>
                            </button>
                        `).join('')}
                    </div>

                    <!-- Desktop: Vertical sidebar -->
                    <div class="hidden md:block w-56 flex-shrink-0">
                        <div class="bg-white rounded-xl border border-gray-100 p-2 sticky top-4">
                            ${SECTIONS.map(section => `
                                <button class="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left
                                    ${section.id === currentSectionId ? 'bg-[var(--bg-accent-light)] text-[var(--bg-accent)]' : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'}"
                                    data-section="${section.id}">
                                    <i data-lucide="${section.icon}" class="w-5 h-5"></i>
                                    <span>${section.label}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </nav>

                <!-- Content Area -->
                <div id="personal-center-content" class="flex-1 min-w-0">
                    <div class="bg-white rounded-xl border border-gray-100 p-4 md:p-6">
                        ${SECTIONS.find(s => s.id === currentSectionId)?.createHTML() || ''}
                    </div>
                </div>
            </div>
        </section>
    `;
}

/**
 * 切換到指定區塊
 * @param {string} sectionId - 區塊 ID
 */
export function switchToSection(sectionId) {
    const section = SECTIONS.find(s => s.id === sectionId);
    if (!section) return;

    currentSectionId = sectionId;

    // Update content
    const contentContainer = document.getElementById('personal-center-content');
    if (contentContainer) {
        const innerContainer = contentContainer.querySelector('.bg-white');
        if (innerContainer) {
            innerContainer.innerHTML = section.createHTML();
            section.initEvents();
            if (window.lucide) window.lucide.createIcons();
        }
    }

    // Update nav active states
    updateNavActiveStates(sectionId);

    console.log(`[PersonalCenter] Switched to section: ${sectionId}`);
}

/**
 * 更新導覽列的 active 狀態
 * @param {string} activeSectionId - 目前選中的區塊 ID
 */
function updateNavActiveStates(activeSectionId) {
    // Mobile tabs
    document.querySelectorAll('.personal-center-nav .nav-tab').forEach(tab => {
        const isActive = tab.dataset.section === activeSectionId;
        if (isActive) {
            tab.classList.add('bg-[var(--bg-accent)]', 'text-white');
            tab.classList.remove('bg-gray-100', 'text-text-secondary');
        } else {
            tab.classList.remove('bg-[var(--bg-accent)]', 'text-white');
            tab.classList.add('bg-gray-100', 'text-text-secondary');
        }
    });

    // Desktop nav items
    document.querySelectorAll('.personal-center-nav .nav-item').forEach(item => {
        const isActive = item.dataset.section === activeSectionId;
        if (isActive) {
            item.classList.add('bg-[var(--bg-accent-light)]', 'text-[var(--bg-accent)]');
            item.classList.remove('text-text-secondary');
        } else {
            item.classList.remove('bg-[var(--bg-accent-light)]', 'text-[var(--bg-accent)]');
            item.classList.add('text-text-secondary');
        }
    });
}

/**
 * 初始化個人中心的事件
 */
export function initPersonalCenterEvents() {
    const view = document.getElementById('view-personal-center');
    if (!view) return;

    // Back button
    const backBtn = view.querySelector('#personal-center-back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            // Navigate back to homepage
            const homepageLink = document.querySelector('.nav-link[data-view="homepage"]');
            if (homepageLink) {
                homepageLink.click();
            }
        });
    }

    // Section navigation (event delegation)
    view.addEventListener('click', (e) => {
        const navBtn = e.target.closest('.nav-tab, .nav-item');
        if (navBtn && navBtn.dataset.section) {
            switchToSection(navBtn.dataset.section);
        }
    });

    // Initialize current section events
    const currentSection = SECTIONS.find(s => s.id === currentSectionId);
    if (currentSection) {
        currentSection.initEvents();
    }
}

/**
 * 開啟個人中心並跳轉到指定區塊
 * @param {string} sectionId - 區塊 ID，預設為 'account'
 */
export function openPersonalCenter(sectionId = 'account') {
    currentSectionId = sectionId;

    // Switch to personal center view
    document.querySelectorAll('.view-section').forEach(view => {
        view.classList.add('hidden');
    });

    const personalCenterView = document.getElementById('view-personal-center');
    if (personalCenterView) {
        personalCenterView.classList.remove('hidden');

        // Render the target section
        switchToSection(sectionId);
    }

    // Clear active states from main nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    console.log(`[PersonalCenter] Opened with section: ${sectionId}`);
}
