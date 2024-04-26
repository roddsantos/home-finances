import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CreditCard } from "../types/objects";
import { FeedbackInfo, FeedbackVariant } from "../types/components";

@Injectable({
    providedIn: "root",
})
export class CreditCardState {
    private _creditCards$ = new BehaviorSubject<CreditCard[]>([]);
    private _status$ = new BehaviorSubject<FeedbackInfo>({
        title: "loading",
        description: "",
        actionLabel: "reload",
        action: undefined,
        variant: "loading",
    });

    public readonly status$ = this._status$.asObservable();
    public readonly creditCards$ = this._creditCards$.asObservable();

    changeStatus(variant: FeedbackVariant, title: string) {
        this._status$.next({ ...this._status$.getValue(), variant, title });
        if (variant !== "none" && variant !== "loading") this._creditCards$.next([]);
    }

    changeVariant(variant: FeedbackVariant) {
        this._status$.next({ ...this._status$.getValue(), variant });
    }

    setCreditCards(creditCards: CreditCard[]) {
        if (creditCards.length === 0) this.changeStatus("empty", "no credit cards");
        else this.changeVariant("none");

        this._creditCards$.next(creditCards);
    }

    addCreditCard(cc: CreditCard, index?: number) {
        let auxCompanies = [...this._creditCards$.getValue()];
        const existingCompany = this._creditCards$.getValue().find((c) => c.id === cc.id);
        if (existingCompany && index !== undefined) auxCompanies[index] = cc;
        else auxCompanies = [cc, ...auxCompanies];

        this._creditCards$.next(auxCompanies);
    }

    setStatus(status: FeedbackInfo) {
        this._status$.next(status);
    }

    setAction(action: () => void) {
        this._status$.next({ ...this._status$.getValue(), action });
    }
}
