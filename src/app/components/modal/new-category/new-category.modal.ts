import { CustomSnackbarComponent } from "../../custom-snackbar/custom-snackbar.component";
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
import { ModalState } from "src/app/subjects/subjects.modal";
import { CompanyState } from "src/app/subjects/subjects.company";
import { Category, Company } from "src/app/types/objects";
import { CategoryObject, CompanyObject } from "src/app/types/services";
import { NO_DESCRIPTION, NO_NAME } from "src/utils/constants/forms";
import { ServiceCategory } from "src/app/services/category.service";
import { CategoryState } from "src/app/subjects/subjects.category";
import { MatIconModule } from "@angular/material/icon";

export interface DialogData {
    username: string;
}

@Component({
    selector: "modal-new-category",
    templateUrl: "./new-category.modal.html",
    styleUrls: ["./new-category.modal.css"],
    standalone: true,
    imports: [
        ModalComponent,
        MatFormField,
        FormsModule,
        MatLabel,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
    ],
})
export class ModalNewCategory implements OnInit {
    public catApi = inject(ServiceCategory);
    public modalState = inject(ModalState);
    public catState = inject(CategoryState);
    public snack = inject(CustomSnackbarComponent);
    @ViewChild(ModalComponent) modalComponent: any;

    categoryForm = new FormGroup({
        name: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        description: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        color: new FormControl<string>("#000000", { nonNullable: true }),
        icon: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
    });

    constructor() {}

    errorMessage = {
        name: NO_NAME,
        description: NO_DESCRIPTION,
        icon: "you must enter an icon",
    };
    @Output() submit = new EventEmitter<String>();
    @Output() onClose = new EventEmitter<void>();

    onSubmit() {
        if (!this.categoryForm.invalid) {
            this.catApi
                .createCategory({
                    ...(this.categoryForm.value as CategoryObject),
                })
                .subscribe({
                    next: (data) => {
                        this.catState.addCategory(data as Category);
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
        this.modalState.changeHeader("new category");
    }
}
