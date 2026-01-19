import { CommonModule } from "@angular/common";
import { Component, inject, Inject } from "@angular/core";
import { ModalComponent } from "../modal.component";
import { MatIconModule } from "@angular/material/icon";
import { DIALOG_DATA } from "@angular/cdk/dialog";
import { EventsListModalType } from "src/app/core/types/modal";
import { Bill, BillData, CreditCard } from "src/app/core/types/objects";
import { SectorPipe } from "src/utils/pipes/sector";
import { CustomFilterState } from "../../custom-filter/custom-filter.subjects.component";
import { BillService } from "src/app/services/bill.service";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { CustomSnackbarComponent } from "../../custom-snackbar/custom-snackbar.component";
import { Router } from "@angular/router";

@Component({
    selector: "modal-events-list",
    templateUrl: "./events-list.modal.html",
    styleUrls: ["./events-list.modal.css"],
    standalone: true,
    imports: [CommonModule, ModalComponent, MatIconModule, SectorPipe],
})
export class ModalEventsList extends ModalComponent {
    public filterState = inject(CustomFilterState);
    public billService = inject(BillService);
    public billState = inject(BillState);
    private snack = inject(CustomSnackbarComponent);

    public router = new Router();
    public month = new Date().getMonth();
    public year = new Date().getFullYear();

    constructor(@Inject(DIALOG_DATA) public data: EventsListModalType) {
        super();
    }

    isBill(event: BillDataObjectType | CreditCard): event is BillDataObjectType {
        return (event as BillDataObjectType).type !== undefined;
    }

    onClickEvent(event: BillDataObjectType | CreditCard) {
        if (!this.isBill(event)) {
            this.generalService.navigateTo("/credit-cards");
            this.onClose();
            return;
        }
        this.filterState.setFilters([
            {
                id: new Date(
                    this.year,
                    this.month,
                    new Date(event.due).getDate()
                ).toISOString(),
                identifier: "date1",
                name: new Date(
                    this.year,
                    this.month,
                    new Date(event.due).getDate()
                ).toLocaleDateString(),
            },
            {
                id: new Date(
                    this.year,
                    this.month,
                    new Date(event.due).getDate() + 1
                ).toISOString(),
                identifier: "date2",
                name: new Date(
                    this.year,
                    this.month,
                    new Date(event.due).getDate() + 1
                ).toLocaleDateString(),
            },
        ]);
        this.billService.getBills().subscribe({
            next: (bills) => {
                if (bills.count === 0) this.billState.changeStatus("empty", "no bills");
                else this.billState.setBills(bills);
                this.generalService.navigateTo("/bills");
                this.onClose();
            },
            error: () => {
                this.snack.openSnackBar("error fetching bills", "error");
                this.billState.changeStatus("error", "error fetching bills");
            },
        });
    }
}
