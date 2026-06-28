export const $ = (selector, parent = document) =>
    parent.querySelector(selector);

export const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

export function getEls() {
    return {
        navbar: $("#navbar"),
        overlay: $("#overlay"),
        cartSidebar: $("#cart-sidebar"),
        cartBtn: $("#cart-btn"),
        cartClose: $("#cart-close"),
        cartItems: $("#cart-items"),
        cartEmpty: $("#cart-empty"),
        cartFooter: $("#cart-footer"),
        cartCountBadge: $("#cart-count-badge"),
        cartCounter: $("#cart-counter"),
        cartTotal: $("#cart-total"),
        checkoutBtn: $("#checkout-btn"),
        mobileMenu: $("#mobile-menu"),
        mobileMenuBtn: $("#mobile-menu-btn"),
        mobileMenuClose: $("#mobile-menu-close"),
        mobileThemeToggle: $("#mobile-theme-toggle"),
        themeToggle: $("#theme-toggle"),
        searchInput: $("#search-input"),
        filterCategory: $("#filter-category"),
        sortProducts: $("#sort-products"),
        productsGrid: $("#products-grid"),
        productsEmpty: $("#products-empty"),
        productModal: $("#product-modal"),
        modalClose: $("#modal-close"),
        modalBackdrop: $("#modal-backdrop"),
        modalImg: $("#modal-img"),
        modalCategory: $("#modal-category"),
        modalTitle: $("#modal-title"),
        modalDescription: $("#modal-description"),
        modalStars: $("#modal-stars"),
        modalReviewsCount: $("#modal-reviews-count"),
        modalPrice: $("#modal-price"),
        modalFeatures: $("#modal-features"),
        modalQtyMinus: $("#modal-qty-minus"),
        modalQtyPlus: $("#modal-qty-plus"),
        modalQtyValue: $("#modal-qty-value"),
        modalAddCart: $("#modal-add-cart"),
        backToTop: $("#back-to-top"),
        contactForm: $("#contact-form"),
        newsletterForm: $("#newsletter-form"),
        toastContainer: $("#toast-container"),
    };
}

export let els = {};

export function initDOM() {
    els = getEls();
}