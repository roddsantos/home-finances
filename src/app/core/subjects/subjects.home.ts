import { BillData } from "./../types/objects";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { SumAndCountData } from "../types/services";
import { Bill } from "../types/objects";

@Injectable({
    providedIn: "root",
})
export class HomeState {
    private _expenses$ = new BehaviorSubject<
        SumAndCountData & { delta: number; settled: number }
    >({
        total: 0,
        count: 0,
        delta: 0,
        settled: 0,
    });
    private _savings$ = new BehaviorSubject<SumAndCountData & { toReceive: number }>({
        total: 0,
        count: 0,
        toReceive: 0,
    });
    private _invoices$ = new BehaviorSubject<SumAndCountData>({
        total: 0,
        count: 0,
    });
    private _recentBills$ = new BehaviorSubject<(Bill & BillData)[]>([]);

    public readonly expenses$ = this._expenses$.asObservable();
    public readonly savings$ = this._savings$.asObservable();
    public readonly invoices$ = this._invoices$.asObservable();
    public readonly recentBills$ = this._recentBills$.asObservable();

    public updateExpenses(
        expenses: SumAndCountData & { delta: number; settled: number }
    ) {
        this._expenses$.next(expenses);
    }

    public updateSavings(savings: SumAndCountData & { toReceive: number }) {
        this._savings$.next(savings);
    }

    public updateInvoices(savings: SumAndCountData) {
        this._invoices$.next(savings);
    }

    public updateRecentBills(bills: (Bill & BillData)[]) {
        this._recentBills$.next(bills);
    }
}
