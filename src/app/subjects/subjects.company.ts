import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Company, ListStatus } from "src/app/types/general";

@Injectable({
    providedIn: "root",
})
export class CompanyState {
    private _companies$ = new BehaviorSubject<Company[]>([]);
    private _status$ = new BehaviorSubject<ListStatus>("empty");

    public readonly status$ = this._status$.asObservable();
    public readonly company$ = this._companies$.asObservable();

    changeStatus(newStatus: ListStatus) {
        this._status$.next(newStatus);
    }

    setCompanies(companies: Company[]) {
        this._companies$.next(companies);
    }
}
