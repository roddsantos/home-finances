import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ManagerTabs, ThemeType } from "src/app/core/types/general";

@Injectable({
    providedIn: "root",
})
export class GeneralState {
    private _managerTab$ = new BehaviorSubject<ManagerTabs>("0");
    private _theme$ = new BehaviorSubject<ThemeType>("default");

    public readonly managerTabs$ = this._managerTab$.asObservable();
    public readonly theme$ = this._theme$.asObservable();

    changeTab(tab: ManagerTabs) {
        this._managerTab$.next(tab);
    }

    changeTheme(theme: ThemeType) {
        this._theme$.next(theme);
    }
}
