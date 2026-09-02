import { Dialog } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Subscription } from "rxjs";

import { CalendarComponent } from "src/app/components/calendar/calendar.component";
import { CardComponent } from "src/app/components/card/card.component";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";

import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";

import { DashboardState } from "src/app/core/subjects/subjects.dashboard";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { UserState } from "src/app/core/subjects/subjects.user";

import { CardActionType } from "src/app/core/types/components";
import { CategoriesSummaryType } from "src/app/core/types/services/dashboard.services.types";

import {
    DashboardBillsPerMonthType,
    DashboardSavingsType,
    MonthBillsType,
    PiggyBanksProgressionType,
} from "src/app/core/types/data/dashboard.types";

import {
    ChartConfigType,
    MoneyLeftChartType,
    PaidBillsChartType,
} from "src/app/core/types/pages/dashboard";

import { CategoryObjectType } from "src/app/core/types/data/category.types";
import { BillDataObjectType } from "src/app/core/types/data/bills.types";
import { CreditCardDashboardType } from "src/app/core/types/services";

import { BankService } from "src/app/services/bank.service";
import { BillService } from "src/app/services/bill.service";
import { CreditCardService } from "src/app/services/credit-card.service";
import { DashboardService } from "src/app/services/dashboard.service";
import { GeneralService } from "src/app/services/general.service";

import { currentPallete } from "src/utils/color";
import { MONTHS } from "src/utils/constants/general";
import { convertToFloat } from "src/utils/parser";

import { billsProgressionChart } from "./charts/bills-progression.charts.dashboard";
import { categoriesChart } from "./charts/category.charts.dashboard";
import { savingsChart } from "./charts/savings.charts.dashboard";
import { piggyBanksProgressionChart } from "./charts/piggy-banks-progression.charts.dashboard";
import { creditCardProgressionChart } from "./charts/credit-cards-progression.charts.dashboard";
import { paidBillsChart } from "./charts/paid-bills.charts.dashboard";
import { moneyLeftChart } from "./charts/money-left.chart.dashboard";

@Component({
    selector: "page-dashboard",
    templateUrl: "./pages.dashboard.html",
    styleUrls: ["./pages.dashboard.css"],
    standalone: true,
    imports: [
        CommonModule,
        CardComponent,
        MatIconModule,
        MatButtonModule,
        CalendarComponent,
    ],
})
export class PageDashboard implements OnInit, OnDestroy {
    // Services
    public billService = inject(BillService);
    public bankService = inject(BankService);
    public dashboardService = inject(DashboardService);
    public creditCardService = inject(CreditCardService);

    private generalService = inject(GeneralService);
    private dialog = inject(Dialog);
    private snack = inject(CustomSnackbarComponent);

    public userState = inject(UserState);
    public dashboardState = inject(DashboardState);
    public generalState = inject(GeneralState);

    public router = inject(Router);

    // Charts
    public billsPerMonthChart?: Chart;
    public categoryChart?: Chart;
    public savingsChart?: Chart;
    public piggyBanksProgressionChart?: Chart;
    public creditCardsChart?: Chart;
    public paidBillsChart?: Chart;
    public moneyLeftChart?: Chart;

    // Dashboard data
    public categories: CategoryObjectType[] = [];
    public monthBills: MonthBillsType[] = [];

    public pallete = currentPallete();

    public theme = "default";
    public months = MONTHS;
    public monthSpan = 1;
    public month = MONTHS[new Date().getMonth()];
    public year = new Date().getFullYear();

    public incomings = 0;
    public outcomings = 0;

    public savingsLabels = ["paid bills", "pending bills", "savings preview"];

    public savingsColors = [this.pallete.warning, this.pallete.error, this.pallete.info];

    public ARC = 120;

    public chartConfig: ChartConfigType | null = null;

    public moneyReserve = {
        scaleIncome: 0,
        scaleSavings: 0,
        colors: [""],
    };

    // Subscriptions
    private fetchBillsProgression$?: Subscription;
    private fetchTopCategories$?: Subscription;
    private fetchCalendarBills$?: Subscription;
    private fetchSavings$?: Subscription;
    private fetchCreditCardProgression$?: Subscription;
    private theme$?: Subscription;

    public bankActions: CardActionType[] = [
        {
            icon: "north_east",
            tooltip: "go to banks",
            action: () => this.generalService.navigateTo("/banks"),
        },
    ];

    // --------------------------------------------------
    // Fetch
    // --------------------------------------------------

    private fetchBillsProgression(): void {
        this.fetchBillsProgression$?.unsubscribe();

        this.fetchBillsProgression$ = this.dashboardService
            .getBillsProgression()
            .subscribe({
                next: (data) => {
                    this.dashboardState.updateBillsProgression(data);
                    this.setBillsProgressionChart(data);
                },
            });
    }

    private fetchTopCategories(): void {
        this.fetchTopCategories$?.unsubscribe();

        this.fetchTopCategories$ = this.dashboardService.getTopCategories().subscribe({
            next: (summary) => {
                this.setCategoryChart(summary);
                this.dashboardState.updateCategoriesSummary(summary);
            },
        });
    }

