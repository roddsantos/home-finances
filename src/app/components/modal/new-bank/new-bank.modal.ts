import { Component, inject, Inject } from "@angular/core";
import { ModalComponent } from "../modal.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { BankService } from "src/app/services/bank.service";
import { BankState } from "src/app/core/subjects/subjects.bank";
import { DIALOG_DATA } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { BANK_FORM, BOOLEAN_FORM, GENERAL_FORM } from "src/utils/constants/forms";
import { BankObjectType } from "src/app/core/types/data/bank.types";
import { ToggleButtonComponent } from "../../toggle-buttons/toggle-buttons.component";

@Component({
    selector: "modal-new-bank",
    templateUrl: "./new-bank.modal.html",
    styleUrls: ["./new-bank.modal.css"],
    standalone: true,
    imports: [
        CommonModule,
        MatInputModule,
        ModalComponent,
        ReactiveFormsModule,
        ToggleButtonComponent,
    ],
})
export class ModalNewBank extends ModalComponent {
    public bankService = inject(BankService);
    public bankState = inject(BankState);

    constructor(@Inject(DIALOG_DATA) public data: BankObjectType) {
        super();
    }

    public bankForm = new FormGroup({
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
        isPiggyBank: new FormControl<boolean>(this.data?.isPiggyBank || false, {
            nonNullable: true,
        }),
    });

    public errorMessage = {
        name: GENERAL_FORM.noName,
        description: GENERAL_FORM.noDescription,
        savings: BANK_FORM.noSavings,
    };

    public booleanForm = BOOLEAN_FORM;

    ngOnInit() {
        this.modalState.changeSubmitFooter(this.data ? "edit" : "create bank", "cancel");
        this.bankForm.controls.savings.disable();
    }

    onUpdate() {
        const dataToUpdate = this.getFormDirtyValues(this.bankForm);
        this.bankService
            .updateBank({
                ...dataToUpdate,
                userId: this.data.userId,
                id: this.data.id,
            })
            .subscribe({
                next: (bank) => {
                    this.bankState.addBank(bank);
                    this.generalService.successSnackbar(
                        `bank [${bank.name}] successfully updated`
                    );
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
                ...this.bankForm.getRawValue(),
            })
            .subscribe({
                next: (data) => {
                    this.bankState.addBank(data);
                    this.generalService.successSnackbar(
                        `bank [${data.name}] successfully created`
                    );
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
