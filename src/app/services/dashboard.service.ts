import { inject, Injectable } from "@angular/core";
import { concatMap, map, Subscription } from "rxjs";
import { Bill, BillData, CreditCard } from "../core/types/objects";
import { DASHBOARD } from "src/utils/constants/services";
import { DashboardState } from "../core/subjects/subjects.dashboard";
import { CreditCardDashboardType } from "../core/types/services";
import { Service } from "./service";
import { CategoriesSummaryType } from "../core/types/services/dashboard.services.types";
import { DashboardBillsPerMonth } from "../core/types/subjects/dashboard.subjects";

@Injectable({
    providedIn: "root",
})
export class DashboardService extends Service {
    private user = this.getUser();
    private dashboardState = inject(DashboardState);
    private monthSpan: number = 4;

    private monthSpan$: Subscription = this.dashboardState.monthSpan$.subscribe({
        next: (ms) => {
            this.monthSpan = ms;
        },
    });

    getBillsProgression() {
        return this.httpClient.get<DashboardBillsPerMonth[]>(DASHBOARD + "/months", {
            params: { span: this.monthSpan, userId: this.user?.id || "" },
        });
    }

    getMonthBills() {
        return this.httpClient.get<Array<Bill & BillData>>(DASHBOARD + "/bills", {
            params: { userId: this.user?.id || "" },
        });
    }

    getSavingsInfo() {
        return this.httpClient.get<Array<Bill & BillData>>(DASHBOARD + "/savings", {
            params: { userId: this.user?.id || "" },
        });
    }

    getTopCategories() {
        return this.httpClient.get<CategoriesSummaryType>(DASHBOARD + "/categories", {
            params: { userId: this.user?.id || "", categories: 5 },
        });
    }

    getCreditCards() {
        return this.userState.user$.pipe(
            concatMap((user) =>
                this.httpClient.get<Array<CreditCard>>(DASHBOARD + "/credit-cards", {
                    params: { userId: user!.id },
                })
            ),
            map((creditCards) => {
                let creditCardSets: CreditCardDashboardType = {};
                creditCards.forEach((creditCard) => {
                    let creditCardSet: {
                        [month: number]: CreditCard;
                    } = {};
                    creditCardSet[creditCard.month] = creditCard;
                    creditCardSets[creditCard.name] = {
                        ...(creditCardSets[creditCard.name] || {}),
                        ...creditCardSet,
                    };
                });
                this.dashboardState.updateCreditCardsSpan(creditCardSets);
                return creditCardSets;
            })
        );
    }
    override ngOnDestroy(): void {
        this.user$.unsubscribe();
        this.monthSpan$.unsubscribe();
    }
}
