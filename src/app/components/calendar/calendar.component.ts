import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnChanges, SimpleChanges } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DateObject } from "src/app/core/types/general";
import { WEEKDAYS } from "src/utils/constants/general";
import { CustomFilterState } from "../custom-filter/custom-filter.subjects.component";
import { Router } from "@angular/router";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { ServiceBill } from "src/app/services/bill.service";
import { CustomSnackbarComponent } from "../custom-snackbar/custom-snackbar.component";
import { DashboardState } from "src/app/core/subjects/subjects.dashboard";
import { Subscription } from "rxjs";
import { Bill, BillData, CreditCard } from "src/app/core/types/objects";
import { ModalEventsList } from "../modal/events-list/events-list.modal";
import { Dialog } from "@angular/cdk/dialog";
import { GeneralState } from "src/app/core/subjects/subjects.general";

@Component({
    selector: "calendar-component",
    templateUrl: "./calendar.component.html",
    styleUrls: ["./calendar.component.css"],
    standalone: true,
    imports: [CommonModule, MatIconModule, MatTooltipModule],
})
export class CalendarComponent implements OnChanges {
    public filterState = inject(CustomFilterState);
    public dashboardState = inject(DashboardState);
    public generalState = inject(GeneralState);
    public billApi = inject(ServiceBill);
    public billState = inject(BillState);
    private snack = inject(CustomSnackbarComponent);
    public router = new Router();
    public dialog = inject(Dialog);

    @Input() monthBills: (Bill & BillData)[];
    @Input() creditCards: CreditCard[];

    public dates: DateObject[] = [];
    public previousDates: DateObject[] = [];
    public today = new Date().getDate();
    public month = new Date().getMonth();
    public year = new Date().getFullYear();
    public allEvents: any[] = [];
    public theme: string;

    public weekdays = WEEKDAYS;

    public monthBillsSubscriber: Subscription;
    public creditCardSubscriber: Subscription;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["creditCards"]) {
            const creditCards = changes["creditCards"].currentValue;
            creditCards.forEach((creditCard: CreditCard) => {
                const eventDate = creditCard["due"];
                if (!isNaN(eventDate)) this.dates[eventDate - 1].events.push(creditCard);
            });
        }
        if (changes["monthBills"]) {
            const monthBills = changes["monthBills"].currentValue;
            const dayOfWeek = new Date(this.year, this.month, 1).getDay();
            monthBills.forEach((bill: Bill & BillData) => {
                const eventDate = new Date(bill["due"]).getDate();
                if (!isNaN(eventDate))
                    this.dates[eventDate + dayOfWeek - 1].events.push(bill);
            });
        }
    }

    ngOnInit() {
        this.generalState.theme$.subscribe({
            next: (theme) => (this.theme = theme),
        });
        const dayOfWeek = new Date(this.year, this.month, 1).getDay();
        const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

        for (let i = dayOfWeek; i > 0; i--) {
            this.previousDates.push({
                day: new Date(this.year, this.month, 1 - i).getDate(),
                weekDay: dayOfWeek - i,
                thisMonth: false,
                thisYear:
                    new Date(this.year, this.month - 1, 1).getFullYear() ===
                    new Date(this.year, this.month, 1).getFullYear(),
                events: [],
            });
        }
        this.dates = [...this.previousDates];
        for (let i = 1; i <= daysInMonth; i++) {
            this.dates.push({
                day: new Date(this.year, this.month, i).getDate(),
                weekDay: new Date(
                    this.year,
                    this.month,
                    new Date(this.year, this.month, i).getDate()
                ).getDay(),
                thisMonth: true,
                thisYear: true,
                events: [],
            });
        }
    }

    isBill(event: (Bill & BillData) | CreditCard): event is Bill & BillData {
        return (event as Bill & BillData).type !== undefined;
    }

    onDateClick(date: DateObject) {
        const option = {
            data: {
                events: [
                    ...date.events.map((event) => ({
                        ...event,
                        sector: this.isBill(event) ? "bill" : "credit-card",
                    })),
                ],
            },
        };
        this.dialog.open(ModalEventsList, option);
    }
}
