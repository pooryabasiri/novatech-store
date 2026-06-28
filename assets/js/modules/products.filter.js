import { SORT_OPTIONS } from "../utils/constants.js";

export function getFilteredProducts(
    products,
    searchQuery,
    category,
    sortBy
) {
    let items = [...products];

    // Search
    if (searchQuery) {
        const query = searchQuery.trim().toLowerCase();

        items = items.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    }

    // Category
    if (category !== "all") {
        items = items.filter(product => product.category === category);
    }

    // Sort
    switch (sortBy) {

        case SORT_OPTIONS.PRICE_LOW:
            items.sort((a, b) => a.price - b.price);
            break;

        case SORT_OPTIONS.PRICE_HIGH:
            items.sort((a, b) => b.price - a.price);
            break;

        case SORT_OPTIONS.RATING:
            items.sort((a, b) => b.rating - a.rating);
            break;

        case SORT_OPTIONS.NAME:
            items.sort((a, b) => a.name.localeCompare(b.name));
            break;

        default:
            break;
    }

    return items;
}