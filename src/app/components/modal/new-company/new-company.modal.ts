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
    public companyService = inject(CompanyService);
    public companyState = inject(CompanyState);

    constructor(@Inject(DIALOG_DATA) public data: CompanyObjectType) {
        super();
    }

    public companyForm = new FormGroup({
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

    public errorMessage = {
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
        const dataToUpdate = this.getFormDirtyValues(this.companyForm);
        this.companyService
            .updateCompany({
                ...dataToUpdate,
                id: this.data.id,
            })
            .subscribe({
                next: (company) => {
                    this.companyState.updateCompany(company);
                    this.generalService.successSnackbar(
                        `company [${company.name}] successfully updated`
                    );
                    this.onClose();
                },
                error: () => {
                    this.generalService.errorSnackbar("error updating company");
                },
            });
    }

    onCreate() {
        this.companyService
            .createCompany({
                ...this.companyForm.getRawValue(),
            })
            .subscribe({
                next: (company) => {
                    this.companyState.addCompany(company);
                    this.generalService.successSnackbar(
                        `company [${company.name}] successfully created`
                    );
                    this.onClose();
                },
                error: () => {
                    this.generalService.errorSnackbar("error creating company");
                },
            });
    }

    onSubmit() {
        if (this.companyForm.invalid) return;
        if (this.data) this.onUpdate();
        else this.onCreate();
    }
}
