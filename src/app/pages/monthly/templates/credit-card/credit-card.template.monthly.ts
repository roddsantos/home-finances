import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { ActionsComponent } from "src/app/components/actions/actions.component";
import { Bill, BillData } from "src/app/types/objects";

@Component({
    selector: "credit-card-list-template",
    templateUrl: "./credit-card.template.monthly.html",
    styleUrls: ["../../pages.monthly.css"],
    standalone: true,
    imports: [CommonModule, MatExpansionModule, ActionsComponent],
})
export class CreditCardTemplateMonthly {
    @Input() data: Bill & BillData;
    color: string = "transparent";

    ngOnInit() {
        if (this.data.settled) this.color = "#008f18";
        else if (new Date(this.data.due).getTime() - new Date().getTime() > 0)
            this.color = "#a86d00";
        else this.color = "#8f0000";
    }

    onEdit() {
        console.log("EDIT");
    }

    onDelete() {
        console.log("DELETE");
    }
}
