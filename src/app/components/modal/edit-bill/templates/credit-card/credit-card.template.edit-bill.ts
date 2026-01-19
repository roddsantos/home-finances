import { Component, ElementRef, inject, Input, ViewChild } from "@angular/core";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatOption } from "@angular/material/core";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { CreditCardState } from "src/app/core/subjects/subjects.credit-card";
import { CompanyState } from "src/app/core/subjects/subjects.company";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { CREDIT_CARD_FORM } from "src/utils/constants/forms";
import { BillDataObjectType } from "src/app/core/types/data/bills.types";
import { CompanyObjectType } from "src/app/core/types/data/company.type";
import { CreditCardObjectType } from "src/app/core/types/data/credit-card.types";

@Component({
    selector: "template-edit-credit-card",
    templateUrl: "./credit-card.template.edit-bill.html",
    styleUrls: ["./credit-card.template.edit-bill.css"],
    standalone: true,
    imports: [
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatOption,
        CommonModule,
        MatSelectModule,
        MatInputModule,
        MatCheckboxModule,
    ],
    exportAs: "templateCreditCard",
})
export class CreditCardTemplateEditBill {
    public creditCards = inject(CreditCardState);
    public companies = inject(CompanyState);

    @Input({ required: true }) creditCardIdControl: FormControl<string | null>;
    @Input({ required: true }) companyIdControl: FormControl<string | null>;
    @Input({ required: true }) taxesControl: FormControl<number>;
    @Input({ required: true }) parcelsControl: FormControl<number>;
    @Input({ required: true }) deltaControl: FormControl<number>;

    public errorMessage = {
        creditCard: CREDIT_CARD_FORM.noCreditCard,
        parcels: CREDIT_CARD_FORM.invalidParcels,
    };
}
