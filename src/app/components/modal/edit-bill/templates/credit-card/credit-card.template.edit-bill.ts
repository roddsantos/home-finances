import { Component, ElementRef, inject, Input, ViewChild } from "@angular/core";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Bill, BillData, Company, CreditCard } from "src/app/core/types/objects";
import { MatOption } from "@angular/material/core";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { CreditCardState } from "src/app/core/subjects/subjects.credit-card";
import { CompanyState } from "src/app/core/subjects/subjects.company";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { INVALID_PARCEL, NO_CREDIT_CARD } from "src/utils/constants/forms";

@Component({
    selector: "template-edit-credit-card",
    templateUrl: "./credit-card.template.edit-bill.html",
    styleUrls: ["./credit-card.template.edit-bill.css"],
    standalone: true,
    imports: [
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatOption,
        CommonModule,
        MatSelectModule,
        MatInputModule,
        MatCheckboxModule,
    ],
    exportAs: "templateCreditCard",
})
export class CreditCardTemplateEditBill {
    public creditCards = inject(CreditCardState);
    public companies = inject(CompanyState);
    @ViewChild("parcels") parcels: ElementRef;

    @Input() bill!: Bill & BillData;

    ccForm = new FormGroup({
        creditCard: new FormControl<CreditCard | null>(null, {
            nonNullable: false,
            validators: [Validators.required],
        }),
        company: new FormControl<Company | null>(null, {
            nonNullable: false,
        }),
        taxes: new FormControl<number>(0, { nonNullable: true }),
        parcels: new FormControl<number>(1, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(1)],
        }),
        delta: new FormControl<number>(0, { nonNullable: true }),
        isRefund: new FormControl<boolean>(false, { nonNullable: true }),
    });

    errorMessage = {
        creditCard: NO_CREDIT_CARD,
        parcels: INVALID_PARCEL,
    };

    ngOnInit() {
        this.ccForm.patchValue({
            creditCard: this.bill.creditCard,
            company: this.bill.company,
            taxes: this.bill.taxes,
            parcels: this.bill.parcels,
            delta: this.bill.delta,
            isRefund: this.bill.isRefund,
        });
        if (this.bill.settled) {
            this.ccForm.controls["creditCard"].disable();
            this.ccForm.controls["parcels"].disable();
            this.ccForm.controls["taxes"].disable();
            this.ccForm.controls["delta"].disable();
        }
    }

    compareCreditCards(cc1: CreditCard, cc2: CreditCard): boolean {
        return cc1.id === cc2.id;
    }

    compareCompanies(c1: Company, c2: Company): boolean {
        return c1.id === c2.id;
    }
}
