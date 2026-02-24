export function createHomepageHTML() {
    return `
    <div id="view-homepage" class="view-section space-y-8 md:space-y-10">
        <section>
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-text-primary flex items-center gap-2"><i data-lucide="book-open"
                        class="w-6 h-6 text-accent"></i>正在閱讀</h2>
            </div>
            <div class="flex overflow-x-auto space-x-6 pb-4 no-scrollbar">
                <div
                    class="min-w-[180px] max-w-[180px] md:min-w-[220px] md:max-w-[220px] bg-secondary rounded-xl p-3 md:p-4 shadow-sm border border-border-color flex flex-col hover:shadow-md transition-shadow cursor-pointer relative group">
                    <div class="absolute top-2.5 right-2.5 z-10"><span
                            class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border border-white/50 shadow-md">剩餘
                            5 天 10 小時</span></div>
                    <div class="relative aspect-[2/3] mb-3"><img
                            src="https://placehold.co/220x140/629BC1/FFFFFF?text=Design+System" alt="Cover"
                            class="w-full h-full object-cover rounded-lg shadow-sm">
                        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div class="h-full rounded-full"
                                style="width: 40%; background-color: var(--bg-accent);"></div>
                        </div>
                    </div>
                    <h3 class="font-bold text-base text-text-primary truncate mb-0.5">設計系統實戰</h3>
                    <p class="text-xs text-text-secondary mb-2">作者 A</p>
                    <div class="mt-auto flex justify-between text-[10px] text-text-secondary font-medium">
                        <span>40%</span>
                    </div>
                </div>
                <div
                    class="min-w-[180px] max-w-[180px] md:min-w-[220px] md:max-w-[220px] bg-secondary rounded-xl p-3 md:p-4 shadow-sm border border-border-color flex flex-col hover:shadow-md transition-shadow cursor-pointer">
                    <div class="relative aspect-[2/3] mb-3"><img
                            src="https://placehold.co/220x140/48C774/FFFFFF?text=UX+Leadership" alt="Cover"
                            class="w-full h-full object-cover rounded-lg shadow-sm">
                        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div class="h-full rounded-full"
                                style="width: 10%; background-color: var(--bg-accent);"></div>
                        </div>
                    </div>
                    <h3 class="font-bold text-base text-text-primary truncate mb-0.5">UX 領導力</h3>
                    <p class="text-xs text-text-secondary mb-2">作者 B</p>
                    <div class="mt-auto flex justify-between text-[10px] text-text-secondary font-medium">
                        <span>10%</span>
                    </div>
                </div>
                <div
                    class="min-w-[180px] max-w-[180px] md:min-w-[220px] md:max-w-[220px] bg-secondary rounded-xl p-3 md:p-4 shadow-sm border border-border-color flex flex-col hover:shadow-md transition-shadow cursor-pointer">
                    <div class="relative aspect-[2/3] mb-3"><img
                            src="https://placehold.co/220x140/F59E0B/FFFFFF?text=Atomic+Habits" alt="Cover"
                            class="w-full h-full object-cover rounded-lg shadow-sm">
                        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div class="h-full rounded-full"
                                style="width: 71%; background-color: var(--bg-accent);"></div>
                        </div>
                    </div>
                    <h3 class="font-bold text-base text-text-primary truncate mb-0.5">原子習慣</h3>
                    <p class="text-xs text-text-secondary mb-2">James Clear</p>
                    <div class="mt-auto flex justify-between text-[10px] text-text-secondary font-medium">
                        <span>71%</span>
                    </div>
                </div>
                <!-- Clean Code -->
                <div
                    class="min-w-[180px] max-w-[180px] md:min-w-[220px] md:max-w-[220px] bg-secondary rounded-xl p-3 md:p-4 shadow-sm border border-border-color flex flex-col hover:shadow-md transition-shadow cursor-pointer relative group">
                    <div class="absolute top-2.5 right-2.5 z-10"><span
                            class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border border-white/50 shadow-md">剩餘
                            10 天 10 小時</span></div>
                    <div class="relative aspect-[2/3] mb-3"><img
                            src="https://placehold.co/220x140/3498DB/FFFFFF?text=Clean" alt="Cover"
                            class="w-full h-full object-cover rounded-lg shadow-sm">
                        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div class="h-full rounded-full"
                                style="width: 20%; background-color: var(--bg-accent);"></div>
                        </div>
                    </div>
                    <h3 class="font-bold text-base text-text-primary truncate mb-0.5">Clean Code</h3>
                    <p class="text-xs text-text-secondary mb-2">Robert C. Martin</p>
                    <div class="mt-auto flex justify-between text-[10px] text-text-secondary font-medium">
                        <span>20%</span>
                    </div>
                </div>
                <!-- English Listening -->
                <div
                    class="min-w-[180px] max-w-[180px] md:min-w-[220px] md:max-w-[220px] bg-secondary rounded-xl p-3 md:p-4 shadow-sm border border-border-color flex flex-col hover:shadow-md transition-shadow cursor-pointer relative group">
                    <div class="absolute top-2.5 right-2.5 z-10"><span
                            class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border border-white/50 shadow-md">剩餘
                            30 天</span></div>
                    <div class="relative aspect-[2/3] mb-3"><img
                            src="https://placehold.co/220x140/8E45AD/FFFFFF?text=English" alt="Cover"
                            class="w-full h-full object-cover rounded-lg shadow-sm">
                        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div class="h-full rounded-full"
                                style="width: 10%; background-color: var(--bg-accent);"></div>
                        </div>
                    </div>
                    <h3 class="font-bold text-base text-text-primary truncate mb-0.5">英語聽力特訓</h3>
                    <p class="text-xs text-text-secondary mb-2">Teacher John</p>
                    <div class="mt-auto flex justify-between text-[10px] text-text-secondary font-medium">
                        <span>10%</span>
                    </div>
                </div>
            </div>
        </section>
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-8">
            <section
                class="bg-secondary rounded-xl p-6 shadow-sm border border-border-color flex flex-col justify-between h-full">
                <div id="reading-goal-display">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-bold text-text-primary mb-2 flex items-center gap-2">
                            <i data-lucide="clock" class="w-5 h-5 text-accent"></i>今日閱讀時間
                        </h2>
                    </div>
                    <p class="text-text-secondary text-sm mb-6">保持每日閱讀習慣，累積知識複利</p>
                    <div class="flex items-baseline space-x-2 mb-6">
                        <span id="current-reading-time" class="text-6xl font-bold tracking-tight"
                            style="color: var(--bg-accent);">0</span>
                        <span class="text-xl text-text-secondary font-medium">分鐘</span>
                    </div>
                    
                    <div class="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                <i data-lucide="book-check" class="w-5 h-5 text-blue-500"></i>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-text-primary">本月已讀完</p>
                                <p class="text-xs text-text-secondary">累積閱讀成就</p>
                            </div>
                        </div>
                        <div class="flex items-baseline gap-1">
                            <span id="completed-books-count" class="text-2xl font-bold text-gray-800">0</span>
                            <span class="text-sm text-text-secondary">本</span>
                        </div>
                    </div>
                </div>
            </section>
            <section class="xl:col-span-2">
                <h2 class="text-xl font-bold text-text-primary mb-4 flex items-center gap-2"><i
                        data-lucide="sparkles" class="w-5 h-5 text-accent"></i>書城活動</h2>
                <div class="relative activity-carousel-container">
                    <div class="swiper-container activity-carousel">
                        <div class="swiper-wrapper">
                            <div
                                class="swiper-slide rounded-xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-lg transition-all">
                                <img src="https://placehold.co/600x300/3B82F6/FFFFFF?text=Summer+Sale"
                                    alt="Activity 1"
                                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                                <div
                                    class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                                    <div>
                                        <span
                                            class="text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block"
                                            style="background-color: var(--bg-accent);">限時優惠</span>
                                        <h3 class="text-white font-bold text-xl">夏日閱讀季：全館 5 折起</h3>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="swiper-slide rounded-xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-lg transition-all">
                                <img src="https://placehold.co/600x300/EC4899/FFFFFF?text=New+Arrivals"
                                    alt="Activity 2"
                                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                                <div
                                    class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                                    <div>
                                        <span
                                            class="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">新品上市</span>
                                        <h3 class="text-white font-bold text-xl">本月新書上架</h3>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="swiper-slide rounded-xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-lg transition-all">
                                <img src="https://placehold.co/600x300/8B5CF6/FFFFFF?text=Member+Day"
                                    alt="Activity 3"
                                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                                <div
                                    class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                                    <div>
                                        <span
                                            class="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">會員日</span>
                                        <h3 class="text-white font-bold text-xl">每月 15 號會員享 8 折</h3>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="swiper-slide rounded-xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-lg transition-all">
                                <img src="https://placehold.co/600x300/F59E0B/FFFFFF?text=Points+Reward"
                                    alt="Activity 4"
                                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                                <div
                                    class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                                    <div>
                                        <span
                                            class="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">點數回饋</span>
                                        <h3 class="text-white font-bold text-xl">消費滿額享點數 2 倍送</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
    `;
}
