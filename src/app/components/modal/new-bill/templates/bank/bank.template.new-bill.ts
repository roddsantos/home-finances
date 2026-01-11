import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
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
import { BankBillForm, ErrorsBillForm } from "src/app/core/types/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { ToggleButtonComponent } from "src/app/components/toggle-buttons/toggle-buttons.component";
import { BANK_TYPES } from "src/utils/constants/bills";
import { ToggleButtonItemsType } from "src/app/core/types/components/toggle-buttons";
import { CompanyObjectType } from "src/app/core/types/data/company.type";
import { BankObjectType } from "src/app/core/types/data/bank.types";

@Component({
    selector: "template-banks",
    templateUrl: "./bank.template.new-bill.html",
    styleUrls: ["./bank.template.new-bill.css", "../../new-bill.modal.css"],
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
        MatButtonToggleModule,
        ToggleButtonComponent,
    ],
    exportAs: "templateBanks",
})
export class BankTemplateNewBill {
    constructor() {}
    public companies = inject(CompanyState);
    public banks = inject(BankState);

    @Input({ required: true }) bank1Control: FormControl<BankObjectType | null>;
    @Input({ required: true }) bank2Control: FormControl<BankObjectType | null>;
    @Input({ required: true }) isPaymentControl: FormControl<boolean>;
    @Input({ required: true }) companyControl: FormControl<CompanyObjectType | null>;
    @Output() setBankData = new EventEmitter<Partial<BankBillForm>>();

    public errorMessage = {
        bank1: BANK_FORM.noBank,
        sameBank: BANK_FORM.sameBanks,
    };

    public banksMode = BANK_TYPES;
    public isBetweenAccounts = new FormControl<boolean>(false);

    handleChange(item: ToggleButtonItemsType<boolean>) {
        if (!item.value) {
            this.bank2Control.patchValue(null);
        }
    }
}
