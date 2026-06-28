import { getCart } from "./storage.js";

export const state = {
    products: [],
    cart: getCart(),
    theme: "light",
    searchQuery: "",
    filterCategory: "all",
    sortBy: "featured",
    modalProduct: null,
    modalQuantity: 1,
};