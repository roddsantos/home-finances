import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
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
import { UserService } from "src/app/services/user.service";
import { UserState } from "src/app/core/subjects/subjects.user";
import { UserPipe } from "src/utils/pipes/user";
import { CustonButton } from "src/app/components/button/custom-button.component";
import { UserObjectType } from "src/app/core/types/data/user.types";
import { GeneralComponent } from "src/app/core/general/general.component";
import { USER_FORMS } from "src/utils/constants/forms";
import { DEFAULT_THEME } from "src/utils/constants/colors";
import { ThemeService } from "src/app/services/theme.service";
import { ModalChangePassword } from "src/app/components/modal/change-password/change-password.modal";
import { AuthService } from "src/app/services/auth.service";

@Component({
    selector: "profile-settings",
    templateUrl: "./profile.settings.html",
    styleUrls: ["./profile.settings.css"],
    standalone: true,
    imports: [
        CommonModule,
        CardComponent,
        ReactiveFormsModule,
        FormsModule,
        MatFormField,
        UserPipe,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        CustonButton,
    ],
})
export class ProfileSettingsComponent extends GeneralComponent {
    public userState = inject(UserState);
    public userService = inject(UserService);
    public themeService = inject(ThemeService);
    private authService = inject(AuthService);

    public storedUser: UserObjectType | null;
    public errorMessage = USER_FORMS;

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
        password: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
    });

    constructor() {
        super();
        const userStored = this.localStorageService.getUser();
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
        this.storedUser = this.localStorageService.getUser();

        this.profileForm.patchValue({
            username: this.storedUser?.username || "",
            surname: this.storedUser?.surname || "",
            name: this.storedUser?.name || "",
        });
    }

    onLogout() {
        this.authService.logout();
        this.themeService.setTheme(DEFAULT_THEME);
    }

    onUpdate() {
        this.userService
            .updateUser({
                ...this.profileForm.getRawValue(),
                id: this.storedUser?.id || "",
            })
            .subscribe({
                next: (user) => {
                    this.userState.setUser(user);
                    this.generalService.successSnackbar("user successfully updated");
                    this.profileForm.reset({
                        name: user.name,
                        username: user.username,
                        surname: user.surname,
                    });
                },
                error: () => this.generalService.errorSnackbar("error updating user"),
            });
    }

    openPasswordChangeModal() {
        this.generalService.dialog.open(ModalChangePassword, {});
    }
}
