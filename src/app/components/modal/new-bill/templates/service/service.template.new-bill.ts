import { Component, inject } from "@angular/core";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Bank, Company, CreditCard } from "src/app/core/types/objects";
import { MatOption } from "@angular/material/core";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { CreditCardState } from "src/app/core/subjects/subjects.credit-card";
import { CompanyState } from "src/app/core/subjects/subjects.company";
import { BankState } from "src/app/core/subjects/subjects.bank";
import {
    INVALID_PARCEL,
    NO_COMPANY,
    UNNECESSARY_BANK,
    UNNECESSARY_CC,
} from "src/utils/constants/forms";

@Component({
    selector: "template-service",
    templateUrl: "./service.template.new-bill.html",
    styleUrls: ["./service.template.new-bill.css"],
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
    exportAs: "templateService",
})
export class ServiceTemplateNewBill {
    public creditCards = inject(CreditCardState);
    public companies = inject(CompanyState);
    public banks = inject(BankState);

    serviceForm = new FormGroup({
        creditCard: new FormControl<CreditCard | null>(null, {
            nonNullable: false,
        }),
        company: new FormControl<Company | null>(null, {
            nonNullable: false,
            validators: [Validators.required],
        }),
        bank: new FormControl<Bank | null>(null, {
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
        parcels: INVALID_PARCEL,
        noBank: UNNECESSARY_BANK,
        noCC: UNNECESSARY_CC,
    };

    toggleError(type: "cc" | "bank") {
        if (this.serviceForm.value.creditCard && this.serviceForm.value.bank)
            if (type === "cc") this.serviceForm.controls.bank.setErrors({ noBank: true });
            else this.serviceForm.controls.creditCard.setErrors({ noCC: true });
    }
}
