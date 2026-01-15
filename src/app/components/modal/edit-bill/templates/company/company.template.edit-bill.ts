import { Component, inject, Input } from "@angular/core";
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
import { CompanyState } from "src/app/core/subjects/subjects.company";
import { MatInputModule } from "@angular/material/input";
import { BankState } from "src/app/core/subjects/subjects.bank";
import { BANK_FORM, COMPANY_FORM } from "src/utils/constants/forms";
import { CreditCardState } from "src/app/core/subjects/subjects.credit-card";
import { BillDataObjectType } from "src/app/core/types/data/bills.types";
import { CompanyObjectType } from "src/app/core/types/data/company.type";

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

    @Input() bill!: BillDataObjectType;
    @Input({ required: true }) companyIdControl: FormControl<string | null>;
    @Input({ required: true }) bank1IdControl: FormControl<string | null>;
    @Input({ required: true }) creditCardIdControl: FormControl<string | null>;
    @Input({ required: true }) taxesControl: FormControl<number>;
    @Input({ required: true }) parcelsControl: FormControl<number>;
    @Input({ required: true }) deltaControl: FormControl<number>;

    public errorMessage = {
        company: COMPANY_FORM.noCompany,
        noBank: BANK_FORM.noBank,
        noCC: COMPANY_FORM.unnecessaryCreditCard,
        parcels: COMPANY_FORM.invalidParcels,
    };

    toggleError(type: "cc" | "bank") {
        if (this.creditCardIdControl.value && this.bank1IdControl.value) {
            if (type === "cc") this.creditCardIdControl.setErrors({ noCC: true });
            else this.bank1IdControl.setErrors({ noBank: true });
        } else {
            this.bank1IdControl.clearValidators();
            this.creditCardIdControl.clearValidators();
            this.bank1IdControl.updateValueAndValidity();
            this.creditCardIdControl.updateValueAndValidity();
        }
    }

    compareCompanies(c1: CompanyObjectType, c2: CompanyObjectType): boolean {
        return c1.id === c2.id;
    }
}
