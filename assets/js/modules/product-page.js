import { state } from "./state.js";
import { addToCart } from "./cart.js";
import { loadProducts } from "./products.service.js";
import { showSuccess, showError } from "./toast.js";
import { formatPrice, escapeHTML, generateStars } from "../utils/helpers.js";
import { STORAGE_KEYS } from "../utils/constants.js";
import { getViewed, saveViewed } from "./storage.js";

function getProductId() {
    return new URLSearchParams(window.location.search).get("id");
}

function getCategoryLabel(category) {
    const labels = {
        phone: "Phones",
        laptop: "Laptops",
        audio: "Audio",
        wearable: "Wearables",
        accessory: "Accessories",
    };

    return labels[category] || category;
}

function getProductImages(product) {
    const images =
        Array.isArray(product.images) && product.images.length
            ? product.images
            : [product.image];

    return [...new Set(images.filter(Boolean))];
}

function getWishlist() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];
    } catch {
        return [];
    }
}

function saveWishlist(list) {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
}

function isWishlisted(productId) {
    return getWishlist().includes(productId);
}

function updateWishlistButton(button, productId) {
    if (!button) return;

    const active = isWishlisted(productId);

    button.classList.toggle("active", active);
    button.innerHTML = active ? "♥ Wishlisted" : "♡ Wishlist";
}

function toggleWishlist(product) {
    const wishlist = getWishlist();
    const exists = wishlist.includes(product.id);

    let nextWishlist;

    if (exists) {
        nextWishlist = wishlist.filter((id) => id !== product.id);
        showSuccess(`${product.name} removed from wishlist`);
    } else {
        nextWishlist = [...wishlist, product.id];
        showSuccess(`${product.name} added to wishlist`);
    }

    saveWishlist(nextWishlist);

    return !exists;
}

function saveRecentlyViewed(productId) {
    const viewed = getViewed().filter((id) => id !== productId);
    viewed.unshift(productId);
    saveViewed(viewed.slice(0, 8));
}

function createProductCards(products) {
    return products
        .map(
            (product) => `
        <article class="product-card">
            <a
                class="product-card-image"
                href="product.html?id=${escapeHTML(product.id)}"
                aria-label="View ${escapeHTML(product.name)}"
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
            </a>

            <div class="product-card-body">
                <span class="product-card-category">${escapeHTML(product.category)}</span>
                <h3 class="product-card-title">${escapeHTML(product.name)}</h3>

                <div class="product-card-rating">
                    <div class="stars">${generateStars(product.rating, 12)}</div>
                    <span>${product.rating} (${product.reviews.toLocaleString()})</span>
                </div>

                <div class="product-card-footer">
                    <span class="product-card-price">${formatPrice(product.price)}</span>

                    <div class="product-card-actions">
                        <a
                            class="product-card-btn"
                            href="product.html?id=${escapeHTML(product.id)}"
                            aria-label="Open ${escapeHTML(product.name)}"
                            title="View details"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </a>

                        <button
                            class="product-card-btn add-cart-btn"
                            data-add-cart="${escapeHTML(product.id)}"
                            aria-label="Add ${escapeHTML(product.name)} to cart"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </article>
    `
        )
        .join("");
}

function attachCardActions(container) {
    if (!container) return;

    container.addEventListener("click", (event) => {
        const addButton = event.target.closest("[data-add-cart]");

        if (!addButton) return;

        addToCart(addButton.dataset.addCart);
    });
}

function renderCollection(section, grid, products) {
    if (!section || !grid) return;

    if (!products.length) {
        section.style.display = "none";
        return;
    }

    section.style.display = "";
    grid.innerHTML = createProductCards(products);
    attachCardActions(grid);
}

