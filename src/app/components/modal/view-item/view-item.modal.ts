import { DIALOG_DATA } from "@angular/cdk/dialog";
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { Component, inject, Inject, OnInit } from "@angular/core";
import { ModalComponent } from "../modal.component";
import { ModalState } from "src/app/core/subjects/subjects.modal";
import { ViewItemModalType } from "src/app/core/types/modal";
import { SectorPipe } from "src/utils/pipes/sector";
import { MONTHS } from "src/utils/constants/general";
import { TemplateCreditCard } from "./templates/credit-card/credit-card.template";

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
    ],
})
export class ModalViewItem implements OnInit {
    public modalState = inject(ModalState);
    public style = getComputedStyle(document.body);
    public defaultColor = this.style.getPropertyValue("--default");
    constructor(@Inject(DIALOG_DATA) public data: ViewItemModalType) {}

    public months = MONTHS;

    ngOnInit(): void {
        console.log("OK", this.data);
        this.modalState.changeHeader(this.data.header || "view item");
    }
}
