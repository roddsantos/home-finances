import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
import { CompanyState } from "src/app/core/subjects/subjects.company";
import { MatInputModule } from "@angular/material/input";
import { BankState } from "src/app/core/subjects/subjects.bank";
import { CreditCardState } from "src/app/core/subjects/subjects.credit-card";
import { ConfigForm } from "src/app/core/types/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { BOOLEAN_FORM, MONEY_FLOW_FORM } from "src/utils/constants/forms";
import { ToggleButtonComponent } from "src/app/components/toggle-buttons/toggle-buttons.component";
import { ToggleButtonItemsType } from "src/app/core/types/components/toggle-buttons";

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
        ToggleButtonComponent,
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

    public moneyFlowItems = MONEY_FLOW_FORM;
    public booleanItems = BOOLEAN_FORM;

    settledChange(event: ToggleButtonItemsType<string>) {
        if (!event.value) {
            this.setConfigData.emit({ ...this.configForm.getRawValue(), paid: null });
            this.configForm.patchValue({ paid: null });
        }
    }

    ngOnInit() {
        this.configForm.patchValue({ ...this.configData });
        if (this.configData.type === "companyCredit") {
            this.configForm.controls["paid"].patchValue(null);
            this.configForm.get("paid")?.disable();
            this.configForm.controls["settled"].patchValue(false);
            this.configForm.get("settled")?.disable();
        }
    }
}
