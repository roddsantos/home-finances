import { Component, inject, Input } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatOption } from "@angular/material/core";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { CreditCardState } from "src/app/core/subjects/subjects.credit-card";
import { CompanyState } from "src/app/core/subjects/subjects.company";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { CREDIT_CARD_FORM, GENERAL_FORM } from "src/utils/constants/forms";
import { MatIconModule } from "@angular/material/icon";
import { MONTHS } from "src/utils/constants/general";

@Component({
    selector: "template-credit-card",
    templateUrl: "./credit-card.template.new-bill.html",
    styleUrls: ["./credit-card.template.new-bill.css", "../../new-bill.modal.css"],
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
        MatIconModule,
    ],
    exportAs: "templateCreditCard",
})
export class CreditCardTemplateNewBill {
    constructor() {}
    public creditCards = inject(CreditCardState);
    public companies = inject(CompanyState);
    public monthList = MONTHS;

    @Input({ required: true }) creditcardControl: FormControl<string | null>;
    @Input({ required: true }) companyControl: FormControl<string | null>;
    @Input({ required: true }) totalParcelControl: FormControl<number>;
    @Input({ required: true }) parcelsControl: FormControl<number>;
    @Input({ required: true }) deltaControl: FormControl<number>;

    public errorMessage = {
        creditCard: CREDIT_CARD_FORM.noCreditCard,
        parcels: CREDIT_CARD_FORM.invalidParcels,
        total: GENERAL_FORM.invalidTotal,
    };
}
