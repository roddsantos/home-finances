import { Component, inject, Injectable } from "@angular/core";
import { ModalNewBill } from "../../new-bill.modal";
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
import { Bank, Company } from "src/app/types/objects";
import { MatOption } from "@angular/material/core";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { NO_BANK } from "src/utils/constants/forms";
import { MatIconModule } from "@angular/material/icon";
import { CompanyState } from "src/app/subjects/subjects.company";

@Component({
    selector: "template-banks",
    templateUrl: "./bank.template.new-bill.html",
    styleUrls: ["./bank.template.new-bill.css"],
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
    exportAs: "templateBanks",
})
export class BankTemplateNewBill {
    public companies = inject(CompanyState);
    public banks = inject(BankState);

    bankForm = new FormGroup({
        bank1: new FormControl<Bank | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
        bank2: new FormControl<Bank | null>(null, { nonNullable: false }),
        isPayment: new FormControl<boolean>(true, {
            nonNullable: true,
        }),
        company: new FormControl<Company | null>(null, {
            nonNullable: false,
        }),
    });

    enableArrow() {
        return this.bankForm.value.bank1 && this.bankForm.value.bank2;
    }

    errorMessage = NO_BANK;
}
