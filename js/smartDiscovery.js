// js/smartDiscovery.js
// Handles Similar Products and Recently Viewed logic/UI
import ProductsManager from './products.js';
import { renderProductCard } from './productCard.js';

const SIMILAR_LIMIT = 6;
const RECENT_LIMIT = 6;

function getRelevanceScore(product, refProduct) {
    let score = 0;
    if (product.category === refProduct.category) score += 3;
    if (product.brand && refProduct.brand && product.brand === refProduct.brand) score += 2;
    // Close price: within 20% range
    const priceClose = Math.abs(product.price - refProduct.price) <= refProduct.price * 0.2;
    if (priceClose) score += 1;
    return score;
}

function getSimilarProducts(allProducts, refProduct) {
    return allProducts
        .filter(p => p.id !== refProduct.id)
        .map(p => ({...p, _score: getRelevanceScore(p, refProduct)}))
        .filter(p => p._score > 0)
        .sort((a, b) => b._score - a._score)
        .slice(0, SIMILAR_LIMIT);
}

function getRecentlyViewed() {
    try {
        return JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    } catch { return []; }
}

function addRecentlyViewed(id) {
    let arr = getRecentlyViewed();
    arr = arr.filter(pid => pid !== id);
    arr.unshift(id);
    if (arr.length > RECENT_LIMIT) arr = arr.slice(0, RECENT_LIMIT);
    localStorage.setItem('recentlyViewed', JSON.stringify(arr));
}

export function renderSmartDiscoverySections(refProduct) {
    const productsManager = new ProductsManager();
    const allProducts = productsManager.products;
    // --- Similar Products ---
    const similar = getSimilarProducts(allProducts, refProduct);
    const similarSection = document.getElementById('similarProductsSection');
    if (similarSection) {
        if (similar.length === 0) {
            similarSection.innerHTML = '';
            similarSection.style.display = 'none';
        } else {
            similarSection.innerHTML = `
                <h2 class="smart-section-title">Similar Products</h2>
                <div class="smart-products-list" id="similarProductsList">
                    ${similar.map(p => renderProductCard(p, {
                        badge: p.category === refProduct.category ? 'Same Category' : (p.brand === refProduct.brand ? 'Similar Brand' : ''),
                        compact: true
                    })).join('')}
                </div>
            `;
            similarSection.style.display = '';
        }
    }
    // --- Recently Viewed ---
    const recentIds = getRecentlyViewed().filter(id => id !== refProduct.id);
    const recentProducts = recentIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean);
    const recentSection = document.getElementById('recentlyViewedSection');
    if (recentSection) {
        if (recentProducts.length === 0) {
            recentSection.innerHTML = '';
            recentSection.style.display = 'none';
        } else {
            recentSection.innerHTML = `
                <h2 class="smart-section-title">Recently Viewed</h2>
                <div class="smart-products-list" id="recentlyViewedList">
                    ${recentProducts.map(p => renderProductCard(p, {compact: true})).join('')}
                </div>
            `;
            recentSection.style.display = '';
        }
    }
    // Add click listeners for navigation
    document.querySelectorAll('.smart-product-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.productId;
            if (id) {
                document.body.classList.add('page-transition-out');
                setTimeout(() => {
                    window.scrollTo({top: 0, behavior: 'auto'});
                    window.location.href = `product.html?id=${id}`;
                }, 220);
            }
        });
    });
}

export function trackProductView(productId) {
    addRecentlyViewed(productId);
}
