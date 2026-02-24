import { showToast } from './toast.js';
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartCount();
        this.bindEvents();
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
        this.dispatchCartUpdate();
    }

    addItem(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
            showToast({ message: `Increased quantity for ${product.name}.`, type: 'info' });
        } else {
            this.cart.push({ ...product, quantity });
            showToast({ message: `Added ${product.name} to cart!`, type: 'success' });
        }
        this.saveCart();
        this.showAddToCartAnimation();
    }

    removeItem(productId) {
        const item = this.cart.find(i => i.id === productId);
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        if (item) showToast({ message: `Removed ${item.name} from cart.`, type: 'warning' });
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                showToast({ message: `Updated quantity for ${item.name}.`, type: 'info' });
            }
        } else {
            showToast({ message: 'Item not found in cart.', type: 'error' });
        }
    }

    getCartItems() {
        return this.cart;
    }

    getCartCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    updateCartCount() {
        const cartCountElements = document.querySelectorAll('#cartCount');
        const count = this.getCartCount();
        cartCountElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    showAddToCartAnimation() {
        const event = new CustomEvent('cartItemAdded', {
            detail: { message: 'Item added to cart!' }
        });
        document.dispatchEvent(event);
    }

    dispatchCartUpdate() {
        const event = new CustomEvent('cartUpdated', {
            detail: { cart: this.cart }
        });
        document.dispatchEvent(event);
    }

    bindEvents() {
        document.addEventListener('cartUpdated', () => {
            this.updateCartCount();
        });
    }
}

export default CartManager;
