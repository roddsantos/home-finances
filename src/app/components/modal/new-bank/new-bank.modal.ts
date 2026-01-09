import { Component, inject, Inject } from "@angular/core";
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
import { BankService } from "src/app/services/bank.service";
import { BankState } from "src/app/core/subjects/subjects.bank";
import { BankObject } from "src/app/core/types/services";
import { Bank } from "src/app/core/types/objects";
import { DIALOG_DATA } from "@angular/cdk/dialog";
import { mergeMap } from "rxjs";
import { CommonModule } from "@angular/common";
import { BANK_FORM, GENERAL_FORM } from "src/utils/constants/forms";

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
export class ModalNewBank extends ModalComponent {
    public bankService = inject(BankService);
    public bankState = inject(BankState);

    constructor(@Inject(DIALOG_DATA) public data: Bank) {
        super();
    }

    bankForm = new FormGroup({
        name: new FormControl<string>(this.data?.name || "", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        description: new FormControl<string>(this.data?.description || "", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        color: new FormControl<string>(this.data?.color || "#000000", {
            nonNullable: true,
        }),
        savings: new FormControl<number>(this.data?.savings || 0, {
            nonNullable: true,
        }),
    });

    errorMessage = {
        name: GENERAL_FORM.noName,
        description: GENERAL_FORM.noDescription,
        savings: BANK_FORM.noSavings,
    };

    ngOnInit() {
        this.modalState.changeSubmitFooter(this.data ? "edit" : "create bank", "cancel");
        this.bankForm.controls.savings.disable();
    }

    onUpdate() {
        this.bankService
            .updateBank({
                ...(this.bankForm.value as BankObject),
                id: this.data.id,
            })
            .pipe(mergeMap(() => this.bankService.getBanks()))
            .subscribe({
                next: (banks) => {
                    this.bankState.setBanks(banks as Bank[]);
                    this.bankState.changeStatus(
                        (banks as Bank[]).length === 0 ? "empty" : "none",
                        "no banks"
                    );
                    this.generalService.successSnackbar("bank successfully updated");
                    this.onClose();
                },
                error: () => {
                    this.generalService.errorSnackbar("error updating bank");
                },
            });
    }

    onCreate() {
        this.bankService
            .createBank({
                ...(this.bankForm.getRawValue() as Omit<BankObject, "userId">),
            })
            .subscribe({
                next: (data) => {
                    this.bankState.addBank(data as Bank);
                    this.generalService.successSnackbar("bank successfully created");
                    this.onClose();
                },
                error: () => {
                    this.generalService.errorSnackbar("error creating bank");
                },
            });
    }

    handleClose() {
        this.onClose();
    }

    onSubmit() {
        if (this.bankForm.invalid) return;
        if (this.data) this.onUpdate();
        else this.onCreate();
    }
}
