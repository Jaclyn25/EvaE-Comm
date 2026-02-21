const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
    let lastScrollY = 0;
    let ticking = false;
    const showThreshold = 300;
    function updateButtonVisibility() {
        const shouldShow = window.scrollY > showThreshold;
        scrollTopBtn.classList.toggle('show', shouldShow);
        scrollTopBtn.classList.toggle('hide', !shouldShow);
    }
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
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        scrollTopBtn.classList.add('vibrate');
        setTimeout(() => scrollTopBtn.classList.remove('vibrate'), 300);
    });
    scrollTopBtn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            scrollTopBtn.click();
        }
    });
}