import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CreditCard } from "../types/objects";
import { ListStatus } from "src/app/types/general";

@Injectable({
    providedIn: "root",
})
export class CreditCardState {
    private _creditCards$ = new BehaviorSubject<CreditCard[]>([]);
    private _status$ = new BehaviorSubject<ListStatus>("empty");

    public readonly status$ = this._status$.asObservable();
    public readonly creditCards$ = this._creditCards$.asObservable();

    changeStatus(newStatus: ListStatus) {
        this._status$.next(newStatus);
        if (newStatus !== "data") this._creditCards$.next([]);
    }

    setCreditCards(creditCards: CreditCard[]) {
        if (creditCards.length === 0) this._status$.next("empty");
        else this._status$.next("data");

        this._creditCards$.next(creditCards);
    }

    addCreditCard(cc: CreditCard, index?: number) {
        let auxCompanies = [...this._creditCards$.getValue()];
        const existingCompany = this._creditCards$.getValue().find((c) => c.id === cc.id);
        if (existingCompany && index !== undefined) auxCompanies[index] = cc;
        else auxCompanies = [cc, ...auxCompanies];

        this._creditCards$.next(auxCompanies);
    }
}
