import { DIALOG_DATA } from "@angular/cdk/dialog";
import { CommonModule, DatePipe } from "@angular/common";
import { Component, inject, Inject } from "@angular/core";
import { ModalComponent } from "../modal.component";
import { ModalState } from "src/app/core/subjects/subjects.modal";
import { ViewItemModalType } from "src/app/core/types/modal";
import { SectorPipe } from "src/utils/pipes/sector";
import { MONTHS } from "src/utils/constants/general";
import { TemplateCreditCard } from "./templates/credit-card/credit-card.template";
import { TemplateBank } from "./templates/bank/bank.template";
import { TemplateBill } from "./templates/bill/bill.template";
import { MatIconModule } from "@angular/material/icon";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { CardComponent } from "../../card/card.component";

@Component({
    selector: "modal-view-item",
    templateUrl: "./view-item.modal.html",
    styleUrls: ["./view-item.modal.css"],
    standalone: true,
    imports: [
        CommonModule,
        ModalComponent,
        SectorPipe,
        DatePipe,
        TemplateCreditCard,
        TemplateBank,
        TemplateBill,
        MatIconModule,
        CardComponent,
    ],
})
export class ModalViewItem {
    public modalState = inject(ModalState);
    public generalState = inject(GeneralState);
    public style = getComputedStyle(document.body);
    public defaultColor = this.style.getPropertyValue("--default");
    constructor(@Inject(DIALOG_DATA) public data: any) {}

    public months = MONTHS;

    ngOnInit(): void {}
}
