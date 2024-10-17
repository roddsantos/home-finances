import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { ServiceBill } from "src/app/services/bill.service";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
    selector: "pagination-template",
    standalone: true,
    templateUrl: "./pagination.template.monthly.html",
    styleUrls: ["./pagination.template.monthly.css", "../../pages.monthly.css"],
    imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
})
export class PaginationTemplate {
    public billsState = inject(BillState);
    public billService = inject(ServiceBill);
    public snack = inject(CustomSnackbarComponent);

    getBills() {
        this.billService.getBills().subscribe({
            next: (bills) => {
                if (bills.data.length === 0)
                    this.billsState.changeStatus("empty", "no bills");
                else this.billsState.setBills(bills);
            },
            error: () => {
                this.snack.openSnackBar("error fetching bills", "error");
                this.billsState.changeStatus("error", "error fetching bills");
            },
        });
    }

    setLimitList() {
        let limit = 10;
        let total = 0;
        let page = 1;
        this.billsState.billsPagination$.subscribe({
            next: (pagination) => {
                page = pagination.page;
                limit = pagination.limit;
                total = pagination.total;
            },
        });
        switch (limit) {
            case 10:
                this.billsState.setLimit(20);
                limit = 20;
                break;
            case 20:
                this.billsState.setLimit(5);
                limit = 5;
                break;
            default:
                this.billsState.setLimit(10);
                limit = 10;
                break;
        }
        if (page > Math.ceil(total / limit))
            this.billsState.setPage(Math.ceil(total / limit));
        this.getBills();
    }

    disablePrevious() {
        let status: boolean = false;
        this.billsState.billsPagination$.subscribe({
            next: (pagination) => {
                status = pagination.page === 1;
            },
        });
        return status;
    }

    disableNext() {
        let status: boolean = false;
        this.billsState.billsPagination$.subscribe({
            next: (pagination) => {
                status =
                    pagination.page === Math.ceil(pagination.total / pagination.limit) ||
                    pagination.total === 0;
            },
        });
        return status;
    }

    onNextPage() {
        this.billsState.autoPage(true);
        this.getBills();
    }

    onPreviousPage() {
        this.billsState.autoPage(false);
        this.getBills();
    }
}
