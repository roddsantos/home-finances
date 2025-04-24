import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    inject,
    ViewChild,
    Inject,
} from "@angular/core";
import { ModalComponent } from "../modal.component";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { ServiceBank } from "src/app/services/bank.service";
import { BankState } from "src/app/core/subjects/subjects.bank";
import { CustomSnackbarComponent } from "../../custom-snackbar/custom-snackbar.component";
import { ModalState } from "src/app/core/subjects/subjects.modal";
import { BankObject } from "src/app/core/types/services";
import { Bank } from "src/app/core/types/objects";
import { DIALOG_DATA } from "@angular/cdk/dialog";
import { EditBankModalType } from "src/app/core/types/modal";
import { mergeMap } from "rxjs";
import { CommonModule } from "@angular/common";

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
        ReactiveFormsModule,
        CommonModule,
    ],
})
export class ModalNewBank implements OnInit {
    public modalState = inject(ModalState);
    public bankApi = inject(ServiceBank);
    public bankState = inject(BankState);
    public snack = inject(CustomSnackbarComponent);
    @ViewChild(ModalComponent) modalComponent: any;

    constructor(@Inject(DIALOG_DATA) public data: EditBankModalType) {}

    bankForm = new FormGroup({
        name: new FormControl<string>(this.data.bank?.name || "", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        description: new FormControl<string>(this.data.bank?.description || "", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        color: new FormControl<string>(this.data.bank?.color || "#000000", {
            nonNullable: true,
        }),
        savings: new FormControl<number>(this.data.bank?.savings || 0, {
            nonNullable: true,
        }),
    });

    errorMessage = {
        name: "you must enter a name",
        description: "you must enter a description",
        savings: "you must enter the savings",
    };
    @Output() submit = new EventEmitter<String>();
    @Output() onClose = new EventEmitter<void>();

    ngOnInit() {
        this.modalState.onSubmitFooter(this.data.bank ? "edit" : "OK", "cancel");
        this.modalState.changeHeader(this.data.header || "new bank");
        this.bankForm.controls.savings.disable();
    }

    onUpdate() {
        if (!this.bankForm.invalid) {
            this.bankApi
                .updateBank({
                    ...(this.bankForm.value as BankObject),
                    id: this.data.bank.id,
                })
                .pipe(mergeMap(() => this.bankApi.getBanks()))
                .subscribe({
                    next: (banks) => {
                        this.bankState.setBanks(banks as Bank[]);
                        this.bankState.changeStatus(
                            (banks as Bank[]).length === 0 ? "empty" : "none",
                            "no banks"
                        );
                        this.snack.openSnackBar("bank successfully updated", "success");
                        this.modalComponent.onClose();
                    },
                    error: () => {
                        this.snack.openSnackBar("error updating bank", "error");
                    },
                });
        }
    }

    onCreate() {
        if (!this.bankForm.invalid) {
            this.bankApi
                .createBank({
                    ...(this.bankForm.value as BankObject),
                })
                .subscribe({
                    next: (data) => {
                        this.bankState.addBank(data as Bank);
                        this.snack.openSnackBar("bank successfully created", "success");
                        this.modalComponent.onClose();
                    },
                    error: () => {
                        this.snack.openSnackBar("error creating bank", "error");
                    },
                });
        } else this.onClose.emit();
    }

    onSubmit() {
        if (this.data.bank) this.onUpdate();
        else this.onCreate();
    }
}
