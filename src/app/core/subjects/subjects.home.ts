import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { SumAndCountData } from "../types/services";

@Injectable({
    providedIn: "root",
})
export class HomeState {
    private _expenses$ = new BehaviorSubject<SumAndCountData & { delta: number }>({
        total: 0,
        count: 0,
        delta: 0,
    });
    private _savings$ = new BehaviorSubject<SumAndCountData>({
        total: 0,
        count: 0,
    });
    private _invoices$ = new BehaviorSubject<SumAndCountData>({
        total: 0,
        count: 0,
    });

    public readonly expenses$ = this._expenses$.asObservable();
    public readonly savings$ = this._savings$.asObservable();
    public readonly invoices$ = this._invoices$.asObservable();

    public updateExpenses(expenses: SumAndCountData & { delta: number }) {
        this._expenses$.next(expenses);
    }

    public updateSavings(savings: SumAndCountData) {
        this._savings$.next(savings);
    }

    public updateInvoices(savings: SumAndCountData) {
        this._invoices$.next(savings);
    }
}
