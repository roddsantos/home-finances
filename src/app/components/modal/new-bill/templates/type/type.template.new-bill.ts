import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { PaymentTypes } from "src/app/core/types/general";
import { PAYMENT_TYPES } from "src/utils/constants/forms";

@Component({
    selector: "type-template",
    templateUrl: "./type.template.new-bill.html",
    styleUrls: ["./type.template.new-bill.css", "../../new-bill.modal.css"],
    standalone: true,
    imports: [CommonModule, MatIconModule, ReactiveFormsModule],
})
export class TypeTemplate {
    @Input() type: PaymentTypes | null;
    @Output() setType = new EventEmitter<PaymentTypes>();

    typeList = PAYMENT_TYPES;

    handleType(t: PaymentTypes) {
        this.setType.emit(t);
    }
}
