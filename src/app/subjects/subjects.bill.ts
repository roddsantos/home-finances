import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ListStatus } from "src/app/types/general";
import { Bill } from "src/app/types/objects";

@Injectable({
    providedIn: "root",
})
export class BillState {
    private _bills$ = new BehaviorSubject<Bill[]>([]);
    private _status$ = new BehaviorSubject<ListStatus>("empty");

    public readonly status$ = this._status$.asObservable();
    public readonly bills$ = this._bills$.asObservable();

    changeStatus(newStatus: ListStatus) {
        this._status$.next(newStatus);
        if (newStatus !== "data") this._bills$.next([]);
    }

    setBills(bills: Bill[]) {
        if (bills.length === 0) this._status$.next("empty");
        else this._status$.next("data");

        this._bills$.next(bills);
    }

    addBill(bill: Bill, index?: number) {
        let auxBills = [...this._bills$.getValue()];
        const existingBank = this._bills$.getValue().find((b) => b.id === bill.id);
        if (existingBank && index !== undefined) auxBills[index] = bill;
        else auxBills = [bill, ...auxBills];

        this._bills$.next(auxBills);
    }
}
