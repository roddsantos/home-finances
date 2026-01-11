import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CategoryState } from "src/app/core/subjects/subjects.category";
import { ErrorsBillForm, InfoBillForm } from "src/app/core/types/forms";
import { CategoryObjectType } from "src/app/core/types/data/category.types";
import { CATEGORY_FORM, GENERAL_FORM } from "src/utils/constants/forms";
import { PaymentTypes } from "src/app/core/types/general";

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

    @Input() type: PaymentTypes | null;
    @Input({ required: true }) nameControl: FormControl<string>;
    @Input({ required: true }) descriptionControl: FormControl<string>;
    @Input({ required: true }) totalControl: FormControl<number>;
    @Input({ required: true }) categoryControl: FormControl<CategoryObjectType | null>;
    @Output() setInfo = new EventEmitter<Partial<InfoBillForm>>();
    public catState = inject(CategoryState);

    public errorMessage = {
        name: GENERAL_FORM.noName,
        description: GENERAL_FORM.noDescription,
        total: GENERAL_FORM.invalidTotal,
        category: CATEGORY_FORM.noCategory,
        year: GENERAL_FORM.yearOutOfRange,
    };

    public infoForm = new FormGroup({
        name: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        description: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        total: new FormControl<number>(0, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(0.01)],
        }),
        category: new FormControl<CategoryObjectType | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
    });
}
