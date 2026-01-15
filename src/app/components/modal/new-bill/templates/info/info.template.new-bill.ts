import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CategoryState } from "src/app/core/subjects/subjects.category";
import { PaymentTypes } from "src/app/core/types/data/bills.types";
import { InfoBillForm } from "src/app/core/types/forms";
import { CATEGORY_FORM, GENERAL_FORM } from "src/utils/constants/forms";

@Component({
    selector: "info-template",
    templateUrl: "./info.template.new-bill.html",
    styleUrls: ["./info.template.new-bill.css", "../../new-bill.modal.css"],
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
    ],
})
export class InfoTemplate {
    constructor() {}

    @Input() type: PaymentTypes;
    @Input({ required: true }) nameControl: FormControl<string>;
    @Input({ required: true }) descriptionControl: FormControl<string>;
    @Input({ required: true }) totalControl: FormControl<number>;
    @Input({ required: true }) categoryControl: FormControl<string | null>;
    @Output() setInfo = new EventEmitter<Partial<InfoBillForm>>();
    public catState = inject(CategoryState);

    selectedCategory(categoryId: string) {
        const category = this.catState.getCategory(categoryId);
        return category || null;
    }

    public errorMessage = {
        name: GENERAL_FORM.noName,
        description: GENERAL_FORM.noDescription,
        total: GENERAL_FORM.invalidTotal,
        category: CATEGORY_FORM.noCategory,
        year: GENERAL_FORM.yearOutOfRange,
    };
}
