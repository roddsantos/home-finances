export type ProfileType = {
    id: string;
    title: string;
    description: string;
    theme: ColorThemeType;
    primary: string;
    secondary: string;
    background: string;
    text1: string;
    text2: string;
    borderRadius: number;
    borderWidth: number;
    font: FontProfileType;
};

export type ColorThemeType = "dark" | "default" | "light";

export type FontProfileType = "Open-Sans" | "Commissioner" | "Roboto" | "GT-Eesti-Text";
