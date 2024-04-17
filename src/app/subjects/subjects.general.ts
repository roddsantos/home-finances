import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ManagerTabs } from "src/app/types/general";

@Injectable({
    providedIn: "root",
})
export class GeneralState {
    private _managerTab$ = new BehaviorSubject<ManagerTabs>("0");

    public readonly managerTabs$ = this._managerTab$.asObservable();

    changeTab(tab: ManagerTabs) {
        this._managerTab$.next(tab);
    }
}
