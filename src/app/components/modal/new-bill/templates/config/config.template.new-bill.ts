import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatFormFieldControl, MatFormFieldModule } from "@angular/material/form-field";
import { Bank, Company, CreditCard } from "src/app/types/objects";
import { MatOption } from "@angular/material/core";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { CompanyState } from "src/app/core/subjects/subjects.company";
import { MatInputModule } from "@angular/material/input";
import { BankState } from "src/app/core/subjects/subjects.bank";
import {
    INVALID_PARCEL,
    NO_COMPANY,
    UNNECESSARY_BANK,
    UNNECESSARY_CC,
} from "src/utils/constants/forms";
import { CreditCardState } from "src/app/core/subjects/subjects.credit-card";
import {
    BankBillForm,
    CompanyBillForm,
    ConfigForm,
    ErrorsBillForm,
} from "src/app/types/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatDatepickerModule } from "@angular/material/datepicker";

@Component({
    selector: "template-config",
    templateUrl: "./config.template.new-bill.html",
    styleUrls: ["./config.template.new-bill.css", "../../new-bill.modal.css"],
    standalone: true,
    imports: [
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatButtonToggleModule,
        MatDatepickerModule,
        MatInputModule,
    ],
    exportAs: "templateConfig",
})
export class ConfigTemplate {
    constructor() {
        this.configForm.valueChanges.subscribe((data) => {
            this.setConfigData.emit({ ...data });
        });
    }
    public companies = inject(CompanyState);
    public banks = inject(BankState);
    public ccs = inject(CreditCardState);

    @Input() configData: ConfigForm;
    @Output() setConfigData = new EventEmitter<Partial<ConfigForm>>();

    configForm = new FormGroup({
        isPayment: new FormControl<boolean>(false, {
            nonNullable: true,
        }),
        isRefund: new FormControl<boolean>(false, {
            nonNullable: true,
        }),
        settled: new FormControl<boolean>(true, { nonNullable: true }),
        due: new FormControl<Date>(new Date(), { nonNullable: false }),
        paid: new FormControl<Date | null>(null, { nonNullable: false }),
    });

    errorMessage = {
        company: NO_COMPANY,
        noBank: UNNECESSARY_BANK,
        noCC: UNNECESSARY_CC,
        parcels: INVALID_PARCEL,
    };
}
