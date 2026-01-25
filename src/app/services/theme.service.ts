import { Injectable } from "@angular/core";
import { GeneralService } from "./general.service";
import {
    ColorThemeType,
    GeneralMeasureType,
    ThemeObjectType,
    ThemeCreateType,
    ThemeUpdateType,
} from "../core/types/pages/theme";
import {
    COLOR_STATUS,
    DEFAULT_BACKGROUND_COLORS,
    DEFAULT_COLORS,
    DEFAULT_TEXT_COLORS,
    FIELD_TO_PROPERTY,
} from "src/utils/constants/colors";
import { SECTORS } from "src/utils/constants/general";
import { mergeMap, switchMap, take } from "rxjs";
import { THEME } from "src/utils/constants/services";

@Injectable({
    providedIn: "root",
})
export class ThemeService extends GeneralService {
    getThemes() {
        return this.user.user$.pipe(
            take(1),
            switchMap((user) => this.http.get<ThemeObjectType[]>(THEME + `/${user?.id}`)),
        );
    }

    createTheme(data: ThemeCreateType) {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.post<ThemeObjectType>(THEME, {
                    ...data,
                    userId: user?.id,
                }),
            ),
        );
    }

    updateTheme(data: ThemeUpdateType) {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.patch<ThemeObjectType>(THEME, {
                    ...data,
                    userId: user?.id,
                }),
            ),
        );
    }

    deleteTheme(id: string) {
        return this.http.delete<string>(THEME + `/${id}`);
    }

    setTheme(theme: ThemeObjectType) {
        const { id } = theme;
        this.setupTheme(theme);
        document.body.className = "";
        document.body.className = id;
        this.generalState.changeThemeObject(theme);
        this.generalState.changeTheme(id);
        this.localStorageService.setTheme(theme);
    }

    getBorderWidth(borderWidth: GeneralMeasureType) {
        switch (borderWidth) {
            case "default":
                return "2px";
            case "large":
                return "5px";
            case "minimum":
                return "1px";
        }
    }

    getPadding(padding: GeneralMeasureType) {
        switch (padding) {
            case "default":
                return "0.75rem";
            case "large":
                return "1.25rem";
            case "minimum":
                return "0.5rem";
        }
    }

    getInputSize(inputSize: GeneralMeasureType) {
        switch (inputSize) {
            case "default":
                return {
                    unit: "1.5rem",
                    position: "1.5rem",
                    font: "1rem",
                };
            case "large":
                return {
                    unit: "2rem",
                    position: "2rem",
                    font: "1.5rem",
                };
            case "minimum":
                return {
                    unit: "1.2rem",
                    position: "0.85rem",
                    font: "0.75rem",
                };
        }
    }

    getText1Theme(theme: ColorThemeType) {
        switch (theme) {
            case "dark":
                return "dark";
            default:
                return "light";
        }
    }

    getInverseTextColor(theme: ColorThemeType) {
        switch (theme) {
            case "dark":
                return "light";
            default:
                return "dark";
        }
    }

    setColor(value: string, theme: ColorThemeType, key: string) {
        const color = DEFAULT_COLORS[theme][value as keyof typeof DEFAULT_COLORS.default];
        document.documentElement.style.setProperty(`--${key}`, color.value);
    }

    setTextColor(value: string, theme: ColorThemeType, key: string) {
        const themeVariant = key === "text-2" ? this.getInverseTextColor(theme) : theme;
        const color =
            DEFAULT_TEXT_COLORS[themeVariant][
                value as keyof typeof DEFAULT_TEXT_COLORS.light
            ];
        document.documentElement.style.setProperty(`--${key}`, color.value);
    }

    setBackground(value: string, theme: ColorThemeType, key: string) {
        const themeVariant = this.getText1Theme(theme);
        const color =
            DEFAULT_BACKGROUND_COLORS[themeVariant][
                value as keyof typeof DEFAULT_BACKGROUND_COLORS.light
            ];
        document.documentElement.style.setProperty(`--${key}`, color.value);
    }

    setStatusColors(theme: ColorThemeType) {
        Object.keys(COLOR_STATUS[theme]).forEach((key) => {
            // @ts-ignore
            const color = COLOR_STATUS[theme][key as keyof typeof COLOR_STATUS];
            document.documentElement.style.setProperty(`--${key}`, color);
        });
    }

    setSectorsColors(theme: ColorThemeType) {
        const sectorsArray = Object.keys(SECTORS).map(
            (key) => SECTORS[key as keyof typeof SECTORS],
        );

        Object.keys(COLOR_STATUS[theme]).forEach((key, index) => {
            // @ts-ignore
            const color = COLOR_STATUS[theme][key as keyof typeof COLOR_STATUS];
            document.documentElement.style.setProperty(`--${sectorsArray[index]}`, color);
        });
    }

    setProperties(profileTheme: ThemeObjectType) {
        Object.keys(FIELD_TO_PROPERTY).map((field) => {
            const property = FIELD_TO_PROPERTY[field as keyof typeof FIELD_TO_PROPERTY];
            document.documentElement.style.setProperty(
                property,
                // @ts-ignore
                profileTheme[field],
            );
        });
    }

    setPadding(padding: GeneralMeasureType) {
        const value = this.getPadding(padding);
        document.documentElement.style.setProperty("--padding-gen", value);
    }

    setInputSize(inputSize: GeneralMeasureType) {
        const value = this.getInputSize(inputSize);
        document.documentElement.style.setProperty("--input-unit", value.unit);
        document.documentElement.style.setProperty("--input-position", value.position);
        document.documentElement.style.setProperty("--input-font", value.font);
        document.documentElement.style.setProperty("--font-size", value.font);
    }

    setBorder(borderWidth: GeneralMeasureType, borderRadius: number) {
        const width = this.getBorderWidth(borderWidth);
        document.documentElement.style.setProperty("--border-width", width);
        document.documentElement.style.setProperty(
            "--border-radius",
            `${borderRadius}px`,
        );
    }

    setOtherVars(profileTheme: ThemeObjectType) {
        const { id } = profileTheme;

        document.documentElement.style.setProperty(
            "--bh",
            id === "binary"
                ? "var(--background)"
                : "rgb(from var(--background) calc(r - 10) calc(g - 10) calc(b - 10))",
        );
        document.documentElement.style.setProperty(
            "--border-color",
            id === "binary" ? "var(--text-1)" : "var(--primary)",
        );
    }

    setupTheme(profileTheme: ThemeObjectType) {
        const {
            theme,
            inputSize,
            padding,
            borderWidth,
            borderRadius,
            primary,
            secondary,
            background,
            text1,
            text2,
        } = profileTheme;

        this.setProperties(profileTheme);
        this.setStatusColors(theme);
        this.setSectorsColors(theme);
        this.setOtherVars(profileTheme);
        this.setBorder(borderWidth, borderRadius);
        this.setPadding(padding);
        this.setInputSize(inputSize);
        this.setColor(primary, theme, "primary");
        this.setColor(secondary, theme, "secondary");
        this.setBackground(background, theme, "background");
        this.setTextColor(text1, theme, "text-1");
        this.setTextColor(text2, theme, "text-2");
    }

    removeTheme() {
        this.generalState.changeTheme("default");
        this.localStorageService.removeTheme();
    }
}
