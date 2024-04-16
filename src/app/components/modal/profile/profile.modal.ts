import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    inject,
    ViewChild,
} from "@angular/core";
import { LocalStorageService } from "src/app/services/services.local-storage";
import { ModalComponent } from "../modal.component";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { AppService } from "src/app/app.service";
import { FormsModule } from "@angular/forms";
import { User } from "src/app/types/general";
import { FooterModal } from "src/app/types/modal";
import { CustomSnackbarComponent } from "../../custom-snackbar/custom-snackbar.component";
import { ServiceUser } from "src/app/services/services.user";

export interface DialogData {
    username: string;
}

@Component({
    selector: "modal-profile",
    templateUrl: "./profile.modal.html",
    styleUrls: ["./profile.modal.css"],
    standalone: true,
    imports: [MatFormField, MatInputModule, MatLabel, ModalComponent, FormsModule],
})
export class ModalProfile implements OnInit {
    private storage = inject(LocalStorageService);
    private userService = inject(ServiceUser);
    private snack = inject(CustomSnackbarComponent);

    @ViewChild(ModalComponent) modalComponent: any;

    username: string = "";
    user: User | null = null;
    hasUser: any;
    textString: string;
    mode: FooterModal = {
        type: "submit",
        submit: "login",
        alert: "cancel",
    };

    @Output() submit = new EventEmitter<string>();
    @Output() logoutClose = new EventEmitter<void>();

    ngOnInit() {
        this.update();
    }

    update() {
        let userAux = this.storage.getUser();
        this.user = userAux || null;
        this.mode = {
            type: "submit",
            submit: userAux ? "OK" : "login",
            alert: userAux ? "logout" : "cancel",
        };
    }

    onProfileSubmit() {
        this.userService.getUser(this.username).subscribe({
            next: (data: any) => {
                this.storage.setUser(data);
                this.user = data;
                this.snack.openSnackBar("login successful", "success");
                this.mode = {
                    type: "submit",
                    submit: "OK",
                    alert: "logout",
                };
            },
            error: () => {
                this.snack.openSnackBar("login error, try again", "success");
                this.mode = {
                    type: "submit",
                    submit: "login",
                    alert: "cancel",
                };
            },
        });
    }

    onCloseModal() {
        this.modalComponent.onClose();
    }

    onLogout() {
        this.storage.removeUser();
        this.user = null;
        this.mode = {
            type: "submit",
            submit: "login",
            alert: "cancel",
        };
    }
}
