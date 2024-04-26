import { Dialog } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { CustomFilterComponent } from "src/app/components/custom-filter/custom-filter.component";
import { ModalNewBill } from "src/app/components/modal/new-bill/new-bill.modal";
import { BillState } from "src/app/subjects/subjects.bill";
import { Bill, BillData } from "src/app/types/objects";
import { getMonthAndYear } from "src/utils/date";
import { BankListTemplateMonthly } from "./templates/bank/bank.template.monthly";
import { CreditCardTemplateMonthly } from "./templates/credit-card/credit-card.template.monthly";
import { ServiceTemplateMonthly } from "./templates/service/service.template.monthly";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { ServiceBill } from "src/app/services/bill.service";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { FetchPaginatedData } from "src/app/types/services";
import { PaginationTemplate } from "./templates/pagination/pagination.template.monthly";

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
    ],
})
export class PageMonthly {
    public billState = inject(BillState);
    public dialog = inject(Dialog);
    public billService = inject(ServiceBill);
    public snack = inject(CustomSnackbarComponent);

    titleItems: Partial<keyof Bill>[] = ["name", "updatedAt"];
    detailsItems: Partial<keyof Bill>[] = ["description", "total"];

    ngOnInit() {
        this.billState.setAction(() => this.onReload());
    }

    trackByFn(index: number, item: any) {
        return item.id;
    }

    getSpecialLabel(item: Bill & Partial<BillData>) {
        switch (item.typeBill?.referTo) {
            case "creditCard":
                return item.creditCard?.name;
            case "banks":
                return item.bank1?.name;
            case "company":
                return item.company?.name;
            case "service":
                return item.company?.name;
            default:
                return;
        }
    }

    getTypeTranslation(item: Bill & Partial<BillData>) {
        switch (item.typeBill?.referTo) {
            case "creditCard":
                return "credit card";
            case "banks":
                return "bank";
            case "service":
                return "service";
            case "company":
                return "company";
            default:
                return;
        }
    }

    getDate(item: Bill, toUse: "updatedAt" | "separated") {
        let obj =
            toUse === "updatedAt"
                ? { date: new Date(item.updatedAt) }
                : { month: item.month, year: item.year };
        return getMonthAndYear(obj, "ddMMyyyy");
    }

    openDialog(): void {
        this.dialog.open<string>(ModalNewBill, {
            data: {
                header: "new bill",
                size: "lg",
            },
            hasBackdrop: true,
            backdropClass: "modal-backdrop",
        });
    }

    getBills() {
        this.billService.getBills().subscribe({
            next: (data) => {
                const result = data as FetchPaginatedData<Bill & BillData>;
                if (result.count === 0) this.billState.changeStatus("empty", "no bills");
                else this.billState.setBills(result.data);
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
