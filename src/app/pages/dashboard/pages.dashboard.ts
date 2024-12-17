import { Dialog } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";
import { Chart } from "chart.js/auto";
import { CalendarComponent } from "src/app/components/calendar/calendar.component";
import { CardComponent } from "src/app/components/card/card.component";
import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";
import { DashboardState } from "src/app/core/subjects/subjects.dashboard";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { UserState } from "src/app/core/subjects/subjects.user";
import { CardActionType } from "src/app/core/types/components";
import { Bill, BillData } from "src/app/core/types/objects";
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
    public userState = inject(UserState);
    public dashboardState = inject(DashboardState);
    public generalState = inject(GeneralState);

    public billService = inject(ServiceBill);
    public bankService = inject(ServiceBank);
    public dashboardService = inject(DashboardService);
    public creditCardService = inject(ServiceCreditCard);
    public dialog = inject(Dialog);

    public date = new Date();
    public router = new Router();
    public billsPerMonthChart: Chart;
    public bills: Array<Bill & BillData> = [];

    public style = getComputedStyle(document.body);
    public secondaryColor = this.style.getPropertyValue("--secondary");
    public thirdColor = this.style.getPropertyValue("--third");

    public theme = "default";
    public months = MONTHS;
    public monthSpan = 1;
    public month = MONTHS[new Date().getMonth()];

    ngOnInit() {
        this.billService
            .getBills(1, 0, [
                {
                    id: new Date().getMonth(),
                    identifier: "month",
                    name: MONTHS[new Date().getMonth()].name,
                },
                {
                    id: new Date().getFullYear(),
                    identifier: "year",
                    name: new Date().getFullYear(),
                },
            ])
            .subscribe({
                next: (bills) => (this.bills = bills.data),
            });
        this.dashboardState.monthSpan$.subscribe({
            next: (monthSpan) => {
                this.monthSpan = monthSpan;
                this.dashboardService.getBillsPerMonth(monthSpan).subscribe({
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
                this.billsPerMonthChart = new Chart("billsPerMonth", {
                    type: "bar",
                    data: {
                        labels: billsCounters
                            .map((bc) => MONTHS[bc.month].short)
                            .reverse(),
                        datasets: [
                            {
                                label: "total bill value (R$)",
                                data: billsCounters.map((bc) => bc.total).reverse(),
                                borderWidth: 2,
                                borderRadius: 10,
                                backgroundColor:
                                    this.theme === "binary"
                                        ? "transparent"
                                        : billsCounters
                                              .map((_, index) =>
                                                  tint(index * 0.1, this.secondaryColor)
                                              )
                                              .reverse(),
                                borderColor: this.secondaryColor,
                                categoryPercentage: 0.8,
                                barPercentage: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                ticks: {
                                    stepSize: 30,
                                },
                            },
                        },
                    },
                });
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
                console.log(billsCounters, index);
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

    // public monthSpanActions: CardActionType[] = [
    //     {
    //         icon: ["date_range", "counter_" + this.monthSpan],
    //         tooltip: this.monthSpan + " month span",
    //         action: () =>
    //             this.dashboardState.updateMonthSpan(
    //                 this.monthSpan === 5 ? 1 : this.monthSpan + 1
    //             ),
    //     },
    // ];

    public bankActions: CardActionType[] = [
        {
            icon: "north_east",
            tooltip: "go to banks",
            action: () => this.router.navigate(["/banks"]),
        },
    ];

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
