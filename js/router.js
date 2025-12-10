export function initRouter() {
    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.view-section');

    // Add click listeners to nav items
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewName = link.dataset.view;
            switchView(viewName);
        });
    });

    // Logo click reloads/resets to homepage
    const logoBtn = document.getElementById('logo-reload-btn');
    if (logoBtn) {
        logoBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }

    // Initialize default view based on active class or default
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
        switchView(activeLink.dataset.view);
    } else {
        switchView('homepage');
    }
}

function switchView(viewName) {
    const viewId = `view-${viewName}`;
    const navId = `nav-${viewName}`;

    // Hide all views
    document.querySelectorAll('.view-section').forEach(view => {
        view.classList.add('hidden');
    });

    // Show target view
    const targetView = document.getElementById(viewId);
    if (targetView) targetView.classList.remove('hidden');

    // Update nav state
    document.querySelectorAll('.nav-link').forEach(nav => {
        nav.classList.remove('active');
        if (nav.id === navId) nav.classList.add('active');
    });

    console.log(`Switched to view: ${viewName}`);
}