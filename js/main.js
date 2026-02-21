import CartManager from './cart.js';
import ProductsManager from './products.js';
import ImageSlider from './slider.js';
import AuthUI, { isAuthenticated } from './auth.js';

const PROTECTED_PATHS = ['cart.html', 'product.html'];

function isProtectedPage() {
    const path = window.location.pathname || '';
    return PROTECTED_PATHS.some((p) => path.includes(p));
}

function redirectToLogin() {
    document.body.classList.add('page-transition-out');
    setTimeout(() => {
        const loginUrl = 'login.html';
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = returnUrl ? `${loginUrl}?returnUrl=${returnUrl}` : loginUrl;
    }, 280);
}

class App {
    constructor() {
        this.cartManager = new CartManager();
        this.productsManager = new ProductsManager();
        this.authUI = new AuthUI();
        this.slider = null;

        this.init();
    }

    init() {
        if (isProtectedPage() && !isAuthenticated()) {
            redirectToLogin();
            return;
        }
        this.initNavbar();
        this.initPage();
        this.initRippleEffects();
        this.initWishlistModal();
    }
    initWishlistModal() {
        const openBtn = document.getElementById('openWishlistModal');
        const closeBtn = document.getElementById('closeWishlistModal');
        const modal = document.getElementById('wishlistModal');
        const productsContainer = document.getElementById('wishlistProductsContainer');
        const wishlistCount = document.getElementById('wishlistCount');
        const productsManager = this.productsManager;
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

        openBtn?.addEventListener('click', () => {
            modal.classList.add('open');
            setTimeout(() => modal.classList.add('visible'), 10);
            renderWishlist();
        });
        closeBtn?.addEventListener('click', () => {
            modal.classList.remove('visible');
            setTimeout(() => modal.classList.remove('open'), 250);
        });
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('visible');
                setTimeout(() => modal.classList.remove('open'), 250);
            }
        });
        productsContainer?.addEventListener('click', (e) => {
            const btn = e.target.closest('.wishlist-remove-btn');
            if (!btn) return;
            const card = btn.closest('.wishlist-product-card');
            if (!card) return;
            const id = parseInt(card.dataset.productId);
            productsManager.toggleWishlist(id);
            renderWishlist();
            openBtn.classList.add('animated');
            setTimeout(() => openBtn.classList.remove('animated'), 500);
        });
        function updateWishlistCount() {
            const wishlist = productsManager.getWishlist();
            wishlistCount.textContent = wishlist.length;
        }
        updateWishlistCount();
        window.addEventListener('storage', (e) => {
            if (e.key === 'wishlist') {
                renderWishlist();
                updateWishlistCount();
            }
        });
        const origToggle = productsManager.toggleWishlist.bind(productsManager);
        productsManager.toggleWishlist = function(id) {
            origToggle(id);
            updateWishlistCount();
            openBtn.classList.add('animated');
            setTimeout(() => openBtn.classList.remove('animated'), 500);
        };
    }

    initNavbar() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.querySelector('.nav-menu');

        mobileMenuToggle?.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navMenu?.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                mobileMenuToggle?.classList.remove('active');
                navMenu?.classList.remove('active');
            }
        });
    }

    initPage() {
        const path = window.location.pathname;

        if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
            this.initHomePage();
        } else if (path.includes('product.html')) {
            this.initProductPage();
        } else if (path.includes('cart.html')) {
            this.initCartPage();
        } else if (path.includes('success.html')) {
            this.initSuccessPage();
        }
    }

    initHomePage() {
        const sliderContainer = document.getElementById('sliderContainer');
        if (sliderContainer) {
            this.slider = new ImageSlider('sliderContainer', {
                autoPlay: true,
                autoPlayDelay: 5000
            });
        }
        this.initSidebarFilters();
        this.initFilters();
        const productsGrid = document.getElementById('productsGrid');
        const skeletonGrid = document.getElementById('skeletonGrid');
        if (skeletonGrid) skeletonGrid.style.display = 'flex';
        setTimeout(() => {
            if (productsGrid) {
                this.productsManager.renderProducts(productsGrid, this.cartManager);
                productsGrid.querySelectorAll('.product-card').forEach(card => card.classList.add('reveal'));
                this.initScrollReveal();
            }
            if (skeletonGrid) skeletonGrid.style.display = 'none';
        }, 900);
        document.addEventListener('cartUpdated', () => {
        });
    }

    initScrollReveal() {
        const revealEls = document.querySelectorAll('.reveal');
        const observer = new window.IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(el => observer.observe(el));
    }

    initSidebarFilters() {
        const sidebar = document.getElementById('sidebarFilters');
        const openBtn = document.getElementById('openSidebarBtn');
        const closeBtn = document.getElementById('closeSidebarBtn');
        const clearBtn = document.getElementById('clearFiltersBtn');
        openBtn?.addEventListener('click', () => {
            sidebar?.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
        closeBtn?.addEventListener('click', () => {
            sidebar?.classList.remove('open');
            document.body.style.overflow = '';
        });
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 900 && sidebar?.classList.contains('open')) {
                if (!e.target.closest('.sidebar-filters') && !e.target.closest('.sidebar-toggle-btn')) {
                    sidebar.classList.remove('open');
                    document.body.style.overflow = '';
                }
            }
        });
        clearBtn?.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector('.filter-btn[data-category="all"]')?.classList.add('active');
            document.getElementById('priceRange').value = 1000;
            document.getElementById('priceValue').textContent = 1000;
            document.getElementById('sizeFilter').value = 'all';
            this.productsManager.filterProducts({ category: 'all', maxPrice: 1000, size: 'all' });
            this.productsManager.renderProducts(document.getElementById('productsGrid'), this.cartManager);
        });
    }

    initFilters() {
        const categoryBtns = document.querySelectorAll('.filter-btn');
        const priceRange = document.getElementById('priceRange');
        const priceValue = document.getElementById('priceValue');
        const sizeFilter = document.getElementById('sizeFilter');
        const productsGrid = document.getElementById('productsGrid');
        const filterChips = document.getElementById('filterChips');
        const updateChips = () => {
            const filters = this.productsManager.currentFilters;
            let chips = '';
            if (filters.category && filters.category !== 'all') {
                chips += `<span class="filter-chip" data-chip="category">${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} <button class="chip-close" aria-label="Remove"><i class="fa fa-xmark"></i></button></span>`;
            }
            if (filters.maxPrice && filters.maxPrice < 1000) {
                chips += `<span class="filter-chip" data-chip="maxPrice">Up to $${filters.maxPrice} <button class="chip-close" aria-label="Remove"><i class="fa fa-xmark"></i></button></span>`;
            }
            if (filters.size && filters.size !== 'all') {
                chips += `<span class="filter-chip" data-chip="size">${filters.size} <button class="chip-close" aria-label="Remove"><i class="fa fa-xmark"></i></button></span>`;
            }
            filterChips.innerHTML = chips;
        };
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.dataset.category;
                this.productsManager.filterProducts({ category });
                this.productsManager.renderProducts(productsGrid, this.cartManager);
                updateChips();
            });
        });
        if (priceRange && priceValue) {
            priceRange.addEventListener('input', (e) => {
                const maxPrice = parseInt(e.target.value);
                priceValue.textContent = maxPrice;
                this.productsManager.filterProducts({ maxPrice });
                this.productsManager.renderProducts(productsGrid, this.cartManager);
                updateChips();
            });
        }
        sizeFilter?.addEventListener('change', (e) => {
            const size = e.target.value;
            this.productsManager.filterProducts({ size });
            this.productsManager.renderProducts(productsGrid, this.cartManager);
            updateChips();
        });
        filterChips.addEventListener('click', (e) => {
            const chip = e.target.closest('.filter-chip');
            if (!chip) return;
            const type = chip.dataset.chip;
            if (type === 'category') {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                document.querySelector('.filter-btn[data-category="all"]')?.classList.add('active');
                this.productsManager.filterProducts({ category: 'all' });
            } else if (type === 'maxPrice') {
                document.getElementById('priceRange').value = 1000;
                document.getElementById('priceValue').textContent = 1000;
                this.productsManager.filterProducts({ maxPrice: 1000 });
            } else if (type === 'size') {
                document.getElementById('sizeFilter').value = 'all';
                this.productsManager.filterProducts({ size: 'all' });
            }
            this.productsManager.renderProducts(productsGrid, this.cartManager);
            updateChips();
        });
        updateChips();
    }

    initProductPage() {
        const container = document.getElementById('productDetails');
        if (container) {
            container.innerHTML = `
                <div class="product-details-wrapper product-details-skeleton">
                    <div class="product-details-skeleton-image skeleton-block"></div>
                    <div class="product-details-skeleton-info">
                        <div class="skeleton-line skeleton-title"></div>
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line skeleton-small"></div>
                    </div>
                </div>
            `;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (!productId) {
            window.location.href = 'index.html';
            return;
        }

        const product = this.productsManager.getProductById(productId);
        if (!product) {
            window.location.href = 'index.html';
            return;
        }

        this.renderProductDetails(product);
    }

    renderProductDetails(product) {
        const container = document.getElementById('productDetails');
        if (!container) return;

        let quantity = 1;
        const isOutOfStock = product.stock <= 0;

        container.innerHTML = `
            <div class="product-details-image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-details-image">
            </div>
            <div class="product-details-info">
                <h1>${product.name}</h1>
                <p class="product-details-category">${product.category}</p>
                <div class="product-details-meta">
                    <div class="product-details-rating">
                        <span class="star-icon">★</span>
                        <span class="rating-value">${product.rating.toFixed(1)} / 5.0</span>
                    </div>
                    <div class="product-details-stock ${isOutOfStock ? 'out-of-stock' : 'in-stock'}">
                        ${isOutOfStock ? 'Out of stock' : `In stock · ${product.stock} available`}
                    </div>
                </div>
                <div class="product-details-price">$${product.price.toFixed(2)}</div>
                <p class="product-details-description">
                    ${product.description}
                </p>
                <div class="quantity-control">
                    <label>Quantity:</label>
                    <div class="quantity-buttons">
                        <button class="quantity-btn" id="decreaseQty">-</button>
                        <span class="quantity-value" id="quantityValue">${quantity}</span>
                        <button class="quantity-btn" id="increaseQty">+</button>
                    </div>
                </div>
                <button class="add-to-cart-details-btn" id="addToCartDetails" ${isOutOfStock ? 'disabled' : ''}>
                    <span>${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 20px; height: 20px;">
                        <path d="M9 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4m7 14h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2M9 7h6M9 7v12m6-12v12"/>
                    </svg>
                </button>
            </div>
        `;

        const decreaseBtn = document.getElementById('decreaseQty');
        const increaseBtn = document.getElementById('increaseQty');
        const quantityValue = document.getElementById('quantityValue');
        const addToCartBtn = document.getElementById('addToCartDetails');

        decreaseBtn?.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                quantityValue.textContent = quantity;
            }
        });

        increaseBtn?.addEventListener('click', () => {
            if (!isOutOfStock && quantity < product.stock) {
                quantity++;
                quantityValue.textContent = quantity;
            }
        });

        addToCartBtn?.addEventListener('click', () => {
            if (isOutOfStock) return;
            this.cartManager.addItem(product, quantity);
            addToCartBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                addToCartBtn.style.transform = '';
            }, 150);
        });
    }

    initCartPage() {
        this.renderCart();
        document.addEventListener('cartUpdated', () => {
            this.renderCart();
        });
    }

    renderCart() {
        const cartItems = this.cartManager.getCartItems();
        const container = document.getElementById('cartItems');
        const subtotalEl = document.getElementById('subtotal');
        const taxEl = document.getElementById('tax');
        const totalEl = document.getElementById('total');
        const buyNowBtn = document.getElementById('buyNowBtn');

        if (!container) return;

        if (cartItems.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4m7 14h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2M9 7h6M9 7v12m6-12v12"/>
                    </svg>
                    <h2>Your cart is empty</h2>
                    <p>Add some products to get started!</p>
                    <a href="index.html" class="back-home-btn" style="display: inline-block; margin-top: 1rem;">
                        <span>Continue Shopping</span>
                    </a>
                </div>
            `;
            
            if (subtotalEl) subtotalEl.textContent = '$0.00';
            if (taxEl) taxEl.textContent = '$0.00';
            if (totalEl) totalEl.textContent = '$0.00';
            if (buyNowBtn) buyNowBtn.disabled = true;
            return;
        }

        container.innerHTML = cartItems.map(item => `
            <div class="cart-item" data-item-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-category">${item.category}</p>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `).join('');
        container.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(btn.dataset.id);
                const action = btn.dataset.action;
                const item = cartItems.find(i => i.id === itemId);
                
                if (item) {
                    if (action === 'increase') {
                        this.cartManager.updateQuantity(itemId, item.quantity + 1);
                    } else if (action === 'decrease') {
                        this.cartManager.updateQuantity(itemId, item.quantity - 1);
                    }
                }
            });
        });

        container.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(btn.dataset.id);
                this.cartManager.removeItem(itemId);
            });
        });
        const subtotal = this.cartManager.getTotalPrice();
        const tax = subtotal * 0.1; 
        const total = subtotal + tax;

        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
        if (buyNowBtn) {
            buyNowBtn.disabled = false;
            buyNowBtn.onclick = () => {
                this.cartManager.clearCart();
                window.location.href = 'success.html';
            };
        }
    }

    initSuccessPage() {
        const successCard = document.querySelector('.success-card');
        if (successCard) {
            successCard.style.animation = 'fadeInUp 0.6s ease-out';
        }
    }

    initRippleEffects() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button, .auth-submit-btn, .buy-now-btn, .back-home-btn');
            if (button && button.querySelector('.ripple-effect')) {
                const ripple = button.querySelector('.ripple-effect');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.animation = 'none';
                
                setTimeout(() => {
                    ripple.style.animation = 'ripple 0.6s ease-out';
                }, 10);
            }
        });
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new App();
    });
} else {
    new App();
}
