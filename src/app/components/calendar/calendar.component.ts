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

@Component({
    selector: "calendar-component",
    templateUrl: "./calendar.component.html",
    styleUrls: ["./calendar.component.css"],
    standalone: true,
    imports: [CommonModule, MatIconModule, MatTooltipModule],
})
export class CalendarComponent implements OnChanges {
    public filterState = inject(CustomFilterState);
    public billApi = inject(ServiceBill);
    public billState = inject(BillState);
    private snack = inject(CustomSnackbarComponent);
    public router = new Router();

    @Input() key: string;
    @Input() events: any[];
    public dates: DateObject[] = [];
    public previousDates: DateObject[] = [];
    public today = new Date().getDate();
    public month = new Date().getMonth();
    public year = new Date().getFullYear();
    public allEvents: any[] = [];

    public weekdays = WEEKDAYS;

    public style = getComputedStyle(document.body);
    public primaryColor = this.style.getPropertyValue("--primary");
    public secondaryColor = this.style.getPropertyValue("--secondary");
    public thirdColor = this.style.getPropertyValue("--third");
    public errorColor = this.style.getPropertyValue("--error");

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["events"]) {
            this.allEvents = changes["events"].currentValue;
            this.allEvents.forEach((event) => {
                const eventDate = new Date(event[this.key]);
                if (!isNaN(eventDate.valueOf()))
                    this.dates[eventDate.getDate() - 1].events.push(event);
            });
        }
    }

    ngOnInit() {
        const firstDay = new Date(this.year, this.month, 1).getDay();
        const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

        for (let i = firstDay; i > 0; i--) {
            this.previousDates.push({
                day: new Date(this.year, this.month, 1 - i).getDate(),
                weekDay: firstDay - i,
                thisMonth: false,
                thisYear:
                    new Date(this.year, this.month - 1, 1).getFullYear() ===
                    new Date(this.year, this.month, 1).getFullYear(),
                events: [],
            });
        }
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

    onDateClick(date: DateObject) {
        this.filterState.setFilters([
            {
                id: new Date(this.year, this.month, date.day).toISOString(),
                identifier: "date1",
                name: new Date(this.year, this.month, date.day).toLocaleDateString(),
            },
            {
                id: new Date(this.year, this.month, date.day + 1).toISOString(),
                identifier: "date2",
                name: new Date(this.year, this.month, date.day + 1).toLocaleDateString(),
            },
        ]);
        this.billApi.getBills().subscribe({
            next: (bills) => {
                if (bills.count === 0) this.billState.changeStatus("empty", "no bills");
                else this.billState.setBills(bills);
                this.router.navigate(["/bills"]);
            },
            error: () => {
                this.snack.openSnackBar("error fetching bills", "error");
                this.billState.changeStatus("error", "error fetching bills");
            },
        });
    }
}
