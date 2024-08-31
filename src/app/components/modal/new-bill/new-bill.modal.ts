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
import { BillState } from "src/app/subjects/subjects.bill";
import { CustomSnackbarComponent } from "../../custom-snackbar/custom-snackbar.component";
import { ModalState } from "src/app/subjects/subjects.modal";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { Category } from "src/app/types/objects";
import { BankTemplateNewBill } from "./templates/bank/bank.template.new-bill";
import { CategoryState } from "src/app/subjects/subjects.category";
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
import { MonthType, PaymentTypes, RequiredKeys } from "src/app/types/general";
import { MONTHS } from "src/utils/constants/general";
import { MatOption } from "@angular/material/core";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { BillObject } from "src/app/types/services";
import { TypeTemplate } from "./templates/type/type.template.new-bill";

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
    @ViewChild(BankTemplateNewBill) bankTemplate: BankTemplateNewBill;
    @ViewChild(CompanyTemplateNewBill) companyTemplate: CompanyTemplateNewBill;
    @ViewChild(CreditCardTemplateNewBill) creditCardTemplate: CreditCardTemplateNewBill;
    @ViewChild(ServiceTemplateNewBill) serviceTemplate: ServiceTemplateNewBill;

    step: number = 1;

    ngOnInit() {
        this.modalState.changeFooter({
            type: "submit",
            submit: "create",
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
        settled: new FormControl<boolean>(true, { nonNullable: false }),
        due: new FormControl<Date>(new Date(), { nonNullable: false }),
        paid: new FormControl<Date>(new Date(), { nonNullable: false }),
        type: new FormControl<PaymentTypes>("money", { nonNullable: true }),
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

    onDisableButton() {
        console.log("KKKKKKKKKK", this.bankTemplate);
        switch (this.billForm.value.type) {
            case "money":
                return this.billForm.invalid || this.bankTemplate.bankForm.invalid;
            case "companyCredit": {
                return this.billForm.invalid || this.companyTemplate.compForm.invalid;
            }
            case "creditCard":
                return this.billForm.invalid || this.creditCardTemplate.ccForm.invalid;
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
            year: this.billForm.value.year!,
            month: this.billForm.value.month!.order,
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
}
