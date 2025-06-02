import { Dialog } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";
import { Chart } from "chart.js/auto";
import ChartDataLabels, { Context } from "chartjs-plugin-datalabels";
import { Subscription } from "rxjs";
import { CalendarComponent } from "src/app/components/calendar/calendar.component";
import { CardComponent } from "src/app/components/card/card.component";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";
import { DashboardState } from "src/app/core/subjects/subjects.dashboard";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { UserState } from "src/app/core/subjects/subjects.user";
import { CardActionType } from "src/app/core/types/components";
import { Bill, BillData, Category, CreditCard } from "src/app/core/types/objects";
import { CategoriesSummaryType } from "src/app/core/types/services/dashboard.services.types";
import { DashboardSavingsType } from "src/app/core/types/subjects/dashboard.subjects";
import { ServiceBank } from "src/app/services/bank.service";
import { ServiceBill } from "src/app/services/bill.service";
import { ServiceCreditCard } from "src/app/services/credit-card.service";
import { DashboardService } from "src/app/services/dashboard.service";
import { GeneralService } from "src/app/services/general.service";
import { tint } from "src/utils/color";
import { MONTHS } from "src/utils/constants/general";

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
    public billService = inject(ServiceBill);
    public bankService = inject(ServiceBank);
    public dashboardService = inject(DashboardService);
    public creditCardService = inject(ServiceCreditCard);
    private generalService = inject(GeneralService);

    public userState = inject(UserState);
    public dashboardState = inject(DashboardState);
    public generalState = inject(GeneralState);

    public dialog = inject(Dialog);
    private snack = inject(CustomSnackbarComponent);

    public router = new Router();
    public billsPerMonthChart: Chart;
    public categoryChart: Chart;
    public categories: Category[] = [];
    public savingsChart: Chart;
    public creditCardsChart: Chart;

    public style = getComputedStyle(document.body);
    public primaryColor = this.style.getPropertyValue("--primary");
    public secondaryColor = this.style.getPropertyValue("--secondary");
    public bhColor = this.style.getPropertyValue("--bh");
    public thirdColor = this.style.getPropertyValue("--third");
    public text1Color = this.style.getPropertyValue("--text-1");
    public text3Color = this.style.getPropertyValue("--text-3");

    public theme = "default";
    public months = MONTHS;
    public monthSpan = 1;
    public month = MONTHS[new Date().getMonth()];
    public year = new Date().getFullYear();
    public incomings = 0;
    public outcomings = 0;
    public savingsLabels = ["income", "savings", "settled", "pending", "preview"];
    public savingsColors = ["#00E226", "#005BE2", "#008905", "#DBE200", "#00E288"];

    public monthBills: (Bill & BillData)[] = [];
    public creditCards: CreditCard[] = [];

    public fetchBillsProgression$: Subscription;
    public fetchTopCategories$: Subscription;
    public fetchCalendarBills$: Subscription;
    public fetchSavings$: Subscription;

    public bankActions: CardActionType[] = [
        {
            icon: "north_east",
            tooltip: "go to banks",
            action: () => this.generalService.navigateTo("/banks"),
        },
    ];

    public lineOptions: any = (dataOfChart: any[]) => {
        return {
            layout: { autoPadding: true, padding: { top: 0, right: 40, left: 40 } },
            clip: false,
            responsive: true,
            plugins: {
                datalabels: {
                    anchor: "end",
                    align: "top",
                    color: this.text1Color,
                    font: { weight: "bold" },
                    formatter: (v: number, context: Context) => {
                        return v + " R$\n" + dataOfChart[context.dataIndex].delta + "%";
                    },
                },
                tooltip: {
                    callbacks: {
                        footer: (x: any) => {
                            return "qty: " + dataOfChart[x[0].dataIndex].count + " bills";
                        },
                    },
                },
            },
            scales: {
                y: { display: false },
                x: {
                    ticks: {
                        font: { weight: "bold", size: 12 },
                    },
                },
            },
        };
    };

    fetchBillsProgression() {
        this.fetchBillsProgression$ = this.dashboardService
            .getBillsProgression()
            .subscribe({
                next: (data) => {
                    this.dashboardState.updateBillsProgression(data);
                    this.setBillsProgressionChart();
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
            },
        });
    }

    ngOnInit() {
        Chart.register(ChartDataLabels);
        this.creditCardService
            .getCreditCards({
                month: this.month.order === 0 ? 11 : this.month.order - 1,
                year: this.month.order === 0 ? this.year - 1 : this.year,
            })
            .subscribe({
                next: (creditCards) => {
                    this.dashboardState.updateCreditCards(creditCards);
                    this.creditCards = creditCards;
                },
            });
        this.dashboardService.getCreditCards().subscribe({
            next: () => this.setCreditCardsChart(),
        });
        this.generalState.theme$.subscribe({
            next: (theme) => (this.theme = theme),
        });
        this.fetchBillsProgression();
        this.fetchTopCategories();
        this.fetchCalendarBills();
        this.fetchSavings();
    }

    setBillsProgressionChart() {
        this.dashboardState.billsProgression$.subscribe({
            next: (billsProgression) => {
                this.billsPerMonthChart = new Chart("bills-per-month", {
                    type: "line",
                    data: {
                        labels: billsProgression.map((bc) => MONTHS[bc.month].short),
                        datasets: [
                            {
                                label: "total value (R$)",
                                data: billsProgression.map((bm) => bm.total),
                                tension: 0.3,
                                backgroundColor:
                                    this.theme === "binary"
                                        ? "transparent"
                                        : tint(0.1, this.secondaryColor),
                                borderColor: this.secondaryColor,
                                fill: true,
                            },
                        ],
                    },
                    options: this.lineOptions(billsProgression),
                });
            },
        });
    }

    setCategoryChart(summary: CategoriesSummaryType) {
        this.categoryChart = new Chart("categories-chart", {
            plugins: [ChartDataLabels],
            type: "bar",
            data: {
                labels: summary.topCategories.map((tc) => tc.category!.name),
                datasets: [
                    {
                        label: "",
                        data: summary.topCategories.map((tc) => tc.total),
                        spacing: 1,
                        borderWidth: 3,
                        borderRadius: 10,
                        borderColor:
                            this.theme === "binary"
                                ? summary.topCategories.map((tc) => tc.category!.color)
                                : "transparent",
                        backgroundColor:
                            this.theme === "binary"
                                ? "transparent"
                                : summary.topCategories.map((tc) => tc.category!.color),
                    },
                ],
            },
            options: {
                clip: false,
                layout: { padding: { top: 10 } },
                scales: {
                    y: { display: false, max: summary.topCategories[0].total * 1.1 },
                },
                maintainAspectRatio: true,
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            footer: (x) => {
                                return (
                                    "qty: " + summary.topCategories[x[0].dataIndex].count
                                );
                            },
                        },
                    },
                    legend: { display: false },
                    datalabels: {
                        anchor: "end",
                        align: "top",
                        color: this.text1Color,
                        font: { weight: "bold", family: "GT-Eesti-Text-Book", size: 14 },
                        formatter: (v) => v + " R$",
                    },
                },
            },
        });
    }

    setSavingsChart(savings: DashboardSavingsType) {
        const ARC = 120;
        this.savingsChart = new Chart("savings-chart", {
            type: "doughnut",
            data: {
                datasets: [
                    {
                        weight: 1.5,
                        data: [savings.totalIncome, savings.totalSavings],
                        backgroundColor:
                            this.theme === "binary"
                                ? "transparent"
                                : ["#00E226", "#005BE2"],
                        borderColor:
                            this.theme === "binary"
                                ? ["#00E226", "#005BE2"]
                                : "transparency",
                        borderRadius: 10,
                    },
                    {
                        weight: 1.5,
                        data: [
                            savings.totalSettled,
                            savings.totalPending,
                            savings.totalPreview,
                        ],
                        backgroundColor:
                            this.theme === "binary"
                                ? "transparent"
                                : ["#008905", "#DBE200", "#00E288"],
                        borderColor:
                            this.theme === "binary"
                                ? ["#008905", "#DBE200", "#00E288"]
                                : "transparency",
                        borderRadius: 10,
                    },
                ],
            },
            options: {
                circumference: 360 - ARC,
                rotation: -1 * ARC,
                cutout: 40,
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true },
                    datalabels: {
                        color: this.text1Color,
                        backgroundColor: this.bhColor,
                        font: { weight: "bold" },
                        formatter: (v) => v + " R$",
                    },
                    tooltip: { enabled: false },
                },
            },
        });
    }

    handleMonthSpan() {
        this.dashboardState.updateMonthSpan(
            this.monthSpan === 5 ? 1 : this.monthSpan + 1
        );
        this.fetchBillsProgression();
        this.billsPerMonthChart.update();
    }

    setCreditCardsChart() {
        const monthsArray = [
            new Date().getMonth() - 4,
            new Date().getMonth() - 3,
            new Date().getMonth() - 2,
            new Date().getMonth() - 1,
            new Date().getMonth(),
        ];
        this.dashboardState.creditCardsSpan$.subscribe({
            next: (creditCards) => {
                this.creditCardsChart = new Chart("credit-cards-chart", {
                    type: "line",
                    data: {
                        labels: monthsArray.map((mth) => MONTHS[mth].short),
                        datasets: Object.keys(creditCards)
                            .map((name) => ({
                                label: name,
                                data: monthsArray.map(
                                    (month) => creditCards[name][month]?.invoice || 0
                                ),
                                tension: 0.3,
                                fill: true,
                                borderColor:
                                    Object.keys(creditCards[name]).map(
                                        (mth: any) => creditCards[name][mth]?.color
                                    )[0] || this.primaryColor,
                                backgroundColor:
                                    this.theme === "binary"
                                        ? "transparent"
                                        : Object.keys(creditCards[name]).map(
                                              (mth: any) => creditCards[name][mth]?.color
                                          )[0] + "77" || this.primaryColor,
                            }))
                            .sort(
                                (a, b) =>
                                    a.data.reduce((acc, total) => acc + total, 0) -
                                    b.data.reduce((acc, total) => acc + total, 0)
                            ),
                    },
                    options: this.lineOptions,
                });
            },
        });
    }

    openBill(bill: Bill & BillData) {
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
    }
}
