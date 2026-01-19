import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { BillService } from "src/app/services/bill.service";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Subscription } from "rxjs";
import { CustonButton } from "src/app/components/button/custom-button.component";

@Component({
    selector: "pagination-template",
    standalone: true,
    templateUrl: "./pagination.template.bills.html",
    styleUrls: ["./pagination.template.bills.css", "../../pages.bills.css"],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        CustonButton,
    ],
})
export class PaginationTemplate {
    public billsState = inject(BillState);
    public billService = inject(BillService);
    public snack = inject(CustomSnackbarComponent);

    limit = 10;
    count = 0;
    page = 1;

    billsPagination$: Subscription;

    ngOnInit() {
        this.billsPagination$ = this.billsState.billsPagination$.subscribe({
            next: (pagination) => {
                this.page = pagination.page;
                this.limit = pagination.limit;
                this.count = pagination.count;
            },
        });
    }

    getBills() {
        this.billService.getBills().subscribe({
            next: (bills) => {
                this.billsState.setBills(bills);
            },
            error: () => {
                this.snack.openSnackBar("error fetching bills", "error");
                this.billsState.changeStatus("error", "error fetching bills");
            },
        });
    }

    setLimitList() {
        switch (this.limit) {
            case 10:
                this.billsState.setLimit(20);
                this.limit = 20;
                break;
            case 20:
                this.billsState.setLimit(5);
                this.limit = 5;
                break;
            default:
                this.billsState.setLimit(10);
                this.limit = 10;
                break;
        }
        if (this.page > Math.ceil(this.count / this.limit))
            this.billsState.setPage(Math.ceil(this.count / this.limit));
        this.getBills();
    }

    disableNext() {
        return this.page === Math.ceil(this.count / this.limit);
    }

    onNextPage() {
        this.billsState.autoPage(true);
        this.getBills();
    }

    onFirstPage() {
        this.billsState.setPage(1);
        this.getBills();
    }

    onLastPage() {
        this.billsState.setPage(Math.ceil(this.count / this.limit));
        this.getBills();
    }

    onPreviousPage() {
        this.billsState.autoPage(false);
        this.getBills();
    }
}
