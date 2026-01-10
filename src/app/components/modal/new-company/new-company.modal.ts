import { CustomSnackbarComponent } from "./../../custom-snackbar/custom-snackbar.component";
import { Component, inject, Inject } from "@angular/core";
import { ModalComponent } from "../modal.component";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { CompanyService } from "src/app/services/company.service";
import { CompanyState } from "src/app/core/subjects/subjects.company";
import { CompanyObject } from "src/app/core/types/services";
import { GENERAL_FORM } from "src/utils/constants/forms";
import { DIALOG_DATA } from "@angular/cdk/dialog";
import { mergeMap } from "rxjs";
import { CompanyObjectType } from "src/app/core/types/data/company.type";

export interface DialogData {
    username: string;
}

@Component({
    selector: "modal-new-company",
    templateUrl: "./new-company.modal.html",
    styleUrls: ["./new-company.modal.css"],
    standalone: true,
    imports: [
        ModalComponent,
        MatFormField,
        FormsModule,
        MatLabel,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class ModalNewCompany extends ModalComponent {
    public companyApi = inject(CompanyService);
    public compState = inject(CompanyState);

    constructor(@Inject(DIALOG_DATA) public data: CompanyObjectType) {
        super();
    }

    companyForm = new FormGroup({
        name: new FormControl<string>(this.data?.name || "", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        description: new FormControl<string>(this.data?.description || "", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        color: new FormControl<string>(this.data?.color || "#000000", {
            nonNullable: true,
        }),
    });

    errorMessage = {
        name: GENERAL_FORM.noName,
        description: GENERAL_FORM.noDescription,
    };

    ngOnInit() {
        this.modalState.changeSubmitFooter(this.data ? "edit" : "OK", "cancel");
    }

    handleClose() {
        this.onClose();
    }

    onUpdate() {
        if (this.companyForm.invalid) return;
        this.companyApi
            .updateCompany({
                ...(this.companyForm.value as CompanyObject),
                id: this.data.id,
            })
            .pipe(mergeMap(() => this.companyApi.getCompanies()))
            .subscribe({
                next: (companies) => {
                    this.compState.setCompanies(companies as CompanyObjectType[]);
                    this.compState.changeStatus(
                        (companies as CompanyObjectType[]).length === 0
                            ? "empty"
                            : "none",
                        "no companies"
                    );
                    this.generalService.successSnackbar("company successfully updated");
                    this.onClose();
                },
                error: () => {
                    this.generalService.errorSnackbar("error updating company");
                },
            });
    }

    onCreate() {
        if (this.companyForm.invalid) return;
        this.companyApi
            .createCompany({
                ...(this.companyForm.value as CompanyObject),
            })
            .subscribe({
                next: (companies) => {
                    this.compState.setCompanies(companies as CompanyObjectType[]);
                    this.generalService.successSnackbar("company successfully created");
                    this.onClose();
                },
                error: () => {
                    this.generalService.errorSnackbar("error creating company");
                },
            });
    }

    onSubmit() {
        if (this.data) this.onUpdate();
        else this.onCreate();
    }
}
