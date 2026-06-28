import { state } from "./state.js";
import { els } from "./dom.js";
import { getProductById } from "./products.js";
import { addToCart } from "./cart.js";
import { toggleWishlist } from "./wishlist.js";
import { formatPrice, generateStars } from "../utils/helpers.js";

export function openModal(productId) {
    const product = getProductById(productId);

    if (!product) return;

    state.modalProduct = product;
    state.modalQuantity = 1;

    els.modalImg.src = product.image;
    els.modalImg.alt = product.name;
    els.modalCategory.textContent = product.category;
    els.modalTitle.textContent = product.name;
    els.modalDescription.textContent = product.description;
    els.modalStars.innerHTML = generateStars(product.rating, 18);
    els.modalReviewsCount.textContent =
        product.rating + " (" + product.reviews.toLocaleString() + " reviews)";
    els.modalPrice.textContent = formatPrice(product.price);
    els.modalQtyValue.textContent = "1";

    els.modalFeatures.innerHTML = (product.features || [])
        .map(function (feature) {
            return "<li>" + feature + "</li>";
        })
        .join("");

    els.productModal.classList.add("open");
    els.productModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    setTimeout(function () {
        els.modalClose.focus();
    }, 100);
}

export function closeModal() {
    els.productModal.classList.remove("open");
    els.productModal.setAttribute("aria-hidden", "true");

    if (!els.cartSidebar.classList.contains("open")) {
        document.body.style.overflow = "";
    }

    state.modalProduct = null;
}

export function updateModalQuantity(delta) {
    state.modalQuantity = Math.max(1, state.modalQuantity + delta);
    els.modalQtyValue.textContent = state.modalQuantity;
}

export function addModalProductToCart() {
    if (!state.modalProduct) return;

    addToCart(state.modalProduct.id, state.modalQuantity);
    closeModal();
}

export function handleProductClick(event) {
    var target = event.target.closest("[data-action]");

    if (!target) return;

    var action = target.dataset.action;
    var id = target.dataset.id;

    if (action === "open-modal") {
        openModal(id);
        return;
    }

    if (action === "add-cart") {
        const card = target.closest(".product-card");
        const image = card?.querySelector("img");
        addToCart(id, 1, image);
        return;
    }

    if (action === "toggle-wishlist") {
        toggleWishlist(id);
        return;
    }
}

export function handleFeaturedAdd(event) {
    var button = event.target.closest(".featured-add-btn");

    if (!button) return;

    addToCart(button.dataset.id);
}