import { BillData } from "./../types/objects";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Bill } from "../types/objects";
import { BillsMonthCount } from "../types/dashboard";

@Injectable({
    providedIn: "root",
})
export class DashboardState {
    private _monthSpan$ = new BehaviorSubject<number>(5);
    private _billsCounters$ = new BehaviorSubject<BillsMonthCount[]>([]);
    private _billsGroups$ = new BehaviorSubject<Array<Bill & BillData>[]>([]);
    private _monthBills$ = new BehaviorSubject<Array<Bill & BillData>>([]);
    private _savings$ = new BehaviorSubject<Array<Bill & BillData>>([]);

    public readonly monthSpan$ = this._monthSpan$.asObservable();
    public readonly billsCounters$ = this._billsCounters$.asObservable();
    public readonly billsGroups$ = this._billsGroups$.asObservable();
    public readonly monthBills$ = this._monthBills$.asObservable();
    public readonly savings$ = this._savings$.asObservable();

    public updateMonthBills(bills: Array<Bill & BillData>) {
        this._monthBills$.next(bills);
    }

    public updateBillsCounters(billsGroups: Array<Bill & BillData>[]) {
        let res: BillsMonthCount[] = billsGroups.map((bills, index) => ({
            total: bills.reduce((sum, bill) => sum + (bill.totalParcel || bill.total), 0),
            count: bills.length,
            month:
                new Date().getMonth() - index < 0
                    ? 12 - (index - new Date().getMonth())
                    : new Date().getMonth() - index,
            year:
                new Date().getMonth() - index < 0
                    ? new Date().getFullYear() - 1
                    : new Date().getFullYear(),
        }));
        this._billsCounters$.next(res);
    }

    public updateBillsGroups(billsGroups: Array<Bill & BillData>[]) {
        this._billsGroups$.next(billsGroups);
    }

    public updateMonthSpan(monthSpan: number) {
        this._monthSpan$.next(monthSpan);
    }

    public updateSavings(savings: Array<Bill & BillData>) {
        this._savings$.next(savings);
    }
}
