import { loadProducts } from "./products.service.js";
import { escapeHTML, formatPrice } from "../utils/helpers.js";
import { addToCart } from "./cart.js";
import { state } from "./state.js";

export async function initFeaturedSlider() {
    const container = document.getElementById("featured-slider");

    if (!container) return;

    const products = await loadProducts();

    if (state.products.length === 0) {
        state.products = products;
    }

    const featured = products.slice(0, 8);

    container.innerHTML = featured
        .map(
            (product) => `
        <div class="swiper-slide">
            <div class="featured-slide-card" data-id="${escapeHTML(product.id)}">
                <div class="featured-slide-image">
                    <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy">
                    ${
                        product.badge
                            ? `<span class="featured-slide-badge">${escapeHTML(product.badge)}</span>`
                            : ""
                    }
                </div>
                <div class="featured-slide-body">
                    <span class="featured-slide-category">${escapeHTML(product.category)}</span>
                    <h3 class="featured-slide-title">${escapeHTML(product.name)}</h3>
                    <p class="featured-slide-desc">${escapeHTML(product.description)}</p>
                    <div class="featured-slide-footer">
                        <span class="featured-slide-price">${formatPrice(product.price)}</span>
                        <button class="btn btn-primary btn-sm" data-slide-add="${escapeHTML(product.id)}">
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
        )
        .join("");

    // eslint-disable-next-line no-undef
    new Swiper(".featured-swiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        navigation: {
            nextEl: ".featured-next",
            prevEl: ".featured-prev",
        },
        pagination: {
            el: ".featured-pagination",
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            968: {
                slidesPerView: 3,
                spaceBetween: 24,
            },
            1200: {
                slidesPerView: 4,
                spaceBetween: 24,
            },
        },
    });

    container.addEventListener("click", (e) => {
        const addBtn = e.target.closest("[data-slide-add]");
        const card = e.target.closest(".featured-slide-card");

        if (addBtn) {
            e.stopPropagation();
            addToCart(addBtn.dataset.slideAdd);
            return;
        }

        if (card) {
            window.location.href = `product.html?id=${card.dataset.id}`;
        }
    });
}