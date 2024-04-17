import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    inject,
    ViewChild,
    ChangeDetectionStrategy,
} from "@angular/core";
import { LocalStorageService } from "src/app/services/services.local-storage";
import { ModalComponent } from "../modal.component";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { User } from "src/app/types/general";
import { CustomSnackbarComponent } from "../../custom-snackbar/custom-snackbar.component";
import { ServiceUser } from "src/app/services/services.user";
import { ModalState } from "src/app/subjects/subjects.modal";
import { UserState } from "src/app/subjects/subjects.user";
import { AsyncPipe } from "@angular/common";

export interface DialogData {
    username: string;
}

@Component({
    selector: "modal-profile",
    templateUrl: "./profile.modal.html",
    styleUrls: ["./profile.modal.css"],
    standalone: true,
    imports: [
        MatFormField,
        MatInputModule,
        MatLabel,
        ModalComponent,
        FormsModule,
        AsyncPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalProfile implements OnInit {
    private storage = inject(LocalStorageService);
    private userService = inject(ServiceUser);
    public modalState = inject(ModalState);
    public userState = inject(UserState);
    private snack = inject(CustomSnackbarComponent);

    @ViewChild(ModalComponent) modalComponent: any;

    username: string = "";
    textString: string;

    @Output() submit = new EventEmitter<string>();
    @Output() logoutClose = new EventEmitter<void>();

    ngOnInit() {
        this.userState.user$.subscribe({
            next: (user) =>
                this.modalState.changeFooter({
                    type: "submit",
                    submit: user ? "OK" : "login",
                    alert: user ? "logout" : "cancel",
                    disabled: false,
                }),
        });
        this.modalState.changeHeader("user profile");
    }

    onActionPrimary() {
        this.userState.user$
            .subscribe({
                next: (user) =>
                    user === null ? this.onProfileSubmit() : this.onCloseModal(),
            })
            .unsubscribe();
    }

    onActionSecondary() {
        this.userState.user$
            .subscribe({
                next: (user) => (user === null ? this.onCloseModal() : this.onLogout()),
            })
            .unsubscribe();
    }

    onProfileSubmit() {
        this.userService.getUser(this.username).subscribe({
            next: (user) => {
                this.userState.setUser(user as User);
                this.storage.setUser(user);
                this.snack.openSnackBar("login successful", "success");
                this.modalState.changeFooter({
                    type: "submit",
                    submit: "OK",
                    alert: "logout",
                });
            },
            error: (error) => {
                console.log("error", error);
                this.snack.openSnackBar("login error, try again", "error");
                this.modalState.changeFooter({
                    type: "submit",
                    submit: "login",
                    alert: "cancel",
                });
            },
        });
    }

    onCloseModal() {
        this.modalComponent.onClose();
    }

    onLogout() {
        this.storage.removeUser();
        this.userState.setUser(null);
        this.modalState.changeFooter({
            type: "submit",
            submit: "login",
            alert: "cancel",
        });
    }
}
