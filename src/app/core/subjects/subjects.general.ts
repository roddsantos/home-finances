import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ManagerTabs, ThemeType } from "src/app/core/types/general";
import { LocalStorageService } from "src/app/services/local-storage.service";

@Injectable({
    providedIn: "root",
})
export class GeneralState {
    private _managerTab$ = new BehaviorSubject<ManagerTabs>("0");
    private _theme$ = new BehaviorSubject<ThemeType>("default");
    private _filterContainer$ = new BehaviorSubject<boolean>(true);

    public readonly managerTabs$ = this._managerTab$.asObservable();
    public readonly theme$ = this._theme$.asObservable();
    public readonly filterContainer$ = this._filterContainer$.asObservable();

    changeTab(tab: ManagerTabs) {
        this._managerTab$.next(tab);
    }

    changeTheme(theme: ThemeType) {
        this._theme$.next(theme);
    }

    changeFilterContainer(status: boolean) {
        this._filterContainer$.next(status);
    }
}
