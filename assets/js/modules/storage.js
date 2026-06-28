import { STORAGE_KEYS } from "../utils/constants.js";

export function getCart() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
    } catch {
        return [];
    }
}

export function saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

export function getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || "light";
}

export function saveTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

export function getWishlist() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];
    } catch {
        return [];
    }
}

export function saveWishlist(list) {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
}

export function getViewed() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.VIEWED)) || [];
    } catch {
        return [];
    }
}

export function saveViewed(list) {
    localStorage.setItem(STORAGE_KEYS.VIEWED, JSON.stringify(list));
}

export function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function load(key, fallback = null) {
    try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : fallback;
    } catch {
        return fallback;
    }
}