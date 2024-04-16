import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CreditCard, ListStatus } from "src/app/types/general";

@Injectable({
    providedIn: "root",
})
export class CreditCardState {
    private _ceditCards$ = new BehaviorSubject<CreditCard[]>([]);
    private _status$ = new BehaviorSubject<ListStatus>("empty");

    public readonly status$ = this._status$.asObservable();
    public readonly creditCards$ = this._ceditCards$.asObservable();

    changeStatus(newStatus: ListStatus) {
        this._status$.next(newStatus);
        if (newStatus !== "data") this._ceditCards$.next([]);
    }

    setCreditCards(creditCards: CreditCard[]) {
        if (creditCards.length === 0) this._status$.next("empty");
        else this._status$.next("data");

        this._ceditCards$.next(creditCards);
    }
}
