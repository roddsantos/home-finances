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

    bankForm = new FormGroup({
        bank1: new FormControl<BankObjectType | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
        bank2: new FormControl<BankObjectType | null>(null, { nonNullable: false }),
        company: new FormControl<CompanyObjectType | null>(null, {
            nonNullable: false,
        }),
    });

    ngOnInit() {
        this.bankForm.patchValue({
            bank1: this.bill.bank1,
            bank2: this.bill.bank2,
            company: this.bill.company,
        });
        if (this.bill.settled) {
            this.bankForm.controls["bank1"].disable();
            this.bankForm.controls["bank2"].disable();
        }
    }

    enableArrow() {
        return this.bankForm.value.bank1 && this.bankForm.value.bank2;
    }

    errorMessage = BANK_FORM.noBank;

    compareBanks(b1: BankObjectType, b2: BankObjectType): boolean {
        return b1.id === b2.id;
    }

    compareCompanies(c1: CompanyObjectType, c2: CompanyObjectType): boolean {
        return c1.id === c2.id;
    }
}
