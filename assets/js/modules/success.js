import { formatPrice, escapeHTML } from "../utils/helpers.js";

function loadLastOrder() {
    try {
        const data = localStorage.getItem("novatech_last_order");
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

function formatDeliveryDate() {
    const date = new Date();
    date.setDate(date.getDate() + 3);

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    return date.toLocaleDateString("en-US", options);
}

function renderOrder(order) {
    const { cart, summary, shipping, payment } = order;

    const orderIdEl = document.getElementById("order-id");
    if (orderIdEl) orderIdEl.textContent = order.id;

    const itemsContainer = document.getElementById("order-items");
    if (itemsContainer) {
        itemsContainer.innerHTML = cart
            .map(
                (item) => `
            <div class="order-item-row">
                <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" />
                <div class="order-item-details">
                    <strong>${escapeHTML(item.name)}</strong>
                    <span>Qty: ${item.quantity}</span>
                </div>
                <div class="order-item-price">
                    ${formatPrice(item.price * item.quantity)}
                </div>
            </div>
        `
            )
            .join("");
    }

    const subtotalEl = document.getElementById("order-subtotal");
    const shippingEl = document.getElementById("order-shipping");
    const taxEl = document.getElementById("order-tax");
    const totalEl = document.getElementById("order-total");
    const discountEl = document.getElementById("order-discount");
    const discountRow = document.getElementById("order-discount-row");

    if (subtotalEl) subtotalEl.textContent = formatPrice(summary.subtotal);

    if (shippingEl) {
        shippingEl.textContent =
            summary.shipping === 0 ? "Free" : formatPrice(summary.shipping);
    }

    if (taxEl) taxEl.textContent = formatPrice(summary.tax);
    if (totalEl) totalEl.textContent = formatPrice(summary.total);

    if (summary.discount > 0) {
        if (discountRow) discountRow.style.display = "flex";
        if (discountEl)
            discountEl.textContent = `-${formatPrice(summary.discount)}`;
    }

    const shippingInfoEl = document.getElementById("order-shipping-info");
    if (shippingInfoEl && shipping) {
        shippingInfoEl.innerHTML = `
            <strong>${escapeHTML(shipping.firstName)} ${escapeHTML(shipping.lastName)}</strong><br>
            ${escapeHTML(shipping.address)}<br>
            ${escapeHTML(shipping.city)}, ${escapeHTML(shipping.zip)}<br>
            ${escapeHTML(shipping.country.toUpperCase())}<br>
            ${escapeHTML(shipping.email)}
            ${shipping.phone ? `<br>${escapeHTML(shipping.phone)}` : ""}
        `;
    }

    const paymentInfoEl = document.getElementById("order-payment-info");
    if (paymentInfoEl && payment) {
        if (payment.method === "card") {
            paymentInfoEl.innerHTML = `
                <strong>Credit Card</strong><br>
                Ending in •••• ${escapeHTML(payment.cardLast4)}<br>
                ${escapeHTML(payment.cardName)}
            `;
        } else {
            paymentInfoEl.innerHTML = `<strong>PayPal</strong>`;
        }
    }

    const deliveryDateEl = document.getElementById("delivery-date");
    if (deliveryDateEl) {
        deliveryDateEl.textContent = formatDeliveryDate();
    }
}

function initPrintButton() {
    const printBtn = document.getElementById("print-order");

    if (!printBtn) return;

    printBtn.addEventListener("click", () => {
        window.print();
    });
}

export function initSuccessPage() {
    const card = document.querySelector(".success-card");

    if (!card) return;

    const order = loadLastOrder();

    if (!order) {
        window.location.href = "index.html";
        return;
    }

    renderOrder(order);
    initPrintButton();
}