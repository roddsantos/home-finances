import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { forkJoin, mergeMap, switchMap, zip } from "rxjs";
import { CardComponent } from "src/app/components/card/card.component";
import { UserState } from "src/app/subjects/subjects.user";
import { User } from "src/app/types/objects";
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
    ],
})
export class ProfileSettingsComponent {
    constructor() {
        this.profileForm.valueChanges.subscribe((data) => {
            this.setProfile.emit({ ...data });
        });
    }

    @Input() user: any;
    @Output() changed = new EventEmitter<boolean>();
    @Output() setProfile = new EventEmitter<Partial<User>>();

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
    };

    ngOnInit() {
        this.profileForm.patchValue({ ...this.user });
    }
}
