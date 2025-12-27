import { ToggleButtonItemsType } from "src/app/core/types/components/toggle-buttons";
import {
    ColorThemeType,
    FontProfileType,
    GeneralMeasureType,
    ProfileThemeType,
} from "src/app/core/types/pages/profiles";

export const COLOR_STATUS = {
    light: {
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
    dark: {
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

export const GENERAL_MEASURES: ToggleButtonItemsType<GeneralMeasureType>[] = [
    {
        label: "minimum",
        value: "minimum",
    },
    {
        label: "default",
        value: "default",
    },
    {
        label: "large",
        value: "large",
    },
];

export const THEME_FONTS = {
    opensans: "Open-Sans" as FontProfileType,
    commissioner: "Commissioner" as FontProfileType,
    roboto: "Roboto" as FontProfileType,
    gteestitext: "GT-Eesti-Text" as FontProfileType,
};

export const DEFAULT_COLORS = {
    dark: {
        black: {
            label: "black",
            value: "#000000",
        },
        red: {
            label: "red",
            value: "#690000",
        },
        green: {
            label: "green",
            value: "#006800",
        },
        blue: {
            label: "blue",
            value: "#00007e",
        },
        yellow: {
            label: "yellow",
            value: "#888800",
        },
        cyan: {
            label: "cyan",
            value: "#007c7c",
        },
        magenta: {
            label: "magenta",
            value: "#7a007a",
        },
        brown: {
            label: "brown",
            value: "#581d00",
        },
        purple: {
            label: "purple",
            value: "#410052",
        },
        grey: {
            label: "grey",
            value: "#494949",
        },
        white: {
            label: "white",
            value: "#ffffff",
        },
    },
    default: {
        black: {
            label: "black",
            value: "#000000",
        },
        red: {
            label: "red",
            value: "#ff3a3a",
        },
        green: {
            label: "green",
            value: "#43ff43",
        },
        blue: {
            label: "blue",
            value: "#5959ff",
        },
        yellow: {
            label: "yellow",
            value: "#ffff57",
        },
        cyan: {
            label: "cyan",
            value: "#4fffff",
        },
        magenta: {
            label: "magenta",
            value: "#ff4bff",
        },
        brown: {
            label: "brown",
            value: "#794429",
        },
        purple: {
            label: "purple",
            value: "#9337aa",
        },
        grey: {
            label: "grey",
            value: "#777777",
        },
        white: {
            label: "white",
            value: "#ffffff",
        },
    },
    light: {
        black: {
            label: "black",
            value: "#757575",
        },
        red: {
            label: "red",
            value: "#ff9b9b",
        },
        green: {
            label: "green",
            value: "#9dff9d",
        },
        blue: {
            label: "blue",
            value: "#a6a6ff",
        },
        yellow: {
            label: "yellow",
            value: "#ffffa9",
        },
        cyan: {
            label: "cyan",
            value: "#afffff",
        },
        magenta: {
            label: "magenta",
            value: "#ffb0ff",
        },
        brown: {
            label: "brown",
            value: "#a58473",
        },
        purple: {
            label: "purple",
            value: "#a77bb3",
        },
        grey: {
            label: "grey",
            value: "#b1b1b1",
        },
        white: {
            label: "white",
            value: "#ffffff",
        },
    },
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

export const DEFAULT_THEME: ProfileThemeType = {
    id: "default",
    theme: "default",
    title: "default",
    description: "the default theme of the application",
    primary: "#00B2A9",
    secondary: "#FF8200",
    background: "#ffe9efff",
    text1: "#000000",
    text2: "#e2e2ff",
    borderWidth: 1,
    borderRadius: 10,
    font1: "Open-Sans",
    font2: "Commissioner",
};

export const BINARY_THEME: ProfileThemeType = {
    id: "binary",
    theme: "dark",
    title: "black and white",
    description: "black and white themed",
    primary: "#000000",
    secondary: "#ffffff",
    background: "#000000",
    text1: "#ffffff",
    text2: "#ffffff",
    borderWidth: 1,
    borderRadius: 10,
    font1: "Open-Sans",
    font2: "Open-Sans",
};

export const RED_AND_BLACK: ProfileThemeType = {
    id: "red-and-black",
    theme: "dark",
    title: "red and black",
    description: "him",
    primary: "#a82828",
    secondary: "#a82828",
    background: "#000000ff",
    text1: "#d5d6f1",
    text2: "#c0c0c0ff",
    borderWidth: 1,
    borderRadius: 10,
    font1: "Open-Sans",
    font2: "Commissioner",
};

export const FIELD_TO_PROPERTY = {
    id: "--profile-id",
    theme: "--profile-theme",
    title: "--profile-title",
    description: "--profile-description",
    primary: "--primary",
    secondary: "--secondary",
    background: "--background",
    text1: "--text-1",
    text2: "--text-2",
    borderWidth: "--border-width",
    borderRadius: "--border-radius",
    font1: "--font-1",
    font2: "--font-2",
};
