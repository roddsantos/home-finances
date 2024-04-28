import { Component, inject, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
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
import { Bill, BillData, TypeBill } from "src/app/types/objects";
import { BankTemplateNewBill } from "./templates/bank/bank.template.new-bill";
import { TypeBillState } from "src/app/subjects/subjects.type-bills";
import { CommonModule } from "@angular/common";
import { CompanyTemplateNewBill } from "./templates/company/company.template.new-bill";
import { CreditCardTemplateNewBill } from "./templates/credit-card/credit-card.template.new-bill";
import { ServiceTemplateNewBill } from "./templates/service/service.template.new-bill";
import {
    NEGATIVE_TOTAL,
    NO_BILL_VALUE,
    NO_DESCRIPTION,
    NO_NAME,
    NO_TYPE_BILL,
    YEAR_OUT_OF_RANGE,
} from "src/utils/constants/forms";
import { ServiceBill } from "src/app/services/bill.service";
import { MonthType, PaymentTypes } from "src/app/types/general";
import { MONTHS } from "src/utils/constants/general";
import { MatOption } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatCheckboxModule } from "@angular/material/checkbox";

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
    ],
})
export class ModalNewBill implements OnInit {
    public modalState = inject(ModalState);
    public billState = inject(BillState);
    public billService = inject(ServiceBill);
    public tbState = inject(TypeBillState);
    public snack = inject(CustomSnackbarComponent);
    @ViewChild(ModalComponent) modalComponent: ModalComponent;
    @ViewChild(BankTemplateNewBill) bankTemplate: BankTemplateNewBill;
    @ViewChild(CompanyTemplateNewBill) companyTemplate: CompanyTemplateNewBill;
    @ViewChild(CreditCardTemplateNewBill) creditCardTemplate: CreditCardTemplateNewBill;
    @ViewChild(ServiceTemplateNewBill) serviceTemplate: ServiceTemplateNewBill;

    @Input() addTemplate!: TemplateRef<any>;

    ngOnInit() {
        this.modalState.changeFooter({
            type: "submit",
            submit: "create",
            alert: "cancel",
            disabled: false,
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
        due: new FormControl<Date>(new Date(), { nonNullable: true }),
        payment: new FormControl<Date>(new Date(), { nonNullable: true }),
        paymentType: new FormControl<PaymentTypes>("money", { nonNullable: true }),
        year: new FormControl<number>(new Date().getFullYear(), {
            nonNullable: true,
            validators: [Validators.min(2023), Validators.max(2090)],
        }),
        month: new FormControl<MonthType>(MONTHS[new Date().getMonth()], {
            nonNullable: true,
            validators: [Validators.required],
        }),
        typebill: new FormControl<TypeBill | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
        isFixed: new FormControl<boolean>(false, { nonNullable: true }),
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
        typebill: NO_TYPE_BILL,
        year: YEAR_OUT_OF_RANGE,
    };

    onSubmit() {
        var defaultData = {
            name: this.billForm.value.name!,
            description: this.billForm.value.description!,
            settled: this.billForm.value.settled!,
            due: this.billForm.value.due!,
            total: this.billForm.value.total!,
            year: this.billForm.value.year!,
            month: this.billForm.value.month!.order,
            typeBillId: this.billForm.value.typebill!.id,
        };
        var observer;
        switch (this.billForm.value.typebill?.referTo) {
            case "banks":
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
            case "company":
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
            case "service":
                observer = this.billService.createBillService({
                    ...defaultData,
                    creditCardId: this.serviceTemplate.serviceForm.value.creditCard?.id,
                    companyId: this.serviceTemplate.serviceForm.value.company!.id,
                    bank1Id: this.serviceTemplate.serviceForm.value.bank?.id,
                    parcels: this.serviceTemplate.serviceForm.value.parcels!,
                    taxes: this.serviceTemplate.serviceForm.value.taxes,
                    delta: this.serviceTemplate.serviceForm.value.delta,
                });
                break;
            default:
                break;
        }
        observer?.subscribe({
            next: () => {
                this.billService.getBills().subscribe({
                    next: (data) =>
                        this.billState.setBills(
                            data as unknown as Array<Bill & BillData>
                        ),
                });
                this.snack.openSnackBar("bill successfully created", "success");
                this.modalComponent.onClose();
            },
            error: () => {
                this.snack.openSnackBar("error creating bill", "error");
            },
        });
    }

    onChangeType($event: TypeBill) {
        this.inputType = $event?.referTo || "";
    }
}
