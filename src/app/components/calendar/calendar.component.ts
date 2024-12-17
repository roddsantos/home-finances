import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { DateObject } from "src/app/core/types/general";
import { WEEKDAYS } from "src/utils/constants/general";

@Component({
    selector: "calendar-component",
    templateUrl: "./calendar.component.html",
    styleUrls: ["./calendar.component.css"],
    standalone: true,
    imports: [CommonModule],
})
export class CalendarComponent {
    @Input() key: string;
    public dates: DateObject[] = [];
    public month = new Date().getMonth();
    public year = new Date().getFullYear();

    public weekdays = WEEKDAYS;

    public style = getComputedStyle(document.body);
    public secondaryColor = this.style.getPropertyValue("--secondary");
    public thirdColor = this.style.getPropertyValue("--third");

    ngOnInit() {
        const firstDay = new Date(this.year, this.month, 1).getDay();
        const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

        for (let i = firstDay; i > 0; i--) {
            this.dates.push({
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
}
