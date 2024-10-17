import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatOption, MatSelectModule } from "@angular/material/select";
import { distinctUntilChanged } from "rxjs";
import { CategoryState } from "src/app/core/subjects/subjects.category";
import { ErrorsBillForm, InfoBillForm } from "src/app/types/forms";
import { PaymentTypes } from "src/app/types/general";
import { Category } from "src/app/types/objects";
import {
    NEGATIVE_TOTAL,
    NO_BILL_VALUE,
    NO_CATEGORY,
    NO_DESCRIPTION,
    NO_NAME,
    PAYMENT_TYPES,
    YEAR_OUT_OF_RANGE,
} from "src/utils/constants/forms";

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
    constructor() {
        this.infoForm.valueChanges.subscribe((data) => {
            this.setInfo.emit({ ...data });
        });
    }

    @Input() info: InfoBillForm;
    @Input() infoErrors: ErrorsBillForm<InfoBillForm>;
    @Output() setInfo = new EventEmitter<Partial<InfoBillForm>>();
    public catState = inject(CategoryState);

    errorMessage = {
        name: NO_NAME,
        description: NO_DESCRIPTION,
        total: NO_BILL_VALUE,
        negativeValue: NEGATIVE_TOTAL,
        category: NO_CATEGORY,
        year: YEAR_OUT_OF_RANGE,
    };

    infoForm = new FormGroup({
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
        category: new FormControl<Category | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
    });

    ngOnInit() {
        this.infoForm.patchValue({ ...this.info });
    }
}