export async function initProductPage() {
    const container = document.getElementById("product-content");

    if (!container) return;

    const relatedSection = document.getElementById("related-section");
    const relatedGrid = document.getElementById("related-products-grid");
    const recentSection = document.getElementById("recent-section");
    const recentGrid = document.getElementById("recent-products-grid");

    const products = await loadProducts();
    state.products = products;

    const productId = getProductId();
    const product = products.find((item) => item.id === productId);

    if (!product) {
        container.innerHTML = `
            <div class="product-not-found">
                <h2>Product Not Found</h2>
                <p>The product you are looking for does not exist.</p>
                <a href="index.html#products" class="btn btn-primary">Back to products</a>
            </div>
        `;

        if (relatedSection) relatedSection.style.display = "none";
        if (recentSection) recentSection.style.display = "none";
        return;
    }

    saveRecentlyViewed(product.id);

    const images = getProductImages(product);
    const categoryLabel = getCategoryLabel(product.category);
    const firstImage = images[0];

    container.innerHTML = `
        <div class="product-layout">

            <div class="product-gallery">

                <div class="product-thumbnails">
                    ${images
                        .map(
                            (image, index) => `
                        <button
                            type="button"
                            class="product-thumb ${index === 0 ? "active" : ""}"
                            data-image="${escapeHTML(image)}"
                            aria-label="View image ${index + 1}"
                        >
                            <img
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(product.name)} thumbnail ${index + 1}"
                            >
                        </button>
                    `
                        )
                        .join("")}
                </div>

                <div class="product-main">
                    <img
                        id="product-main-image"
                        src="${escapeHTML(firstImage)}"
                        alt="${escapeHTML(product.name)}"
                    >
                </div>

            </div>

            <div class="product-info">

                <div class="breadcrumb">
                    <a href="index.html">Home</a>
                    <span>/</span>
                    <a href="index.html#products">${escapeHTML(categoryLabel)}</a>
                    <span>/</span>
                    <strong>${escapeHTML(product.name)}</strong>
                </div>

                ${
                    product.badge
                        ? `<span class="product-page-badge">${escapeHTML(product.badge)}</span>`
                        : ""
                }

                <span class="product-category">${escapeHTML(categoryLabel)}</span>

                <h1>${escapeHTML(product.name)}</h1>

                <div class="product-rating-row">
                    <div class="product-stars">
                        ${generateStars(product.rating, 16)}
                    </div>
                    <span>${product.rating} · ${product.reviews.toLocaleString()} reviews</span>
                </div>

                <div class="product-price">${formatPrice(product.price)}</div>

                <p class="product-description">
                    ${escapeHTML(product.description)}
                </p>

                <ul class="product-features">
                    ${(product.features || [])
                        .map((feature) => `<li>${escapeHTML(feature)}</li>`)
                        .join("")}
                </ul>

                <div class="product-status">
                    <span class="product-stock">In Stock</span>
                    <span class="product-delivery">Free delivery in 2–3 business days</span>
                </div>

                <div class="product-actions">
                    <div class="quantity-selector">
                        <button type="button" id="qty-minus" aria-label="Decrease quantity">−</button>
                        <span id="qty-value">1</span>
                        <button type="button" id="qty-plus" aria-label="Increase quantity">+</button>
                    </div>

                    <button class="btn btn-primary" id="product-add-cart">
                        Add To Cart
                    </button>

                    <button class="btn btn-outline product-wishlist-btn" id="wishlist-btn" type="button">
                        ♡ Wishlist
                    </button>

                    <button class="btn btn-ghost" id="share-btn" type="button">
                        Share
                    </button>
                </div>

            </div>

        </div>
    `;

    const mainImage = document.getElementById("product-main-image");
    const thumbButtons = document.querySelectorAll(".product-thumb");
    const qtyValue = document.getElementById("qty-value");
    const addCartButton = document.getElementById("product-add-cart");
    const minusButton = document.getElementById("qty-minus");
    const plusButton = document.getElementById("qty-plus");
    const wishlistButton = document.getElementById("wishlist-btn");
    const shareButton = document.getElementById("share-btn");

    let quantity = 1;

    thumbButtons.forEach((button) => {
        button.addEventListener("click", () => {
            thumbButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            mainImage.src = button.dataset.image;
        });
    });

    minusButton.addEventListener("click", () => {
        quantity = Math.max(1, quantity - 1);
        qtyValue.textContent = String(quantity);
    });

    plusButton.addEventListener("click", () => {
        quantity += 1;
        qtyValue.textContent = String(quantity);
    });

    addCartButton.addEventListener("click", () => {
        addToCart(product.id, quantity);
    });

    updateWishlistButton(wishlistButton, product.id);

    wishlistButton.addEventListener("click", () => {
        toggleWishlist(product);
        updateWishlistButton(wishlistButton, product.id);
    });

    shareButton.addEventListener("click", async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: product.name,
                    text: product.description,
                    url: window.location.href,
                });
                return;
            }

            await navigator.clipboard.writeText(window.location.href);
            showSuccess("Product link copied to clipboard");
        } catch {
            showError("Unable to share this product");
        }
    });

    const relatedProducts = products
        .filter(
            (item) =>
                item.category === product.category && item.id !== product.id
        )
        .slice(0, 4);

    renderCollection(relatedSection, relatedGrid, relatedProducts);

    const viewedIds = getViewed().filter((id) => id !== product.id);
    const recentProducts = viewedIds
        .map((id) => products.find((item) => item.id === id))
        .filter(Boolean)
        .slice(0, 4);

    renderCollection(recentSection, recentGrid, recentProducts);
}