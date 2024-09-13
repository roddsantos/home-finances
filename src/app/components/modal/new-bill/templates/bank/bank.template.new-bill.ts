import {
    Component,
    EventEmitter,
    inject,
    Injectable,
    Input,
    Output,
} from "@angular/core";
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
import { NO_BANK, SAME_BANK } from "src/utils/constants/forms";
import { MatIconModule } from "@angular/material/icon";
import { CompanyState } from "src/app/subjects/subjects.company";
import { BankBillForm, ErrorsBillForm } from "src/app/types/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

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

    errorMessage = { bank1: NO_BANK, sameBank: SAME_BANK };

    bankForm = new FormGroup({
        bank1: new FormControl<Bank | null>(null, {
            nonNullable: false,
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

    ngOnInit() {
        this.bankForm.patchValue({ ...this.bankData });
    }

    enableArrow() {
        return this.bankForm.value.bank1 && this.bankForm.value.bank2;
    }
}
