import { CustomSnackbarComponent } from "../../custom-snackbar/custom-snackbar.component";
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
import { Category, Company } from "src/app/core/types/objects";
import { CategoryObject, CompanyObject } from "src/app/core/types/services";
import { NO_DESCRIPTION, NO_NAME } from "src/utils/constants/forms";
import { ServiceCategory } from "src/app/services/category.service";
import { CategoryState } from "src/app/core/subjects/subjects.category";
import { MatIconModule } from "@angular/material/icon";
import { IconSelection } from "../icon-selection/icon-selection-modal";
import { Dialog, DIALOG_DATA } from "@angular/cdk/dialog";
import { MatButtonModule } from "@angular/material/button";
import { EditCategoryModalType } from "src/app/core/types/modal";
import { mergeMap } from "rxjs";

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
        MatButtonModule,
    ],
})
export class ModalNewCategory implements OnInit {
    public catApi = inject(ServiceCategory);
    public modalState = inject(ModalState);
    public catState = inject(CategoryState);
    public snack = inject(CustomSnackbarComponent);
    public dialog = inject(Dialog);
    @ViewChild(ModalComponent) modalComponent: any;
    @ViewChild(IconSelection) iconSelection: IconSelection;

    constructor(@Inject(DIALOG_DATA) public data: Category) {}

    categoryForm = new FormGroup({
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
        icon: new FormControl<string>(this.data?.icon || "", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
    });

    errorMessage = {
        name: NO_NAME,
        description: NO_DESCRIPTION,
        icon: "you must enter an icon",
    };
    @Output() submit = new EventEmitter<String>();
    @Output() onClose = new EventEmitter<void>();

    onUpdate() {
        if (!this.categoryForm.invalid) {
            this.catApi
                .updateCategory({
                    ...(this.categoryForm.value as CategoryObject),
                    id: this.data.id,
                })
                .pipe(mergeMap(() => this.catApi.getCategories()))
                .subscribe({
                    next: (categories) => {
                        this.catState.setCategory(categories as Category[]);
                        this.catState.changeStatus(
                            (categories as Category[]).length === 0 ? "empty" : "none",
                            "no categories"
                        );
                        this.snack.openSnackBar(
                            "category successfully updated",
                            "success"
                        );
                        this.modalComponent.onClose();
                    },
                    error: () => {
                        this.snack.openSnackBar("error updating category", "error");
                    },
                });
        }
    }

    onCreate() {
        if (!this.categoryForm.invalid) {
            this.catApi
                .createCategory({
                    ...(this.categoryForm.value as CategoryObject),
                })
                .subscribe({
                    next: (categories) => {
                        this.catState.setCategory(categories as Category[]);
                        this.snack.openSnackBar(
                            "category successfully created",
                            "success"
                        );
                        this.modalComponent.onClose();
                    },
                    error: (err) => {
                        this.snack.openSnackBar(err.error.message, "error");
                    },
                });
        } else this.onClose.emit();
    }

    onSubmit() {
        if (this.data) this.onUpdate();
        else this.onCreate();
    }

    openDialog(): void {
        this.dialog
            .open<string>(IconSelection, {
                data: {
                    header: "choose icon",
                    size: "md",
                },
                hasBackdrop: true,
                backdropClass: "modal-backdrop",
            })
            .closed.subscribe((res) => {
                this.categoryForm.patchValue({ icon: res });
            });
    }

    ngOnInit() {
        this.modalState.changeSubmitFooter(this.data ? "edit" : "OK", "cancel");
        this.modalState.changeHeader(this.data ? "edit category" : "new category");
    }
}
