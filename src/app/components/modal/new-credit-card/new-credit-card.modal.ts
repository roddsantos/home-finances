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
import { MatSelectModule } from "@angular/material/select";
import { CreditCardService } from "src/app/services/credit-card.service";
import { CreditCardState } from "src/app/core/subjects/subjects.credit-card";
import { MONTHS } from "src/utils/constants/general";
import {
    BANK_FORM,
    CATEGORY_FORM,
    CREDIT_CARD_FORM,
    GENERAL_FORM,
} from "src/utils/constants/forms";
import { CommonModule } from "@angular/common";
import { DIALOG_DATA } from "@angular/cdk/dialog";
import { CreditCardObjectType } from "src/app/core/types/data/credit-card.types";
import { CategoryState } from "src/app/core/subjects/subjects.category";
import { MatIcon } from "@angular/material/icon";
import { BankState } from "src/app/core/subjects/subjects.bank";

@Component({
    selector: "modal-new-credit-card",
    templateUrl: "./new-credit-card.modal.html",
    styleUrls: ["./new-credit-card.modal.css"],
    standalone: true,
    imports: [
        CommonModule,
        ModalComponent,
        MatFormField,
        FormsModule,
        MatLabel,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatIcon,
    ],
})
export class ModalNewCreditCard extends ModalComponent {
    public creditCardService = inject(CreditCardService);
    public creditCardState = inject(CreditCardState);
    public categoryState = inject(CategoryState);
    public bankState = inject(BankState);

    constructor(@Inject(DIALOG_DATA) public data: CreditCardObjectType) {
        super();
    }

    public months = MONTHS;
    public errorMessage = {
        name: GENERAL_FORM.noName,
        description: GENERAL_FORM.noDescription,
        year: GENERAL_FORM.yearOutOfRange,
        limit: CREDIT_CARD_FORM.invalidLimit,
        day: CREDIT_CARD_FORM.invalidClosingDay,
        due: CREDIT_CARD_FORM.invalidDueDay,
        flag: CREDIT_CARD_FORM.noFlag,
        category: CATEGORY_FORM.noCategory,
        bank: BANK_FORM.noBank,
    };

    creditCardForm = new FormGroup({
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
            validators: [Validators.required],
        }),
        limit: new FormControl<number>(this.data?.limit || 0, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(0)],
        }),
        year: new FormControl<number>(this.data?.year || new Date().getFullYear(), {
            nonNullable: true,
            validators: [Validators.min(2023), Validators.required],
        }),
        month: new FormControl<number>(this.data?.month || new Date().getMonth(), {
            nonNullable: true,
            validators: [Validators.required],
        }),
        day: new FormControl<number>(this.data?.day || 1, {
            validators: [Validators.required, Validators.max(28), Validators.min(1)],
            nonNullable: true,
        }),
        due: new FormControl<number>(this.data?.due || 1, {
            validators: [Validators.required, Validators.max(28), Validators.min(1)],
            nonNullable: true,
        }),
        flag: new FormControl<string | null>(this.data?.flag || null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
        isClosed: new FormControl<boolean>(this.data?.isClosed || false, {
            nonNullable: true,
            validators: [Validators.required],
        }),
        categoryId: new FormControl<string | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
        bank1Id: new FormControl<string | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
    });

    ngOnInit() {
        this.modalState.changeSubmitFooter(this.data ? "edit" : "OK", "cancel");
    }

    handleClose() {
        this.onClose();
    }

    selectedCategory(categoryId: string | null) {
        if (!categoryId) return null;
        const category = this.categoryState.getCategory(categoryId);
        return category || null;
    }

    onUpdate() {
        const dataToUpdate = this.getFormDirtyValues(this.creditCardForm);
        this.creditCardService
            .updateCreditCard({
                ...dataToUpdate,
                id: this.data.id,
            })
            .subscribe({
                next: (cc) => {
                    this.creditCardState.updateCreditCard(cc);
                    this.generalService.successSnackbar(
                        `credit card [${cc.name}] successfully updated`,
                    );
                    this.onClose();
                },
                error: () => {
                    this.generalService.errorSnackbar("error updating credit card");
                },
            });
    }

    onCreate() {
        this.creditCardService
            .createCreditCard({
                ...this.creditCardForm.getRawValue(),
            })
            .subscribe({
                next: (creditCards) => {
                    this.creditCardState.addCreditCard(creditCards);
                    this.generalService.successSnackbar(
                        `credit card [${creditCards.name}] successfully created`,
                    );
                    this.onClose();
                },
                error: () => {
                    this.generalService.errorSnackbar("error creating credit card");
                },
            });
    }

    onSubmit() {
        if (this.creditCardForm.invalid) return;
        if (this.data) this.onUpdate();
        else this.onCreate();
    }
}
