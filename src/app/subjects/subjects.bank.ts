import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Bank, ListStatus } from "src/app/types/general";

@Injectable({
    providedIn: "root",
})
export class BankState {
    private _banks$ = new BehaviorSubject<Bank[]>([]);
    private _status$ = new BehaviorSubject<ListStatus>("empty");

    public readonly status$ = this._status$.asObservable();
    public readonly banks$ = this._banks$.asObservable();

    changeStatus(newStatus: ListStatus) {
        this._status$.next(newStatus);
        if (newStatus !== "data") this._banks$.next([]);
    }

    setBanks(banks: Bank[]) {
        if (banks.length === 0) this._status$.next("empty");
        else this._status$.next("data");

        this._banks$.next(banks);
    }
}
