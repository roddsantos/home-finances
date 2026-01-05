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
import { BankListTemplateMonthly } from "./templates/bank/bank.template.bills";
import { CreditCardTemplateMonthly } from "./templates/credit-card/credit-card.template.bills";
import { ServiceTemplateMonthly } from "./templates/service/service.template.bills";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { ServiceBill } from "src/app/services/bill.service";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PaginationTemplate } from "./templates/pagination/pagination.template.bills";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";
import { GeneralService } from "src/app/services/general.service";
import { CardComponent } from "../../components/card/card.component";
import { ModalEditBill } from "src/app/components/modal/edit-bill/edit-bill.modal";
import { ActionItem } from "src/app/core/types/components";
import { ActionsComponent } from "src/app/components/actions/actions.component";
import { CustonButton } from "src/app/components/button/custom-button.component";
import { CustomTag } from "src/app/components/tag/tag.component";

@Component({
    selector: "page-bills",
    templateUrl: "./pages.bills.html",
    styleUrls: ["./pages.bills.css"],
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
        CardComponent,
        ActionsComponent,
        CustonButton,
        CustomTag,
    ],
})
export class PageBills {
    public billState = inject(BillState);
    public dialog = inject(Dialog);
    public billService = inject(ServiceBill);
    public snack = inject(CustomSnackbarComponent);
    public generalState = inject(GeneralState);
    public generalService = inject(GeneralService);
    public storage = inject(LocalStorageService);

    titleItems: Partial<keyof Bill>[] = ["name", "updatedAt"];
    detailsItems: Partial<keyof Bill>[] = ["description", "total"];
    isLineTheme: string = "";
    dateLeft: string = "settled";

    actions: ActionItem[] = [
        {
            name: "",
            icon: "edit",
            action: (data: Bill) => this.onEdit(data),
            color: "#00328f",
        },
        {
            name: "",
            icon: "delete",
            action: (data: Bill) => this.onDelete(data),
            color: "#8f0000",
        },
        {
            name: "",
            icon: "check_circle",
            action: (data) => this.onCheck(data),
            color: "#008f18",
        },
    ];

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

    getBills() {
        this.billService.getBills().subscribe({
            next: (bills) => {
                this.billState.setBills(bills);
            },
            error: () => {
                this.snack.openSnackBar("error fetching bills", "error");
                this.billState.changeStatus("error", "error fetching bills");
            },
        });
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

    onReload() {
        this.billState.changeStatus("loading", "loading");
        this.getBills();
    }

    openModal() {
        let options = {};
        this.dialog.open(ModalNewBill, options);
    }

    onEdit(data: Bill) {
        this.dialog.open(ModalEditBill, {
            data,
        });
    }

    onDelete(data: Bill) {
        console.log("DELETE");
    }

    onCheck(data: Bill) {
        this.billService
            .updateBill(
                {
                    ...data,
                    due: new Date(data.due),
                    paid: new Date(),
                    settled: true,
                },
                data.type
            )
            .subscribe({
                next: () => {
                    this.billService.getBills().subscribe({
                        next: (bills) => {
                            this.billState.setBills(bills);
                        },
                    });
                    this.snack.openSnackBar("bill successfully updated", "success");
                },
                error: () => {
                    this.snack.openSnackBar("error updating bill", "error");
                },
            });
    }

    getDateStatus(data: Bill) {
        if (data.settled) return "var(--success)";
        else if (new Date(data.due).getTime() - new Date().getTime() > 0)
            return "var(--warning)";
        else return "var(--error)";
    }
}
