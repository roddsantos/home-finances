import { inject, Injectable } from "@angular/core";
import { concatMap, map, mergeMap, Subscription } from "rxjs";
import { DASHBOARD } from "src/utils/constants/services";
import { DashboardState } from "../core/subjects/subjects.dashboard";
import { CreditCardDashboardType } from "../core/types/services";
import { CategoriesSummaryType } from "../core/types/services/dashboard.services.types";
import {
    DashboardBillsPerMonthType,
    DashboardSavingsType,
    MonthBillsType,
} from "../core/types/data/dashboard.types";
import { CreditCardObjectType } from "../core/types/data/credit-card.types";
import { GeneralService } from "./general.service";

@Injectable({
    providedIn: "root",
})
export class DashboardService extends GeneralService {
    private dashboardState = inject(DashboardState);
    private monthSpan: number = 4;

    private monthSpan$: Subscription = this.dashboardState.monthSpan$.subscribe({
        next: (ms) => {
            this.monthSpan = ms;
        },
    });

    getBillsProgression() {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.get<DashboardBillsPerMonthType[]>(DASHBOARD + "/months", {
                    params: { span: this.monthSpan, userId: user?.id || "" },
                }),
            ),
        );
    }

    getMonthBills() {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.get<MonthBillsType[]>(DASHBOARD + "/bills", {
                    params: { userId: user?.id || "" },
                }),
            ),
        );
    }

    getSavingsInfo() {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.get<DashboardSavingsType>(DASHBOARD + "/savings", {
                    params: { userId: user?.id || "" },
                }),
            ),
        );
    }

    getTopCategories() {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.get<CategoriesSummaryType>(DASHBOARD + "/categories", {
                    params: { userId: user?.id || "", categories: 5 },
                }),
            ),
        );
    }

    getCreditCards() {
        return this.user.user$.pipe(
            concatMap((user) =>
                this.http.get<Array<CreditCardObjectType>>(DASHBOARD + "/credit-cards", {
                    params: { userId: user!.id },
                }),
            ),
            map((creditCards) => {
                let creditCardSets: CreditCardDashboardType = {};
                creditCards.forEach((creditCard) => {
                    let creditCardSet: {
                        [month: number]: CreditCardObjectType;
                    } = {};
                    creditCardSet[creditCard.month] = creditCard;
                    creditCardSets[creditCard.name] = {
                        ...(creditCardSets[creditCard.name] || {}),
                        ...creditCardSet,
                    };
                });
                this.dashboardState.updateCreditCardsSpan(creditCardSets);
                return creditCardSets;
            }),
        );
    }
    ngOnDestroy(): void {
        this.monthSpan$.unsubscribe();
    }
}
