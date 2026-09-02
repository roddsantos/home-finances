import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { CustomFilterComponent } from "src/app/components/custom-filter/custom-filter.component";
import { ModalNewBill } from "src/app/components/modal/new-bill/new-bill.modal";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { BankListTemplateMonthly } from "./templates/bank/bank.template.bills";
import { CreditCardTemplateMonthly } from "./templates/credit-card/credit-card.template.bills";
import { ServiceTemplateMonthly } from "./templates/service/service.template.bills";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { BillService } from "src/app/services/bill.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PaginationTemplate } from "./templates/pagination/pagination.template.bills";
import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";
import { CardComponent } from "../../components/card/card.component";
import { ModalEditBill } from "src/app/components/modal/edit-bill/edit-bill.modal";
import { ActionItem } from "src/app/core/types/components";
import { CustonButton } from "src/app/components/button/custom-button.component";
import { CustomTag } from "src/app/components/tag/tag.component";
import { GeneralPage } from "src/app/core/general/page.general";
import { BillDataObjectType } from "src/app/core/types/data/bills.types";
import { PinsBillsTemplate } from "./templates/pins/pins.template.bills.pages";
import { MatMenuModule } from "@angular/material/menu";

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
        CustonButton,
        CustomTag,
        PinsBillsTemplate,
        MatMenuModule,
    ],
})
export class PageBills extends GeneralPage {
    public billState = inject(BillState);
    public billService = inject(BillService);

    isLineTheme: string = "";

    options: ActionItem[] = [
        {
            name: "done",
            icon: "check_circle",
            action: (data) => this.onCheck(data),
            color: "#008f18",
            hidden: (data: BillDataObjectType) => data.settled,
        },
        {
            name: "edit",
            icon: "edit",
            action: (data: BillDataObjectType) => this.onEdit(data),
            color: "#00328f",
        },
        {
            name: "delete",
            icon: "delete",
            action: (data: BillDataObjectType) => this.onDelete(data),
            color: "#8f0000",
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
        {
            name: "pin",
            icon: "keep",
            action: (data) => this.onPinBill(data),
            color: "var(--default)",
        },
    ];

    ngOnInit() {
        this.getBills();
        this.billService.getPinnedBills().subscribe({
            next: (pinnedBills) => {
                this.billState.setPinnedBills(pinnedBills);
            },
        });
    }

    trackByFn(index: number, item: any) {
        return item.id;
    }

    openFilterContainer() {
        this.generalState.changeFilterContainer(true);
        this.localStorageService.setFilterContainer(true);
    }

    getBills() {
        this.billService.getBills().subscribe({
            next: (bills) => {
                this.billState.setBills(bills);
            },
            error: () => {
                this.generalService.errorSnackbar("error fetching bills");
                this.billState.changeStatus("error", "error fetching bills");
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

    onReload() {
        this.billState.changeStatus("loading", "loading");
        this.getBills();
    }

    openModal() {
        let options = {};
        this.dialog.open(ModalNewBill, options);
    }

    onEdit(data: BillDataObjectType) {
        this.dialog.open(ModalEditBill, {
            data,
        });
    }

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

    onPinBill(data: BillDataObjectType) {
        const pinnedBills = this.localStorageService.getPinnedBills();

        if (pinnedBills.find((id) => id === data.id)) return;

        pinnedBills.unshift(data.id);

        if (pinnedBills.length > 3) {
            pinnedBills.splice(3);
        }

        this.localStorageService.setPinnedBills(pinnedBills);
        this.billState.addPinnedBill(data);
    }

    getDateStatus(data: BillDataObjectType) {
        if (data.settled) return "closed";
        else if (new Date(data.due).getTime() - new Date().getTime() > 0)
            return "pending";
        else return "overdue";
    }

    getColorStatus(data: BillDataObjectType) {
        const status = this.getDateStatus(data);
        switch (status) {
            case "closed":
                return "var(--success)";
            case "pending":
                return "var(--warning)";
            case "overdue":
                return "var(--error)";
            default:
                return "var(--default)";
        }
    }
}
