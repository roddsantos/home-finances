import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Company } from "src/app/types/objects";
import { FeedbackInfo, FeedbackVariant } from "../types/components";

@Injectable({
    providedIn: "root",
})
export class CompanyState {
    private _companies$ = new BehaviorSubject<Company[]>([]);
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

    setCompanies(companies: Company[]) {
        if (companies.length === 0) this.changeStatus("empty", "no companies");
        else this.changeVariant("none");
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

    setStatus(status: FeedbackInfo) {
        this._status$.next(status);
    }

    setAction(action: () => void) {
        this._status$.next({ ...this._status$.getValue(), action });
    }
}
