import { CustomSnackbarComponent } from "./../../custom-snackbar/custom-snackbar.component";
import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    inject,
    ViewChild,
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

    companyForm = new FormGroup({
        name: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        description: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        color: new FormControl<string>("#000000", { nonNullable: true }),
    });

    constructor() {}

    errorMessage = {
        name: NO_NAME,
        description: NO_DESCRIPTION,
    };
    @Output() submit = new EventEmitter<String>();
    @Output() onClose = new EventEmitter<void>();

    onSubmit() {
        if (!this.companyForm.invalid) {
            this.companyApi
                .createCompany({
                    ...(this.companyForm.value as CompanyObject),
                })
                .subscribe({
                    next: (data) => {
                        this.compState.addCompany(data as Company);
                        this.snack.openSnackBar(
                            "company successfully created",
                            "success"
                        );
                        this.modalComponent.onClose();
                    },
                });
        } else this.onClose.emit();
    }

    ngOnInit() {
        this.modalState.changeFooter({
            type: "submit",
            submit: "OK",
            alert: "cancel",
        });
        this.modalState.changeHeader("new company");
    }
}
