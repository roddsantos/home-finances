import { Dialog } from "@angular/cdk/dialog";
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { ActionsComponent } from "src/app/components/actions/actions.component";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { ModalEditBill } from "src/app/components/modal/edit-bill/edit-bill.modal";
import { ServiceBill } from "src/app/services/bill.service";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { ActionItem } from "src/app/core/types/components";
import { Bill, BillData } from "src/app/core/types/objects";
import { GeneralState } from "src/app/core/subjects/subjects.general";

@Component({
    selector: "bank-list-template",
    templateUrl: "./bank.template.bills.html",
    styleUrls: ["../../pages.bills.css", "./bank.template.bills.css"],
    standalone: true,
    imports: [
        CommonModule,
        MatExpansionModule,
        DatePipe,
        CurrencyPipe,
        ActionsComponent,
        MatIconModule,
    ],
})
export class BankListTemplateMonthly {
    public dialog = inject(Dialog);
    public general = inject(GeneralState);
    public billService = inject(ServiceBill);
    public billState = inject(BillState);
    public snack = inject(CustomSnackbarComponent);
    @Input() data: Bill & BillData;
    dateLeft: string = "settled";
    isLineTheme: string = "";

    deleteAction = {
        name: "",
        icon: "delete",
        action: () => this.onDelete(),
        color: "#8f0000",
    };

    editAction = {
        name: "",
        icon: "edit",
        action: () => this.onEdit(),
        color: "#00328f",
    };

    checkAction = {
        name: "",
        icon: "check_circle",
        action: () => this.onCheck(),
        color: "#008f18",
    };

    actions: ActionItem[] = [];

    setActions(settled: boolean, due: string) {
        if (this.data.settled) this.dateLeft = "settled";
        else if (new Date(this.data.due).getTime() - new Date().getTime() > 0)
            this.dateLeft = "close";
        else this.dateLeft = "late";

        if (!settled)
            this.actions = [this.editAction, this.deleteAction, this.checkAction];
        else this.actions = [this.editAction];
    }

    ngOnInit() {
        this.setActions(this.data.settled, this.data.due);
        this.general.theme$.subscribe({
            next: (theme) => (this.isLineTheme = theme === "binary" ? "binary" : ""),
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
        this.billService
            .updateBillBank({
                ...this.data,
                due: new Date(this.data.due),
                paid: new Date(),
                settled: true,
            })
            .subscribe({
                next: () => {
                    this.billService.getBills().subscribe({
                        next: (bills) => {
                            this.billState.setBills(bills);
                            this.setActions(true, this.data.due);
                        },
                    });
                    this.snack.openSnackBar("bill successfully updated", "success");
                },
                error: () => {
                    this.setActions(false, this.data.due);
                    this.snack.openSnackBar("error updating bill", "error");
                },
            });
    }
}
