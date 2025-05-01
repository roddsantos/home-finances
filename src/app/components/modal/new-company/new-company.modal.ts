import { CustomSnackbarComponent } from "./../../custom-snackbar/custom-snackbar.component";
import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    inject,
    ViewChild,
    Inject,
} from "@angular/core";
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
import { ServiceCompany } from "src/app/services/company.service";
import { ModalState } from "src/app/core/subjects/subjects.modal";
import { CompanyState } from "src/app/core/subjects/subjects.company";
import { Company } from "src/app/core/types/objects";
import { CompanyObject } from "src/app/core/types/services";
import { NO_DESCRIPTION, NO_NAME } from "src/utils/constants/forms";
import { DIALOG_DATA } from "@angular/cdk/dialog";
import { EditCompanyModalType } from "src/app/core/types/modal";
import { mergeMap } from "rxjs";

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
export class ModalNewCompany implements OnInit {
    public companyApi = inject(ServiceCompany);
    public modalState = inject(ModalState);
    public compState = inject(CompanyState);
    public snack = inject(CustomSnackbarComponent);
    @ViewChild(ModalComponent) modalComponent: any;

    constructor(@Inject(DIALOG_DATA) public data: EditCompanyModalType) {}

    companyForm = new FormGroup({
        name: new FormControl<string>(this.data.company?.name || "", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        description: new FormControl<string>(this.data.company?.description || "", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        color: new FormControl<string>(this.data.company?.color || "#000000", {
            nonNullable: true,
        }),
    });

    errorMessage = {
        name: NO_NAME,
        description: NO_DESCRIPTION,
    };
    @Output() submit = new EventEmitter<String>();
    @Output() onClose = new EventEmitter<void>();

    onUpdate() {
        if (!this.companyForm.invalid) {
            this.companyApi
                .updateCompany({
                    ...(this.companyForm.value as CompanyObject),
                    id: this.data.company.id,
                })
                .pipe(mergeMap(() => this.companyApi.getCompanies()))
                .subscribe({
                    next: (companies) => {
                        this.compState.setCompanies(companies as Company[]);
                        this.compState.changeStatus(
                            (companies as Company[]).length === 0 ? "empty" : "none",
                            "no companies"
                        );
                        this.snack.openSnackBar(
                            "company successfully updated",
                            "success"
                        );
                        this.modalComponent.onClose();
                    },
                    error: () => {
                        this.snack.openSnackBar("error updating company", "error");
                    },
                });
        }
    }

    onCreate() {
        if (!this.companyForm.invalid) {
            this.companyApi
                .createCompany({
                    ...(this.companyForm.value as CompanyObject),
                })
                .subscribe({
                    next: (companies) => {
                        this.compState.setCompanies(companies as Company[]);
                        this.snack.openSnackBar(
                            "company successfully created",
                            "success"
                        );
                        this.modalComponent.onClose();
                    },
                    error: () => {
                        this.snack.openSnackBar("error creating company", "error");
                    },
                });
        } else this.onClose.emit();
    }

    onSubmit() {
        if (this.data.company) this.onUpdate();
        else this.onCreate();
    }

    ngOnInit() {
        this.modalState.changeSubmitFooter(this.data.company ? "edit" : "OK", "cancel");
        this.modalState.changeHeader(this.data.header || "new company");
    }
}
