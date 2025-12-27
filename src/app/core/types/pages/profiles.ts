export type ProfileThemeType = {
    id: string;
    theme: ColorThemeType;
    title: string;
    description: string;
    primary: string;
    secondary: string;
    background: string;
    text1: string;
    text2: string;
    borderRadius: number;
    borderWidth: number;
    font1: FontProfileType;
    font2: FontProfileType;
};

export type ColorThemeType = "dark" | "default" | "light";

export type FontProfileType = "Open-Sans" | "Commissioner" | "Roboto" | "GT-Eesti-Text";

export type UpdateProfileControlType<T> = {
    field: string;
    value: T;
};

export type ColorType = {
    label: string;
    value: string;
};

export type GeneralMeasureType = "minimum" | "default" | "large";
