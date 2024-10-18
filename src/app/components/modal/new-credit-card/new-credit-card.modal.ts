import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    inject,
    ViewChild,
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

    months = MONTHS;

    creditCardForm = new FormGroup({
        name: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        description: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        color: new FormControl<string>("#000000", {
            nonNullable: true,
            validators: [Validators.required],
        }),
        limit: new FormControl<number>(0, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(0)],
        }),
        year: new FormControl<number>(new Date().getFullYear(), {
            nonNullable: true,
            validators: [Validators.min(2023), Validators.required],
        }),
        month: new FormControl<MonthType>(MONTHS[new Date().getMonth()], {
            nonNullable: true,
            validators: [Validators.required],
        }),
        day: new FormControl<number>(1, {
            validators: [Validators.required, Validators.max(28), Validators.min(1)],
        }),
        due: new FormControl<number>(1, {
            validators: [Validators.required, Validators.max(28), Validators.min(1)],
        }),
        flag: new FormControl<string | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
        isClosed: new FormControl<boolean>(false),
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

    constructor() {}

    ngOnInit() {
        this.modalState.onSubmitFooter("OK", "cancel");
        this.modalState.changeHeader("new credit card");
    }

    onSubmit() {
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
}
