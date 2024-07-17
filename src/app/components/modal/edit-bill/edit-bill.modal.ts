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
import { BillState } from "src/app/subjects/subjects.bill";
import { CustomSnackbarComponent } from "../../custom-snackbar/custom-snackbar.component";
import { ModalState } from "src/app/subjects/subjects.modal";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { Category } from "src/app/types/objects";
import { BankTemplateEditBill } from "./templates/bank/bank.template.edit-bill";
import { CategoryState } from "src/app/subjects/subjects.category";
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
        isFixed: new FormControl<boolean>(false, { nonNullable: true }),
    });

    ngOnInit() {
        this.billForm.patchValue({
            name: this.data.bill.name,
            description: this.data.bill.description,
            total: this.data.bill.total,
            settled: this.data.bill.settled,
            due: new Date(this.data.bill.due),
            paid: new Date(this.data.bill.paid),
            type: this.data.bill.type as PaymentTypes,
            category: this.data.bill.category,
            isFixed: false,
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
        switch (this.billForm.value.type) {
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
                    bank1Id: this.bankTemplate.bankForm.value.bank1!.id,
                    bank2Id: this.bankTemplate.bankForm.value.bank2?.id,
                    isPayment: this.bankTemplate.bankForm.value.isPayment!,
                });
                break;
            case "creditCard":
                observer = this.billService.createBillCreditCard({
                    ...defaultData,
                    isRefund: this.creditCardTemplate.ccForm.value.isRefund!,
                    creditCardId: this.creditCardTemplate.ccForm.value.creditCard!.id,
                    companyId: this.creditCardTemplate.ccForm.value.company?.id,
                    parcels: this.creditCardTemplate.ccForm.value.parcels!,
                    taxes: this.creditCardTemplate.ccForm.value.taxes,
                    delta: this.creditCardTemplate.ccForm.value.delta,
                });
                break;
            case "companyCredit":
                observer = this.billService.createBillCompany({
                    ...defaultData,
                    creditCardId: this.companyTemplate.compForm.value.creditcard?.id,
                    companyId: this.companyTemplate.compForm.value.company!.id,
                    bank1Id: this.companyTemplate.compForm.value.bank?.id,
                    parcels: this.companyTemplate.compForm.value.parcels!,
                    taxes: this.companyTemplate.compForm.value.taxes,
                    delta: this.companyTemplate.compForm.value.delta,
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

    compareCategories(c1: Category, c2: Category): boolean {
        return c1.id === c2.id;
    }
}
