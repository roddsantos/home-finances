import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { Bill, BillData } from "src/app/types/objects";
import { getMonthAndYear } from "src/utils/date";

@Component({
    selector: "service-list-template",
    templateUrl: "./service.template.monthly.html",
    styleUrls: ["../../pages.monthly.css"],
    standalone: true,
    imports: [CommonModule, MatExpansionModule],
})
export class ServiceTemplateMonthly {
    @Input() data: Bill & BillData;

    getDate(toUse: "updatedAt" | "separated") {
        let obj =
            toUse === "updatedAt"
                ? { date: new Date(this.data.updatedAt) }
                : { month: this.data.month, year: this.data.year };
        return getMonthAndYear(obj, "ddMMyyyy");
    }
}
