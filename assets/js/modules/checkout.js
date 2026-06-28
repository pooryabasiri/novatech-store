import { formatPrice, escapeHTML } from "../utils/helpers.js";
import { showSuccess, showError } from "./toast.js";
import { saveCart } from "./storage.js";
import { state } from "./state.js";

let checkoutData = null;
let shippingInfo = null;
let paymentInfo = null;

function loadCheckoutData() {
    try {
        const data = localStorage.getItem("novatech_checkout");
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

function renderSummary() {
    if (!checkoutData) return;

    const { cart, summary } = checkoutData;

    const itemsContainer = document.getElementById("checkout-items-list");

    if (itemsContainer) {
        itemsContainer.innerHTML = cart
            .map(
                (item) => `
            <div class="checkout-item">
                <div class="checkout-item-image">
                    <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" />
                </div>
                <div class="checkout-item-info">
                    <div class="checkout-item-name">${escapeHTML(item.name)}</div>
                    <div class="checkout-item-qty">Qty: ${item.quantity}</div>
                </div>
                <div class="checkout-item-price">
                    ${formatPrice(item.price * item.quantity)}
                </div>
            </div>
        `
            )
            .join("");
    }

    const subtotalEl = document.getElementById("co-subtotal");
    const shippingEl = document.getElementById("co-shipping");
    const taxEl = document.getElementById("co-tax");
    const discountEl = document.getElementById("co-discount");
    const discountRow = document.getElementById("co-discount-row");
    const totalEl = document.getElementById("co-total");

    if (subtotalEl) subtotalEl.textContent = formatPrice(summary.subtotal);
    if (shippingEl)
        shippingEl.textContent =
            summary.shipping === 0 ? "Free" : formatPrice(summary.shipping);
    if (taxEl) taxEl.textContent = formatPrice(summary.tax);
    if (totalEl) totalEl.textContent = formatPrice(summary.total);

    if (summary.discount > 0) {
        if (discountRow) discountRow.style.display = "flex";
        if (discountEl)
            discountEl.textContent = `-${formatPrice(summary.discount)}`;
    }
}

function goToStep(stepName) {
    document
        .querySelectorAll(".checkout-step-content")
        .forEach((el) => el.classList.remove("active"));

    const target = document.getElementById(`step-${stepName}`);
    if (target) target.classList.add("active");

    const stepMap = { shipping: 1, payment: 2, confirm: 3 };
    const currentStep = stepMap[stepName];

    document.querySelectorAll(".step").forEach((el, i) => {
        el.classList.remove("active", "completed");
        if (i + 1 < currentStep) el.classList.add("completed");
        if (i + 1 === currentStep) el.classList.add("active");
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleShippingSubmit(e) {
    e.preventDefault();

    shippingInfo = {
        firstName: document.getElementById("first-name").value.trim(),
        lastName: document.getElementById("last-name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        city: document.getElementById("city").value.trim(),
        zip: document.getElementById("zip").value.trim(),
        country: document.getElementById("country").value,
    };

    goToStep("payment");
}

function handlePaymentSubmit(e) {
    e.preventDefault();

    const method = document.querySelector(
        "input[name='payment']:checked"
    ).value;

    if (method === "card") {
        const cardNumber = document
            .getElementById("card-number")
            .value.trim();
        const cardExpiry = document
            .getElementById("card-expiry")
            .value.trim();
        const cardCvv = document.getElementById("card-cvv").value.trim();
        const cardName = document.getElementById("card-name").value.trim();

        if (
            cardNumber.replace(/\s/g, "").length < 13 ||
            cardExpiry.length !== 5 ||
            cardCvv.length !== 3
        ) {
            showError("Please enter valid card details.");
            return;
        }

        paymentInfo = {
            method: "card",
            cardLast4: cardNumber.replace(/\s/g, "").slice(-4),
            cardName,
        };
    } else {
        paymentInfo = { method: "paypal" };
    }

    renderConfirm();
    goToStep("confirm");
}

function renderConfirm() {
    const container = document.getElementById("confirm-items");
    if (!container || !shippingInfo) return;

    container.innerHTML = `
        <div class="confirm-section">
            <h4>Shipping Address</h4>
            <p>
                ${escapeHTML(shippingInfo.firstName)} ${escapeHTML(shippingInfo.lastName)}<br>
                ${escapeHTML(shippingInfo.address)}<br>
                ${escapeHTML(shippingInfo.city)}, ${escapeHTML(shippingInfo.zip)}<br>
                ${escapeHTML(shippingInfo.country.toUpperCase())}<br>
                ${escapeHTML(shippingInfo.email)}
            </p>
        </div>

        <div class="confirm-section">
            <h4>Payment Method</h4>
            <p>
                ${
                    paymentInfo.method === "card"
                        ? `Credit Card ending in ${paymentInfo.cardLast4}`
                        : "PayPal"
                }
            </p>
        </div>
    `;
}

function handlePlaceOrder() {
    const orderId = "NV" + Date.now().toString().slice(-8);

    const order = {
        id: orderId,
        date: new Date().toISOString(),
        cart: checkoutData.cart,
        summary: checkoutData.summary,
        shipping: shippingInfo,
        payment: paymentInfo,
    };

    localStorage.setItem("novatech_last_order", JSON.stringify(order));

    state.cart = [];
    saveCart([]);

    localStorage.removeItem("novatech_checkout");

    window.location.href = "success.html";
}

function initPaymentMethods() {
    const methods = document.querySelectorAll(".payment-method");
    const cardFields = document.getElementById("card-fields");

    methods.forEach((method) => {
        method.addEventListener("click", () => {
            methods.forEach((m) => m.classList.remove("active"));
            method.classList.add("active");

            const value = method.querySelector("input").value;

            if (cardFields) {
                cardFields.style.display = value === "card" ? "block" : "none";
            }

            const inputs = cardFields?.querySelectorAll("input") || [];
            inputs.forEach((input) => {
                input.required = value === "card";
            });
        });
    });
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, "").replace(/[^0-9]/g, "");
    value = value.match(/.{1,4}/g)?.join(" ") || value;
    e.target.value = value;
}

function formatExpiry(e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
        value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    e.target.value = value;
}

function formatCvv(e) {
    e.target.value = e.target.value.replace(/\D/g, "");
}

export function initCheckoutPage() {
    const shippingForm = document.getElementById("shipping-form");

    if (!shippingForm) return;

    checkoutData = loadCheckoutData();

    if (!checkoutData || !checkoutData.cart || checkoutData.cart.length === 0) {
        showError("Your cart is empty.");
        setTimeout(() => {
            window.location.href = "cart.html";
        }, 1500);
        return;
    }

    renderSummary();
    initPaymentMethods();

    shippingForm.addEventListener("submit", handleShippingSubmit);

    const paymentForm = document.getElementById("payment-form");
    if (paymentForm) {
        paymentForm.addEventListener("submit", handlePaymentSubmit);
    }

    const backToShipping = document.getElementById("back-to-shipping");
    if (backToShipping) {
        backToShipping.addEventListener("click", () => goToStep("shipping"));
    }

    const backToPayment = document.getElementById("back-to-payment");
    if (backToPayment) {
        backToPayment.addEventListener("click", () => goToStep("payment"));
    }

    const placeOrder = document.getElementById("place-order");
    if (placeOrder) {
        placeOrder.addEventListener("click", handlePlaceOrder);
    }

    const cardNumber = document.getElementById("card-number");
    const cardExpiry = document.getElementById("card-expiry");
    const cardCvv = document.getElementById("card-cvv");

    if (cardNumber) cardNumber.addEventListener("input", formatCardNumber);
    if (cardExpiry) cardExpiry.addEventListener("input", formatExpiry);
    if (cardCvv) cardCvv.addEventListener("input", formatCvv);
}