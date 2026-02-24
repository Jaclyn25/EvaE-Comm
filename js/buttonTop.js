const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
    let lastScrollY = 0;
    let ticking = false;
    const showThreshold = 300;

    // Show/hide button with fade/scale
    function updateButtonVisibility() {
        const shouldShow = window.scrollY > showThreshold;
        scrollTopBtn.classList.toggle('show', shouldShow);
        scrollTopBtn.classList.toggle('hide', !shouldShow);
    }

    // Optimize scroll performance
    function onScroll() {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateButtonVisibility();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateButtonVisibility();

    // Smooth scroll to top and vibration
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Subtle vibration animation
        scrollTopBtn.classList.add('vibrate');
        setTimeout(() => scrollTopBtn.classList.remove('vibrate'), 300);
    });

    // Accessibility: keyboard support
    scrollTopBtn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            scrollTopBtn.click();
        }
    });
}