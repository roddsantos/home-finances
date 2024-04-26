import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { TypeBill } from "../types/objects";
import { FeedbackInfo, FeedbackVariant } from "../types/components";

@Injectable({
    providedIn: "root",
})
export class TypeBillState {
    private _typeBill$ = new BehaviorSubject<TypeBill[]>([]);
    private _status$ = new BehaviorSubject<FeedbackInfo>({
        title: "loading",
        description: "",
        actionLabel: "reload",
        action: undefined,
        variant: "loading",
    });

    public readonly status$ = this._status$.asObservable();
    public readonly typeBill$ = this._typeBill$.asObservable();

    changeStatus(variant: FeedbackVariant, title: string) {
        this._status$.next({ ...this._status$.getValue(), variant, title });
        if (variant !== "none" && variant !== "loading") this._typeBill$.next([]);
    }

    changeVariant(variant: FeedbackVariant) {
        this._status$.next({ ...this._status$.getValue(), variant });
    }

    setTypeBill(tb: TypeBill[]) {
        if (tb.length === 0) this.changeStatus("empty", "no type bills");
        else this.changeVariant("none");

        this._typeBill$.next(tb);
    }

    setStatus(status: FeedbackInfo) {
        this._status$.next(status);
    }

    setAction(action: () => void) {
        this._status$.next({ ...this._status$.getValue(), action });
    }
}
