import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { Bill } from "src/app/core/types/objects";
import { MONTHS } from "src/utils/constants/general";

@Component({
    selector: "template-view-bill",
    templateUrl: "./bill.template.html",
    styleUrls: ["./bill.template.css"],
    standalone: true,
    imports: [CommonModule, MatIconModule],
})
export class TemplateBill {
    @Input() bill: Bill;
    public months = MONTHS;
    public style = getComputedStyle(document.body);
    public errorColor = this.style.getPropertyValue("--error");
    public successColor = this.style.getPropertyValue("--success");
    public warningColor = this.style.getPropertyValue("--warning");
    public dateLeft: string = "settled";

    ngOnInit() {
        if (this.bill.settled) this.dateLeft = "settled";
        else if (new Date(this.bill.due).getTime() - new Date().getTime() > 0)
            this.dateLeft = "close";
        else this.dateLeft = "late";
    }
}
