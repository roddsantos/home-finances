import { Component, ElementRef, Inject, inject, ViewChild } from "@angular/core";
import { ModalComponent } from "../modal.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { CustomSnackbarComponent } from "../../custom-snackbar/custom-snackbar.component";
import { ModalState } from "src/app/core/subjects/subjects.modal";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { Category } from "src/app/types/objects";
import { BankTemplateEditBill } from "./templates/bank/bank.template.edit-bill";
import { CategoryState } from "src/app/core/subjects/subjects.category";
import { CommonModule } from "@angular/common";
import { CompanyTemplateEditBill } from "./templates/company/company.template.edit-bill";
import { CreditCardTemplateEditBill } from "./templates/credit-card/credit-card.template.edit-bill";
import {
    NEGATIVE_TOTAL,
    NO_BILL_VALUE,
    NO_CATEGORY,
    NO_DESCRIPTION,
    NO_NAME,
    YEAR_OUT_OF_RANGE,
} from "src/utils/constants/forms";
import { ServiceBill } from "src/app/services/bill.service";
import { PaymentTypes } from "src/app/types/general";
import { MONTHS } from "src/utils/constants/general";
import { MatOption } from "@angular/material/core";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { DIALOG_DATA } from "@angular/cdk/dialog";
import { EditBillModalType } from "src/app/types/modal";

@Component({
    selector: "modal-new-bill",
    templateUrl: "./edit-bill.modal.html",
    styleUrls: ["./edit-bill.modal.css"],
    standalone: true,
    providers: [provideNativeDateAdapter()],
    imports: [
        MatOption,
        CommonModule,
        ModalComponent,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        ReactiveFormsModule,
        MatButtonToggleModule,
        BankTemplateEditBill,
        CompanyTemplateEditBill,
        CreditCardTemplateEditBill,
        MatSelectModule,
        MatDatepickerModule,
        MatCheckboxModule,
    ],
})
export class ModalEditBill {
    public modalState = inject(ModalState);
    public billState = inject(BillState);
    public billService = inject(ServiceBill);
    public catState = inject(CategoryState);
    public snack = inject(CustomSnackbarComponent);

    constructor(@Inject(DIALOG_DATA) public data: EditBillModalType) {}

    @ViewChild(ModalComponent) modalComponent: ModalComponent;
    @ViewChild(BankTemplateEditBill) bankTemplate: BankTemplateEditBill;
    @ViewChild(CompanyTemplateEditBill) companyTemplate: CompanyTemplateEditBill;
    @ViewChild("ccTemplate") creditCardTemplate: CreditCardTemplateEditBill;
    @ViewChild("type") type: ElementRef;

    billForm = new FormGroup({
        name: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        description: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        total: new FormControl<number>(
            { value: 0, disabled: this.data.bill.settled },
            {
                nonNullable: true,
                validators: [Validators.required, Validators.min(0.01)],
            }
        ),
        settled: new FormControl<boolean>(
            { value: true, disabled: this.data.bill.settled },
            { nonNullable: false }
        ),
        due: new FormControl<Date>(
            { value: new Date(), disabled: this.data.bill.settled },
            { nonNullable: true }
        ),
        paid: new FormControl<Date>(
            { value: new Date(), disabled: this.data.bill.settled },
            { nonNullable: false }
        ),
        type: new FormControl<PaymentTypes>(
            { value: "money" as PaymentTypes, disabled: this.data.bill.settled },
            {
                nonNullable: true,
            }
        ),
        category: new FormControl<Category | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
    });

    ngOnInit() {
        this.billForm.patchValue({
            name: this.data.bill.name,
            description: this.data.bill.description,
            total: this.data.bill.total,
            settled: this.data.bill.settled,
            due: new Date(this.data.bill.due),
            paid: this.data.bill.paid ? new Date(this.data.bill.paid) : null,
            type: this.data.bill.type as PaymentTypes,
            category: this.data.bill.category,
        });
        this.modalState.changeFooter({
            type: "submit",
            submit: "update",
            alert: "cancel",
        });
        this.modalState.changeHeader("edit bill");
    }
    months = MONTHS;
    inputType: string = "";
    isInvalid: boolean = true;

