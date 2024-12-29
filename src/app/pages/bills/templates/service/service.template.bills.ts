import { Dialog } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { ActionsComponent } from "src/app/components/actions/actions.component";
import { ModalEditBill } from "src/app/components/modal/edit-bill/edit-bill.modal";
import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { ActionItem } from "src/app/core/types/components";
import { Bill, BillData } from "src/app/core/types/objects";

@Component({
    selector: "service-list-template",
    templateUrl: "./service.template.bills.html",
    styleUrls: ["../../pages.bills.css", "./service.template.bills.css"],
    standalone: true,
    imports: [CommonModule, MatExpansionModule, ActionsComponent, MatIconModule],
})
export class ServiceTemplateMonthly {
    public billsState = inject(BillState);
    public dialog = inject(Dialog);
    public general = inject(GeneralState);
    @Input() data: Bill & BillData;
    dateLeft: string = "settled";
    isLineTheme: string = "";
    private style = getComputedStyle(document.body);
    public error = this.style.getPropertyValue("--error");

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
        if (this.data.settled) this.dateLeft = "settled";
        else if (new Date(this.data.due).getTime() - new Date().getTime() > 0)
            this.dateLeft = "close";
        else this.dateLeft = "late";

        this.general.theme$.subscribe({
            next: (theme) => (this.isLineTheme = theme === "binary" ? "binary" : ""),
        });

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

    openDetails(bill: Bill, e: any) {
        const className = e.target.className;
        if (className !== "mat-mdc-button-touch-target") {
            const option = {
                data: {
                    item: { ...bill, sector: "bill" },
                    header: "view item: " + bill.name,
                    size: "md",
                },
            };
            this.dialog.open(ModalViewItem, option);
        }
    }

    onCheck() {
        console.log("DELETE");
    }
}
