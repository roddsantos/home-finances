import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormField } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { CardComponent } from "src/app/components/card/card.component";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { UserService } from "src/app/services/user.service";
import { UserState } from "src/app/core/subjects/subjects.user";
import { ColorPipe } from "src/utils/pipes/colors";
import { UserPipe } from "src/utils/pipes/user";
import { UserObject } from "src/app/core/types/services";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";

@Component({
    selector: "profile-settings",
    templateUrl: "./profile.settings.html",
    styleUrls: ["./profile.settings.css"],
    standalone: true,
    imports: [
        CommonModule,
        ColorPipe,
        CardComponent,
        ReactiveFormsModule,
        FormsModule,
        MatFormField,
        UserPipe,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
    ],
})
export class ProfileSettingsComponent {
    public userState = inject(UserState);
    public changed: boolean = false;
    public storage = inject(LocalStorageService);
    public userService = inject(UserService);
    public snackBar = inject(CustomSnackbarComponent);
    private style = getComputedStyle(document.body);
    public errorColor = this.style.getPropertyValue("--error");

    public profileForm = new FormGroup({
        name: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        surname: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        username: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
    });

    errorMessage = {
        name: "your name can't be empty",
        surname: "your surname can't be empty",
        username: "your surname can't be empty",
        usernameExists: "this username already exists",
    };

    constructor() {
        const userStored = this.storage.getUser();
        this.profileForm.valueChanges
            .pipe(debounceTime(350), distinctUntilChanged())
            .subscribe((data) => {
                if (userStored?.username !== data.username) {
                    this.userService.getUser(data.username || "").subscribe({
                        next: (user) => {
                            if (user)
                                this.profileForm.controls["username"].setErrors({
                                    usernameExists: true,
                                });
                        },
                    });
                }
            });
    }

    ngOnInit() {
        const user = this.storage.getUser();

        this.profileForm.patchValue({
            username: user?.username || "",
            surname: user?.surname || "",
            name: user?.name || "",
        });
    }

    onLogout() {
        this.storage.removeUser();
    }

    onUpdate() {
        const user = this.storage.getUser();
        this.userService.updateUser(this.profileForm.value as UserObject).subscribe({
            next: (res) => {
                if (user) this.userState.setUser({ ...user, ...res.user });
                this.snackBar.openSnackBar("user successfully updated", "success");
                this.profileForm.reset({
                    name: res.user.name,
                    username: res.user.username,
                    surname: res.user.surname,
                });
            },
            error: () => this.snackBar.openSnackBar("error updating user", "error"),
        });
    }
}
