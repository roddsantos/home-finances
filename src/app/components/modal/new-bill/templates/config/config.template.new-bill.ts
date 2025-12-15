import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
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
import { ConfigForm } from "src/app/core/types/forms";
import {
    MatButtonToggleChange,
    MatButtonToggleModule,
} from "@angular/material/button-toggle";
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
        isPayment: new FormControl<boolean>(true, {
            nonNullable: true,
        }),
        isRecurrent: new FormControl<boolean>(false, {
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

    settledChange(event: MatButtonToggleChange) {
        if (!event.value) {
            this.setConfigData.emit({ ...this.configForm.getRawValue(), paid: null });
            this.configForm.patchValue({ paid: null });
        }
    }

    ngOnInit() {
        if (this.configData.type === "companyCredit") {
            this.configForm.controls["paid"].patchValue(null);
            this.configForm.get("paid")?.disable();
            this.configForm.controls["settled"].patchValue(false);
            this.configForm.get("settled")?.disable();
        }
    }
}
