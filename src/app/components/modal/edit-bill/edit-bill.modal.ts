import { Component, Inject, inject } from "@angular/core";
import { ModalComponent } from "../modal.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { CustomSnackbarComponent } from "../../custom-snackbar/custom-snackbar.component";
import { BankTemplateEditBill } from "./templates/bank/bank.template.edit-bill";
import { CategoryState } from "src/app/core/subjects/subjects.category";
import { CommonModule } from "@angular/common";
import { CompanyTemplateEditBill } from "./templates/company/company.template.edit-bill";
import { CreditCardTemplateEditBill } from "./templates/credit-card/credit-card.template.edit-bill";
import {
    BOOLEAN_FORM,
    CATEGORY_FORM,
    GENERAL_FORM,
    MONEY_FLOW_FORM,
} from "src/utils/constants/forms";
import { BillService } from "src/app/services/bill.service";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { DIALOG_DATA } from "@angular/cdk/dialog";
import { CardComponent } from "../../card/card.component";
import { ToggleButtonComponent } from "../../toggle-buttons/toggle-buttons.component";
import { CustomTabs } from "../../tabs/tabs.component";
import { EDIT_BILLS_TABS } from "src/utils/constants/bills";
import { CustomTabType } from "src/app/core/types/components/tabs";
import { BillDataObjectType, PaymentTypes } from "src/app/core/types/data/bills.types";
import { BankState } from "src/app/core/subjects/subjects.bank";
import { CreditCardState } from "src/app/core/subjects/subjects.credit-card";

@Component({
    selector: "modal-new-bill",
    templateUrl: "./edit-bill.modal.html",
    styleUrls: ["./edit-bill.modal.css", "../modal.component.css"],
    standalone: true,
    providers: [provideNativeDateAdapter()],
    imports: [
        CommonModule,
        ModalComponent,
        MatInputModule,
        ReactiveFormsModule,
        BankTemplateEditBill,
        CompanyTemplateEditBill,
        CreditCardTemplateEditBill,
        MatSelectModule,
        MatDatepickerModule,
        CardComponent,
        ToggleButtonComponent,
        CustomTabs,
    ],
})
export class ModalEditBill extends ModalComponent {
    public billState = inject(BillState);
    public billService = inject(BillService);
    public bankState = inject(BankState);
    public creditCardState = inject(CreditCardState);
    public categoryState = inject(CategoryState);
    public snack = inject(CustomSnackbarComponent);

    constructor(@Inject(DIALOG_DATA) public data: BillDataObjectType) {
        super();
    }

    public booleanForm = BOOLEAN_FORM;
    public moneyFlowForm = MONEY_FLOW_FORM;
    public billTabs = EDIT_BILLS_TABS;
    public tab = 0;

    public errorMessage = {
        name: GENERAL_FORM.noName,
        description: GENERAL_FORM.noDescription,
        total: GENERAL_FORM.invalidTotal,
        category: CATEGORY_FORM.noCategory,
        year: GENERAL_FORM.yearOutOfRange,
    };

    public billForm = new FormGroup({
        name: new FormControl<string>(this.data.name, {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        description: new FormControl<string>(this.data.description, {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        total: new FormControl<number>(
            { value: this.data.total, disabled: this.data.type !== "money" },
            {
                nonNullable: true,
                validators: [Validators.required, Validators.min(0.01)],
            },
        ),
        totalParcel: new FormControl<number>(
            { value: this.data.totalParcel, disabled: false },
            {
                nonNullable: true,
                validators: [Validators.required, Validators.min(0.01)],
            },
        ),
        settled: new FormControl<boolean>(
            { value: this.data.settled, disabled: this.data.settled },
            { nonNullable: true },
        ),
        due: new FormControl<Date>(
            { value: new Date(this.data.due), disabled: false },
            { nonNullable: true },
        ),
        paid: new FormControl<Date | null>(
            {
                value: this.data.paid ? new Date(this.data.paid) : null,
                disabled: false,
            },
            { nonNullable: false },
        ),
        isPayment: new FormControl<boolean>(
            { value: this.data.isPayment, disabled: this.data.settled },
            { nonNullable: true },
        ),
        isRecurrent: new FormControl<boolean>(
            { value: this.data.isRecurrent, disabled: this.data.settled },
            { nonNullable: true },
        ),
        type: new FormControl<PaymentTypes>(
            { value: this.data.type, disabled: true },
            { nonNullable: true },
        ),
        categoryId: new FormControl<string>(this.data.categoryId, {
            nonNullable: true,
            validators: [Validators.required],
        }),
        companyId: new FormControl<string | null>(this.data.companyId, {
            nonNullable: false,
        }),
        bank1Id: new FormControl<string | null>(
            { value: this.data.bank1Id, disabled: this.data.settled },
            { nonNullable: false },
        ),
        bank2Id: new FormControl<string | null>(
            { value: this.data.bank2Id, disabled: this.data.settled },
            { nonNullable: false },
        ),
        creditCardId: new FormControl<string | null>(
            { value: this.data.creditCardId, disabled: this.data.settled },
            { nonNullable: false },
        ),
        parcels: new FormControl<number>(
            { value: this.data.parcels, disabled: true },
            { nonNullable: true },
        ),
        delta: new FormControl<number>(
            { value: this.data.delta, disabled: this.data.settled },
            { nonNullable: true },
        ),
        taxes: new FormControl<number>(
            { value: this.data.taxes, disabled: this.data.settled },
            { nonNullable: true },
        ),
    });

    ngOnInit() {
        this.modalState.changeFooter({
            type: "submit",
            submitLabel: "update",
            alertLabel: "cancel",
        });
    }

    onChangeTab(event: CustomTabType) {
        this.tab = event.index;
    }

    onSubmit() {
        const dataToUpdate = this.getFormDirtyValues(this.billForm);
        const totalParcel =
            this.data.type === "money"
                ? dataToUpdate["total"]
                : dataToUpdate["totalParcel"];

        const payload = {
            ...dataToUpdate,
            id: this.data.id,
            totalParcel,
        };
        let observer;

        switch (this.data.type) {
            case "money":
                observer = this.billService.updateBillBank(payload);
                break;
            case "creditCard":
                observer = this.billService.updateBillCreditCard(payload);
                break;
            case "companyCredit":
                observer = this.billService.updateBillCompany(payload);
                break;
            default:
                break;
        }

        observer?.subscribe({
            next: ({ banks, creditCard }) => {
                banks.forEach((bank) => this.bankState.updateBank(bank));
                this.creditCardState.updateCreditCard(creditCard);
                this.billService.getBills().subscribe({
                    next: (bills) => {
                        this.billState.setBills(bills);
                    },
                });
                this.generalService.successSnackbar("bill successfully updated");
                this.onClose();
            },
            error: () => {
                this.generalService.errorSnackbar("error updating bill");
            },
        });
    }

    handleClose() {
        this.onClose();
    }
}
