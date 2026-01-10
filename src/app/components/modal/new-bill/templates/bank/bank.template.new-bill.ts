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
import { Bank } from "src/app/core/types/objects";
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
    constructor() {
        this.bankForm.valueChanges.subscribe((data) => {
            this.setBankData.emit({ ...data });
        });
    }
    public companies = inject(CompanyState);
    public banks = inject(BankState);

    @Input() bankData: BankBillForm;
    @Input() bankDataErrors: ErrorsBillForm<BankBillForm>;
    @Output() setBankData = new EventEmitter<Partial<BankBillForm>>();

    errorMessage = {
        bank1: BANK_FORM.noBank,
        sameBank: BANK_FORM.sameBanks,
    };

    banksMode = BANK_TYPES;

    bankForm = new FormGroup({
        bank1: new FormControl<Bank | null>(null, {
            nonNullable: false,
            validators: [Validators.required],
        }),
        bank2: new FormControl<Bank | null>(null, { nonNullable: false }),
        isPayment: new FormControl<boolean>(true, {
            nonNullable: true,
        }),
        company: new FormControl<CompanyObjectType | null>(null, {
            nonNullable: false,
        }),
        isBetweenAccounts: new FormControl<boolean>(false),
    });

    ngOnInit() {
        this.bankForm.patchValue({ ...this.bankData });
    }

    handleChange(item: ToggleButtonItemsType<boolean>) {
        if (!item.value) {
            this.bankForm.controls.bank2.patchValue(null);
            this.setBankData.emit({ ...this.bankForm.getRawValue(), bank2: null });
        }
    }
}
