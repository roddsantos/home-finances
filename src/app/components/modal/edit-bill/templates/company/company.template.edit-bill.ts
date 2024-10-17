import { Component, inject, Input } from "@angular/core";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Bank, Bill, BillData, Company, CreditCard } from "src/app/types/objects";
import { MatOption } from "@angular/material/core";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { CompanyState } from "src/app/core/subjects/subjects.company";
import { MatInputModule } from "@angular/material/input";
import { BankState } from "src/app/core/subjects/subjects.bank";
import {
    INVALID_PARCEL,
    NO_COMPANY,
    UNNECESSARY_BANK,
    UNNECESSARY_CC,
} from "src/utils/constants/forms";
import { CreditCardState } from "src/app/core/subjects/subjects.credit-card";

@Component({
    selector: "template-edit-companies",
    templateUrl: "./company.template.edit-bill.html",
    styleUrls: ["./company.template.edit-bill.css"],
    standalone: true,
    imports: [
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatOption,
        CommonModule,
        MatSelectModule,
        MatInputModule,
    ],
    exportAs: "templateCompanies",
})
export class CompanyTemplateEditBill {
    public companies = inject(CompanyState);
    public banks = inject(BankState);
    public ccs = inject(CreditCardState);

    @Input() bill!: Bill & BillData;

    compForm = new FormGroup({
        company: new FormControl<Company | null>(null, {
            nonNullable: false,
            validators: [Validators.required],
        }),
        bank: new FormControl<Bank | null>(null, {
            nonNullable: false,
        }),
        creditcard: new FormControl<string | null>(null, {
            nonNullable: false,
        }),
        taxes: new FormControl<number>(0, { nonNullable: true }),
        parcels: new FormControl<number>(1, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(1)],
        }),
        delta: new FormControl<number>(0, { nonNullable: true }),
    });

    errorMessage = {
        company: NO_COMPANY,
        noBank: UNNECESSARY_BANK,
        noCC: UNNECESSARY_CC,
        parcels: INVALID_PARCEL,
    };

    ngOnInit() {
        this.compForm.patchValue({
            company: this.bill.company,
            bank: this.bill.bank1,
            creditcard: this.bill.creditCard?.id || null,
            taxes: this.bill.taxes,
            parcels: this.bill.parcels,
            delta: this.bill.delta,
        });
        if (this.bill.settled) {
            this.compForm.controls["bank"].disable();
            this.compForm.controls["creditcard"].disable();
            this.compForm.controls["parcels"].disable();
            this.compForm.controls["taxes"].disable();
            this.compForm.controls["delta"].disable();
        }
    }

    toggleError(type: "cc" | "bank") {
        if (this.compForm.value.creditcard && this.compForm.value.bank) {
            if (type === "cc")
                this.compForm.controls.creditcard.setErrors({ noCC: true });
            else this.compForm.controls.bank.setErrors({ noBank: true });
        } else {
            this.compForm.controls.bank.clearValidators();
            this.compForm.controls.creditcard.clearValidators();
            this.compForm.controls.bank.updateValueAndValidity();
            this.compForm.controls.creditcard.updateValueAndValidity();
        }
    }

    compareCompanies(c1: Company, c2: Company): boolean {
        return c1.id === c2.id;
    }
}
