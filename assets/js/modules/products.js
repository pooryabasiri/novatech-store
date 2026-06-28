import { state } from "./state.js";
import { loadProducts } from "./products.service.js";
import { getFilteredProducts } from "./products.filter.js";
import { renderProducts, showSkeletons } from "./products.render.js";

export async function initProducts() {
    showSkeletons();

    state.products = await loadProducts();

    updateProducts();
}

export function updateProducts() {
    const products = getFilteredProducts(
        state.products,
        state.searchQuery,
        state.filterCategory,
        state.sortBy
    );

    renderProducts(products);
}

export function setSearch(query) {
    state.searchQuery = query.trim();
    updateProducts();
}

export function setCategory(category) {
    state.filterCategory = category;
    updateProducts();
}

export function setSort(sort) {
    state.sortBy = sort;
    updateProducts();
}

export function getProductById(id) {
    return state.products.find(product => product.id === id);
}