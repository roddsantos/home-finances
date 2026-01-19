import { CommonModule } from "@angular/common";
import {
    Component,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DateObject } from "src/app/core/types/general";
import { WEEKDAYS } from "src/utils/constants/general";
import { CustomFilterState } from "../custom-filter/custom-filter.subjects.component";
import { Router } from "@angular/router";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { BillService } from "src/app/services/bill.service";
import { DashboardState } from "src/app/core/subjects/subjects.dashboard";
import { Subscription } from "rxjs";
import { Dialog } from "@angular/cdk/dialog";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { MonthBillsType } from "src/app/core/types/data/dashboard.types";
import { MONTHBILLSTYPE_INITIALIZER } from "src/utils/constants/mocks";
import { GeneralService } from "src/app/services/general.service";

@Component({
    selector: "calendar-component",
    templateUrl: "./calendar.component.html",
    styleUrls: ["./calendar.component.css"],
    standalone: true,
    imports: [CommonModule, MatIconModule, MatTooltipModule],
})
export class CalendarComponent implements OnChanges, OnDestroy {
    public filterState = inject(CustomFilterState);
    public dashboardState = inject(DashboardState);

    private generalService = inject(GeneralService);
    public generalState = inject(GeneralState);

    public billState = inject(BillState);
    private billsService = inject(BillService);
    public dialog = inject(Dialog);

    @Input() monthBills: MonthBillsType[];

    public dates: DateObject[] = [];
    public previousDates: DateObject[] = [];
    public today = new Date().getDate();
    public month = new Date().getMonth();
    public year = new Date().getFullYear();
    public router = new Router();

    public weekdays = WEEKDAYS;

    public getBills$: Subscription;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["monthBills"]) {
            const monthBills = changes["monthBills"].currentValue;
            const dayOfWeek = new Date(this.year, this.month, 1).getDay();
            monthBills.forEach((bill: MonthBillsType) => {
                this.dates[bill.day + dayOfWeek - 1].events = bill;
            });
        }
    }

    ngOnInit() {
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
                events: { ...MONTHBILLSTYPE_INITIALIZER },
            });
        }
        this.dates = [...this.previousDates];
        for (let i = 1; i <= daysInMonth; i++) {
            this.dates.push({
                day: new Date(this.year, this.month, i).getDate(),
                weekDay: new Date(
                    this.year,
                    this.month,
                    new Date(this.year, this.month, i).getDate(),
                ).getDay(),
                thisMonth: true,
                thisYear: true,
                events: { ...MONTHBILLSTYPE_INITIALIZER },
            });
        }
    }

    onDateClick(date: DateObject) {
        if (date.events.count === 0) return;

        const refYear = date.thisYear ? this.year : this.year - 1;
        const refMonth = date.thisYear ? this.month : this.month - 1;

        this.filterState.setFilters([
            {
                id: new Date(refYear, refMonth, date.day).toISOString(),
                identifier: "date1",
                name: new Date(refYear, refMonth, date.day).toLocaleDateString(),
            },
            {
                id: new Date(refYear, refMonth, date.day + 1).toISOString(),
                identifier: "date2",
                name: new Date(refYear, refMonth, date.day + 1).toLocaleDateString(),
            },
        ]);

        this.getBills$ = this.billsService.getBills().subscribe({
            next: (bills) => {
                if (bills.count === 0) this.billState.changeStatus("empty", "no bills");
                else this.billState.setBills(bills);
                this.generalService.navigateTo("/bills");
            },
            error: () => {
                this.generalService.errorSnackbar("error fetching bills");
                this.billState.changeStatus("error", "error fetching bills");
            },
        });
    }

    ngOnDestroy() {
        if (this.getBills$) this.getBills$.unsubscribe();
    }
}
