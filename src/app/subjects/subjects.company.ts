import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Company } from "src/app/types/objects";
import { ListStatus } from "src/app/types/general";

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

    addCompany(company: Company, index?: number) {
        let auxCompanies = [...this._companies$.getValue()];
        const existingCompany = this._companies$
            .getValue()
            .find((c) => c.id === company.id);
        if (existingCompany && index !== undefined) auxCompanies[index] = company;
        else auxCompanies = [company, ...auxCompanies];

        this._companies$.next(auxCompanies);
    }
}
