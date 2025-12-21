import { Component, OnInit, inject, Inject } from "@angular/core";
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
import { Category } from "src/app/core/types/objects";
import { CategoryObject } from "src/app/core/types/services";
import { CATEGORY_FORM, GENERAL_FORM } from "src/utils/constants/forms";
import { ServiceCategory } from "src/app/services/category.service";
import { CategoryState } from "src/app/core/subjects/subjects.category";
import { MatIconModule } from "@angular/material/icon";
import { IconSelection } from "../icon-selection/icon-selection-modal";
import { Dialog, DIALOG_DATA } from "@angular/cdk/dialog";
import { MatButtonModule } from "@angular/material/button";
import { mergeMap, Subscription } from "rxjs";

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
export class ModalNewCategory extends ModalComponent implements OnInit {
    public catApi = inject(ServiceCategory);
    public catState = inject(CategoryState);

    public dialog = inject(Dialog);

    constructor(@Inject(DIALOG_DATA) public data: Category) {
        super();
    }

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

    public iconSubscriber: Subscription;
    public errorMessage = {
        name: GENERAL_FORM.noName,
        description: GENERAL_FORM.noDescription,
        icon: CATEGORY_FORM.noIcon,
    };

    ngOnInit() {
        this.modalState.changeSubmitFooter(this.data ? "edit" : "OK", "cancel");
    }

    onUpdate() {
        if (this.categoryForm.invalid) return;
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
                    this.generalService.successSnackbar("category successfully updated");
                    this.onClose();
                },
                error: () => {
                    this.generalService.errorSnackbar("error updating category");
                },
            });
    }

    onCreate() {
        if (this.categoryForm.invalid) return;
        this.catApi
            .createCategory({
                ...(this.categoryForm.value as CategoryObject),
            })
            .subscribe({
                next: (categories) => {
                    this.catState.setCategory(categories as Category[]);
                    this.generalService.successSnackbar("category successfully created");
                    this.onClose();
                },
                error: (err) => {
                    this.generalService.errorSnackbar(err.error.message);
                },
            });
    }

    onSubmit() {
        if (this.data) this.onUpdate();
        else this.onCreate();
    }

    openDialog(): void {
        this.iconSubscriber = this.dialog
            .open<string>(IconSelection, {
                data: this.categoryForm.value.icon,
            })
            .closed.subscribe((res) => {
                this.categoryForm.patchValue({
                    icon: res || this.categoryForm.value.icon,
                });
            });
    }

    handleClose() {
        this.onClose();
    }

    ngOnDestroy() {
        this.iconSubscriber.unsubscribe();
    }
}
