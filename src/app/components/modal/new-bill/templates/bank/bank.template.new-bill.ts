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
import { BankState } from "src/app/subjects/subjects.bank";
import { Bank } from "src/app/types/objects";
import { MatOption } from "@angular/material/core";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { NO_BANK } from "src/utils/constants/forms";

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
    ],
    exportAs: "templateBanks",
})
export class BankTemplateNewBill {
    public banks = inject(BankState);

    bankForm = new FormGroup({
        bank1: new FormControl<Bank | null>(null, {
            nonNullable: false,
            validators: [Validators.required],
        }),
        bank2: new FormControl<Bank | null>(null, { nonNullable: false }),
    });

    errorMessage = NO_BANK;
}
