import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Bill, BillData } from "src/app/core/types/objects";
import {
    FeedbackInfo,
    FeedbackVariant,
    PaginationType,
} from "src/app/core/types/components";
import { BillsMetadataType } from "../types/pages/bills";
import { BillsMetadataSubjectType } from "../types/subjects/bills.subjects";

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
        count: 0,
    });
    private _billsTotal$ = new BehaviorSubject<number>(0);
    private _billsMetadata$ = new BehaviorSubject<BillsMetadataSubjectType>({
        total: 0,
        count: 0,
        incomeTotal: 0,
        incomeCount: 0,
        outcomeTotal: 0,
        outcomeCount: 0,
    });

    public readonly status$ = this._status$.asObservable();
    public readonly bills$ = this._bills$.asObservable();
    public readonly billsPagination$ = this._billsPagination$.asObservable();
    public readonly billsTotal$ = this._billsTotal$.asObservable();
    public readonly billsMetadata$ = this._billsMetadata$.asObservable();

    changeStatus(variant: FeedbackVariant, title: string) {
        this._status$.next({ ...this._status$.getValue(), variant, title });
        if (variant !== "none" && variant !== "loading") this._bills$.next([]);
    }

    changeVariant(variant: FeedbackVariant) {
        this._status$.next({ ...this._status$.getValue(), variant });
    }

    setBills(bills: BillsMetadataType) {
        if (bills.data.length === 0) this.changeStatus("empty", "no bills");
        else this.changeVariant("none");
        this._bills$.next(bills.data);
        this._billsPagination$.next({
            page: this._billsPagination$.getValue().page,
            limit: this._billsPagination$.getValue().limit,
            count: bills.count,
        });
        this._billsMetadata$.next({
            total: bills.total!,
            count: bills.count,
            incomeCount: bills.income.count,
            incomeTotal: bills.income.total!,
            outcomeCount: bills.count - bills.income.count,
            outcomeTotal: bills.total! - bills.income.total!,
        });
        this._billsTotal$.next(bills.total || 0);
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
            count: this._billsPagination$.getValue().count,
        });
    }

    setLimit(limit: number) {
        this._billsPagination$.next({
            page: this._billsPagination$.getValue().page,
            limit,
            count: this._billsPagination$.getValue().count,
        });
    }

    setMetadata(metadata: BillsMetadataSubjectType) {
        this._billsMetadata$.next(metadata);
    }

    autoPage(increase: boolean) {
        this.setPage(this._billsPagination$.getValue().page + 1 * (increase ? 1 : -1));
    }
}
