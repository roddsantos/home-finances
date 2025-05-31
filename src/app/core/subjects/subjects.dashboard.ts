import { BillData, CreditCard } from "./../types/objects";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Bill } from "../types/objects";
import { CreditCardDashboardType } from "../types/services";
import { CategoriesSummaryType } from "../types/services/dashboard.services.types";
import { DashboardBillsPerMonth } from "../types/subjects/dashboard.subjects";

@Injectable({
    providedIn: "root",
})
export class DashboardState {
    private _month$ = new BehaviorSubject<number>(new Date().getMonth());
    private _monthSpan$ = new BehaviorSubject<number>(5);
    private _billsProgression$ = new BehaviorSubject<DashboardBillsPerMonth[]>([]);
    private _billsGroups$ = new BehaviorSubject<Array<Bill & BillData>[]>([]);
    private _monthBills$ = new BehaviorSubject<Array<Bill & BillData>>([]);
    private _savings$ = new BehaviorSubject<Array<Bill & BillData>>([]);
    private _creditCards$ = new BehaviorSubject<CreditCard[]>([]);
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

    public updateMonthBills(bills: Array<Bill & BillData>) {
        this._monthBills$.next(bills);
    }

    public updateBillsProgression(billsProgression: DashboardBillsPerMonth[]) {
        this._billsProgression$.next(billsProgression);
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

    public updateCreditCards(creditCards: CreditCard[]) {
        this._creditCards$.next(creditCards);
    }

    public updateCreditCardsSpan(creditCards: CreditCardDashboardType) {
        this._creditCardsSpan$.next(creditCards);
    }

    public updateCategoriesSummary(categoriesSummary: CategoriesSummaryType) {
        this._categoriesSummary$.next(categoriesSummary);
    }
}
