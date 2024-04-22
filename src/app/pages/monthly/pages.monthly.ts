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
    ],
})
export class PageMonthly {
    public bills = inject(BillState);
    public dialog = inject(Dialog);

    titleItems: Partial<keyof Bill>[] = ["name", "updatedAt"];
    detailsItems: Partial<keyof Bill>[] = ["description", "total"];

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

    getDate(item: Bill) {
        return getMonthAndYear(item.month, item.year, "mmmmYYYY");
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
}
