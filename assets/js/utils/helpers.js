let starCounter = 0;

export function formatPrice(value) {
    return (
        "$" +
        Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })
    );
}

export function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = String(str);
    return div.innerHTML;
}

export function debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

export function generateStars(rating, size = 14) {
    let html = "";

    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            html += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
        } else if (i - rating < 1) {
            const uniqueId = `half-star-${++starCounter}`;
            html += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="1">
                <defs>
                    <linearGradient id="${uniqueId}">
                        <stop offset="50%" stop-color="#f59e0b"/>
                        <stop offset="50%" stop-color="transparent"/>
                    </linearGradient>
                </defs>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#${uniqueId})"></polygon>
            </svg>`;
        } else {
            html += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
        }
    }

    return html;
}