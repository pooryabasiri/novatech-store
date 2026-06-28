import { els } from "./dom.js";

export function flyToCart(imageElement) {
    if (!imageElement || !els.cartBtn) return;

    const imageRect = imageElement.getBoundingClientRect();
    const cartRect = els.cartBtn.getBoundingClientRect();

    const flyImage = imageElement.cloneNode(true);

    flyImage.style.position = "fixed";
    flyImage.style.left = imageRect.left + "px";
    flyImage.style.top = imageRect.top + "px";
    flyImage.style.width = imageRect.width + "px";
    flyImage.style.height = imageRect.height + "px";
    flyImage.style.objectFit = "cover";
    flyImage.style.borderRadius = "12px";
    flyImage.style.zIndex = "9999";
    flyImage.style.pointerEvents = "none";
    flyImage.style.transition =
        "all 0.8s cubic-bezier(0.55, -0.04, 0.91, 0.94)";
    flyImage.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.3)";

    document.body.appendChild(flyImage);

    requestAnimationFrame(() => {
        flyImage.style.left = cartRect.left + cartRect.width / 2 + "px";
        flyImage.style.top = cartRect.top + cartRect.height / 2 + "px";
        flyImage.style.width = "20px";
        flyImage.style.height = "20px";
        flyImage.style.opacity = "0.3";
        flyImage.style.transform = "rotate(360deg) scale(0.2)";
    });

    setTimeout(() => {
        flyImage.remove();

        els.cartBtn.classList.add("cart-bounce");

        setTimeout(() => {
            els.cartBtn.classList.remove("cart-bounce");
        }, 500);
    }, 800);
}