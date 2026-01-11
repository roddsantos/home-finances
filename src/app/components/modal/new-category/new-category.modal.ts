import { Component, OnInit, inject, Inject } from "@angular/core";
import { ModalComponent } from "../modal.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { CATEGORY_FORM, GENERAL_FORM } from "src/utils/constants/forms";
import { CategoryService } from "src/app/services/category.service";
import { CategoryState } from "src/app/core/subjects/subjects.category";
import { MatIconModule } from "@angular/material/icon";
import { IconSelection } from "../icon-selection/icon-selection-modal";
import { Dialog, DIALOG_DATA } from "@angular/cdk/dialog";
import { Subscription } from "rxjs";
import { CategoryObjectType } from "src/app/core/types/data/category.types";
import { CustonButton } from "../../button/custom-button.component";

@Component({
    selector: "modal-new-category",
    templateUrl: "./new-category.modal.html",
    styleUrls: ["./new-category.modal.css"],
    standalone: true,
    imports: [
        ModalComponent,
        MatInputModule,
        ReactiveFormsModule,
        MatIconModule,
        CustonButton,
    ],
})
export class ModalNewCategory extends ModalComponent implements OnInit {
    public categoryService = inject(CategoryService);
    public catState = inject(CategoryState);

    public dialog = inject(Dialog);

    constructor(@Inject(DIALOG_DATA) public data: CategoryObjectType) {
        super();
    }

    public categoryForm = new FormGroup({
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
        const dataToUpdate = this.getFormDirtyValues(this.categoryForm);
        this.categoryService
            .updateCategory({
                ...dataToUpdate,
                id: this.data.id,
            })
            .subscribe({
                next: (category) => {
                    this.catState.updateCategory(category);
                    this.generalService.successSnackbar(
                        `category [${category.name}] successfully updated`
                    );
                    this.onClose();
                },
                error: () => {
                    this.generalService.errorSnackbar("error updating category");
                },
            });
    }

    onCreate() {
        this.categoryService
            .createCategory({
                ...this.categoryForm.getRawValue(),
            })
            .subscribe({
                next: (category) => {
                    this.catState.addCategory(category);
                    this.generalService.successSnackbar(
                        `category [${category.name}] successfully created`
                    );
                    this.onClose();
                },
                error: (err) => {
                    this.generalService.errorSnackbar("error creating category");
                },
            });
    }

    onSubmit() {
        if (this.categoryForm.invalid) return;
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
