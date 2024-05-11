import { Component, inject, OnInit } from "@angular/core";
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
import { LocalStorageService } from "src/app/services/local-storage.service";
import { ServiceUser } from "src/app/services/user.service";
import { UserState } from "src/app/subjects/subjects.user";

@Component({
    templateUrl: "./login.page.html",
    styleUrls: ["./login.page.css"],
    standalone: true,
    imports: [
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
    ],
})
export class PageLogin implements OnInit {
    public storage = inject(LocalStorageService);
    public userState = inject(UserState);
    public userService = inject(ServiceUser);
    public snack = inject(CustomSnackbarComponent);
    public router = inject(Router);

    ngOnInit() {
        this.userState.user$.subscribe({
            next: (user) => {
                if (user) this.router.navigate(["/monthly"]);
            },
        });
    }

    loginGroup = new FormGroup({
        username: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required, Validators.max(20)],
        }),
        // password: new FormControl<string>("", {
        //     validators: [Validators.required, Validators.max(20)],
        // }),
    });

    onLogout() {
        this.storage.removeUser();
        this.userState.setUser(null);
    }

    onSubmit() {
        this.userService.getUser(this.loginGroup.value.username!).subscribe({
            next: (user) => {
                this.userState.setUser(user);
                this.storage.setUser(user);
                this.snack.openSnackBar("login successful", "success");
                this.router.navigate(["/"]);
            },
            error: () => {
                this.snack.openSnackBar("login error, try again", "error");
            },
        });
    }
}
