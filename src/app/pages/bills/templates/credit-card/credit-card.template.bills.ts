import { Dialog } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { ActionsComponent } from "src/app/components/actions/actions.component";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { ModalEditBill } from "src/app/components/modal/edit-bill/edit-bill.modal";
import { ServiceBill } from "src/app/services/bill.service";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { ActionItem } from "src/app/core/types/components";
import { Bill, BillData } from "src/app/core/types/objects";
import { MatIconModule } from "@angular/material/icon";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
    selector: "credit-card-list-template",
    templateUrl: "./credit-card.template.bills.html",
    styleUrls: ["../../pages.bills.css", "./credit-card.template.bills.css"],
    standalone: true,
    imports: [
        CommonModule,
        MatExpansionModule,
        ActionsComponent,
        MatIconModule,
        MatTooltipModule,
    ],
})
export class CreditCardTemplateMonthly {
    public dialog = inject(Dialog);
    public general = inject(GeneralState);
    public billService = inject(ServiceBill);
    public billState = inject(BillState);
    public snack = inject(CustomSnackbarComponent);
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
            data: this.data,
        });
    }

    onDelete() {
        console.log("DELETE");
    }

    openDetails(bill: Bill, e: any) {
        const className = e.target.className;
        if (className !== "mat-mdc-button-touch-target") {
            const option = {
                data: bill,
            };
            this.dialog.open(ModalViewItem, option);
        }
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
                isRecurrent: this.data.isRecurrent,
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
