import { Component, Inject, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { LocalStorageService } from "src/app/services/services.local-storage";
import { ModalComponent } from "../modal.component";
import { FooterModal } from "src/app/types/modal";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";

export interface DialogData {
    username: string;
}

@Component({
    selector: "modal-new-bank",
    templateUrl: "./new-bank.modal.html",
    styleUrls: ["./new-bank.modal.css"],
    standalone: true,
    imports: [ModalComponent, MatFormField, FormsModule, MatLabel, MatInputModule, FormsModule, ReactiveFormsModule],
})
export class ModalNewBank implements OnInit {
    mode: FooterModal = {
        type: "submit",
        submit: "OK",
        alert: "cancel",
        disabled: true,
    };
    name = new FormControl("", [Validators.required, Validators.maxLength(100)]);
    description = new FormControl("", [Validators.required, Validators.maxLength(100)]);
    color: String = "";
    savings = new FormControl("", [Validators.required, Validators.pattern(/[0-9,.]/gi)]);
    errorMessage = {
        name: "you must enter a name",
        description: "you must enter a description",
        savings: "you must enter the savings",
    };
    @Output() submit = new EventEmitter<String>();
    @Output() onClose = new EventEmitter<void>();

    constructor(private storage: LocalStorageService) {}

    ngOnInit() {}

    onSubmit() {
        if (this.name && this.color && this.description) {
            console.log("ok", this.name, this.color, this.description, this.savings);
        } else this.onClose.emit();
    }

    updateButtonState() {
        this.mode.disabled =
            Boolean(this.errorMessage.name) ||
            Boolean(this.errorMessage.description) ||
            Boolean(this.errorMessage.savings);
    }

    updateNameErrorMessage() {
        if (this.name.hasError("required")) {
            this.errorMessage.name = "you must enter a name";
        } else {
            this.errorMessage.name = "";
        }
        this.updateButtonState();
    }

    updateSavingsErrorMessage() {
        if (this.savings.hasError("required")) {
            this.errorMessage.savings = "you must enter the savings";
        } else if (this.savings.hasError("pattern")) {
            this.errorMessage.savings = "invalid characters";
        } else {
            this.errorMessage.savings = "";
        }
        this.updateButtonState();
    }

    updateDescriptionErrorMessage() {
        if (this.description.hasError("required")) {
            this.errorMessage.description = "you must enter a description";
        } else {
            this.errorMessage.description = "";
        }
        this.updateButtonState();
    }
}
