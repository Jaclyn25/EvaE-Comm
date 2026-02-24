const loadingBar = document.getElementById('globalLoadingBar');
const transitionOverlay = document.getElementById('pageTransitionOverlay');

function showLoadingBar() {
    if (!loadingBar) return;
    loadingBar.classList.add('active');
    loadingBar.classList.remove('complete');
    loadingBar.style.opacity = '1';
    loadingBar.style.width = '80%';
}
function completeLoadingBar() {
    if (!loadingBar) return;
    loadingBar.classList.add('complete');
    loadingBar.style.width = '100%';
    setTimeout(() => {
        loadingBar.classList.remove('active', 'complete');
        loadingBar.style.width = '0%';
        loadingBar.style.opacity = '0';
    }, 500);
}

function showPageTransition(cb) {
    if (!transitionOverlay) { cb && cb(); return; }
    transitionOverlay.classList.add('active');
    setTimeout(() => { cb && cb(); }, 350);
}
function hidePageTransition() {
    if (!transitionOverlay) return;
    transitionOverlay.classList.remove('active');
}

function saveScrollPosition(key = 'scrollPos') {
    sessionStorage.setItem(key, window.scrollY);
}
function restoreScrollPosition(key = 'scrollPos') {
    const pos = +sessionStorage.getItem(key);
    if (!isNaN(pos)) window.scrollTo(0, pos);
}

function interceptLinks() {
    document.body.addEventListener('click', (e) => {
        const a = e.target.closest('a');
        if (!a || a.target === '_blank' || a.hasAttribute('download') || a.href.startsWith('mailto:')) return;
        const href = a.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
        if (window.location.pathname.endsWith(href) || window.location.href.endsWith(href)) return;
        e.preventDefault();
        saveScrollPosition('scrollPos:' + href);
        showPageTransition(() => {
            showLoadingBar();
            setTimeout(() => { window.location.href = href; }, 180);
        });
    });
}

function onPageLoadTransitions() {
    hidePageTransition();
    completeLoadingBar();
    const key = 'scrollPos:' + window.location.pathname.split('/').pop();
    restoreScrollPosition(key);
}
export {
    showLoadingBar,
    completeLoadingBar,
    showPageTransition,
    hidePageTransition,
    saveScrollPosition,
    restoreScrollPosition,
    interceptLinks,
    onPageLoadTransitions
};