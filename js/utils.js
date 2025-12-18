export function initUtils() {
    // Global Modal Handlers
    // Open modal via data-modal-target="modal-id"
    document.querySelectorAll('[data-modal-target]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Prevent default behavior if it's inside a form or link
            if (e.currentTarget.tagName === 'A') e.preventDefault();
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

        // Animation: If there is a child with translate-y-full, slide it up
        const content = modal.querySelector('.translate-y-full');
        if (content) {
            // Needed to allow browser to render 'hidden' removal first for transition to work
            requestAnimationFrame(() => {
                content.classList.remove('translate-y-full');
            });
        }
    }
}

export function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        // Animation: If there was a sliding element, slide it down first
        const content = modal.querySelector('.transform');
        // We look for 'transform' class which we put on the sheet content
        // Or strictly check if we previously removed translate-y-full?
        // Simpler: if it has transition classes but NOT translate-y-full, add it back.
        // The sheet content has: transform transition-transform duration-300

        // Specific check for our bottom sheet pattern:
        if (content && content.classList.contains('duration-300') && !content.classList.contains('translate-y-full')) {
            content.classList.add('translate-y-full');
            // Wait for animation to finish before hiding
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300); // 300ms matches duration-300
        } else {
            modal.classList.add('hidden');
        }
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