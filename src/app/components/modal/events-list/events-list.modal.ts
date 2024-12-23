import { CommonModule } from "@angular/common";
import { Component, inject, Inject, ViewChild } from "@angular/core";
import { ModalComponent } from "../modal.component";
import { MatIconModule } from "@angular/material/icon";
import { DIALOG_DATA } from "@angular/cdk/dialog";
import { EventsListModalType } from "src/app/core/types/modal";
import { ModalState } from "src/app/core/subjects/subjects.modal";
import { Bill, BillData, CreditCard } from "src/app/core/types/objects";
import { SectorPipe } from "src/utils/pipes/sector";
import { CustomFilterState } from "../../custom-filter/custom-filter.subjects.component";
import { ServiceBill } from "src/app/services/bill.service";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { CustomSnackbarComponent } from "../../custom-snackbar/custom-snackbar.component";
import { Router } from "@angular/router";
import { GeneralService } from "src/app/services/general.service";

@Component({
    selector: "modal-events-list",
    templateUrl: "./events-list.modal.html",
    styleUrls: ["./events-list.modal.css"],
    standalone: true,
    imports: [CommonModule, ModalComponent, MatIconModule, SectorPipe],
})
export class ModalEventsList {
    public modalState = inject(ModalState);
    public filterState = inject(CustomFilterState);
    private generalService = inject(GeneralService);
    public billApi = inject(ServiceBill);
    public billState = inject(BillState);
    private snack = inject(CustomSnackbarComponent);
    public router = new Router();
    public month = new Date().getMonth();
    public year = new Date().getFullYear();

    @ViewChild(ModalComponent) modalComponent: any;

    constructor(@Inject(DIALOG_DATA) public data: EventsListModalType) {
        this.modalState.changeHeader(this.data.header || "view item");
    }

    isBill(event: (Bill & BillData) | CreditCard): event is Bill & BillData {
        return (event as Bill & BillData).type !== undefined;
    }

    onClickEvent(event: (Bill & BillData) | CreditCard) {
        if (this.isBill(event)) {
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
            this.billApi.getBills().subscribe({
                next: (bills) => {
                    if (bills.count === 0)
                        this.billState.changeStatus("empty", "no bills");
                    else this.billState.setBills(bills);
                    this.generalService.navigateTo("/bills");
                    this.modalComponent.onClose();
                },
                error: () => {
                    this.snack.openSnackBar("error fetching bills", "error");
                    this.billState.changeStatus("error", "error fetching bills");
                },
            });
        } else {
            this.generalService.navigateTo("/credit-cards");
            this.modalComponent.onClose();
        }
    }
}
