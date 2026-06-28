import { els } from "./dom.js";

export function openMobileMenu() {
    els.mobileMenu.classList.add("open");
    els.overlay.classList.add("active");

    document.body.style.overflow = "hidden";

    els.mobileMenuBtn.setAttribute("aria-expanded", "true");
}

export function closeMobileMenu() {
    els.mobileMenu.classList.remove("open");

    // اگر سبد خرید باز نیست Overlay را ببند
    if (!els.cartSidebar.classList.contains("open")) {
        els.overlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    els.mobileMenuBtn.setAttribute("aria-expanded", "false");
}

export function toggleMobileMenu() {
    if (els.mobileMenu.classList.contains("open")) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}