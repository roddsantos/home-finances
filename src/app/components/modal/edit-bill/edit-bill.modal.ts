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
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { Bill, BillData, Category } from "src/app/core/types/objects";
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
import { ServiceBill } from "src/app/services/bill.service";
import { PaymentTypes } from "src/app/core/types/general";
import { MONTHS } from "src/utils/constants/general";
import { MatOption } from "@angular/material/core";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { DIALOG_DATA } from "@angular/cdk/dialog";
import { CardComponent } from "../../card/card.component";
import { ToggleButtonComponent } from "../../toggle-buttons/toggle-buttons.component";
import { CustomTabs } from "../../tabs/tabs.component";
import { EDIT_BILLS_TABS } from "src/utils/constants/bills";
import { CustomTabType } from "src/app/core/types/components/tabs";

@Component({
    selector: "modal-new-bill",
    templateUrl: "./edit-bill.modal.html",
    styleUrls: ["./edit-bill.modal.css", "../modal.component.css"],
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
        CardComponent,
        ToggleButtonComponent,
        CustomTabs,
    ],
})
export class ModalEditBill extends ModalComponent {
    public billState = inject(BillState);
    public billService = inject(ServiceBill);
    public catState = inject(CategoryState);
    public snack = inject(CustomSnackbarComponent);

    constructor(@Inject(DIALOG_DATA) public data: Bill & BillData) {
        super();
    }
    @ViewChild("bankTemplate") bankTemplate: BankTemplateEditBill;
    @ViewChild("companyTemplate") companyTemplate: CompanyTemplateEditBill;
    @ViewChild("ccTemplate") creditCardTemplate: CreditCardTemplateEditBill;
    @ViewChild("type") type: ElementRef;

    public booleanForm = BOOLEAN_FORM;
    public moneyFlowForm = MONEY_FLOW_FORM;
    public billTabs = EDIT_BILLS_TABS;
    public months = MONTHS;
    public tab = 0;
    public inputType: string = "";

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
            { value: 0, disabled: false },
            {
                nonNullable: true,
                validators: [Validators.required, Validators.min(0.01)],
            }
        ),
        settled: new FormControl<boolean>(
            { value: false, disabled: this.data.settled },
            { nonNullable: false }
        ),
        due: new FormControl<Date>(
            { value: new Date(), disabled: this.data.settled },
            { nonNullable: true }
        ),
        paid: new FormControl<Date>(
            {
                value: new Date(),
                disabled: this.data.settled,
            },
            { nonNullable: false }
        ),
        isPayment: new FormControl<boolean>(
            { value: true, disabled: this.data.settled },
            {
                nonNullable: true,
                validators: [Validators.required],
            }
        ),
        isRecurrent: new FormControl<boolean>(
            { value: true, disabled: this.data.settled },
            {
                nonNullable: true,
                validators: [Validators.required],
            }
        ),
        type: new FormControl<PaymentTypes>(
            { value: "money" as PaymentTypes, disabled: true },
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
            name: this.data.name,
            description: this.data.description,
            total: this.data.total,
            settled: this.data.settled,
            due: new Date(this.data.due),
            paid: this.data.paid ? new Date(this.data.paid) : null,
            type: this.data.type as PaymentTypes,
            category: this.data.category,
            isPayment: this.data.isPayment,
            isRecurrent: this.data.isRecurrent,
        });
        if (this.data.settled && this.data.type !== "money")
            this.billForm.get("total")?.disable();
        this.modalState.changeFooter({
            type: "submit",
            submitLabel: "update",
            alertLabel: "cancel",
        });
    }

    errorMessage = {
        name: GENERAL_FORM.noName,
        description: GENERAL_FORM.noDescription,
        total: GENERAL_FORM.invalidTotal,
        category: CATEGORY_FORM.noCategory,
        year: GENERAL_FORM.yearOutOfRange,
    };

    onChangeTab(event: CustomTabType) {
        this.tab = event.index;
    }

    onDisableButton() {
        switch (this.data.type) {
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
        if (!event.value) {
            this.billForm.patchValue({ paid: null });
        } else {
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
            groupId: this.data.groupId,
            isPayment: billFormValue.isPayment,
            isRecurrent: billFormValue.isRecurrent,
            id: this.data.id,
        };
        var observer;

        switch (this.data.type) {
            case "money":
                const bankFormValue = this.bankTemplate.bankForm.getRawValue();
                observer = this.billService.updateBillBank({
                    ...defaultData,
                    bank1Id: bankFormValue.bank1!.id,
                    bank2Id: bankFormValue.bank2?.id,
                    companyId: bankFormValue.company?.id,
                    totalParcel: billFormValue.total!,
                });
                break;
            case "creditCard":
                const creditCardFormValue = this.creditCardTemplate.ccForm.getRawValue();
                observer = this.billService.updateBillCreditCard({
                    ...defaultData,
                    creditCardId: creditCardFormValue.creditCard!.id,
                    companyId: creditCardFormValue.company?.id,
                    parcels: creditCardFormValue.parcels!,
                    parcel: this.data.parcel,
                    totalParcel: this.data.totalParcel,
                    taxes: creditCardFormValue.taxes,
                    delta: creditCardFormValue.delta,
                });
                break;
            case "companyCredit":
                const companyFormValue = this.companyTemplate.compForm.getRawValue();
                observer = this.billService.updateBillCompany({
                    ...defaultData,
                    creditCardId: companyFormValue.creditcard!,
                    companyId: companyFormValue.company!,
                    bank1Id: companyFormValue.bank!,
                    parcels: companyFormValue.parcels!,
                    taxes: companyFormValue.taxes,
                    delta: companyFormValue.delta,
                    totalParcel: this.data.totalParcel,
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

    onChangeType($event: PaymentTypes) {
        this.inputType = $event || "";
    }

    compareCategories(c1: Category, c2: Category): boolean {
        return c1.id === c2.id;
    }
}
