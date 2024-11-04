import { DIALOG_DATA } from "@angular/cdk/dialog";
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { Component, inject, Inject, OnInit } from "@angular/core";
import { ModalComponent } from "../modal.component";
import { ModalState } from "src/app/core/subjects/subjects.modal";
import { ViewItemModalType } from "src/app/core/types/modal";
import { SectorPipe } from "src/utils/pipes/sector";
import { MONTHS } from "src/utils/constants/general";
import { TemplateCreditCard } from "./templates/credit-card/credit-card.template";
import { TemplateBank } from "./templates/bank/bank.template";
import { TemplateBill } from "./templates/bill/bill.template";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "modal-view-item",
    templateUrl: "./view-item.modal.html",
    styleUrls: ["./view-item.modal.css"],
    standalone: true,
    imports: [
        CommonModule,
        ModalComponent,
        SectorPipe,
        CurrencyPipe,
        DatePipe,
        TemplateCreditCard,
        TemplateBank,
        TemplateBill,
        MatIconModule,
    ],
})
export class ModalViewItem {
    public modalState = inject(ModalState);
    public style = getComputedStyle(document.body);
    public defaultColor = this.style.getPropertyValue("--default");
    constructor(@Inject(DIALOG_DATA) public data: ViewItemModalType) {
        this.modalState.changeHeader(this.data.header || "view item");
    }

    public months = MONTHS;

    ngOnInit(): void {
        console.log("OK", this.data);
    }
}
