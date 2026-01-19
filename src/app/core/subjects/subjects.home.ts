import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { SumAndCountData } from "../types/services";
import {
    SubjectExpensesType,
    SubjectSavingsType,
} from "../types/subjects/home.subjects.types";
import { DateSubjectType } from "../types/subjects/general.subjects.type";
import { BillDataObjectType } from "../types/data/bills.types";

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
        totalBanks: 0,
        countBanks: 0,
        totalSavingsPreview: 0,
        totalIncome: 0,
    });
    private _invoices$ = new BehaviorSubject<SumAndCountData>({
        total: 0,
        count: 0,
    });
    private _recentBills$ = new BehaviorSubject<BillDataObjectType[]>([]);

    private _date$ = new BehaviorSubject<DateSubjectType>({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    });

    public readonly expenses$ = this._expenses$.asObservable();
    public readonly savings$ = this._savings$.asObservable();
    public readonly invoices$ = this._invoices$.asObservable();
    public readonly recentBills$ = this._recentBills$.asObservable();
    public readonly date$ = this._date$.asObservable();

    public updateExpenses(expenses: SubjectExpensesType) {
        this._expenses$.next(expenses);
    }

    public updateSavings(savings: SubjectSavingsType) {
        this._savings$.next(savings);
    }

    public updateInvoices(savings: SumAndCountData) {
        this._invoices$.next(savings);
    }

    public updateRecentBills(bills: BillDataObjectType[]) {
        this._recentBills$.next(bills);
    }

    public updateDate(date: DateSubjectType) {
        this._date$.next(date);
    }
}
