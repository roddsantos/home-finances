import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Bill, BillData } from "src/app/types/objects";
import { FeedbackInfo, FeedbackVariant, PaginationType } from "../types/components";
import { FetchPaginatedData } from "../types/services";

@Injectable({
    providedIn: "root",
})
export class BillState {
    private _bills$ = new BehaviorSubject<Array<Bill & BillData>>([]);
    private _status$ = new BehaviorSubject<FeedbackInfo>({
        title: "loading",
        description: "",
        actionLabel: "reload",
        action: undefined,
        variant: "loading",
    });
    private _billsPagination$ = new BehaviorSubject<PaginationType>({
        page: 1,
        limit: 10,
        total: 0,
    });

    public readonly status$ = this._status$.asObservable();
    public readonly bills$ = this._bills$.asObservable();
    public readonly billsPagination$ = this._billsPagination$.asObservable();

    changeStatus(variant: FeedbackVariant, title: string) {
        this._status$.next({ ...this._status$.getValue(), variant, title });
        if (variant !== "none" && variant !== "loading") this._bills$.next([]);
    }

    changeVariant(variant: FeedbackVariant) {
        this._status$.next({ ...this._status$.getValue(), variant });
    }

    setBills(bills: FetchPaginatedData<Bill & BillData>) {
        if (bills.data.length === 0) this.changeStatus("empty", "no bills");
        else this.changeVariant("none");
        this._bills$.next(bills.data);
        this._billsPagination$.next({
            page: this._billsPagination$.getValue().page,
            limit: this._billsPagination$.getValue().limit,
            total: bills.count,
        });
    }

    addBill(bill: Array<Bill & BillData>, index?: number) {
        let auxBills = [...this._bills$.getValue()];
        auxBills = [...bill, ...auxBills];

        this._bills$.next(auxBills);
    }

    setStatus(status: FeedbackInfo) {
        this._status$.next(status);
    }

    setAction(action: () => void) {
        this._status$.next({ ...this._status$.getValue(), action });
    }

    setPage(page: number) {
        this._billsPagination$.next({
            page,
            limit: this._billsPagination$.getValue().limit,
            total: this._billsPagination$.getValue().total,
        });
    }

    setLimit(limit: number) {
        this._billsPagination$.next({
            page: this._billsPagination$.getValue().page,
            limit,
            total: this._billsPagination$.getValue().total,
        });
    }

    autoPage(increase: boolean) {
        this.setPage(this._billsPagination$.getValue().page + 1 * (increase ? 1 : -1));
    }
}
