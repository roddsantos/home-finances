import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { Bill, BillData } from "src/app/types/objects";
import { getMonthAndYear } from "src/utils/date";
import { currencyDisplay } from "src/utils/parser";

@Component({
    selector: "bank-list-template",
    templateUrl: "./bank.template.monthly.html",
    styleUrls: ["../../pages.monthly.css"],
    standalone: true,
    imports: [CommonModule, MatExpansionModule],
})
export class BankListTemplateMonthly {
    @Input() data: Bill & BillData;
    color: string = "transparent";

    ngOnInit() {
        if (this.data.settled) this.color = "#008f18";
        else if (new Date(this.data.due).getTime() - new Date().getTime() > 0)
            this.color = "#a86d00";
        else this.color = "#8f0000";
    }

    getDate(toUse: "updatedAt" | "separated" | "due") {
        let obj =
            toUse === "updatedAt"
                ? { date: new Date(this.data.updatedAt) }
                : toUse === "due"
                ? { date: new Date(this.data.due) }
                : { month: this.data.month, year: this.data.year };
        return getMonthAndYear(obj, "ddMMyyyy");
    }

    currency(isTotal?: boolean) {
        if (this.data.parcels > 1 && !isTotal)
            return currencyDisplay(this.data.totalParcel || 0);
        else return currencyDisplay(this.data.total);
    }
}
