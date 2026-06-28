import { initDOM, els } from "./dom.js";
import { debounce } from "../utils/helpers.js";

import { initTheme } from "./theme.js";
import { initProducts, setSearch, setCategory, setSort } from "./products.js";
import {
    updateCartUI,
    handleCartClick,
    closeCart,
    initCartButton,
} from "./cart.js";
import {
    handleProductClick,
    handleFeaturedAdd,
    closeModal,
    updateModalQuantity,
    addModalProductToCart,
} from "./modal.js";
import { initNavigation } from "./navigation.js";
import { initRevealAnimations } from "./animations.js";
// import { initForms } from "./forms.js";
import { initProductPage } from "./product-page.js";
import { initCartPage } from "./cart-page.js";
import { initCheckoutPage } from "./checkout.js";
import { initSuccessPage } from "./success.js";
import { closeMobileMenu } from "./mobile-menu.js";
import { initWishlist, closeWishlist } from "./wishlist.js";
import { initFeaturedSlider } from "./featured-slider.js";
import { initHeroSlider } from "./hero-slider.js";

export async function init() {
    initDOM();

    initTheme();
    updateCartUI();

    if (els.productsGrid) {
        await initProducts();
    }
    if (document.getElementById("featured-slider")) {
        await initFeaturedSlider();
    }

    await initProductPage();
    await initCartPage();
    initCheckoutPage();
    initSuccessPage();

    if (els.navbar) {
        initNavigation();
    }

    initRevealAnimations();
    if (document.getElementById("hero-slider")) {
        initHeroSlider();
    }

    initCartButton();
    initWishlist();

    if (els.searchInput) {
        els.searchInput.addEventListener(
            "input",
            debounce((e) => {
                setSearch(e.target.value);
            }, 300)
        );
    }

    if (els.filterCategory) {
        els.filterCategory.addEventListener("change", (e) => {
            setCategory(e.target.value);
        });
    }

    if (els.sortProducts) {
        els.sortProducts.addEventListener("change", (e) => {
            setSort(e.target.value);
        });
    }

    if (els.productsGrid) {
        els.productsGrid.addEventListener("click", handleProductClick);
    }

    if (els.cartItems) {
        els.cartItems.addEventListener("click", handleCartClick);
    }

    document.querySelectorAll(".featured-add-btn").forEach((btn) => {
        btn.addEventListener("click", handleFeaturedAdd);
    });

    if (els.modalClose) {
        els.modalClose.addEventListener("click", closeModal);
    }

    if (els.modalBackdrop) {
        els.modalBackdrop.addEventListener("click", closeModal);
    }

    if (els.modalQtyMinus) {
        els.modalQtyMinus.addEventListener("click", () => {
            updateModalQuantity(-1);
        });
    }

    if (els.modalQtyPlus) {
        els.modalQtyPlus.addEventListener("click", () => {
            updateModalQuantity(1);
        });
    }

    if (els.modalAddCart) {
        els.modalAddCart.addEventListener("click", addModalProductToCart);
    }

    if (els.overlay) {
        els.overlay.addEventListener("click", () => {
            closeCart();
            closeMobileMenu();
            closeWishlist();
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
            closeCart();
            closeMobileMenu();
            closeWishlist();
        }
    });
}