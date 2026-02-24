class ProductsManager {
        getWishlist() {
            try {
                return JSON.parse(localStorage.getItem('wishlist') || '[]');
            } catch { return []; }
        }
        setWishlist(arr) {
            localStorage.setItem('wishlist', JSON.stringify(arr));
        }
        isWishlisted(id) {
            return this.getWishlist().includes(id);
        }
        toggleWishlist(id) {
            let wishlist = this.getWishlist();
            if (wishlist.includes(id)) {
                wishlist = wishlist.filter(pid => pid !== id);
            } else {
                wishlist.push(id);
            }
            this.setWishlist(wishlist);
        }
    constructor() {
        this.products = this.getProductsData();
        this.filteredProducts = [...this.products];
        this.currentFilters = {
            category: 'all',
            maxPrice: 1000,
            size: 'all'
        };
    }

    getProductsData() {
        return [
            // --- CLOTHES ---
            {
                id: 1,
                name: 'Classic White T-Shirt',
                category: 'clothes',
                price: 29.99,
                size: 'M',
                rating: 4.5,
                stock: 24,
                description: 'Premium organic cotton tee with a comfortable relaxed fit.',
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop'
            },
            {
                id: 2,
                name: 'Denim Jacket',
                category: 'clothes',
                price: 79.99,
                size: 'L',
                rating: 4.7,
                stock: 12,
                description: 'Classic blue denim jacket with vintage wash and metal buttons.',
                image: 'https://tse1.mm.bing.net/th/id/OIP.PkgxNi03rsE_u_Et6uhsBQHaJ4?w=794&h=1059&rs=1&pid=ImgDetMain&o=7&rm=3'
            },
            {
                id: 3,
                name: 'Elegant Summer Dress',
                category: 'clothes',
                price: 54.99,
                size: 'S',
                rating: 4.3,
                stock: 18,
                description: 'Flowy floral summer dress made from lightweight breathable fabric.',
                image: 'https://tse4.mm.bing.net/th/id/OIP.gtrghArtAPVy5AWv0QnSJQHaHa?w=500&h=500&rs=1&pid=ImgDetMain&o=7&rm=3'
            },
            {
                id: 10,
                name: 'Urban Leather Jacket',
                category: 'clothes',
                price: 159.99,
                size: 'XL',
                rating: 4.8,
                stock: 6,
                description: '100% genuine leather biker jacket with silver-tone hardware.',
                image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop'
            },
            {
                id: 13,
                name: 'Woolen Winter Coat',
                category: 'clothes',
                price: 129.99,
                size: 'L',
                rating: 4.6,
                stock: 10,
                description: 'Warm long-line wool coat in camel color for professional looks.',
                image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1000&auto=format&fit=crop'
            },
    
            // --- MAKEUP ---
            {
                id: 4,
                name: 'Matte Lipstick Set',
                category: 'makeup',
                price: 24.99,
                size: 'One Size',
                rating: 4.8,
                stock: 40,
                description: 'Long-lasting matte lipsticks with moisturizing vitamin E.',
                image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1000&auto=format&fit=crop'
            },
            {
                id: 5,
                name: 'Glow Foundation',
                category: 'makeup',
                price: 34.99,
                size: '30ml',
                rating: 4.6,
                stock: 30,
                description: 'Full coverage foundation with a dewy, radiant finish.',
                image: 'https://www.makeup.com/product-and-reviews/foundation/-/media/project/loreal/brand-sites/mdc/americas/us/articles/2021/november/18-dewy-glowy-foundations/best-glowy-foundations-body05-mudc-111821.jpg?w=600&h=600&hash=C87AE59AC05D7D7F3D70CE90D6BCCB84%27'
            },
            {
                id: 6,
                name: 'Eyeshadow Palette',
                category: 'makeup',
                price: 39.99,
                size: '12 shades',
                rating: 4.9,
                stock: 15,
                description: 'Nude and smoky pigmented shades for professional makeup artists.',
                image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1000&auto=format&fit=crop'
            },
            {
                id: 11,
                name: 'Volumizing Mascara',
                category: 'makeup',
                price: 19.99,
                size: 'Full Size',
                rating: 4.2,
                stock: 50,
                description: 'Waterproof mascara that adds instant volume and length.',
                image: 'https://th.bing.com/th/id/OIP.W02YUs_nXj5RVmohzA2KiQAAAA?w=128&h=182&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3'
            },
            {
                id: 14,
                name: 'Luxury Perfume',
                category: 'makeup',
                price: 89.99,
                size: '50ml',
                rating: 4.7,
                stock: 15,
                description: 'Sweet floral scent with notes of vanilla and jasmine.',
                image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop'
            },
    
            // --- PHONES ---
            {
                id: 7,
                name: 'iPhone 15 Pro',
                category: 'phones',
                price: 999.99,
                size: '256GB',
                rating: 4.9,
                stock: 8,
                description: 'Titanium design with the ultimate A17 Pro chip for gaming.',
                image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop'
            },
            {
                id: 8,
                name: 'Samsung Galaxy S24',
                category: 'phones',
                price: 899.99,
                size: '256GB',
                rating: 4.7,
                stock: 10,
                description: 'AI-powered smartphone with ultra-bright AMOLED display.',
                image: 'https://th.bing.com/th/id/OIP.43syDyCivYQ0l3mM0Ixz_QHaE8?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3'
            },
            {
                id: 9,
                name: 'Google Pixel 8',
                category: 'phones',
                price: 699.99,
                size: '128GB',
                rating: 4.4,
                stock: 20,
                description: 'The best Android camera experience with Google AI smarts.',
                image: 'https://th.bing.com/th/id/OIP.5neX7AqWlRoEPiEeuF1pxAHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3'
            },
            {
                id: 12,
                name: 'OnePlus 12',
                category: 'phones',
                price: 799.99,
                size: '512GB',
                rating: 4.5,
                stock: 14,
                description: 'Smooth performance with 100W super-fast wired charging.',
                image: 'https://tse4.mm.bing.net/th/id/OIP.uWTKoqxTSyh4r9dRZ4S1zQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3'
            },
            {
                id: 15,
                name: 'Nothing Phone (2)',
                category: 'phones',
                price: 599.99,
                size: '128GB',
                rating: 4.3,
                stock: 12,
                description: 'Unique transparent design with Glyph interface LED lights.',
                image: 'https://tse2.mm.bing.net/th/id/OIP.S1PCjHYYgbV46b5StLo5dAHaE8?rs=1&pid=ImgDetMain&o=7&rm=3'
            },
    
            // --- ACCESSORIES (New Category) ---
            {
                id: 16,
                name: 'Smart Watch Pro',
                category: 'accessories',
                price: 199.99,
                size: '44mm',
                rating: 4.6,
                stock: 25,
                description: 'Health tracking, heart rate monitor, and built-in GPS.',
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'
            },
            {
                id: 17,
                name: 'Wireless Headphones',
                category: 'accessories',
                price: 149.99,
                size: 'Adjustable',
                rating: 4.8,
                stock: 30,
                description: 'Noise-canceling over-ear headphones with 40h battery life.',
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop'
            },
            {
                id: 18,
                name: 'Leather Backpack',
                category: 'accessories',
                price: 89.99,
                size: 'Large',
                rating: 4.5,
                stock: 15,
                description: 'Handcrafted leather bag with laptop compartment.',
                image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'
            }
        ];
    }

    filterProducts(filters) {
        this.currentFilters = { ...this.currentFilters, ...filters };
        
        this.filteredProducts = this.products.filter(product => {
            const categoryMatch = this.currentFilters.category === 'all' || 
                                 product.category === this.currentFilters.category;
            const priceMatch = product.price <= this.currentFilters.maxPrice;
            const sizeMatch = this.currentFilters.size === 'all' || 
                            product.size === this.currentFilters.size;

            return categoryMatch && priceMatch && sizeMatch;
        });

        return this.filteredProducts;
    }

    getProductById(id) {
        return this.products.find(product => product.id === parseInt(id));
    }

    renderProducts(container, cartManager) {
        if (!container) return;

        if (this.filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="empty-products" style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem;">
                    <p style="font-size: 1.25rem; color: var(--text-secondary);">No products found matching your filters.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredProducts.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <button class="wishlist-btn${this.isWishlisted(product.id) ? ' wishlisted' : ''}" data-product-id="${product.id}" aria-label="Add to wishlist" type="button">
                    <i class="fa${this.isWishlisted(product.id) ? 's' : 'r'} fa-heart"></i>
                </button>
                ${product.stock > 0
                    ? `<span class="product-badge in-stock">In stock: ${product.stock}</span>`
                    : `<span class="product-badge out-of-stock">Out of stock</span>`}
                <div class="product-image-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-category">${product.category}</p>
                    <div class="product-rating">
                        <span class="star-icon">★</span>
                        <span class="rating-value">${product.rating.toFixed(1)}</span>
                    </div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <div class="product-actions">
                            <button class="details-btn" data-product-id="${product.id}" type="button">Details</button>
                            <button class="add-to-cart-btn" data-product-id="${product.id}" aria-label="Add to cart" type="button">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M12 5v14M5 12h14"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
                // ...existing code...
        // Wishlist heart toggle
        container.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.productId);
                this.toggleWishlist(productId);
                btn.classList.toggle('wishlisted');
                const icon = btn.querySelector('i');
                icon.className = btn.classList.contains('wishlisted') ? 'fas fa-heart' : 'far fa-heart';
                btn.classList.add('wishlist-animate');
                setTimeout(() => btn.classList.remove('wishlist-animate'), 400);
            });
        });

        // Add event listeners
        container.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (
                    !e.target.closest('.add-to-cart-btn') &&
                    !e.target.closest('.details-btn')
                ) {
                    const productId = card.dataset.productId;
                    window.location.href = `product.html?id=${productId}`;
                }
            });
        });

        container.querySelectorAll('.details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.productId;
                window.location.href = `product.html?id=${productId}`;
            });
        });

        container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.productId);
                const product = this.getProductById(productId);
                if (product && cartManager) {
                    cartManager.addItem(product, 1);
                }
            });
        });
    }
}

export default ProductsManager;
