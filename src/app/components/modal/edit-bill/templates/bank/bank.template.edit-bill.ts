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
import { BankState } from "src/app/subjects/subjects.bank";
import { Bank, Bill, BillData, Company } from "src/app/types/objects";
import { MatOption } from "@angular/material/core";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { NO_BANK } from "src/utils/constants/forms";
import { MatIconModule } from "@angular/material/icon";
import { CompanyState } from "src/app/subjects/subjects.company";

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

    @Input() bill!: Bill & BillData;

    bankForm = new FormGroup({
        bank1: new FormControl<Bank | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
        bank2: new FormControl<Bank | null>(null, { nonNullable: false }),
        isPayment: new FormControl<boolean>(true, {
            nonNullable: true,
            validators: [Validators.required],
        }),
        company: new FormControl<Company | null>(null, {
            nonNullable: false,
        }),
    });

    ngOnInit() {
        this.bankForm.patchValue({
            bank1: this.bill.bank1,
            bank2: this.bill.bank2,
            isPayment: this.bill.isPayment,
            company: this.bill.company,
        });
        if (this.bill.settled) {
            this.bankForm.controls["bank1"].disable();
            this.bankForm.controls["bank2"].disable();
            this.bankForm.controls["isPayment"].disable();
        }
    }

    enableArrow() {
        return this.bankForm.value.bank1 && this.bankForm.value.bank2;
    }

    errorMessage = NO_BANK;

    compareBanks(b1: Bank, b2: Bank): boolean {
        return b1.id === b2.id;
    }

    compareCompanies(c1: Company, c2: Company): boolean {
        return c1.id === c2.id;
    }
}
