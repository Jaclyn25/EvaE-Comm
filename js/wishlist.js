import ProductsManager from './products.js';

const productsManager = new ProductsManager();
const productsContainer = document.getElementById('wishlistProductsContainer');
const wishlistCount = document.getElementById('wishlistCount');

function renderWishlist() {
    const wishlist = productsManager.getWishlist();
    wishlistCount.textContent = wishlist.length;
    if (!productsContainer) return;
    if (wishlist.length === 0) {
        productsContainer.innerHTML = `<div class="empty-wishlist">No favorites yet.<br><span style='font-size:2.2rem;opacity:0.5;'>♡</span></div>`;
        return;
    }
    const allProducts = productsManager.products;
    productsContainer.innerHTML = wishlist.map(id => {
        const p = allProducts.find(prod => prod.id === id);
        if (!p) return '';
        return `
            <div class="wishlist-product-card" data-product-id="${p.id}">
                <img src="${p.image}" alt="${p.name}" class="wishlist-product-img">
                <div class="wishlist-product-info">
                    <div class="wishlist-product-title">${p.name}</div>
                    <div class="wishlist-product-price">$${p.price.toFixed(2)}</div>
                </div>
                <button class="wishlist-remove-btn" aria-label="Remove from wishlist"><i class="fa-solid fa-xmark"></i></button>
            </div>
        `;
    }).join('');
}

productsContainer?.addEventListener('click', (e) => {
    const btn = e.target.closest('.wishlist-remove-btn');
    if (!btn) return;
    const card = btn.closest('.wishlist-product-card');
    if (!card) return;
    const id = parseInt(card.dataset.productId);
    productsManager.toggleWishlist(id);
    renderWishlist();
});

window.addEventListener('storage', (e) => {
    if (e.key === 'wishlist') {
        renderWishlist();
    }
});

renderWishlist();
