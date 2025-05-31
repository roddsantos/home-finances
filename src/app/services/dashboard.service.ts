import { inject, Injectable } from "@angular/core";
import { concatMap, map } from "rxjs";
import { Bill, BillData, CreditCard } from "../core/types/objects";
import { DASHBOARD } from "src/utils/constants/services";
import { DashboardState } from "../core/subjects/subjects.dashboard";
import { CreditCardDashboardType } from "../core/types/services";
import { Service } from "./service";
import { CategoriesSummaryType } from "../core/types/services/dashboard.services.types";

@Injectable({
    providedIn: "root",
})
export class DashboardService extends Service {
    private user = this.getUser();

    private dashboardState = inject(DashboardState);

    getMonthSpanBills(monthSpan: number) {
        return this.httpClient.get<Array<Bill & BillData>[]>(DASHBOARD + "/months", {
            params: { monthSpan, userId: this.user?.id || "" },
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
}
