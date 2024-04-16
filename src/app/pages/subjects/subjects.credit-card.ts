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
    public readonly ceditCards$ = this._ceditCards$.asObservable();

    changeStatus(newStatus: ListStatus) {
        this._status$.next(newStatus);
    }

    setCreditCards(creditCards: CreditCard[]) {
        this._ceditCards$.next(creditCards);
    }
}
