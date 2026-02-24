export function animateSectionTitles() {
    const headers = document.querySelectorAll('.section-title-animate');
    if (!headers.length) return;
    const observer = new window.IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-title-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.18 });
    headers.forEach(h => observer.observe(h));
}