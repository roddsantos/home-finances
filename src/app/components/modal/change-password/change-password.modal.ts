import { CommonModule } from "@angular/common";
import { Component, inject, Inject } from "@angular/core";
import { ModalComponent } from "../modal.component";
import { DIALOG_DATA } from "@angular/cdk/dialog";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { USER_FORMS } from "src/utils/constants/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { UserService } from "src/app/services/user.service";
import { MatInputModule } from "@angular/material/input";

@Component({
    selector: "modal-change-password",
    templateUrl: "./change-password.modal.html",
    styleUrls: ["./change-password.modal.css"],
    standalone: true,
    imports: [
        CommonModule,
        ModalComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
    ],
})
export class ModalChangePassword extends ModalComponent {
    public userService = inject(UserService);

    constructor(@Inject(DIALOG_DATA) public data: any) {
        super();
    }

    public passwordForm = new FormGroup({
        newPassword: new FormControl<string>("", {
            validators: [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(30),
            ],
            nonNullable: true,
        }),
        confirmPassword: new FormControl<string>("", {
            validators: [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(30),
            ],
            nonNullable: true,
        }),
    });

    public errorMessage = {
        invalidPassword: USER_FORMS.invalidPassword,
        passwordsDontMatch: USER_FORMS.passwordsDontMatch,
    };

    ngOnInit() {
        this.modalState.changeSubmitFooter("update", "cancel");
    }

    handleClose() {
        this.onClose();
    }

    onSubmit() {
        if (this.passwordForm.invalid) return;
        this.userService.updatePassword(this.passwordForm.getRawValue()).subscribe({
            next: () => {
                this.generalService.successSnackbar("password successfully updated");
                this.onClose();
            },
            error: () => {
                this.generalService.errorSnackbar("error updating password");
            },
        });
    }
}
