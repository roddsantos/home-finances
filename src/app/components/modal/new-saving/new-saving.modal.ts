import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MonthType } from "src/app/core/types/general";
import { BANK_FORM, BOOLEAN_FORM, GENERAL_FORM } from "src/utils/constants/forms";
import { MONTHS } from "src/utils/constants/general";
import { ModalComponent } from "../modal.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { BankState } from "src/app/core/subjects/subjects.bank";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { ServiceSaving } from "src/app/services/saving.service";
import { ToggleButtonComponent } from "../../toggle-buttons/toggle-buttons.component";
import { ToggleButtonItemsType } from "src/app/core/types/components/toggle-buttons";
import { BankObjectType } from "src/app/core/types/data/bank.types";

@Component({
    selector: "app-new-saving",
    standalone: true,
    imports: [
        CommonModule,
        ModalComponent,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonToggleModule,
        ToggleButtonComponent,
    ],
    templateUrl: "./new-saving.modal.html",
    styleUrl: "./new-saving.modal.css",
})
export class ModalNewSaving extends ModalComponent {
    public savingsService = inject(ServiceSaving);
    public banks = inject(BankState);

    public months = MONTHS;

    savingsForm = new FormGroup({
        total: new FormControl<number>(0, {
            validators: [Validators.required, Validators.min(0)],
            nonNullable: true,
        }),
        year: new FormControl<number>(new Date().getFullYear(), {
            nonNullable: true,
            validators: [Validators.min(2023), Validators.required],
        }),
        month: new FormControl<MonthType>(MONTHS[new Date().getMonth()], {
            nonNullable: true,
            validators: [Validators.required],
        }),
        type: new FormControl<"start">("start", {
            nonNullable: true,
            validators: [Validators.required],
        }),
        bank: new FormControl<BankObjectType | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
        bankValue: new FormControl<boolean>(true),
    });

    errorMessage = {
        bank: BANK_FORM.noBank,
        total: GENERAL_FORM.invalidTotal,
        year: GENERAL_FORM.yearOutOfRange,
    };

    public bankValueItems = BOOLEAN_FORM;

    ngOnInit() {
        this.savingsForm.get("total")?.disable();
        this.savingsForm.get("bankValue")?.disable();
        this.modalState.setupModal({
            header: "new saving",
            size: "sm",
            footerType: "submit",
        });
        this.modalState.changeSubmitFooter("save", "cancel");
    }

    handleClose() {
        this.onClose();
    }

    onCreate() {
        if (this.savingsForm.invalid) return;
        this.savingsService
            .createSaving({
                total: this.savingsForm.value.total!,
                year: this.savingsForm.value.year!,
                month: this.savingsForm.value.month!.order,
                type: this.savingsForm.value.type!,
                bankId: this.savingsForm.value.bank!.id,
            })
            .subscribe({
                next: () => {
                    this.generalService.successSnackbar("saving successfully set!");
                    this.onClose();
                },
                error: (err) => {
                    this.generalService.errorSnackbar(err.error.message);
                },
            });
    }

    enableTotal(bank: BankObjectType) {
        this.savingsForm.get("total")?.enable();
        this.savingsForm.get("bankValue")?.enable();
        this.savingsForm.get("total")?.patchValue(bank.savings);
    }

    useBankSaving(willUseSaving: ToggleButtonItemsType<string>) {
        if (willUseSaving.value) {
            this.savingsForm
                .get("total")
                ?.patchValue(this.savingsForm.value.bank?.savings || 0);
        } else {
            this.savingsForm.get("total")?.patchValue(0);
        }
    }
}
