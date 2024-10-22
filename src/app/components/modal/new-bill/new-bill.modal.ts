import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    ViewChild,
} from "@angular/core";
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
import { Bank, Category, Company, CreditCard } from "src/app/core/types/objects";
import { BankTemplateNewBill } from "./templates/bank/bank.template.new-bill";
import { CategoryState } from "src/app/core/subjects/subjects.category";
import { CommonModule } from "@angular/common";
import { CompanyTemplateNewBill } from "./templates/company/company.template.new-bill";
import { CreditCardTemplateNewBill } from "./templates/credit-card/credit-card.template.new-bill";
import { ServiceTemplateNewBill } from "./templates/service/service.template.new-bill";
import {
    NEGATIVE_TOTAL,
    NO_BILL_VALUE,
    NO_CATEGORY,
    NO_DESCRIPTION,
    NO_NAME,
    YEAR_OUT_OF_RANGE,
} from "src/utils/constants/forms";
import { ServiceBill } from "src/app/services/bill.service";
import { MonthType, PaymentTypes, RequiredKeys } from "src/app/core/types/general";
import { MONTHS } from "src/utils/constants/general";
import { MatOption } from "@angular/material/core";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { BillObject } from "src/app/core/types/services";
import { TypeTemplate } from "./templates/type/type.template.new-bill";
import { InfoTemplate } from "./templates/info/info.template.new-bill";
import { ErrorsBillForm, InfoBillForm } from "src/app/core/types/forms";
import { ConfigTemplate } from "./templates/config/config.template.new-bill";

