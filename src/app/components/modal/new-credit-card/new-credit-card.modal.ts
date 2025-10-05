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
import { CustomSnackbarComponent } from "../../custom-snackbar/custom-snackbar.component";
import { ModalState } from "src/app/core/subjects/subjects.modal";
import { MatSelectModule } from "@angular/material/select";
import { CreditCardObject } from "src/app/core/types/services";
import { CreditCard } from "src/app/core/types/objects";
import { MonthType } from "src/app/core/types/general";
import { ServiceCreditCard } from "src/app/services/credit-card.service";
import { CreditCardState } from "src/app/core/subjects/subjects.credit-card";
import { MONTHS } from "src/utils/constants/general";
import { NO_DESCRIPTION, NO_NAME } from "src/utils/constants/forms";
import { CommonModule } from "@angular/common";
import { DIALOG_DATA } from "@angular/cdk/dialog";
import { EditCreditCardModalType } from "src/app/core/types/modal";
import { mergeMap } from "rxjs";

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
    ],
})
export class ModalNewCreditCard implements OnInit {
    public modalState = inject(ModalState);
    public ccApi = inject(ServiceCreditCard);
    public ccState = inject(CreditCardState);
    public snack = inject(CustomSnackbarComponent);
    @ViewChild(ModalComponent) modalComponent: any;

    constructor(@Inject(DIALOG_DATA) public data: CreditCard) {}

    months = MONTHS;

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
        month: new FormControl<MonthType>(
            this.data?.month ? MONTHS[this.data.month] : MONTHS[new Date().getMonth()],
            {
                nonNullable: true,
                validators: [Validators.required],
            }
        ),
        day: new FormControl<number>(this.data?.day || 1, {
            validators: [Validators.required, Validators.max(28), Validators.min(1)],
        }),
        due: new FormControl<number>(this.data?.due || 1, {
            validators: [Validators.required, Validators.max(28), Validators.min(1)],
        }),
        flag: new FormControl<string | null>(this.data?.flag || null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
        isClosed: new FormControl<boolean>(this.data?.isClosed || false),
    });

    errorMessage = {
        name: NO_NAME,
        description: NO_DESCRIPTION,
        savings: "you must enter the savings",
        limit: "limit must be greater than zero",
        year: "year should be between 2023 asn 2090",
        day: "closing day needs to be a valid number",
        due: "due day needs to be a valid number",
        flag: "flag must be picked",
    };
    @Output() submit = new EventEmitter<String>();
    @Output() onClose = new EventEmitter<void>();

    ngOnInit() {
        this.modalState.changeSubmitFooter(this.data ? "edit" : "OK", "cancel");
        this.modalState.changeHeader(this.data ? "edit credit card" : "new credit card");
    }

    onUpdate() {
        if (!this.creditCardForm.invalid) {
            this.ccApi
                .updateCreditCard({
                    ...(this.creditCardForm.value as Omit<CreditCardObject, "month">),
                    month: this.creditCardForm.value.month!.order,
                    id: this.data.id,
                })
                .pipe(mergeMap(() => this.ccApi.getCreditCards({})))
                .subscribe({
                    next: (cc) => {
                        this.ccState.setCreditCards(cc as CreditCard[]);
                        this.ccState.changeStatus(
                            (cc as CreditCard[]).length === 0 ? "empty" : "none",
                            "no credit cards"
                        );
                        this.snack.openSnackBar(
                            "credit card successfully updated",
                            "success"
                        );
                        this.modalComponent.onClose();
                    },
                    error: () => {
                        this.snack.openSnackBar("error updating credit card", "error");
                    },
                });
        }
    }

    onCreate() {
        if (!this.creditCardForm.invalid) {
            this.ccApi
                .createCreditCard({
                    ...this.creditCardForm.value,
                    month: this.creditCardForm.value.month!.order,
                } as CreditCardObject)
                .subscribe({
                    next: (data) => {
                        this.ccState.addCreditCard(data as CreditCard);
                        this.snack.openSnackBar(
                            "credit card successfully created",
                            "success"
                        );
                        this.modalComponent.onClose();
                    },
                    error: () => {
                        this.snack.openSnackBar("error creating credit card", "error");
                    },
                });
        } else this.onClose.emit();
    }

    onSubmit() {
        if (this.data) this.onUpdate();
        else this.onCreate();
    }
}
