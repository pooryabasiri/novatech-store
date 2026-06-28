import { state } from "./state.js";
import { els } from "./dom.js";
import { saveCart } from "./storage.js";
import { formatPrice, escapeHTML } from "../utils/helpers.js";
import { showToast } from "./toast.js";
import { getProductById } from "./products.js";
import { flyToCart } from "./fly-to-cart.js";

function getCartCount() {
    return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
    return state.cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
}

function syncCart() {
    saveCart(state.cart);
    updateCartUI();
}

function renderCartItems() {
    if (!els.cartItems) return;

    els.cartItems.innerHTML = state.cart
        .map(
            (item) => `
        <div class="cart-item" data-id="${escapeHTML(item.id)}">
            <div class="cart-item-image">
                <img
                    src="${escapeHTML(item.image)}"
                    alt="${escapeHTML(item.name)}"
                    loading="lazy"
                    width="80"
                    height="80"
                >
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">
                    ${escapeHTML(item.name)}
                </div>
                <div class="cart-item-price">
                    ${formatPrice(item.price)}
                </div>
                <div class="cart-item-controls">
                    <div class="cart-qty-controls">
                        <button
                            class="cart-qty-btn"
                            data-action="cart-qty"
                            data-id="${escapeHTML(item.id)}"
                            data-delta="-1"
                            aria-label="Decrease quantity"
                        >−</button>
                        <span class="cart-qty-value">
                            ${item.quantity}
                        </span>
                        <button
                            class="cart-qty-btn"
                            data-action="cart-qty"
                            data-id="${escapeHTML(item.id)}"
                            data-delta="1"
                            aria-label="Increase quantity"
                        >+</button>
                    </div>
                    <button
                        class="cart-remove-btn"
                        data-action="cart-remove"
                        data-id="${escapeHTML(item.id)}"
                        aria-label="Remove ${escapeHTML(item.name)} from cart"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `
        )
        .join("");
}

export function updateCartUI() {
    const count = getCartCount();
    const total = getCartTotal();

    if (els.cartCounter) {
        els.cartCounter.textContent = count;
        if (count > 0) {
            els.cartCounter.classList.add("show");
        } else {
            els.cartCounter.classList.remove("show");
        }
    }

    if (els.cartCountBadge) {
        els.cartCountBadge.textContent = count;
    }

    if (els.cartTotal) {
        els.cartTotal.textContent = formatPrice(total);
    }

    if (count > 0) {
        if (els.cartEmpty) els.cartEmpty.style.display = "none";
        if (els.cartItems) els.cartItems.style.display = "block";
        if (els.cartFooter) els.cartFooter.style.display = "block";
    } else {
        if (els.cartEmpty) els.cartEmpty.style.display = "flex";
        if (els.cartItems) els.cartItems.style.display = "none";
        if (els.cartFooter) els.cartFooter.style.display = "none";
    }

    renderCartItems();
}

export function addToCart(productId, qty = 1, imageElement = null) {
    const product = getProductById(productId);

    if (!product) return;

    const existing = state.cart.find((item) => item.id === productId);

    if (existing) {
        existing.quantity += qty;
    } else {
        state.cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: qty,
        });
    }

    syncCart();
    showToast(`${product.name} added to cart`);

    if (imageElement) {
        flyToCart(imageElement);
    }
}

export function removeFromCart(productId) {
    state.cart = state.cart.filter((item) => item.id !== productId);
    syncCart();
}

export function updateCartQuantity(productId, delta) {
    const item = state.cart.find((c) => c.id === productId);

    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    syncCart();
}

export function clearCart() {
    state.cart = [];
    syncCart();
}

export function openCart() {
    if (!els.cartSidebar) return;
    els.cartSidebar.classList.add("open");
    if (els.overlay) els.overlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

export function closeCart() {
    if (!els.cartSidebar) return;
    els.cartSidebar.classList.remove("open");
    if (els.overlay) els.overlay.classList.remove("active");
    document.body.style.overflow = "";
}

export function handleCartClick(e) {
    const target = e.target.closest("[data-action]");

    if (!target) return;

    const action = target.dataset.action;
    const id = target.dataset.id;

    if (action === "cart-qty") {
        const delta = parseInt(target.dataset.delta, 10);
        updateCartQuantity(id, delta);
    } else if (action === "cart-remove") {
        removeFromCart(id);
    }
}

export function initCartButton() {
    if (!els.checkoutBtn) return;

    els.checkoutBtn.addEventListener("click", () => {
        if (state.cart.length === 0) return;
        window.location.href = "cart.html";
    });
}