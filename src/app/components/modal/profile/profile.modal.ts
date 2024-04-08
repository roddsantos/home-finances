import { Component, Inject, OnInit, Output, EventEmitter, inject, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LocalStorageService } from "src/app/services/services.local-storage";
import { ModalComponent } from "../modal.component";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { AppService } from "src/app/app.service";
import { FormsModule } from "@angular/forms";
import { User } from "src/app/types/general";
import { FooterModal } from "src/app/types/modal";
import { CustomSnackbarComponent } from "../../custom-snackbar/custom-snackbar.component";

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
    @ViewChild(ModalComponent) modalComponent: any;
    username: String = "";
    user: User | null = null;
    hasUser: any;
    textString: String;
    mode: FooterModal = {
        type: "submit",
        submit: "login",
        alert: "cancel",
    };

    @Output() submit = new EventEmitter<String>();
    @Output() logoutClose = new EventEmitter<void>();

    private storage = inject(LocalStorageService);
    private appService = inject(AppService);
    private snack = inject(CustomSnackbarComponent);

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
        this.appService.getUser(this.username).subscribe({
            next: (data: any) => {
                this.storage.setUser(data);
                this.user = data;
                this.mode = {
                    type: "submit",
                    submit: "OK",
                    alert: "logout",
                };
            },
            error: () => {
                this.snack.openSnackBar("Erro", "error");
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
