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
        info: "#003caa",
        warning: "#b97900",
        default: "#3a3a3a",
        success: "#008817",
    },
    default: {
        error: "#da3131",
        info: "#326bd3",
        warning: "#dba134",
        default: "#7c7c7c",
        success: "#29c944",
    },
    dark: {
        error: "#ff8888",
        info: "#84afff",
        warning: "#ffd689",
        default: "#bdbdbd",
        success: "#7eff94",
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
    light: {
        black: {
            label: "black",
            value: "#000000",
        },
        red: {
            label: "red",
            value: "#9c0000",
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
            value: "#dd2c2c",
        },
        green: {
            label: "green",
            value: "#4ea14e",
        },
        blue: {
            label: "blue",
            value: "#4c4cda",
        },
        yellow: {
            label: "yellow",
            value: "#86862e",
        },
        cyan: {
            label: "cyan",
            value: "#2f9e9e",
        },
        magenta: {
            label: "magenta",
            value: "#c03bc0",
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
    dark: {
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
    light: {
        base: {
            label: "base",
            value: "#000000",
        },
        grey: {
            label: "grey",
            value: "#2e2e2e",
        },
        purple: {
            label: "purple",
            value: "#2e003a",
        },
        navy: {
            label: "navy",
            value: "#002630",
        },
        blue: {
            label: "blue",
            value: "#000038",
        },
        red: {
            label: "red",
            value: "#360000",
        },
        green: {
            label: "green",
            value: "#002c02",
        },
    },
    default: {
        base: {
            label: "base",
            value: "#000000",
        },
        grey: {
            label: "grey",
            value: "#464646",
        },
        purple: {
            label: "purple",
            value: "#690083",
        },
        navy: {
            label: "navy",
            value: "#006680",
        },
        blue: {
            label: "blue",
            value: "#000080",
        },
        red: {
            label: "red",
            value: "#8a0000",
        },
        green: {
            label: "green",
            value: "#008507",
        },
    },
    dark: {
        base: {
            label: "base",
            value: "#ffffff",
        },
        grey: {
            label: "grey",
            value: "#dfdfdf",
        },
        purple: {
            label: "purple",
            value: "#ea97ff",
        },
        navy: {
            label: "navy",
            value: "#78e4ff",
        },
        blue: {
            label: "blue",
            value: "#8787ff",
        },
        red: {
            label: "red",
            value: "#ff8989",
        },
        green: {
            label: "green",
            value: "#94ff99",
        },
    },
};

export const DEFAULT_BACKGROUND_COLORS = {
    light: {
        base: {
            label: "base",
            value: "#fafafa",
        },
        blue: {
            label: "blue",
            value: "#dbdbff",
        },
        red: {
            label: "red",
            value: "#ffdede",
        },
        green: {
            label: "green",
            value: "#daffda",
        },
        yellow: {
            label: "yellow",
            value: "#ffffdc",
        },
        cyan: {
            label: "cyan",
            value: "#ddffff",
        },
        magenta: {
            label: "magenta",
            value: "#ffdcff",
        },
        brown: {
            label: "brown",
            value: "#ffe8dc",
        },
        purple: {
            label: "purple",
            value: "#efe5ff",
        },
    },
    dark: {
        base: {
            label: "base",
            value: "#2c2c2c",
        },
        blue: {
            label: "blue",
            value: "#101061",
        },
        red: {
            label: "red",
            value: "#630c0c",
        },
        green: {
            label: "green",
            value: "#174717",
        },
        yellow: {
            label: "yellow",
            value: "#69690f",
        },
        cyan: {
            label: "cyan",
            value: "#0b3a3a",
        },
        magenta: {
            label: "magenta",
            value: "#3f093f",
        },
        brown: {
            label: "brown",
            value: "#3a1909",
        },
        purple: {
            label: "purple",
            value: "#23094d",
        },
    },
};

export const DEFAULT_THEME: ProfileThemeType = {
    id: "default",
    theme: "default",
    title: "default",
    description: "the default theme of the application",
    primary: "cyan",
    secondary: "magenta",
    background: "yellow",
    text1: "base",
    text2: "base",
    borderWidth: "default",
    borderRadius: 10,
    inputSize: "default",
    padding: "default",
    font1: "Open-Sans",
    font2: "Commissioner",
};

export const BINARY_THEME: ProfileThemeType = {
    id: "binary",
    theme: "dark",
    title: "black and white",
    description: "black and white themed",
    primary: "black",
    secondary: "white",
    background: "base",
    text1: "base",
    text2: "base",
    borderWidth: "large",
    borderRadius: 10,
    inputSize: "default",
    padding: "default",
    font1: "Open-Sans",
    font2: "Open-Sans",
};

export const RED_AND_BLACK: ProfileThemeType = {
    id: "red-and-black",
    theme: "dark",
    title: "red and black",
    description: "him",
    primary: "red",
    secondary: "black",
    background: "base",
    text1: "base",
    text2: "base",
    borderWidth: "default",
    borderRadius: 10,
    inputSize: "default",
    padding: "default",
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
    font1: "--font-1",
    font2: "--font-2",
};
