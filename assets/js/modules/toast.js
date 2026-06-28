import { els } from "./dom.js";

const SUCCESS_ICON = `
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
</svg>
`;

const ERROR_ICON = `
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
</svg>
`;

export function showToast(message, icon = SUCCESS_ICON) {
    const toast = document.createElement("div");

    toast.className = "toast";

    toast.innerHTML = `
        ${icon}
        <span>${message}</span>
    `;

    els.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

export function showSuccess(message) {
    showToast(message, SUCCESS_ICON);
}

export function showError(message) {
    showToast(message, ERROR_ICON);
}