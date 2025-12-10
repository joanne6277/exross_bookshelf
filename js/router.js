// js/router.js
export function initRouter() {
    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.view-section');

    // Add click listeners
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.currentTarget;
            const viewName = target.dataset.view;
            switchView(viewName);
        });
    });

    // Logo click reloads
    const logoBtns = document.querySelectorAll('.logo-reload-btn');
    logoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.reload(); 
        });
    });

    // Initialize default view
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
        switchView(activeLink.dataset.view);
    } else {
        switchView('homepage');
    }
}

function switchView(viewName) {
    const viewId = `view-${viewName}`;

    // Hide all views
    document.querySelectorAll('.view-section').forEach(view => {
        view.classList.add('hidden');
    });

    // Show target view
    const targetView = document.getElementById(viewId);
    if (targetView) targetView.classList.remove('hidden');

    // Sync Active States (Desktop & Mobile)
    document.querySelectorAll('.nav-link').forEach(nav => {
        if (nav.dataset.view === viewName) {
            nav.classList.add('active');
        } else {
            nav.classList.remove('active');
        }
    });
    
    // Scroll to top
    const main = document.querySelector('main');
    if(main) main.scrollTop = 0;

    console.log(`Switched to view: ${viewName}`);
}