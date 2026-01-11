import { DASHBOARD_SAVINGS_INITIALIZER } from "src/utils/constants/mocks";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CreditCardDashboardType } from "src/app/core/types/services";
import { CategoriesSummaryType } from "src/app/core/types/services/dashboard.services.types";
import {
    DashboardBillsPerMonthType,
    DashboardSavingsType,
    MonthBillsType,
} from "src/app/core/types/subjects/dashboard.subjects";
import { BillDataObjectType } from "../types/data/bills.types";
import { CreditCardObjectType } from "../types/data/credit-card.types";

@Injectable({
    providedIn: "root",
})
export class DashboardState {
    private _month$ = new BehaviorSubject<number>(new Date().getMonth());
    private _monthSpan$ = new BehaviorSubject<number>(5);
    private _billsProgression$ = new BehaviorSubject<DashboardBillsPerMonthType[]>([]);
    private _billsGroups$ = new BehaviorSubject<Array<BillDataObjectType>[]>([]);
    private _monthBills$ = new BehaviorSubject<MonthBillsType[]>([]);
    private _savings$ = new BehaviorSubject<DashboardSavingsType>({
        ...DASHBOARD_SAVINGS_INITIALIZER,
    });
    private _creditCards$ = new BehaviorSubject<CreditCardObjectType[]>([]);
    private _creditCardsSpan$ = new BehaviorSubject<CreditCardDashboardType>({});
    private _categoriesSummary$ = new BehaviorSubject<CategoriesSummaryType>({
        topCategories: [],
        otherCategories: null,
    });

    public readonly monthSpan$ = this._monthSpan$.asObservable();
    public readonly billsProgression$ = this._billsProgression$.asObservable();
    public readonly billsGroups$ = this._billsGroups$.asObservable();
    public readonly monthBills$ = this._monthBills$.asObservable();
    public readonly savings$ = this._savings$.asObservable();
    public readonly creditCards$ = this._creditCards$.asObservable();
    public readonly creditCardsSpan$ = this._creditCardsSpan$.asObservable();
    public readonly month$ = this._month$.asObservable();
    public readonly categoriesSummary$ = this._categoriesSummary$.asObservable();

    public updateMonth(month: number) {
        this._month$.next(month);
    }

    public updateMonthBills(bills: MonthBillsType[]) {
        this._monthBills$.next(bills);
    }

    public updateBillsProgression(billsProgression: DashboardBillsPerMonthType[]) {
        this._billsProgression$.next(billsProgression);
    }

    public updateBillsGroups(billsGroups: Array<BillDataObjectType>[]) {
        this._billsGroups$.next(billsGroups);
    }

    public updateMonthSpan(monthSpan: number) {
        this._monthSpan$.next(monthSpan);
    }

    public updateSavings(savings: DashboardSavingsType) {
        this._savings$.next(savings);
    }

    public updateCreditCards(creditCards: CreditCardObjectType[]) {
        this._creditCards$.next(creditCards);
    }

    public updateCreditCardsSpan(creditCards: CreditCardDashboardType) {
        this._creditCardsSpan$.next(creditCards);
    }

    public updateCategoriesSummary(categoriesSummary: CategoriesSummaryType) {
        this._categoriesSummary$.next(categoriesSummary);
    }
}
