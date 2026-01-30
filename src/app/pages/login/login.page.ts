import { Component, inject } from "@angular/core";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { UserService } from "src/app/services/user.service";
import { AuthService } from "src/app/services/auth.service";
import { UserState } from "src/app/core/subjects/subjects.user";
import { MatIconModule } from "@angular/material/icon";
import { GeneralPage } from "src/app/core/general/page.general";
import { ThemeService } from "src/app/services/theme.service";
import { DEFAULT_THEME } from "src/utils/constants/colors";

@Component({
    selector: "login-page",
    templateUrl: "./login.page.html",
    styleUrls: ["./login.page.css"],
    standalone: true,
    imports: [
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
    ],
})
export class PageLogin extends GeneralPage {
    public userState = inject(UserState);
    public userService = inject(UserService);
    public authService = inject(AuthService);
    public themeService = inject(ThemeService);

    public snack = inject(CustomSnackbarComponent);
    public router = inject(Router);

    public isPasswordVisible = false;

    public loginGroup = new FormGroup({
        username: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required, Validators.max(30)],
        }),
        password: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required, Validators.max(30)],
        }),
    });

    ngOnInit() {
        this.themeService.setTheme(DEFAULT_THEME);
        this.userState.user$.subscribe({
            next: (user) => {
                if (user) this.generalService.navigateTo("/");
            },
        });
    }

    onLogout() {
        this.localStorageService.removeUser();
        this.userState.setUser(null);
    }

    onTogglePasswordVisibility() {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

    onSubmit() {
        if (this.loginGroup.invalid) return;
        this.authService.login(this.loginGroup.getRawValue()).subscribe({
            next: ({ user, token }) => {
                this.userState.setUser(user);
                this.localStorageService.setUser(user);
                this.localStorageService.setToken(token);
                this.snack.openSnackBar("login successful", "success");
                this.generalService.navigateTo("/");
            },
            error: () => {
                this.snack.openSnackBar("login error, try again", "error");
            },
        });
    }
}
