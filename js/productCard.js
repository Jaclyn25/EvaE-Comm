// js/productCard.js
// Reusable product card component for similar/recently viewed sections

export function renderProductCard(product, options = {}) {
    // options: { badge, onClick, compact }
    const badge = options.badge ? `<span class="product-badge smart-badge">${options.badge}</span>` : '';
    const compact = options.compact !== false;
    return `
    <div class="product-card smart-product-card${compact ? ' compact' : ''}" data-product-id="${product.id}">
        <div class="product-image-wrapper">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            ${badge}
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-meta">
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <span class="product-rating"><span class="star-icon">★</span> ${product.rating?.toFixed(1) ?? '--'}</span>
            </div>
        </div>
    </div>
    `;
}
