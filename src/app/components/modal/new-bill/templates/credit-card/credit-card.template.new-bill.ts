import { Component, inject } from "@angular/core";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Company, CreditCard } from "src/app/types/objects";
import { MatOption } from "@angular/material/core";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { CreditCardState } from "src/app/subjects/subjects.credit-card";
import { CompanyState } from "src/app/subjects/subjects.company";
import { INVALID_PARCEL, NO_CREDIT_CARD } from "src/utils/constants/forms";

@Component({
    selector: "template-credit-card",
    templateUrl: "./credit-card.template.new-bill.html",
    styleUrls: ["./credit-card.template.new-bill.css"],
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
    exportAs: "templateCreditCard",
})
export class CreditCardTemplateNewBill {
    public creditCards = inject(CreditCardState);
    public companies = inject(CompanyState);

    ccForm = new FormGroup({
        creditCard: new FormControl<CreditCard | null>(null, {
            nonNullable: false,
            validators: [Validators.required],
        }),
        company: new FormControl<Company | null>(null, {
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
        creditCard: NO_CREDIT_CARD,
        parcels: INVALID_PARCEL,
    };
}