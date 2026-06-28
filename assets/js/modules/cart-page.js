import { state } from "./state.js";
import { loadProducts } from "./products.service.js";
import { getCart, saveCart } from "./storage.js";
import { formatPrice, escapeHTML } from "../utils/helpers.js";
import { showSuccess, showError } from "./toast.js";

const COUPONS = {
    NOVA10: { discount: 0.1, label: "10% off" },
    NOVA20: { discount: 0.2, label: "20% off" },
    FREESHIP: { discount: 0, freeShipping: true, label: "Free Shipping" },
};

const TAX_RATE = 0.08;
const SHIPPING_COST = 9.99;
const FREE_SHIPPING_THRESHOLD = 99;

let appliedCoupon = null;

function getCartItems() {
    return getCart();
}

function saveCartItems(items) {
    saveCart(items);
    state.cart = items;
}

function updateQuantity(productId, delta) {
    const cart = getCartItems();
    const item = cart.find((i) => i.id === productId);

    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        removeItem(productId);
        return;
    }

    saveCartItems(cart);
    renderCartPage();
}

function removeItem(productId) {
    const cart = getCartItems().filter((i) => i.id !== productId);
    saveCartItems(cart);
    renderCartPage();
}

function calculateSummary(cart) {
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    let discount = 0;
    let shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

    if (appliedCoupon) {
        if (appliedCoupon.freeShipping) {
            shipping = 0;
        } else {
            discount = subtotal * appliedCoupon.discount;
        }
    }

    const tax = (subtotal - discount) * TAX_RATE;
    const total = subtotal - discount + shipping + tax;

    return { subtotal, discount, shipping, tax, total };
}

function updateSummary(cart) {
    const { subtotal, discount, shipping, tax, total } =
        calculateSummary(cart);

    const subtotalEl = document.getElementById("summary-subtotal");
    const shippingEl = document.getElementById("summary-shipping");
    const taxEl = document.getElementById("summary-tax");
    const discountEl = document.getElementById("summary-discount");
    const totalEl = document.getElementById("summary-total");
    const discountRow = document.querySelector(".summary-row.discount");

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (shippingEl)
        shippingEl.textContent =
            shipping === 0 ? "Free" : formatPrice(shipping);
    if (taxEl) taxEl.textContent = formatPrice(tax);
    if (discountEl) discountEl.textContent = `-${formatPrice(discount)}`;
    if (totalEl) totalEl.textContent = formatPrice(total);
    if (discountRow)
        discountRow.style.display = discount > 0 ? "flex" : "none";
}

function renderCartItems(cart) {
    const container = document.getElementById("cart-page-items");

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <h2>Your cart is empty</h2>
                <p>Add some products to get started.</p>
                <a href="index.html#products" class="btn btn-primary">
                    Browse Products
                </a>
            </div>
        `;

        const checkoutBtn = document.getElementById("go-checkout");
        if (checkoutBtn) checkoutBtn.disabled = true;

        return;
    }

    const checkoutBtn = document.getElementById("go-checkout");
    if (checkoutBtn) checkoutBtn.disabled = false;

    container.innerHTML = cart
        .map(
            (item) => `
        <div class="cart-page-item" data-id="${escapeHTML(item.id)}">

            <div class="cart-page-item-image">
                <img
                    src="${escapeHTML(item.image)}"
                    alt="${escapeHTML(item.name)}"
                    loading="lazy"
                >
            </div>

            <div class="cart-page-item-info">
                <div class="cart-page-item-name">
                    ${escapeHTML(item.name)}
                </div>
                <div class="cart-page-item-price">
                    ${formatPrice(item.price)} each
                </div>
                <div class="cart-page-item-controls">
                    <div class="cart-page-qty">
                        <button
                            data-action="decrease"
                            data-id="${escapeHTML(item.id)}"
                            aria-label="Decrease quantity"
                        >−</button>
                        <span>${item.quantity}</span>
                        <button
                            data-action="increase"
                            data-id="${escapeHTML(item.id)}"
                            aria-label="Increase quantity"
                        >+</button>
                    </div>
                    <button
                        class="cart-page-remove"
                        data-action="remove"
                        data-id="${escapeHTML(item.id)}"
                        aria-label="Remove ${escapeHTML(item.name)}"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="cart-page-item-total">
                ${formatPrice(item.price * item.quantity)}
            </div>

        </div>
    `
        )
        .join("");

    container.addEventListener("click", (event) => {
        const button = event.target.closest("[data-action]");

        if (!button) return;

        const action = button.dataset.action;
        const id = button.dataset.id;

        if (action === "increase") updateQuantity(id, 1);
        if (action === "decrease") updateQuantity(id, -1);
        if (action === "remove") removeItem(id);
    });
}

function renderCartPage() {
    const cart = getCartItems();
    renderCartItems(cart);
    updateSummary(cart);
}

function initCoupon() {
    const couponBtn = document.getElementById("coupon-btn");
    const couponInput = document.getElementById("coupon-input");
    const couponApplied = document.getElementById("coupon-applied");

    if (!couponBtn || !couponInput) return;

    couponBtn.addEventListener("click", () => {
        const code = couponInput.value.trim().toUpperCase();

        if (!code) {
            showError("Please enter a coupon code.");
            return;
        }

        const coupon = COUPONS[code];

        if (!coupon) {
            showError("Invalid coupon code.");
            return;
        }

        appliedCoupon = coupon;

        if (couponApplied) {
            couponApplied.textContent = `✅ Coupon applied: ${coupon.label}`;
            couponApplied.classList.add("show");
        }

        showSuccess(`Coupon applied: ${coupon.label}`);

        renderCartPage();
    });
}

function initCheckout() {
    const checkoutBtn = document.getElementById("go-checkout");

    if (!checkoutBtn) return;

    checkoutBtn.addEventListener("click", () => {
        const cart = getCartItems();

        if (cart.length === 0) {
            showError("Your cart is empty.");
            return;
        }

        const summary = calculateSummary(cart);

        localStorage.setItem(
            "novatech_checkout",
            JSON.stringify({ cart, summary })
        );

        window.location.href = "checkout.html";
    });
}

export async function initCartPage() {
    const container = document.getElementById("cart-page-items");

    if (!container) return;

    const products = await loadProducts();
    state.products = products;

    renderCartPage();
    initCoupon();
    initCheckout();
}