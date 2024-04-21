import { Dialog } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { CustomFilterComponent } from "src/app/components/custom-filter/custom-filter.component";
import { ModalNewBill } from "src/app/components/modal/new-bill/new-bill.modal";
import { BillState } from "src/app/subjects/subjects.bill";
import { Bill } from "src/app/types/objects";

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
