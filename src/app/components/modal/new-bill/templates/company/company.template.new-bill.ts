import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Bank, CreditCard } from "src/app/core/types/objects";
import { MatOption } from "@angular/material/core";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { CompanyState } from "src/app/core/subjects/subjects.company";
import { MatInputModule } from "@angular/material/input";
import { BankState } from "src/app/core/subjects/subjects.bank";
import { COMPANY_FORM, GENERAL_FORM } from "src/utils/constants/forms";
import { CreditCardState } from "src/app/core/subjects/subjects.credit-card";
import { BankBillForm, CompanyBillForm, ErrorsBillForm } from "src/app/core/types/forms";
import { MatIconModule } from "@angular/material/icon";
import { CompanyObjectType } from "src/app/core/types/data/company.type";

@Component({
    selector: "template-companies",
    templateUrl: "./company.template.new-bill.html",
    styleUrls: ["./company.template.new-bill.css", "../../new-bill.modal.css"],
    standalone: true,
    imports: [
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatOption,
        MatIconModule,
        CommonModule,
        MatSelectModule,
        MatInputModule,
    ],
    exportAs: "templateCompanies",
})
export class CompanyTemplateNewBill {
    constructor() {
        this.compForm.valueChanges.subscribe((data) => {
            this.setCompData.emit({ ...data });
        });
    }
    public companies = inject(CompanyState);
    public banks = inject(BankState);
    public ccs = inject(CreditCardState);

    @Input() compData: CompanyBillForm;
    @Input() compDataErrors: ErrorsBillForm<CompanyBillForm>;
    @Output() setCompData = new EventEmitter<Partial<BankBillForm>>();

    compForm = new FormGroup({
        company: new FormControl<CompanyObjectType | null>(null, {
            nonNullable: false,
            validators: [Validators.required],
        }),
        bank1: new FormControl<Bank | null>(null, {
            nonNullable: false,
        }),
        creditcard: new FormControl<CreditCard | null>(null, {
            nonNullable: false,
        }),
        totalParcel: new FormControl<number>(0, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(0.01)],
        }),
        taxes: new FormControl<number>(0, { nonNullable: true }),
        parcels: new FormControl<number>(1, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(1)],
        }),
        delta: new FormControl<number>(0, { nonNullable: true }),
    });

    errorMessage = {
        company: COMPANY_FORM.noCompany,
        noBank: COMPANY_FORM.unnecessaryBank,
        noCC: COMPANY_FORM.unnecessaryBank,
        parcels: COMPANY_FORM.invalidParcels,
        total: GENERAL_FORM.invalidTotal,
    };

    toggleError(type: "cc" | "bank") {
        if (this.compForm.value.creditcard && this.compForm.value.bank1) {
            if (type === "cc")
                this.compForm.controls.creditcard.setErrors({ noCC: true });
            else this.compForm.controls.bank1.setErrors({ noBank: true });
        } else {
            this.compForm.controls.bank1.clearValidators();
            this.compForm.controls.creditcard.clearValidators();
            this.compForm.controls.bank1.updateValueAndValidity();
            this.compForm.controls.creditcard.updateValueAndValidity();
        }
    }
}
