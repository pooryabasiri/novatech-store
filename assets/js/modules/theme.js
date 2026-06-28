import { state } from "./state.js";
import { getTheme, saveTheme } from "./storage.js";
import { THEMES } from "../utils/constants.js";

export function initTheme() {
    state.theme = getTheme();
    applyTheme(state.theme);
}

export function applyTheme(theme) {
    state.theme = theme;

    document.documentElement.setAttribute("data-theme", theme);

    saveTheme(theme);
}

export function toggleTheme() {
    const nextTheme =
        state.theme === THEMES.LIGHT
            ? THEMES.DARK
            : THEMES.LIGHT;

    applyTheme(nextTheme);
}