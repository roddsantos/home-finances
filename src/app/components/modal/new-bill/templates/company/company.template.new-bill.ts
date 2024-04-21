import { Component, inject } from "@angular/core";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Company } from "src/app/types/objects";
import { MatOption } from "@angular/material/core";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { CompanyState } from "src/app/subjects/subjects.company";
import { MatInputModule } from "@angular/material/input";

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

    compForm = new FormGroup({
        company: new FormControl<Company | null>(null, {
            nonNullable: false,
            validators: [Validators.required],
        }),
        taxes: new FormControl<number>(0, { nonNullable: false }),
        parcels: new FormControl<number>(1, {
            nonNullable: false,
            validators: [Validators.required],
        }),
        delta: new FormControl<number>(0, { nonNullable: false }),
    });

    errorMessage = {
        company: "you must select a company",
        parcels: "invalid number of parcels",
    };
}
