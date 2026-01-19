import { Component, inject, Input } from "@angular/core";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { BankState } from "src/app/core/subjects/subjects.bank";
import { MatOption } from "@angular/material/core";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { BANK_FORM } from "src/utils/constants/forms";
import { MatIconModule } from "@angular/material/icon";
import { CompanyState } from "src/app/core/subjects/subjects.company";
import { BillDataObjectType } from "src/app/core/types/data/bills.types";
import { CompanyObjectType } from "src/app/core/types/data/company.type";
import { BankObjectType } from "src/app/core/types/data/bank.types";

@Component({
    selector: "template-edit-banks",
    templateUrl: "./bank.template.edit-bill.html",
    styleUrls: ["./bank.template.edit-bill.css"],
    standalone: true,
    imports: [
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatOption,
        CommonModule,
        MatSelectModule,
        MatCheckboxModule,
        MatIconModule,
    ],
    exportAs: "templateEditBanks",
})
export class BankTemplateEditBill {
    public companies = inject(CompanyState);
    public banks = inject(BankState);

    @Input() bill!: BillDataObjectType;
    @Input({ required: true }) companyIdControl: FormControl<string | null>;
    @Input({ required: true }) bank1IdControl: FormControl<string | null>;
    @Input({ required: true }) bank2IdControl: FormControl<string | null>;

    public errorMessage = {
        bank1: BANK_FORM.noBank,
        sameBank: BANK_FORM.sameBanks,
    };

    enableArrow() {
        return this.bank1IdControl.value && this.bank2IdControl.value;
    }
}
