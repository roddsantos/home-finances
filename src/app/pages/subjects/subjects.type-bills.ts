import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ListStatus, TypeBill } from "src/app/types/general";

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
    }

    setTypeBill(tb: TypeBill[]) {
        this._typeBill$.next(tb);
    }
}
