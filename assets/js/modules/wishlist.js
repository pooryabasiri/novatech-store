import { state } from "./state.js";
import { load, save } from "./storage.js";
import { showToast } from "./toast.js";
import { formatPrice, escapeHTML } from "../utils/helpers.js";
import { addToCart } from "./cart.js";

const STORAGE_KEY = "novatech_wishlist";

let listenerAttached = false;

export function getWishlist() {
    return load(STORAGE_KEY, []);
}

function saveWishlist(list) {
    save(STORAGE_KEY, list);
}

export function toggleWishlist(productId) {
    const wishlist = getWishlist();
    const index = wishlist.indexOf(productId);

    if (index > -1) {
        wishlist.splice(index, 1);
        showToast("Removed from wishlist");
    } else {
        wishlist.push(productId);
        showToast("Added to wishlist ❤️");
    }

    saveWishlist(wishlist);
    updateWishlistButtons();
    renderWishlistSidebar();
    updateWishlistCounter();
}

export function isInWishlist(productId) {
    return getWishlist().includes(productId);
}

export function updateWishlistButtons() {
    const wishlist = getWishlist();

    document
        .querySelectorAll("[data-action='toggle-wishlist']")
        .forEach((btn) => {
            const id = btn.dataset.id;

            if (wishlist.includes(id)) {
                btn.classList.add("active");
                btn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24"
                        fill="var(--error)"
                        stroke="var(--error)"
                        stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>`;
            } else {
                btn.classList.remove("active");
                btn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>`;
            }
        });
}

export function updateWishlistCounter() {
    const counter = document.getElementById("wishlist-counter");
    const badge = document.getElementById("wishlist-count-badge");
    const count = getWishlist().length;

    if (counter) {
        counter.textContent = count;
        if (count > 0) counter.classList.add("show");
        else counter.classList.remove("show");
    }

    if (badge) badge.textContent = count;
}

function handleWishlistClick(e) {
    const addBtn = e.target.closest("[data-wishlist-add]");
    const removeBtn = e.target.closest("[data-wishlist-remove]");

    if (addBtn) {
        addToCart(addBtn.dataset.wishlistAdd);
    }

    if (removeBtn) {
        toggleWishlist(removeBtn.dataset.wishlistRemove);
    }
}

export function renderWishlistSidebar() {
    const container = document.getElementById("wishlist-items");
    const emptyEl = document.getElementById("wishlist-empty");

    if (!container) return;

    const wishlist = getWishlist();
    const products = wishlist
        .map((id) => state.products.find((p) => p.id === id))
        .filter(Boolean);

    if (products.length === 0) {
        container.innerHTML = "";
        container.style.display = "none";
        if (emptyEl) emptyEl.style.display = "flex";
        return;
    }

    if (emptyEl) emptyEl.style.display = "none";
    container.style.display = "block";

    container.innerHTML = products
        .map(
            (product) => `
        <div class="wishlist-item" data-id="${escapeHTML(product.id)}">
            <div class="wishlist-item-image">
                <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy">
            </div>
            <div class="wishlist-item-info">
                <div class="wishlist-item-title">${escapeHTML(product.name)}</div>
                <div class="wishlist-item-price">${formatPrice(product.price)}</div>
                <div class="wishlist-item-actions">
                    <button class="wishlist-add-btn" data-wishlist-add="${escapeHTML(product.id)}">
                        Add to Cart
                    </button>
                    <button class="wishlist-remove-btn" data-wishlist-remove="${escapeHTML(product.id)}" aria-label="Remove">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

    if (!listenerAttached) {
        container.addEventListener("click", handleWishlistClick);
        listenerAttached = true;
    }
}

export function openWishlist() {
    const sidebar = document.getElementById("wishlist-sidebar");
    const overlay = document.getElementById("overlay");

    if (sidebar) sidebar.classList.add("open");
    if (overlay) overlay.classList.add("active");
    document.body.style.overflow = "hidden";

    renderWishlistSidebar();
}

export function closeWishlist() {
    const sidebar = document.getElementById("wishlist-sidebar");
    const overlay = document.getElementById("overlay");

    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("active");
    document.body.style.overflow = "";
}

export function initWishlist() {
    updateWishlistCounter();

    const openBtn = document.getElementById("wishlist-btn");
    const closeBtn = document.getElementById("wishlist-close");

    if (openBtn) openBtn.addEventListener("click", openWishlist);
    if (closeBtn) closeBtn.addEventListener("click", closeWishlist);
}