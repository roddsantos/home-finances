import { Dialog } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { CustomFilterComponent } from "src/app/components/custom-filter/custom-filter.component";
import { ModalNewBill } from "src/app/components/modal/new-bill/new-bill.modal";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { Bill } from "src/app/core/types/objects";
import { BankListTemplateMonthly } from "./templates/bank/bank.template.monthly";
import { CreditCardTemplateMonthly } from "./templates/credit-card/credit-card.template.monthly";
import { ServiceTemplateMonthly } from "./templates/service/service.template.monthly";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { ServiceBill } from "src/app/services/bill.service";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PaginationTemplate } from "./templates/pagination/pagination.template.monthly";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { GeneralState } from "src/app/core/subjects/subjects.general";

@Component({
    selector: "page-monthly",
    templateUrl: "./pages.monthly.html",
    styleUrls: ["./pages.monthly.css"],
    standalone: true,
    imports: [
        CustomFilterComponent,
        MatExpansionModule,
        CommonModule,
        MatIconModule,
        MatButtonModule,
        BankListTemplateMonthly,
        CreditCardTemplateMonthly,
        ServiceTemplateMonthly,
        FeedbackContainerComponent,
        PaginationTemplate,
        MatTooltipModule,
    ],
})
export class PageMonthly {
    public billState = inject(BillState);
    public dialog = inject(Dialog);
    public billService = inject(ServiceBill);
    public snack = inject(CustomSnackbarComponent);
    public generalState = inject(GeneralState);
    public storage = inject(LocalStorageService);

    titleItems: Partial<keyof Bill>[] = ["name", "updatedAt"];
    detailsItems: Partial<keyof Bill>[] = ["description", "total"];

    ngOnInit() {
        this.billState.setAction(() => this.onReload());
    }

    trackByFn(index: number, item: any) {
        return item.id;
    }

    openFilterContainer() {
        this.generalState.changeFilterContainer(true);
        this.storage.setFilterContainer(true);
    }

    openDialog(): void {
        this.dialog.open<string>(ModalNewBill, {
            data: {
                header: "new bill",
                size: "md",
            },
            hasBackdrop: true,
            backdropClass: "modal-backdrop",
        });
    }

    getBills() {
        this.billService.getBills().subscribe({
            next: (bills) => {
                if (bills.data.length === 0)
                    this.billState.changeStatus("empty", "no bills");
                else this.billState.setBills(bills);
            },
            error: () => {
                this.snack.openSnackBar("error fetching bills", "error");
                this.billState.changeStatus("error", "error fetching bills");
            },
        });
    }

    onReload() {
        this.billState.changeStatus("loading", "loading");
        this.getBills();
    }
}