@Component({
    selector: "modal-new-bill",
    templateUrl: "./new-bill.modal.html",
    styleUrls: ["./new-bill.modal.css"],
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
        BankTemplateNewBill,
        CompanyTemplateNewBill,
        CreditCardTemplateNewBill,
        ServiceTemplateNewBill,
        MatSelectModule,
        MatDatepickerModule,
        MatCheckboxModule,
        TypeTemplate,
        InfoTemplate,
        ConfigTemplate,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalNewBill implements OnInit {
    public modalState = inject(ModalState);
    public billState = inject(BillState);
    public billService = inject(ServiceBill);
    public catState = inject(CategoryState);
    public snack = inject(CustomSnackbarComponent);
    @ViewChild(ModalComponent) modalComponent: ModalComponent;

    step: number = 1;

    ngOnInit() {
        this.modalState.changeFooter({
            type: "submit",
            submit: "advance",
            alert: "cancel",
        });
    }

    billForm = new FormGroup({
        name: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        description: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        total: new FormControl<number>(0, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(0.01)],
        }),
        settled: new FormControl<boolean>(true, { nonNullable: true }),
        due: new FormControl<Date>(new Date(), { nonNullable: false }),
        paid: new FormControl<Date | null>(null, { nonNullable: false }),
        type: new FormControl<PaymentTypes | null>(null, { nonNullable: false }),
        year: new FormControl<number>(new Date().getFullYear(), {
            nonNullable: true,
            validators: [Validators.min(2023), Validators.max(2090)],
        }),
        month: new FormControl<MonthType>(MONTHS[new Date().getMonth()], {
            nonNullable: true,
            validators: [Validators.required],
        }),
        category: new FormControl<Category | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
        bank1: new FormControl<Bank | null>(null, {
            nonNullable: false,
            validators: [Validators.required],
        }),
        bank2: new FormControl<Bank | null>(null, { nonNullable: false }),
        isPayment: new FormControl<boolean>(true, {
            nonNullable: true,
        }),
        company: new FormControl<Company | null>(null, {
            nonNullable: false,
        }),
        creditcard: new FormControl<CreditCard | null>(null, {
            nonNullable: false,
        }),
        taxes: new FormControl<number>(0, { nonNullable: true }),
        parcels: new FormControl<number>(1, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(1)],
        }),
        delta: new FormControl<number>(0, { nonNullable: true }),
        isRefund: new FormControl<boolean>(false, { nonNullable: true }),
    });

    months = MONTHS;
    inputType: string = "";
    isInvalid: boolean = true;

    constructor() {}

    errorMessage = {
        name: NO_NAME,
        description: NO_DESCRIPTION,
        total: NO_BILL_VALUE,
        negativeValue: NEGATIVE_TOTAL,
        category: NO_CATEGORY,
        year: YEAR_OUT_OF_RANGE,
    };

    getInfoForm() {
        return {
            name: this.billForm.get("name")?.value || "",
            description: this.billForm.get("description")?.value || "",
            total: this.billForm.get("total")?.value || 0,
            category: this.billForm.get("category")?.value || null,
        };
    }

    getErrorInfoForm() {
        return {
            name: this.billForm.controls.name.errors,
            description: this.billForm.controls.description.errors,
            total: this.billForm.controls.total.errors,
            category: this.billForm.controls.category.errors,
        };
    }

    getBankForm() {
        return {
            bank1: this.billForm.get("bank1")?.value || null,
            bank2: this.billForm.get("bank2")?.value || null,
            isPayment: this.billForm.get("isPayment")!.value,
            company: this.billForm.get("company")?.value || null,
        };
    }

    getErrorBankForm() {
        return {
            bank1: this.billForm.controls.bank1.errors,
            bank2: this.billForm.controls.bank2.errors,
            isPayment: this.billForm.controls.isPayment.errors,
            company: this.billForm.controls.company.errors,
        };
    }

    getCompanyForm() {
        return {
            company: this.billForm.get("company")?.value || null,
            bank1: this.billForm.get("bank1")?.value || null,
            creditcard: this.billForm.get("creditcard")?.value || null,
            taxes: this.billForm.get("taxes")?.value || 0,
            parcels: this.billForm.get("parcels")?.value || 0,
            delta: this.billForm.get("delta")?.value || 0,
        };
    }

    getErrorCompanyForm() {
        return {
            company: this.billForm.controls.company.errors,
            bank1: this.billForm.controls.bank1.errors,
            creditcard: this.billForm.controls.creditcard.errors,
            taxes: this.billForm.controls.taxes.errors,
            parcels: this.billForm.controls.parcels.errors,
            delta: this.billForm.controls.delta.errors,
        };
    }

    getCreditCardForm() {
        return {
            company: this.billForm.get("company")?.value || null,
            bank1: this.billForm.get("isRefund")!.value,
            creditcard: this.billForm.get("creditcard")?.value || null,
            taxes: this.billForm.get("taxes")?.value || 0,
            parcels: this.billForm.get("parcels")?.value || 0,
            delta: this.billForm.get("delta")?.value || 0,
        };
    }

    getErrorCreditCardForm() {
        return {
            company: this.billForm.controls.company.errors,
            isRefund: this.billForm.controls.isRefund.errors,
            creditcard: this.billForm.controls.creditcard.errors,
            taxes: this.billForm.controls.taxes.errors,
            parcels: this.billForm.controls.parcels.errors,
            delta: this.billForm.controls.delta.errors,
        };
    }

    getConfigForm() {
        return {
            isPayment: this.billForm.get("isPayment")!.value,
            isRefund: this.billForm.get("isRefund")!.value,
            settled: this.billForm.get("settled")!.value,
            due: this.billForm.get("due")!.value,
            paid: this.billForm.get("paid")?.value || null,
            type: this.billForm.get("type")!.value!,
        };
    }

    onDisableButton() {
        const formErrors = this.billForm.controls;
        switch (this.step) {
            case 1:
                return !Boolean(this.billForm.get("type")?.value);
            case 2:
                return (
                    Boolean(formErrors.name.errors) ||
                    Boolean(formErrors.category.errors) ||
                    Boolean(formErrors.description.errors) ||
                    Boolean(formErrors.total.errors)
                );
            case 3:
                return this.billForm.value.type === "money"
                    ? !Boolean(this.billForm.get("bank1")?.value) ||
                          this.billForm.value.bank1?.id === this.billForm.value.bank2?.id
                    : this.billForm.value.type === "companyCredit"
                    ? !Boolean(this.billForm.get("bank1")?.value) ||
                      Boolean(formErrors.parcels.errors) ||
                      (Boolean(this.billForm.get("bank1")?.value) &&
                          Boolean(this.billForm.get("creditcard")?.value))
                    : !Boolean(this.billForm.value.creditcard) ||
                      Boolean(formErrors.parcels.errors);
            case 4:
                return (
                    Boolean(this.billForm.get("settled")?.value) &&
                    !Boolean(this.billForm.get("paid")?.value)
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

    onNextStep() {
        this.step = this.step + 1;
        this.modalState.changeFooter({
            type: "submit",
            submit: this.step === 4 ? "create" : "advance",
            alert: this.step === 1 ? "cancel" : "back",
        });
    }

    onPreviousStep() {
        this.step = this.step - 1;
        this.modalState.changeFooter({
            type: "submit",
            submit: this.step === 4 ? "create" : "advance",
            alert: this.step === 1 ? "cancel" : "back",
        });
    }

    onPatch(e: any) {
        this.billForm.patchValue(e);
    }

    onSubmit() {
        var defaultData = {
            name: this.billForm.value.name!,
            description: this.billForm.value.description!,
            settled: this.billForm.value.settled!,
            due: this.billForm.value.due!,
            paid: this.billForm.value.paid!,
            total: this.billForm.value.total!,
            type: this.billForm.value.type!,
            categoryId: this.billForm.value.category!.id,
        };
        var observer;
        switch (this.billForm.value.type) {
            case "money":
                observer = this.billService.createBillBank({
                    ...defaultData,
                    bank1Id: this.billForm.value.bank1!.id,
                    bank2Id: this.billForm.value.bank2?.id,
                    companyId: this.billForm.value.company?.id,
                    isPayment: this.billForm.value.isPayment!,
                });
                break;
            case "creditCard":
                observer = this.billService.createBillCreditCard({
                    ...defaultData,
                    isRefund: this.billForm.value.isRefund!,
                    creditCardId: this.billForm.value.creditcard!.id,
                    companyId: this.billForm.value.company?.id,
                    parcels: this.billForm.value.parcels!,
                    taxes: this.billForm.value.taxes,
                    delta: this.billForm.value.delta,
                });
                break;
            case "companyCredit":
                observer = this.billService.createBillCompany({
                    ...defaultData,
                    creditCardId: this.billForm.value.creditcard?.id,
                    companyId: this.billForm.value.company!.id,
                    bank1Id: this.billForm.value.bank1?.id,
                    parcels: this.billForm.value.parcels!,
                    taxes: this.billForm.value.taxes,
                    delta: this.billForm.value.delta,
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
                this.snack.openSnackBar("bill successfully created", "success");
                this.modalComponent.onClose();
            },
            error: () => {
                this.snack.openSnackBar("error creating bill", "error");
            },
        });
    }

    onChangeType($event: PaymentTypes) {
        this.inputType = $event || "";
    }
}
