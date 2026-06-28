import { els } from "./dom.js";
import { toggleTheme } from "./theme.js";
import { openCart, closeCart } from "./cart.js";
import { openMobileMenu, closeMobileMenu } from "./mobile-menu.js";

function updateActiveNav() {
    const sections = ["home", "products", "reviews", "contact"];
    const scrollPos = window.scrollY + 100;

    let current = "home";

    sections.forEach((id) => {
        const section = document.getElementById(id);

        if (section && section.offsetTop <= scrollPos) {
            current = id;
        }
    });

    document.querySelectorAll(".nav-link, .mobile-nav-link").forEach((link) => {
        const href = link.getAttribute("href");

        if (href === `#${current}`) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

function handleScroll() {
    const scrollY = window.scrollY;

    if (els.navbar) {
        if (scrollY > 50) {
            els.navbar.classList.add("scrolled");
        } else {
            els.navbar.classList.remove("scrolled");
        }
    }

    if (els.backToTop) {
        if (scrollY > 500) {
            els.backToTop.classList.add("visible");
        } else {
            els.backToTop.classList.remove("visible");
        }
    }

    updateActiveNav();
}

export function initNavigation() {
    if (els.themeToggle) {
        els.themeToggle.addEventListener("click", toggleTheme);
    }

    if (els.mobileThemeToggle) {
        els.mobileThemeToggle.addEventListener("click", toggleTheme);
    }

    if (els.cartBtn) {
        els.cartBtn.addEventListener("click", openCart);
    }

    if (els.cartClose) {
        els.cartClose.addEventListener("click", closeCart);
    }

    if (els.mobileMenuBtn) {
        els.mobileMenuBtn.addEventListener("click", openMobileMenu);
    }

    if (els.mobileMenuClose) {
        els.mobileMenuClose.addEventListener("click", closeMobileMenu);
    }

    document.querySelectorAll(".mobile-nav-link").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    if (els.overlay) {
        els.overlay.addEventListener("click", () => {
            closeCart();
            closeMobileMenu();
        });
    }

    if (els.backToTop) {
        els.backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
}