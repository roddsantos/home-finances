import { ProfileThemeType } from "./../types/pages/profiles";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ThemeState {
    private _themes$ = new BehaviorSubject<ProfileThemeType[]>([]);

    public readonly themes$ = this._themes$.asObservable();

    setThemeList(themes: ProfileThemeType[]) {
        this._themes$.next(themes);
    }

    updateTheme(theme: ProfileThemeType) {
        const themes = this._themes$.getValue();
        const themeIndex = themes.findIndex((t) => t.id === theme.id);
        themes.splice(themeIndex, 1, theme);

        this._themes$.next(themes);
    }

    addTheme(theme: ProfileThemeType) {
        const themes = this._themes$.getValue();
        themes.splice(0, 0, theme);

        this._themes$.next(themes);
    }
}
