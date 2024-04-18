import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ListStatus } from "src/app/types/general";
import { TypeBill } from "../types/objects";

@Injectable({
    providedIn: "root",
})
export class TypeBillState {
    private _typeBill$ = new BehaviorSubject<TypeBill[]>([]);
    private _status$ = new BehaviorSubject<ListStatus>("empty");

    public readonly status$ = this._status$.asObservable();
    public readonly typeBill$ = this._typeBill$.asObservable();

    changeStatus(newStatus: ListStatus) {
        this._status$.next(newStatus);
        if (newStatus !== "data") this._typeBill$.next([]);
    }

    setTypeBill(tb: TypeBill[]) {
        if (tb.length === 0) this._status$.next("empty");
        else this._status$.next("data");

        this._typeBill$.next(tb);
    }
}
