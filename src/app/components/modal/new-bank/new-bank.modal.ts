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
import { FooterModal } from "src/app/types/modal";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { ServiceBank } from "src/app/services/services.bank";
import { BankState } from "src/app/subjects/subjects.bank";
import { CustomSnackbarComponent } from "../../custom-snackbar/custom-snackbar.component";
import { ModalState } from "src/app/subjects/subjects.modal";
import { BankObject } from "src/app/types/services";
import { Bank } from "src/app/types/general";

export interface DialogData {
    username: string;
}

@Component({
    selector: "modal-new-bank",
    templateUrl: "./new-bank.modal.html",
    styleUrls: ["./new-bank.modal.css"],
    standalone: true,
    imports: [
        ModalComponent,
        MatFormField,
        FormsModule,
        MatLabel,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class ModalNewBank implements OnInit {
    public modalState = inject(ModalState);
    public bankApi = inject(ServiceBank);
    public bankState = inject(BankState);
    public snack = inject(CustomSnackbarComponent);
    @ViewChild(ModalComponent) modalComponent: any;

    bankForm = new FormGroup({
        name: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        description: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        color: new FormControl<string>("#000000", { nonNullable: true }),
        savings: new FormControl<number>(0, { nonNullable: true }),
    });

    errorMessage = {
        name: "you must enter a name",
        description: "you must enter a description",
        savings: "you must enter the savings",
    };
    @Output() submit = new EventEmitter<String>();
    @Output() onClose = new EventEmitter<void>();

    constructor() {
        this.bankForm.valueChanges.subscribe({
            next: (data) => {
                this.modalState.setDisableButton(
                    !Boolean(data.description) || !Boolean(data.name)
                );
            },
        });
    }

    ngOnInit() {
        this.modalState.onSubmitFooter("OK", "cancel");
        this.modalState.disableButton();
        this.modalState.changeHeader("new company");
    }

    onSubmit() {
        if (!this.bankForm.invalid) {
            this.bankApi
                .createBank({
                    ...(this.bankForm.value as BankObject),
                })
                .subscribe({
                    next: (data) => {
                        this.bankState.addBank(data as Bank);
                        this.snack.openSnackBar(
                            "company successfully created",
                            "success"
                        );
                        this.modalComponent.onClose();
                    },
                    error: (err) => {
                        this.snack.openSnackBar("error creating bank", "error");
                    },
                });
        } else this.onClose.emit();
    }
}
