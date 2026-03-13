import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatMenuModule } from "@angular/material/menu";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { MatIcon } from "@angular/material/icon";
import { BillDataObjectType } from "src/app/core/types/data/bills.types";
import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";
import { GeneralPage } from "src/app/core/general/page.general";
import { ModalEditBill } from "src/app/components/modal/edit-bill/edit-bill.modal";
import { CustomTag } from "src/app/components/tag/tag.component";
import { ActionItem } from "src/app/core/types/components";
import { BillService } from "src/app/services/bill.service";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
    templateUrl: "./pins.template.bills.pages.html",
    selector: "bills-pins",
    styleUrls: ["./pins.template.bills.pages.css"],
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIcon,
        CustomTag,
        MatMenuModule,
        MatTooltipModule,
    ],
})
export class PinsBillsTemplate extends GeneralPage {
    public billState = inject(BillState);
    public billService = inject(BillService);

    options: ActionItem[] = [
        {
            name: "edit",
            icon: "edit",
            action: (data: BillDataObjectType) => this.onEdit(data),
            color: "var(--info)",
        },
        {
            name: "delete",
            icon: "delete",
            action: (data: BillDataObjectType) => this.onDelete(data),
            color: "var(--error)",
            hidden: (data: BillDataObjectType) => data.settled,
        },
        {
            name: "done",
            icon: "check_circle",
            action: (data) => this.onCheck(data),
            color: "var(--success)",
            hidden: (data: BillDataObjectType) => data.settled,
        },
        {
            name: "reroll",
            icon: "rotate_left",
            action: (data) => this.onReverseCheck(data),
            color: "var(--warning)",
            hidden: (data: BillDataObjectType) =>
                !data.settled || (data.settled && data.isRecurrent),
        },
    ];

    onDelete(data: BillDataObjectType) {
        console.log("DELETE");
    }

    onCheck(data: BillDataObjectType) {
        this.billService.quickSettle(data.id).subscribe({
            next: () => {
                this.billService.getBills().subscribe({
                    next: (bills) => {
                        this.billState.setBills(bills);
                    },
                });
                this.generalService.successSnackbar("bill successfully settled");
            },
            error: () => {
                this.generalService.errorSnackbar("error settling bill");
            },
        });
    }

    onReverseCheck(data: BillDataObjectType) {
        this.billService.redoQuickSettle(data.id).subscribe({
            next: () => {
                this.billService.getBills().subscribe({
                    next: (bills) => {
                        this.billState.setBills(bills);
                    },
                });
                this.generalService.successSnackbar("bill successfully reverse settled");
            },
            error: () => {
                this.generalService.errorSnackbar("error reversing settle bill");
            },
        });
    }

    openDetails(bill: BillDataObjectType, e: any) {
        const className = e.target.className;
        if (className !== "mat-mdc-button-touch-target") {
            const option = {
                data: bill,
            };
            this.dialog.open(ModalViewItem, option);
        }
    }

    onEdit(data: BillDataObjectType) {
        this.dialog.open(ModalEditBill, {
            data,
        });
    }

    onUnpin(data: BillDataObjectType) {
        console.log(data);
        this.billState.removePinnedBill(data);
        this.localStorageService.removePinnedBill(data.id);
    }
}
