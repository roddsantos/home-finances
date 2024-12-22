import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { UserState } from "../core/subjects/subjects.user";
import { concatMap, map, mergeMap, Observable } from "rxjs";
import { Bill, BillData, CreditCard } from "../core/types/objects";
import { BILL, DASHBOARD } from "src/utils/constants/services";
import { DashboardState } from "../core/subjects/subjects.dashboard";
import { CreditCardDashboardType } from "../core/types/services";

@Injectable({
    providedIn: "root",
})
export class DashboardService {
    private http = inject(HttpClient);
    private user = inject(UserState);

    private dashboardState = inject(DashboardState);
    //  = {
    //     [new Date().getMonth() - 4]: [] as CreditCard[],
    //     [new Date().getMonth() - 3]: [] as CreditCard[],
    //     [new Date().getMonth() - 2]: [] as CreditCard[],
    //     [new Date().getMonth() - 1]: [] as CreditCard[],
    //     [new Date().getMonth()]: [] as CreditCard[],
    // };

    getMonthSpanBills(monthSpan: number) {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.get<Array<Bill & BillData>[]>(DASHBOARD + "/months", {
                    params: { monthSpan, userId: user!.id },
                })
            )
        );
    }

    getMonthBills() {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.get<Array<Bill & BillData>>(DASHBOARD + "/bills", {
                    params: { userId: user!.id },
                })
            )
        );
    }

    getSavingsInfo() {
        return this.user.user$.pipe(
            mergeMap((user) =>
                this.http.get<Array<Bill & BillData>>(DASHBOARD + "/savings", {
                    params: { userId: user!.id },
                })
            )
        );
    }

    getCreditCards() {
        return this.user.user$.pipe(
            concatMap((user) =>
                this.http.get<Array<CreditCard>>(DASHBOARD + "/credit-cards", {
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
