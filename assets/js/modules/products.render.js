import { updateWishlistButtons } from "./wishlist.js";
import { escapeHTML, formatPrice, generateStars } from "../utils/helpers.js";
import { els } from "./dom.js";

export function showSkeletons(count = 8) {
    let html = "";

    for (let i = 0; i < count; i++) {
        html += `
            <div class="skeleton-card">
                <div class="skeleton-image"></div>
                <div class="skeleton-body">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                </div>
            </div>
        `;
    }

    els.productsGrid.innerHTML = html;
    els.productsEmpty.style.display = "none";
}

export function renderProducts(products) {
    if (products.length === 0) {
        els.productsGrid.innerHTML = "";
        els.productsEmpty.style.display = "block";
        return;
    }

    els.productsEmpty.style.display = "none";

    els.productsGrid.innerHTML = products
        .map(
            (product) => `
        <article class="product-card reveal revealed" data-id="${escapeHTML(product.id)}">

            <div
                class="product-card-image"
                data-action="open-modal"
                data-id="${escapeHTML(product.id)}"
                tabindex="0"
                role="button"
                aria-label="View ${escapeHTML(product.name)} preview"
            >
                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                    width="500"
                    height="400"
                >

                ${
                    product.badge
                        ? `<span class="product-card-badge">${escapeHTML(product.badge)}</span>`
                        : ""
                }
            </div>

            <div class="product-card-body">

                <span class="product-card-category">
                    ${escapeHTML(product.category)}
                </span>

                <h3 class="product-card-title">
                    ${escapeHTML(product.name)}
                </h3>

                <p class="product-card-desc">
                    ${escapeHTML(product.description)}
                </p>

                <div class="product-card-rating">
                    <div class="stars">
                        ${generateStars(product.rating, 14)}
                    </div>
                    <span>
                        ${product.rating} (${product.reviews.toLocaleString()})
                    </span>
                </div>

                <div class="product-card-footer">

                    <span class="product-card-price">
                        ${formatPrice(product.price)}
                    </span>

                    <div class="product-card-actions">

                        <button
                            class="product-card-btn"
                            data-action="toggle-wishlist"
                            data-id="${escapeHTML(product.id)}"
                            aria-label="Toggle wishlist"
                            title="Wishlist"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>

                        <a
                            class="product-card-btn"
                            href="product.html?id=${escapeHTML(product.id)}"
                            aria-label="View details"
                            title="View details"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </a>

                        <button
                            class="product-card-btn add-cart-btn"
                            data-action="add-cart"
                            data-id="${escapeHTML(product.id)}"
                            aria-label="Add to cart"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add
                        </button>

                    </div>

                </div>

            </div>

        </article>
    `
        )
        .join("");

    updateWishlistButtons();
}