import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { ActionsComponent } from "src/app/components/actions/actions.component";
import { ActionItem } from "src/app/types/components";
import { Bill, BillData } from "src/app/types/objects";

@Component({
    selector: "service-list-template",
    templateUrl: "./service.template.monthly.html",
    styleUrls: ["../../pages.monthly.css"],
    standalone: true,
    imports: [CommonModule, MatExpansionModule, ActionsComponent],
})
export class ServiceTemplateMonthly {
    @Input() data: Bill & BillData;
    color: string = "transparent";

    actions: ActionItem[] = [
        { name: "", icon: "edit", action: () => this.onEdit(), color: "#00328f" },
        {
            name: "",
            icon: "delete",
            action: () => this.onDelete(),
            color: "#8f0000",
        },
        {
            name: "",
            icon: "check_circle",
            action: () => this.onCheck(),
            color: "#008f18",
        },
    ];

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

    onCheck() {
        console.log("DELETE");
    }
}
