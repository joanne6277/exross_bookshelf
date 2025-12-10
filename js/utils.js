export function initUtils() {
    // Global Modal Handlers
    // Open modal via data-modal-target="modal-id"
    document.querySelectorAll('[data-modal-target]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Prevent default behavior if it's inside a form or link
            if(e.currentTarget.tagName === 'A') e.preventDefault();
            e.stopPropagation(); // Stop propagation to prevent immediate closing issues
            
            const modalId = btn.dataset.modalTarget;
            openModal(modalId);
        });
    });

    // Close modal via data-modal-close="modal-id"
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = btn.dataset.modalClose;
            closeModal(modalId);
        });
    });

    // Accordion Handler
    document.querySelectorAll('[data-accordion-target]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.dataset.accordionTarget;
            toggleAccordion(targetId, btn);
        });
    });
}

export function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        // Hide other overlays first
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
        modal.classList.remove('hidden');
    }
}

export function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('hidden');
    }
}

export function toggleAccordion(id, btn) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.toggle('hidden');
        const icon = btn.querySelector('i');
        if (icon) icon.classList.toggle('rotate-180');
    }
}