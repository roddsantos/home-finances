export type ThemeObjectType = {
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
    borderWidth: GeneralMeasureType;
    font1: FontThemeType;
    font2: FontThemeType;
    inputSize: GeneralMeasureType;
    padding: GeneralMeasureType;
    userId: string;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
};

export type ThemeCreateType = {
    theme: ColorThemeType;
    title: string;
    description: string;
    primary: string;
    secondary: string;
    background: string;
    text1: string;
    text2: string;
    borderRadius: number;
    borderWidth: GeneralMeasureType;
    font1: FontThemeType;
    font2: FontThemeType;
    inputSize: GeneralMeasureType;
    padding: GeneralMeasureType;
};

export type ThemeUpdateType = Partial<
    ThemeObjectType & {
        id: string;
    }
>;

export type ColorThemeType = "dark" | "default" | "light";

export type FontThemeType = "Open-Sans" | "Commissioner" | "Roboto" | "GT-Eesti-Text";

export type UpdateProfileControlType<T> = {
    field: string;
    value: T;
};

export type ColorType = {
    label: string;
    value: string;
};

export type GeneralMeasureType = "minimum" | "default" | "large";

export type ModalDataProfileTheme = {
    selected: boolean;
    theme: ThemeObjectType;
};
