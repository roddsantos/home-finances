import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FeedbackInfo, FeedbackVariant } from "src/app/core/types/components";
import { CompanyObjectType } from "../types/data/company.type";

@Injectable({
    providedIn: "root",
})
export class CompanyState {
    private _companies$ = new BehaviorSubject<CompanyObjectType[]>([]);
    private _status$ = new BehaviorSubject<FeedbackInfo>({
        title: "loading",
        description: "",
        actionLabel: "reload",
        action: undefined,
        variant: "loading",
    });

    public readonly status$ = this._status$.asObservable();
    public readonly company$ = this._companies$.asObservable();

    changeStatus(variant: FeedbackVariant, title: string) {
        this._status$.next({ ...this._status$.getValue(), variant, title });
        if (variant !== "none" && variant !== "loading") this._companies$.next([]);
    }

    changeVariant(variant: FeedbackVariant) {
        this._status$.next({ ...this._status$.getValue(), variant });
    }

    setCompanies(companies: CompanyObjectType[]) {
        if (companies.length === 0) this.changeStatus("empty", "no companies");
        else this.changeVariant("none");
        this._companies$.next(companies);
    }

    updateCompany(company: CompanyObjectType) {
        let auxCompanies = [...this._companies$.getValue()];
        const indexCompany = this._companies$
            .getValue()
            .findIndex((c) => c.id === company.id);

        if (indexCompany >= 0) auxCompanies[indexCompany] = company;
        this._companies$.next(auxCompanies);
    }

    addCompany(company: CompanyObjectType) {
        let auxCompanies = [...this._companies$.getValue()];

        const companiesArray = [company, ...auxCompanies].sort((comp1, comp2) => {
            if (comp1.name > comp2.name) return -1;
            return 1;
        });

        this._companies$.next(companiesArray);
    }

    setStatus(status: FeedbackInfo) {
        this._status$.next(status);
    }

    setAction(action: () => void) {
        this._status$.next({ ...this._status$.getValue(), action });
    }
}