    errorMessage = {
        name: NO_NAME,
        description: NO_DESCRIPTION,
        total: NO_BILL_VALUE,
        negativeValue: NEGATIVE_TOTAL,
        category: NO_CATEGORY,
        year: YEAR_OUT_OF_RANGE,
    };

    onDisableButton() {
        switch (this.data.bill.type) {
            case "money":
                return (
                    this.billForm.invalid ||
                    (this.bankTemplate ? this.bankTemplate.bankForm.invalid : false)
                );
            case "companyCredit":
                return (
                    this.billForm.invalid ||
                    (this.companyTemplate ? this.companyTemplate.compForm.invalid : false)
                );
            case "creditCard":
                return (
                    this.billForm.invalid ||
                    (this.creditCardTemplate
                        ? this.creditCardTemplate.ccForm.invalid
                        : false)
                );
            default:
                return false;
        }
    }

    onSetSettled(event: MatSelectChange) {
        if (event.value === "companyCredit") {
            this.billForm.patchValue({ settled: false });
            this.billForm.patchValue({ paid: null });
        } else {
            this.billForm.patchValue({ settled: true });
            this.billForm.patchValue({ paid: new Date() });
        }
    }

    onSubmit() {
        const billFormValue = this.billForm.getRawValue();
        var defaultData = {
            type: billFormValue.type!,
            name: billFormValue.name!,
            categoryId: billFormValue.category!.id,
            description: billFormValue.description!,
            settled: billFormValue.settled!,
            total: billFormValue.total!,
            due: billFormValue.due!,
            paid: billFormValue.paid!,
            groupId: this.data.bill.groupId,
            id: this.data.bill.id,
        };
        var observer;

        switch (this.data.bill.type) {
            case "money":
                const bankFormValue = this.bankTemplate.bankForm.getRawValue();
                observer = this.billService.updateBillBank({
                    ...defaultData,
                    bank1Id: bankFormValue.bank1!.id,
                    bank2Id: bankFormValue.bank2?.id,
                    isPayment: bankFormValue.isPayment!,
                    companyId: bankFormValue.company?.id,
                });
                break;
            case "creditCard":
                const creditCardFormValue = this.creditCardTemplate.ccForm.getRawValue();
                observer = this.billService.updateBillCreditCard({
                    ...defaultData,
                    isRefund: creditCardFormValue.isRefund!,
                    creditCardId: creditCardFormValue.creditCard!.id,
                    companyId: creditCardFormValue.company?.id,
                    parcels: creditCardFormValue.parcels!,
                    parcel: this.data.bill.parcel,
                    totalParcel: this.data.bill.totalParcel,
                    taxes: creditCardFormValue.taxes,
                    delta: creditCardFormValue.delta,
                });
                break;
            case "companyCredit":
                const companyFormValue = this.companyTemplate.compForm.getRawValue();
                observer = this.billService.updateBillCompany({
                    ...defaultData,
                    creditCardId: companyFormValue.creditcard!,
                    companyId: companyFormValue.company!.id,
                    bank1Id: companyFormValue.bank?.id,
                    parcels: companyFormValue.parcels!,
                    taxes: companyFormValue.taxes,
                    delta: companyFormValue.delta,
                    totalParcel: this.data.bill.totalParcel,
                });
                break;
            default:
                break;
        }
        observer?.subscribe({
            next: () => {
                this.billService.getBills().subscribe({
                    next: (bills) => this.billState.setBills(bills),
                });
                this.snack.openSnackBar("bill successfully updated", "success");
                this.modalComponent.onClose();
            },
            error: () => {
                this.snack.openSnackBar("error updating bill", "error");
            },
        });
    }

    onChangeType($event: PaymentTypes) {
        this.inputType = $event || "";
    }

    compareCategories(c1: Category, c2: Category): boolean {
        return c1.id === c2.id;
    }
}