    private fetchCalendarBills(): void {
        this.fetchCalendarBills$?.unsubscribe();

        this.fetchCalendarBills$ = this.dashboardService.getMonthBills().subscribe({
            next: (bills) => {
                this.dashboardState.updateMonthBills(bills);
                this.monthBills = bills;
            },
            error: () => {
                this.snack.openSnackBar("error fetching bills", "error");
            },
        });
    }

    private fetchSavings(): void {
        this.fetchSavings$?.unsubscribe();

        this.fetchSavings$ = this.dashboardService.getSavingsInfo().subscribe({
            next: (savings) => {
                this.dashboardState.updateSavings(savings);

                this.setSavingsChart(savings);

                this.setSavingsProgression(savings.piggyBanksProgression);

                this.setPaidBillsChart({
                    pending: savings.totalPending,
                    paid: savings.totalSettled,
                });

                const total = savings.totalIncome + savings.totalSavings;

                const scaleIncome = total === 0 ? 0 : savings.totalIncome / total;

                const scaleSavings = total === 0 ? 0 : savings.totalSavings / total;

                this.setMoneyLeftChart({
                    spent: convertToFloat(
                        savings.totalIncome + savings.totalSavings - savings.totalBanks,
                    ),
                    savings: savings.totalBanks,
                });

                this.moneyReserve = {
                    scaleIncome,
                    scaleSavings,
                    colors: ["#00E226", "#005BE2"],
                };
            },
        });
    }

    private fetchCreditCardProgression(): void {
        this.fetchCreditCardProgression$?.unsubscribe();

        this.fetchCreditCardProgression$ = this.dashboardService
            .getCreditCards()
            .subscribe({
                next: (data) => {
                    this.dashboardState.updateCreditCardsSpan(data);
                    this.setCreditCardsChart(data);
                },
                error: () => {
                    this.snack.openSnackBar("error fetching credit cards", "error");
                },
            });
    }

    // --------------------------------------------------
    // Lifecycle
    // --------------------------------------------------

    ngOnInit(): void {
        Chart.register(ChartDataLabels);

        this.theme$ = this.generalState.theme$.subscribe({
            next: (theme) => {
                this.theme = theme;
            },
        });

        this.fetchBillsProgression();
        this.fetchTopCategories();
        this.fetchCalendarBills();
        this.fetchSavings();
        this.fetchCreditCardProgression();
    }

    ngOnDestroy(): void {
        this.fetchBillsProgression$?.unsubscribe();
        this.fetchTopCategories$?.unsubscribe();
        this.fetchCalendarBills$?.unsubscribe();
        this.fetchSavings$?.unsubscribe();
        this.fetchCreditCardProgression$?.unsubscribe();
        this.theme$?.unsubscribe();

        this.destroyCharts();
    }

    // --------------------------------------------------
    // Charts
    // --------------------------------------------------

    private destroyCharts(): void {
        this.billsPerMonthChart?.destroy();
        this.categoryChart?.destroy();
        this.savingsChart?.destroy();
        this.piggyBanksProgressionChart?.destroy();
        this.creditCardsChart?.destroy();
        this.paidBillsChart?.destroy();
        this.moneyLeftChart?.destroy();
    }

    private setBillsProgressionChart(data: DashboardBillsPerMonthType[]): void {
        this.billsPerMonthChart?.destroy();

        this.billsPerMonthChart = billsProgressionChart(data, this.theme);
    }

    private setCategoryChart(summary: CategoriesSummaryType): void {
        this.categoryChart?.destroy();

        this.categoryChart = categoriesChart(summary, this.theme);
    }

    private setSavingsChart(savings: DashboardSavingsType): void {
        this.savingsChart?.destroy();

        this.savingsChart = savingsChart(savings, this.theme);
    }

    private setPaidBillsChart(data: PaidBillsChartType): void {
        this.paidBillsChart?.destroy();

        this.paidBillsChart = paidBillsChart(data);
    }

    private setMoneyLeftChart(data: MoneyLeftChartType): void {
        this.moneyLeftChart?.destroy();

        this.moneyLeftChart = moneyLeftChart(data);
    }

    private setSavingsProgression(
        piggyBanksProgression: PiggyBanksProgressionType[],
    ): void {
        this.piggyBanksProgressionChart?.destroy();

        this.piggyBanksProgressionChart = piggyBanksProgressionChart(
            piggyBanksProgression,
            this.theme,
        );
    }

    private setCreditCardsChart(data: CreditCardDashboardType[]): void {
        this.creditCardsChart?.destroy();

        this.creditCardsChart = creditCardProgressionChart(data, this.theme);
    }

    // --------------------------------------------------
    // Actions
    // --------------------------------------------------

    handleMonthSpan(): void {
        this.dashboardState.updateMonthSpan(
            this.monthSpan === 5 ? 1 : this.monthSpan + 1,
        );

        this.fetchBillsProgression();

        this.billsPerMonthChart?.update();
    }

    openBill(bill: BillDataObjectType): void {
        this.dialog.open(ModalViewItem, {
            data: {
                item: {
                    ...bill,
                    sector: "bill",
                },
                header: "view item: " + bill.name,
                size: "md",
            },
        });
    }
}
