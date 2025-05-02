import { Component, inject, OnInit, ViewChild } from "@angular/core";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { ModalState } from "src/app/core/subjects/subjects.modal";
import { MonthType } from "src/app/core/types/general";
import { Bank } from "src/app/core/types/objects";
import { INVALID_TOTAL, NO_BANK, YEAR_OUT_OF_RANGE } from "src/utils/constants/forms";
import { MONTHS } from "src/utils/constants/general";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { ModalComponent } from "../modal.component";
import { MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { BankState } from "src/app/core/subjects/subjects.bank";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import {
    MatButtonToggleChange,
    MatButtonToggleModule,
} from "@angular/material/button-toggle";

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
    ],
    templateUrl: "./new-saving.modal.html",
    styleUrl: "./new-saving.modal.css",
})
export class ModalNewSaving implements OnInit {
    public modalState = inject(ModalState);
    public snack = inject(CustomSnackbarComponent);
    public banks = inject(BankState);
    @ViewChild(ModalComponent) modalComponent: any;
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
        bank: new FormControl<Bank | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
        bankValue: new FormControl<boolean>(true),
    });

    errorMessage = {
        bank: NO_BANK,
        total: INVALID_TOTAL,
        year: YEAR_OUT_OF_RANGE,
    };

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

    onCreate() {
        if (!this.savingsForm.invalid) {
            console.log(this.savingsForm.value);
        }
    }

    enableTotal(bank: Bank) {
        this.savingsForm.get("total")?.enable();
        this.savingsForm.get("bankValue")?.enable();
        this.savingsForm.get("total")?.patchValue(bank.savings);
    }

    useBankSaving(willUseSaving: MatButtonToggleChange) {
        if (willUseSaving.value) {
            this.savingsForm
                .get("total")
                ?.patchValue(this.savingsForm.value.bank?.savings || 0);
        } else {
            this.savingsForm.get("total")?.patchValue(0);
        }
    }
}
