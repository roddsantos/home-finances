import { ColorThemeType } from "src/app/core/types/pages/profiles";

export const COLOR_STATUS = {
    dark: {
        error: "#aa0000",
        warning: "#b97900",
        info: "#003caa",
        success: "#008817",
        default: "#3a3a3a",
    },
    default: {
        error: "#da3131",
        warning: "#dba134",
        info: "#326bd3",
        success: "#29c944",
        default: "#7c7c7c",
    },
    light: {
        error: "#ff8888",
        warning: "#ffd689",
        info: "#84afff",
        success: "#7eff94",
        default: "#bdbdbd",
    },
};

export const COLOR_THEMES = {
    dark: "dark" as ColorThemeType,
    default: "default" as ColorThemeType,
    light: "light" as ColorThemeType,
};

export const DEFAULT_COLORS = {
    black: "#000000",
    red: "#ff0000",
    green: "#00ff00",
    blue: "#0000ff",
    yellow: "#ffff00",
    cyan: "#00ffff",
    magenta: "#ff00ff",
    brown: "#773311",
    purple: "#8800aa",
    grey: "#777777",
    white: "#ffffff",
};

export const DEFAULT_TEXT_COLORS = {
    black: "#000000",
    grey: "#666666",
    white: "#ffffff",
    blue: "#0000ff",
    purple: "#8800aa",
    navy: "#007c9bff",
};

export const DEFAULT_BACKGROUND_COLORS = {
    grey: "#2b2b2b",
    blueWhite: "#ccccff",
    redWhite: "#ffcccc",
    greenWhite: "#caffca",
    yellow: "#ffffb5ff",
    cyan: "#bbffffff",
    magenta: "#ffbfffff",
    brown: "#ffcfb7ff",
    purple: "#f3c4ffff",
    white: "#ffffff",
};
