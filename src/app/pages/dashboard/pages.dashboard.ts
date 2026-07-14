import { Dialog } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
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
import { BankService } from "src/app/services/bank.service";
import { BillService } from "src/app/services/bill.service";
import { CreditCardService } from "src/app/services/credit-card.service";
import { DashboardService } from "src/app/services/dashboard.service";
import { GeneralService } from "src/app/services/general.service";
import { currentPallete } from "src/utils/color";
import { MONTHS } from "src/utils/constants/general";
import { billsProgressionChart } from "./charts/bills-progression.charts.dashboard";
import {
    ChartConfigType,
    MoneyLeftChartType,
    PaidBillsChartType,
} from "src/app/core/types/pages/dashboard";
import { categoriesChart } from "./charts/category.charts.dashboard";
import { savingsChart } from "./charts/savings.charts.dashboard";
import { piggyBanksProgressionChart } from "./charts/piggy-banks-progression.charts.dashboard";
import { creditCardProgressionChart } from "./charts/credit-cards-progression.charts.dashboard";
import { CategoryObjectType } from "src/app/core/types/data/category.types";
import { BillDataObjectType } from "src/app/core/types/data/bills.types";
import { paidBillsChart } from "./charts/paid-bills.charts.dashboard";
import { moneyLeftChart } from "./charts/money-left.chart.dashboard";
import { convertToFloat } from "src/utils/parser";
import { CreditCardDashboardType } from "src/app/core/types/services";

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
export class PageDashboard {
    public billService = inject(BillService);
    public bankService = inject(BankService);
    public dashboardService = inject(DashboardService);
    public creditCardService = inject(CreditCardService);
    private generalService = inject(GeneralService);

    public userState = inject(UserState);
    public dashboardState = inject(DashboardState);
    public generalState = inject(GeneralState);

    public dialog = inject(Dialog);
    private snack = inject(CustomSnackbarComponent);

    public router = new Router();
    public billsPerMonthChart: Chart;
    public categoryChart: Chart;
    public categories: CategoryObjectType[] = [];
    public savingsChart: Chart;
    public creditCardsChart: Chart;
    public paidBillsChart: Chart;
    public moneyLeftChart: Chart;

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
    public chartConfig: null | ChartConfigType = null;

    public monthBills: MonthBillsType[] = [];

    public fetchBillsProgression$: Subscription;
    public fetchTopCategories$: Subscription;
    public fetchCalendarBills$: Subscription;
    public fetchSavings$: Subscription;
    public fetchCreditCardProgression$: Subscription;
    public theme$: Subscription;

    public bankActions: CardActionType[] = [
        {
            icon: "north_east",
            tooltip: "go to banks",
            action: () => this.generalService.navigateTo("/banks"),
        },
    ];
    public moneyReserve = {
        scaleIncome: 0,
        scaleSavings: 0,
        colors: [""],
    };

    fetchBillsProgression() {
        this.fetchBillsProgression$ = this.dashboardService
            .getBillsProgression()
            .subscribe({
                next: (data) => {
                    this.dashboardState.updateBillsProgression(data);
                    this.setBillsProgressionChart(data);
                },
            });
    }

    fetchTopCategories() {
        this.fetchTopCategories$ = this.dashboardService.getTopCategories().subscribe({
            next: (summary) => {
                this.setCategoryChart(summary);
                this.dashboardState.updateCategoriesSummary(summary);
            },
        });
    }

    fetchCalendarBills() {
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

    fetchSavings() {
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
                const scaleIncome = savings.totalIncome / total;
                const scaleSavings = savings.totalSavings / total;
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

    fetchCreditCardProgression() {
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

    ngOnInit() {
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

    setBillsProgressionChart(data: DashboardBillsPerMonthType[]) {
        this.billsPerMonthChart = billsProgressionChart(data, this.theme);
    }

    setCategoryChart(summary: CategoriesSummaryType) {
        this.categoryChart = categoriesChart(summary, this.theme);
    }

    setSavingsChart(savings: DashboardSavingsType) {
        this.savingsChart = savingsChart(savings, this.theme);
    }

    setPaidBillsChart(data: PaidBillsChartType) {
        this.paidBillsChart = paidBillsChart(data);
    }

    setMoneyLeftChart(data: MoneyLeftChartType) {
        this.moneyLeftChart = moneyLeftChart(data);
    }

    setSavingsProgression(piggyBanksProgression: PiggyBanksProgressionType[]) {
        this.billsPerMonthChart = piggyBanksProgressionChart(
            piggyBanksProgression,
            this.theme,
        );
    }

    setCreditCardsChart(data: CreditCardDashboardType[]) {
        this.creditCardsChart = creditCardProgressionChart(data, this.theme);
    }

    handleMonthSpan() {
        this.dashboardState.updateMonthSpan(
            this.monthSpan === 5 ? 1 : this.monthSpan + 1,
        );
        this.fetchBillsProgression();
        this.billsPerMonthChart.update();
    }

    openBill(bill: BillDataObjectType) {
        const option = {
            data: {
                item: { ...bill, sector: "bill" },
                header: "view item: " + bill.name,
                size: "md",
            },
        };
        this.dialog.open(ModalViewItem, option);
    }

    ngOnDestroy() {
        this.fetchBillsProgression$.unsubscribe();
        this.fetchTopCategories$.unsubscribe();
        this.fetchCalendarBills$.unsubscribe();
        this.fetchSavings$.unsubscribe();
        this.theme$.unsubscribe();
    }
}
