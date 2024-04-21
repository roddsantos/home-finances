import { Component, inject } from "@angular/core";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Bank, Company } from "src/app/types/objects";
import { MatOption } from "@angular/material/core";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { CompanyState } from "src/app/subjects/subjects.company";
import { MatInputModule } from "@angular/material/input";
import { BankState } from "src/app/subjects/subjects.bank";
import { INVALID_PARCEL, NO_BANK, NO_COMPANY } from "src/utils/constants/forms";

@Component({
    selector: "template-companies",
    templateUrl: "./company.template.new-bill.html",
    styleUrls: ["./company.template.new-bill.css"],
    standalone: true,
    imports: [
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatOption,
        CommonModule,
        MatSelectModule,
        MatInputModule,
    ],
    exportAs: "templateCompanies",
})
export class CompanyTemplateNewBill {
    public companies = inject(CompanyState);
    public banks = inject(BankState);

    compForm = new FormGroup({
        company: new FormControl<Company | null>(null, {
            nonNullable: false,
            validators: [Validators.required],
        }),
        bank: new FormControl<Bank | null>(null, {
            nonNullable: false,
            validators: [Validators.required],
        }),
        taxes: new FormControl<number>(0, { nonNullable: false }),
        parcels: new FormControl<number>(1, {
            nonNullable: false,
            validators: [Validators.required, Validators.min(1)],
        }),
        delta: new FormControl<number>(0, { nonNullable: false }),
    });

    errorMessage = {
        company: NO_COMPANY,
        bank: NO_BANK,
        parcels: INVALID_PARCEL,
    };
}
