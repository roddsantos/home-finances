import { Dialog } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { ActionsComponent } from "src/app/components/actions/actions.component";
import { ModalEditBill } from "src/app/components/modal/edit-bill/edit-bill.modal";
import { ActionItem } from "src/app/core/types/components";
import { Bill, BillData } from "src/app/core/types/objects";

@Component({
    selector: "service-list-template",
    templateUrl: "./service.template.bills.html",
    styleUrls: ["../../pages.bills.css"],
    standalone: true,
    imports: [CommonModule, MatExpansionModule, ActionsComponent],
})
export class ServiceTemplateMonthly {
    public dialog = inject(Dialog);
    @Input() data: Bill & BillData;
    color: string = "transparent";

    actions: ActionItem[] = [
        {
            name: "",
            icon: "edit",
            action: () => this.onEdit(),
            color: "#00328f",
        },
        {
            name: "",
            icon: "delete",
            action: () => this.onDelete(),
            color: "#8f0000",
        },
    ];

    ngOnInit() {
        if (this.data.settled) this.color = "#008f18";
        else if (new Date(this.data.due).getTime() - new Date().getTime() > 0)
            this.color = "#a86d00";
        else this.color = "#8f0000";
        if (!this.data.settled)
            this.actions.push({
                name: "",
                icon: "check_circle",
                action: () => this.onCheck(),
                color: "#008f18",
            });
    }

    onEdit() {
        this.dialog.open(ModalEditBill, {
            data: {
                bill: this.data,
                size: "md",
            },
            hasBackdrop: true,
            backdropClass: "modal-backdrop",
        });
    }

    onDelete() {
        console.log("DELETE");
    }

    onCheck() {
        console.log("DELETE");
    }
}