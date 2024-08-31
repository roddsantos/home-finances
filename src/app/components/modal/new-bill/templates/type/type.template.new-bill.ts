import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { PaymentTypes } from "src/app/types/general";
import { PAYMENT_TYPES } from "src/utils/constants/forms";

@Component({
    selector: "type-template",
    templateUrl: "./type.template.new-bill.html",
    styleUrls: ["./type.template.new-bill.css"],
    standalone: true,
    imports: [CommonModule, MatIconModule],
})
export class TypeTemplate {
    @Input() type: PaymentTypes | null;
    @Output() setType = new EventEmitter<PaymentTypes>();

    typeList = PAYMENT_TYPES;

    typeForm = new FormGroup({
        typeLocal: new FormControl<PaymentTypes | null>(null, {
            validators: [Validators.required],
            nonNullable: false,
        }),
    });
}
