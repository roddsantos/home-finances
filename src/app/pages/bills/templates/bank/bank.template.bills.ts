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
import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";
import { GeneralService } from "src/app/services/general.service";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
    selector: "bank-list-template",
    templateUrl: "./bank.template.bills.html",
    styleUrls: ["../../pages.bills.css", "./bank.template.bills.css"],
    standalone: true,
    imports: [CommonModule, MatExpansionModule, MatIconModule, MatTooltipModule],
})
export class BankListTemplateMonthly {
    public general = inject(GeneralState);
    @Input() data: Bill & BillData;
    isLineTheme: string = "";

    ngOnInit() {
        this.general.theme$.subscribe({
            next: (theme) => (this.isLineTheme = theme === "binary" ? "binary" : ""),
        });
    }
}
