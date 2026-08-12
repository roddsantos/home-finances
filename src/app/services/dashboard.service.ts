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
        return this.http.get<DashboardBillsPerMonthType[]>(DASHBOARD + "/months", {
            params: { span: this.monthSpan },
        });
    }

    getMonthBills() {
        return this.http.get<MonthBillsType[]>(DASHBOARD + "/bills");
    }

    getSavingsInfo() {
        return this.http.get<DashboardSavingsType>(DASHBOARD + "/savings");
    }

    getTopCategories() {
        return this.http.get<CategoriesSummaryType>(DASHBOARD + "/categories", {
            params: { categories: 6 },
        });
    }

    getCreditCards() {
        return this.http.get<CreditCardDashboardType[]>(DASHBOARD + "/credit-cards");
    }
    ngOnDestroy(): void {
        this.monthSpan$.unsubscribe();
    }
}
