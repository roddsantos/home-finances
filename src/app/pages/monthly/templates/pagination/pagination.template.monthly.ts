import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { BillState } from "src/app/subjects/subjects.bill";

@Component({
    selector: "pagination-template",
    standalone: true,
    templateUrl: "./pagination.template.monthly.html",
    styleUrls: ["./pagination.template.monthly.css", "../../pages.monthly.css"],
    imports: [CommonModule, MatButtonModule, MatIconModule],
})
export class PaginationTemplate {
    public billsState = inject(BillState);

    setLimitList() {
        let limit = 10;
        this.billsState.billsPagination$.subscribe({
            next: (pagination) => {
                limit = pagination.limit;
            },
        });
        switch (limit) {
            case 5:
                this.billsState.setLimit(10);
                break;
            case 10:
                this.billsState.setLimit(20);
                break;
            case 20:
                this.billsState.setLimit(5);
                break;
            default:
                this.billsState.setLimit(10);
                break;
        }
    }
}
