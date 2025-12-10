export function initStoreFeature() {
    const userBtn = document.getElementById('user-menu-btn');
    const userDropdown = document.getElementById('user-dropdown');

    if (userBtn && userDropdown) {
        userBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('hidden');
        });

        window.addEventListener('click', (e) => {
            if (!userDropdown.contains(e.target) && !userBtn.contains(e.target)) {
                userDropdown.classList.add('hidden');
            }
        });
    }

    // Store Login Logic (delegated listener)
    if (userDropdown) {
        userDropdown.addEventListener('click', (e) => {
            const card = e.target.closest('.store-card');
            if (card) {
                handleStoreClick(card);
            }
        });
    }
}

function handleStoreClick(card) {
    const storeName = card.dataset.storeName;
    const isUnlinked = card.classList.contains('unlinked');
    const statusText = card.querySelector('.status-text');
    const btn = card.querySelector('.action-btn');

    if (isUnlinked) {
        alert(`即將前往 ${storeName} 登入頁面... (模擬跳轉)`);
        setTimeout(() => {
            card.classList.remove('unlinked');
            card.classList.add('linked');
            if (statusText) statusText.innerText = '已連結';
            if (btn) btn.innerText = '管理';
            alert(`${storeName} 連結成功！`);
        }, 500);
    } else {
        alert(`管理 ${storeName} 的連結設定`);
    }
}