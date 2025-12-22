import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { UserState } from "../core/subjects/subjects.user";
import { GeneralService } from "./general.service";
import { ProfileThemeType } from "../core/types/pages/profiles";
import { LocalStorageService } from "./local-storage.service";
import { COLOR_STATUS, FIELD_TO_PROPERTY } from "src/utils/constants/colors";

@Injectable({
    providedIn: "root",
})
export class ThemeService extends GeneralService {
    public localStorageService = inject(LocalStorageService);

    setupTheme(profileTheme: ProfileThemeType) {
        const { id, primary, secondary, theme, borderWidth, borderRadius } = profileTheme;

        Object.keys(FIELD_TO_PROPERTY).map((field) => {
            const property = FIELD_TO_PROPERTY[field as keyof typeof FIELD_TO_PROPERTY];

            document.documentElement.style.setProperty(
                property,
                // @ts-ignore
                profileTheme[field]
            );
        });
        Object.keys(COLOR_STATUS[theme]).map((field) => {
            // @ts-ignore
            const value = COLOR_STATUS[theme][field as keyof typeof COLOR_STATUS];
            document.documentElement.style.setProperty("--" + field, value);
        });
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
