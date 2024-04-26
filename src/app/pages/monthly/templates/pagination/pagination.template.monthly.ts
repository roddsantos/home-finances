import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { BillState } from "src/app/subjects/subjects.bill";

@Component({
    selector: "pagination-template",
    standalone: true,
    templateUrl: "./pagination.template.monthly.html",
    styleUrls: ["./pagination.template.monthly.css", "../../pages.monthly.css"],
    imports: [CommonModule, MatButtonModule],
})
export class PaginationTemplate {
    public billsState = inject(BillState);
}
