import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    inject,
    ViewChild,
    ChangeDetectionStrategy,
} from "@angular/core";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { ModalComponent } from "../modal.component";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { CustomSnackbarComponent } from "../../custom-snackbar/custom-snackbar.component";
import { UserService } from "src/app/services/user.service";
import { ModalState } from "src/app/core/subjects/subjects.modal";
import { UserState } from "src/app/core/subjects/subjects.user";
import { AsyncPipe } from "@angular/common";

export interface DialogData {
    username: string;
}

@Component({
    selector: "modal-profile",
    templateUrl: "./profile.modal.html",
    styleUrls: ["./profile.modal.css"],
    standalone: true,
    imports: [MatFormField, MatInputModule, ModalComponent, FormsModule, AsyncPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalProfile extends ModalComponent {
    private storage = inject(LocalStorageService);
    private userService = inject(UserService);
    public userState = inject(UserState);

    username: string = "";
    textString: string;

    ngOnInit() {
        this.userState.user$.subscribe({
            next: (user) =>
                this.modalState.changeSubmitFooter(
                    user ? "OK" : "login",
                    user ? "logout" : "cancel",
                ),
        });
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
                this.userState.setUser(user);
                this.storage.setUser(user);
                this.generalService.successSnackbar("login successful");
                this.modalState.changeSubmitFooter("OK", "logout");
            },
            error: () => {
                this.generalService.errorSnackbar("login error, try again");
                this.modalState.changeSubmitFooter("login", "cancel");
            },
        });
    }

    onCloseModal() {
        this.onClose();
    }

    onLogout() {
        this.storage.removeUser();
        this.userState.setUser(null);
        this.modalState.changeSubmitFooter("login", "cancel");
    }
}
