import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ManagerTabs, RoutesType, ThemeObjectType } from "src/app/core/types/general";
import { THEMES } from "src/utils/constants/general";
import { BillsLayoutType } from "../types/subjects";
import { ProfileThemeType } from "../types/pages/theme";
import { DEFAULT_THEME } from "src/utils/constants/colors";

@Injectable({
    providedIn: "root",
})
export class GeneralState {
    private _managerTab$ = new BehaviorSubject<ManagerTabs>("0");
    private _theme$ = new BehaviorSubject<string>("default");
    private _themeObject$ = new BehaviorSubject<ProfileThemeType>(DEFAULT_THEME);
    private _filterContainer$ = new BehaviorSubject<boolean>(true);
    private _page$ = new BehaviorSubject<RoutesType | string>(window.location.pathname);
    private _billsLayout$ = new BehaviorSubject<BillsLayoutType>("grid");

    public readonly managerTabs$ = this._managerTab$.asObservable();
    public readonly theme$ = this._theme$.asObservable();
    public readonly themeObject$ = this._themeObject$.asObservable();
    public readonly filterContainer$ = this._filterContainer$.asObservable();
    public readonly page$ = this._page$.asObservable();
    public readonly billsLayout$ = this._billsLayout$.asObservable();

    changeTab(tab: ManagerTabs) {
        this._managerTab$.next(tab);
    }

    changeTheme(theme: string) {
        this._theme$.next(theme);
    }

    changeThemeObject(theme: ProfileThemeType) {
        this._themeObject$.next(theme);
    }

    changeFilterContainer(status: boolean) {
        this._filterContainer$.next(status);
    }

    changePage(page: RoutesType | string) {
        this._page$.next(page);
    }

    changeBillsLayout(view: BillsLayoutType) {
        this._billsLayout$.next(view);
    }
}
