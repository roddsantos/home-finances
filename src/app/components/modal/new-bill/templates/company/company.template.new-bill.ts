import { Component, inject, Input } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { CompanyState } from "src/app/core/subjects/subjects.company";
import { MatInputModule } from "@angular/material/input";
import { BankState } from "src/app/core/subjects/subjects.bank";
import { COMPANY_FORM, GENERAL_FORM } from "src/utils/constants/forms";
import { CreditCardState } from "src/app/core/subjects/subjects.credit-card";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "template-companies",
    templateUrl: "./company.template.new-bill.html",
    styleUrls: ["./company.template.new-bill.css", "../../new-bill.modal.css"],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatIconModule,
        CommonModule,
        MatSelectModule,
        MatInputModule,
    ],
    exportAs: "templateCompanies",
})
export class CompanyTemplateNewBill {
    constructor() {}
    public companies = inject(CompanyState);
    public banks = inject(BankState);
    public ccs = inject(CreditCardState);

    @Input({ required: true }) companyControl: FormControl<string | null>;
    @Input({ required: true }) bank1Control: FormControl<string | null>;
    @Input({ required: true }) creditcardControl: FormControl<string | null>;
    @Input({ required: true }) totalParcelControl: FormControl<number>;
    @Input({ required: true }) taxesControl: FormControl<number>;
    @Input({ required: true }) parcelsControl: FormControl<number>;
    @Input({ required: true }) deltaControl: FormControl<number>;

    public errorMessage = {
        company: COMPANY_FORM.noCompany,
        noBank: COMPANY_FORM.unnecessaryBank,
        noCC: COMPANY_FORM.unnecessaryBank,
        parcels: COMPANY_FORM.invalidParcels,
        total: GENERAL_FORM.invalidTotal,
    };

    toggleError(type: "cc" | "bank") {
        if (this.creditcardControl.value && this.bank1Control.value) {
            if (type === "cc") this.creditcardControl.setErrors({ noCC: true });
            else this.bank1Control.setErrors({ noBank: true });
        } else {
            this.bank1Control.clearValidators();
            this.creditcardControl.clearValidators();
            this.bank1Control.updateValueAndValidity();
            this.creditcardControl.updateValueAndValidity();
        }
    }
}
