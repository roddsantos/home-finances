import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { BillState } from "src/app/core/subjects/subjects.bill";

@Component({
    templateUrl: "./pins.template.bills.pages.html",
    selector: "bills-pins",
    styleUrls: ["./pins.template.bills.pages.css"],
    standalone: true,
    imports: [CommonModule],
})
export class PinsBillsTemplate {
    public billsState = inject(BillState);
}
