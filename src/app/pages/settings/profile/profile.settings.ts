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
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { CardComponent } from "src/app/components/card/card.component";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { ServiceUser } from "src/app/services/user.service";
import { UserState } from "src/app/core/subjects/subjects.user";
import { User } from "src/app/core/types/objects";
import { ColorPipe } from "src/utils/pipes/colors";

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
        MatLabel,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
    ],
})
export class ProfileSettingsComponent {
    @Input() user: any;
    @Output() changed = new EventEmitter<boolean>();
    @Output() setProfile = new EventEmitter<Partial<User>>();
    public storage = inject(LocalStorageService);
    public userService = inject(ServiceUser);

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
                this.setProfile.emit({ ...data });
            });
    }

    ngOnInit() {
        this.profileForm.patchValue({ ...this.user });
    }

    onLogout() {
        this.storage.removeUser();
    }
}
