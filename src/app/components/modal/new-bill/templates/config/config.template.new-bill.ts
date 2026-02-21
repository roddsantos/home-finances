import { Component, inject, Input } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
import { CompanyState } from "src/app/core/subjects/subjects.company";
import { MatInputModule } from "@angular/material/input";
import { BankState } from "src/app/core/subjects/subjects.bank";
import { CreditCardState } from "src/app/core/subjects/subjects.credit-card";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { BOOLEAN_FORM, MONEY_FLOW_FORM } from "src/utils/constants/forms";
import { ToggleButtonComponent } from "src/app/components/toggle-buttons/toggle-buttons.component";
import { ToggleButtonItemsType } from "src/app/core/types/components/toggle-buttons";
import { PaymentTypes } from "src/app/core/types/data/bills.types";
import { MatIcon } from "@angular/material/icon";

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
        MatIcon,
    ],
    exportAs: "templateConfig",
})
export class ConfigTemplate {
    constructor() {}
    public companies = inject(CompanyState);
    public banks = inject(BankState);
    public ccs = inject(CreditCardState);

    @Input({ required: true }) type: PaymentTypes;
    @Input({ required: true }) isPaymentControl: FormControl<boolean>;
    @Input({ required: true }) isRecurrentControl: FormControl<boolean>;
    @Input({ required: true }) settledControl: FormControl<boolean>;
    @Input({ required: true }) dueControl: FormControl<Date>;
    @Input({ required: true }) paidControl: FormControl<Date | null>;

    public moneyFlowItems = MONEY_FLOW_FORM;
    public booleanItems = BOOLEAN_FORM;

    settledChange(event: ToggleButtonItemsType<string>) {
        if (!event.value) {
            this.paidControl.patchValue(null);
        }
    }
}
