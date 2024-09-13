import { Dialog } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { ActionsComponent } from "src/app/components/actions/actions.component";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { ModalEditBill } from "src/app/components/modal/edit-bill/edit-bill.modal";
import { ServiceBill } from "src/app/services/bill.service";
import { BillState } from "src/app/subjects/subjects.bill";
import { ActionItem } from "src/app/types/components";
import { Bill, BillData } from "src/app/types/objects";

@Component({
    selector: "credit-card-list-template",
    templateUrl: "./credit-card.template.monthly.html",
    styleUrls: ["../../pages.monthly.css"],
    standalone: true,
    imports: [CommonModule, MatExpansionModule, ActionsComponent],
})
export class CreditCardTemplateMonthly {
    public dialog = inject(Dialog);
    public billService = inject(ServiceBill);
    public billState = inject(BillState);
    public snack = inject(CustomSnackbarComponent);
    @Input() data: Bill & BillData;
    color: string = "transparent";

    actions: ActionItem[] = [
        {
            name: "",
            icon: "edit",
            action: () => this.onEdit(),
            color: "#00328f",
        },
    ];

    ngOnInit() {
        if (this.data.settled) this.color = "#008f18";
        else if (new Date(this.data.due).getTime() - new Date().getTime() > 0)
            this.color = "#a86d00";
        else this.color = "#8f0000";

        if (!this.data.settled)
            this.actions = [
                ...this.actions,
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
        this.billService
            .updateBillCreditCard({
                id: this.data.id,
                name: this.data.name,
                description: this.data.description,
                total: this.data.total,
                settled: true,
                type: this.data.type,
                categoryId: this.data.categoryId,
                due: new Date(this.data.due),
                paid: new Date(),
                creditCardId: this.data.creditCardId,
                companyId: this.data.companyId,
                parcels: this.data.parcels,
                taxes: this.data.taxes,
                delta: this.data.delta,
                isRefund: this.data.isRefund,
                totalParcel: this.data.totalParcel,
                parcel: this.data.parcel,
                groupId: this.data.groupId,
            })
            .subscribe({
                next: () => {
                    this.billService.getBills().subscribe({
                        next: (bills) => this.billState.setBills(bills),
                    });
                    this.snack.openSnackBar("bill successfully updated", "success");
                },
                error: () => {
                    this.snack.openSnackBar("error updating bill", "error");
                },
            });
    }
}
