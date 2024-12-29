import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import {
    ManagerTabs,
    RoutesType,
    ThemeObjectType,
    ThemeType,
} from "src/app/core/types/general";
import { THEMES } from "src/utils/constants/general";

@Injectable({
    providedIn: "root",
})
export class GeneralState {
    private _managerTab$ = new BehaviorSubject<ManagerTabs>("0");
    private _theme$ = new BehaviorSubject<ThemeType>("default");
    private _themeObject$ = new BehaviorSubject<ThemeObjectType>(THEMES[0]);
    private _filterContainer$ = new BehaviorSubject<boolean>(true);
    private _page$ = new BehaviorSubject<RoutesType | string>(window.location.pathname);

    public readonly managerTabs$ = this._managerTab$.asObservable();
    public readonly theme$ = this._theme$.asObservable();
    public readonly themeObject$ = this._themeObject$.asObservable();
    public readonly filterContainer$ = this._filterContainer$.asObservable();
    public readonly page$ = this._page$.asObservable();

    changeTab(tab: ManagerTabs) {
        this._managerTab$.next(tab);
    }

    changeTheme(theme: ThemeType) {
        this._theme$.next(theme);
    }

    changeThemeObject(theme: ThemeObjectType) {
        this._themeObject$.next(theme);
    }

    changeFilterContainer(status: boolean) {
        this._filterContainer$.next(status);
    }

    changePage(page: RoutesType | string) {
        this._page$.next(page);
    }
}
