import { BillData } from "./../types/objects";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { SumAndCountData } from "../types/services";
import { Bill } from "../types/objects";
import {
    SubjectExpensesType,
    SubjectSavingsType,
} from "../types/subjects/home.subjects.types";

@Injectable({
    providedIn: "root",
})
export class HomeState {
    private _expenses$ = new BehaviorSubject<SubjectExpensesType>({
        sumOfBills: 0,
        numberOfBills: 0,
        delta: 0,
        paidBills: 0,
    });
    private _savings$ = new BehaviorSubject<SubjectSavingsType>({
        totalSavings: 0,
        totalBanks: 0,
        moneyToReceive: 0,
        moneyIncome: 0,
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

    public updateExpenses(expenses: SubjectExpensesType) {
        this._expenses$.next(expenses);
    }

    public updateSavings(savings: SubjectSavingsType) {
        this._savings$.next(savings);
    }

    public updateInvoices(savings: SumAndCountData) {
        this._invoices$.next(savings);
    }

    public updateRecentBills(bills: (Bill & BillData)[]) {
        this._recentBills$.next(bills);
    }
}
