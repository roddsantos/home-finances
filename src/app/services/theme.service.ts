import { inject, Injectable } from "@angular/core";
import { GeneralService } from "./general.service";
import { ColorThemeType, ProfileThemeType } from "../core/types/pages/profiles";
import { LocalStorageService } from "./local-storage.service";
import { COLOR_STATUS, FIELD_TO_PROPERTY } from "src/utils/constants/colors";
import { SECTORS } from "src/utils/constants/general";
import { mergeMap } from "rxjs";
import { THEME } from "src/utils/constants/services";

@Injectable({
    providedIn: "root",
})
export class ThemeService extends GeneralService {
    public localStorageService = inject(LocalStorageService);

    getThemes() {
        return this.user.user$.pipe(
            mergeMap((user) => this.http.get<ProfileThemeType[]>(THEME + `/${user?.id}`))
        );
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
            (key) => SECTORS[key as keyof typeof SECTORS]
        );

        Object.keys(COLOR_STATUS[theme]).forEach((key, index) => {
            // @ts-ignore
            const color = COLOR_STATUS[theme][key as keyof typeof COLOR_STATUS];
            document.documentElement.style.setProperty(`--${sectorsArray[index]}`, color);
        });
    }

    setProperties(profileTheme: ProfileThemeType) {
        Object.keys(FIELD_TO_PROPERTY).map((field) => {
            const property = FIELD_TO_PROPERTY[field as keyof typeof FIELD_TO_PROPERTY];
            document.documentElement.style.setProperty(
                property,
                // @ts-ignore
                profileTheme[field]
            );
        });
    }

    setOtherVars(profileTheme: ProfileThemeType) {
        const { id, primary, secondary, borderWidth, borderRadius } = profileTheme;
        document.documentElement.style.setProperty(
            "--bh",
            "rgb(from var(--background) calc(r - 10) calc(g - 10) calc(b - 10))"
        );
        document.documentElement.style.setProperty(
            "--border-color",
            id === "binary" ? secondary : primary
        );
        document.documentElement.style.setProperty("--border-width", `${borderWidth}px`);
        document.documentElement.style.setProperty(
            "--border-radius",
            `${borderRadius}px`
        );
    }

    setupTheme(profileTheme: ProfileThemeType) {
        const { theme } = profileTheme;

        this.setProperties(profileTheme);
        this.setStatusColors(theme);
        this.setSectorsColors(theme);
        this.setOtherVars(profileTheme);
    }

    setTheme(theme: ProfileThemeType) {
        const { id } = theme;
        this.setupTheme(theme);
        document.body.className = "";
        document.body.className = id === "default" ? "" : id;
        this.generalState.changeThemeObject(theme);
        this.generalState.changeTheme(id);
        this.localStorageService.setTheme(id);
    }

    removeTheme() {
        this.generalState.changeTheme("default");
        this.localStorageService.removeTheme();
    }
}
