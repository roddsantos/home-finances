import { Dialog } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { CalendarComponent } from "src/app/components/calendar/calendar.component";
import { CardComponent } from "src/app/components/card/card.component";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";
import { DashboardState } from "src/app/core/subjects/subjects.dashboard";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { UserState } from "src/app/core/subjects/subjects.user";
import { CardActionType } from "src/app/core/types/components";
import { Bill, BillData, Category, CreditCard } from "src/app/core/types/objects";
import { ServiceBank } from "src/app/services/bank.service";
import { ServiceBill } from "src/app/services/bill.service";
import { ServiceCreditCard } from "src/app/services/credit-card.service";
import { DashboardService } from "src/app/services/dashboard.service";
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

    public style = getComputedStyle(document.body);
    public primaryColor = this.style.getPropertyValue("--primary");
    public secondaryColor = this.style.getPropertyValue("--secondary");
    public thirdColor = this.style.getPropertyValue("--third");
    public text1Color = this.style.getPropertyValue("--text-1");

    public theme = "default";
    public months = MONTHS;
    public monthSpan = 1;
    public month = MONTHS[new Date().getMonth()];
    public year = new Date().getFullYear();

    public monthBills: (Bill & BillData)[] = [];
    public creditCards: CreditCard[] = [];

    public bankActions: CardActionType[] = [
        {
            icon: "north_east",
            tooltip: "go to banks",
            action: () => this.router.navigate(["/banks"]),
        },
    ];

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
        this.dashboardService.getSavingsInfo().subscribe({
            next: (savings) => {
                this.dashboardState.updateSavings(savings);
                this.setSavingsChart(savings);
            },
        });
        this.dashboardService.getMonthBills().subscribe({
            next: (bills) => {
                this.dashboardState.updateMonthBills(bills);
                this.setCategoryChart(bills);
                this.monthBills = bills;
            },
            error: () => {
                this.snack.openSnackBar("error fetching bills", "error");
            },
        });
        this.dashboardState.monthSpan$.subscribe({
            next: (monthSpan) => {
                this.monthSpan = monthSpan;
                this.dashboardService.getMonthSpanBills(monthSpan).subscribe({
                    next: (data) => {
                        this.dashboardState.updateBillsCounters(data);
                        this.setBillsPerMonthChart();
                    },
                });
            },
        });
        this.generalState.theme$.subscribe({
            next: (theme) => (this.theme = theme),
        });
    }

    setBillsPerMonthChart() {
        this.dashboardState.billsCounters$.subscribe({
            next: (billsCounters) => {
                this.billsPerMonthChart = new Chart("bills-per-month", {
                    type: "line",
                    data: {
                        labels: billsCounters
                            .map((bc) => MONTHS[bc.month].short)
                            .reverse(),
                        datasets: [
                            {
                                label: "total bill value (R$)",
                                data: billsCounters.map((bc) => bc.total).reverse(),
                                tension: 0.3,
                                backgroundColor:
                                    this.theme === "binary"
                                        ? "transparent"
                                        : billsCounters
                                              .map((_, index) =>
                                                  tint(index * 0.1, this.secondaryColor)
                                              )
                                              .reverse(),
                                borderColor: this.secondaryColor,
                                fill: true,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            datalabels: {
                                anchor: "end",
                                align: "top",
                                color: this.text1Color,
                                font: { weight: "bold" },
                                formatter: (v) => v + " R$",
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
                    },
                });
            },
        });
    }

    setCategoryChart(monthBills: Array<Bill & BillData>) {
        let categorySets: any = {};
        this.categories = [...new Set(monthBills.map((bill) => bill.category))];
        monthBills.forEach((monthBill) => {
            categorySets[monthBill.categoryId] = [
                ...(categorySets[monthBill.categoryId] || []),
                monthBill,
            ];
        });

        this.categoryChart = new Chart("categories-chart", {
            plugins: [ChartDataLabels],
            type: "pie",
            data: {
                labels: this.categories.map((category) => category.name),
                datasets: [
                    {
                        label: "value R$",
                        data: Object.keys(categorySets).map((category) =>
                            categorySets[category].reduce(
                                (acc: number, value: Bill & BillData) =>
                                    acc + value.totalParcel!,
                                0
                            )
                        ),
                        spacing: 3,
                        borderWidth: 3,
                        borderRadius: 10,
                        borderColor:
                            this.theme === "binary"
                                ? this.categories.map((category) => category.color)
                                : "transparent",
                        backgroundColor:
                            this.theme === "binary"
                                ? "transparent"
                                : this.categories.map((category) => category.color),
                    },
                    { data: [], weight: 0.1 },
                    {
                        label: "number of bills",
                        data: Object.keys(categorySets).map(
                            (category) => categorySets[category].length
                        ),
                        borderWidth: 2,
                        borderColor:
                            this.theme === "binary"
                                ? this.categories.map((category) => category.color)
                                : "transparent",
                        backgroundColor:
                            this.theme === "binary"
                                ? "transparent"
                                : this.categories.map((category) => category.color),
                    },
                ],
            },
            options: {
                responsive: true,
                devicePixelRatio: 4,
                layout: { padding: 0 },
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            boxWidth: 10,
                            font: { size: 12 },
                        },
                        fullSize: false,
                    },
                    datalabels: {
                        backgroundColor:
                            this.theme === "binary" ? "transparent" : this.secondaryColor,
                        borderRadius: 10,
                        color: this.text1Color,
                        formatter: (value, ctx) => {
                            return ctx.dataset.label === "value R$"
                                ? value + "R$"
                                : value;
                        },
                    },
                },
            },
        });
    }

    setSavingsChart(savings: (Bill & BillData)[]) {
        let incomings: number = 0;
        let outcomings: number = 0;
        savings.forEach((bill) => {
            if (bill.isPayment) outcomings += bill.total;
            else incomings += bill.total;
        });
        this.savingsChart = new Chart("savings-chart", {
            type: "bar",
            data: {
                labels: ["incomings", "outcomings"],
                datasets: [
                    {
                        label: "",
                        data: [incomings, outcomings],
                        backgroundColor:
                            this.theme === "binary"
                                ? "transparent"
                                : [this.primaryColor, this.secondaryColor],
                        borderColor:
                            this.theme === "binary"
                                ? [this.primaryColor, this.secondaryColor]
                                : "transparent",
                        categoryPercentage: 0.8,
                        barPercentage: 1,
                        borderRadius: 10,
                    },
                ],
            },
            options: {
                layout: { padding: { top: 30 } },
                scales: { y: { display: false } },
                responsive: true,
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        anchor: "end",
                        align: "top",
                        color: this.text1Color,
                        font: { weight: "bold" },
                        formatter: (v) => v + " R$",
                    },
                },
            },
        });
    }

    handleMonthSpan() {
        this.dashboardState.updateMonthSpan(
            this.monthSpan === 5 ? 1 : this.monthSpan + 1
        );
        this.dashboardState.billsCounters$.subscribe({
            next: (billsCounters) => {
                this.billsPerMonthChart.data.labels = billsCounters
                    .map((bc) => MONTHS[bc.month].short)
                    .reverse();
                this.billsPerMonthChart.data.datasets.forEach((dataset) => {
                    dataset.data = billsCounters.map((bc) => bc.total).reverse();
                    dataset.backgroundColor =
                        this.theme === "binary"
                            ? "transparent"
                            : billsCounters
                                  .map((_, index) =>
                                      tint(index * 0.1, this.secondaryColor)
                                  )
                                  .reverse();
                });
                this.billsPerMonthChart.update();
            },
        });
    }

    getMonthPercentage(index: number) {
        if (index === 0) return 0;
        let percentage = 0;
        this.dashboardState.billsCounters$.subscribe({
            next: (billsCounters) => {
                percentage = parseFloat(
                    (
                        billsCounters[billsCounters.length - index - 1].total /
                            billsCounters[billsCounters.length - index].total -
                        1
                    ).toFixed(4)
                );
            },
        });
        return percentage;
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
}
