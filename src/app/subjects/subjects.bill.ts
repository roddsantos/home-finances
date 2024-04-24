import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ListStatus } from "src/app/types/general";
import { Bill, BillData } from "src/app/types/objects";

@Injectable({
    providedIn: "root",
})
export class BillState {
    private _bills$ = new BehaviorSubject<Array<Bill & BillData>>([]);
    private _status$ = new BehaviorSubject<ListStatus>("empty");

    public readonly status$ = this._status$.asObservable();
    public readonly bills$ = this._bills$.asObservable();

    changeStatus(newStatus: ListStatus) {
        this._status$.next(newStatus);
        if (newStatus !== "data") this._bills$.next([]);
    }

    setBills(bills: Array<Bill & BillData>) {
        if (bills.length === 0) this._status$.next("empty");
        else this._status$.next("data");

        this._bills$.next(bills);
    }

    addBill(bill: Array<Bill & BillData>, index?: number) {
        let auxBills = [...this._bills$.getValue()];
        auxBills = [...bill, ...auxBills];

        this._bills$.next(auxBills);
    }
}
