import { ThemeObjectType } from "../types/pages/theme";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ALL_ROOT_THEMES } from "src/utils/constants/colors";

@Injectable({
    providedIn: "root",
})
export class ThemeState {
    private _themes$ = new BehaviorSubject<ThemeObjectType[]>([...ALL_ROOT_THEMES]);

    public readonly themes$ = this._themes$.asObservable();

    setThemeList(themes: ThemeObjectType[]) {
        this._themes$.next(themes);
    }

    updateTheme(theme: ThemeObjectType) {
        const themes = this._themes$.getValue();
        const themeIndex = themes.findIndex((t) => t.id === theme.id);
        themes.splice(themeIndex, 1, theme);

        this._themes$.next(themes);
    }

    addTheme(theme: ThemeObjectType) {
        const themes = this._themes$.getValue();
        themes.splice(0, 0, theme);

        this._themes$.next(themes);
    }

    removeTheme(id: string) {
        const themes = this._themes$.getValue();
        const themeIndex = themes.findIndex((t) => t.id === id);
        themes.splice(themeIndex, 1);

        this._themes$.next(themes);
    }
}
