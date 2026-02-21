import { Component, inject } from "@angular/core";
import { ModalComponent } from "../modal.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { BankTemplateNewBill } from "./templates/bank/bank.template.new-bill";
import { CategoryState } from "src/app/core/subjects/subjects.category";
import { CommonModule } from "@angular/common";
import { CompanyTemplateNewBill } from "./templates/company/company.template.new-bill";
import { CreditCardTemplateNewBill } from "./templates/credit-card/credit-card.template.new-bill";
import { BillService } from "src/app/services/bill.service";
import { MONTHS } from "src/utils/constants/general";
import { provideNativeDateAdapter } from "@angular/material/core";
import { TypeTemplate } from "./templates/type/type.template.new-bill";
import { InfoTemplate } from "./templates/info/info.template.new-bill";
import { ConfigTemplate } from "./templates/config/config.template.new-bill";
import { BillCreateType, PaymentTypes } from "src/app/core/types/data/bills.types";
import { BankState } from "src/app/core/subjects/subjects.bank";
import { CreditCardState } from "src/app/core/subjects/subjects.credit-card";

@Component({
    selector: "modal-new-bill",
    templateUrl: "./new-bill.modal.html",
    styleUrls: ["./new-bill.modal.css"],
    standalone: true,
    providers: [provideNativeDateAdapter()],
    imports: [
        CommonModule,
        ModalComponent,
        ReactiveFormsModule,
        BankTemplateNewBill,
        CompanyTemplateNewBill,
        CreditCardTemplateNewBill,
        TypeTemplate,
        InfoTemplate,
        ConfigTemplate,
    ],
})
export class ModalNewBill extends ModalComponent {
    constructor() {
        super();
    }
    public billState = inject(BillState);
    public billService = inject(BillService);
    public bankState = inject(BankState);
    public creditCardState = inject(CreditCardState);
    public catState = inject(CategoryState);

    public step: number = 1;
    public months = MONTHS;

    ngOnInit() {
        this.modalState.changeFooter({
            type: "submit",
            submitLabel: "advance",
            alertLabel: "cancel",
        });
    }

    public billForm = new FormGroup({
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
        totalParcel: new FormControl<number>(0, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(0.01)],
        }),
        settled: new FormControl<boolean>(true, { nonNullable: true }),
        parcels: new FormControl<number>(1, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(1)],
        }),
        due: new FormControl<Date>(new Date(), { nonNullable: true }),
        paid: new FormControl<Date | null>(null, { nonNullable: false }),
        type: new FormControl<PaymentTypes>("money", { nonNullable: true }),
        categoryId: new FormControl<string | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
        bank1Id: new FormControl<string | null>(null, {
            nonNullable: false,
            validators: [Validators.required],
        }),
        bank2Id: new FormControl<string | null>(null, { nonNullable: false }),
        isPayment: new FormControl<boolean>(true, {
            nonNullable: true,
        }),
        companyId: new FormControl<string | null>(null, {
            nonNullable: false,
        }),
        creditCardId: new FormControl<string | null>(null, {
            nonNullable: false,
        }),
        taxes: new FormControl<number>(0, { nonNullable: true }),
        delta: new FormControl<number>(0, { nonNullable: true }),
        isRecurrent: new FormControl<boolean>(false, { nonNullable: true }),
    });

    setType(type: PaymentTypes) {
        if (type === "companyCredit") this.billForm.controls["settled"].patchValue(false);
        this.billForm.controls["type"].setValue(type);
    }

    onDisableButton() {
        const formErrors = this.billForm.controls;
        switch (this.step) {
            case 1:
                return !Boolean(this.billForm.get("type")?.value);
            case 2:
                return (
                    Boolean(this.billForm.get("name")?.errors) ||
                    Boolean(this.billForm.get("description")?.errors) ||
                    Boolean(this.billForm.get("categoryId")?.errors) ||
                    (this.billForm.get("type")!.value === "money" &&
                        Boolean(this.billForm.get("total")!.errors))
                );
            case 3:
                return this.billForm.value.type === "money"
                    ? !Boolean(this.billForm.get("bank1Id")?.value) ||
                          this.billForm.value.bank1Id === this.billForm.value.bank2Id
                    : this.billForm.value.type === "companyCredit"
                      ? !Boolean(this.billForm.get("companyId")?.value) ||
                        Boolean(formErrors.parcels.errors) ||
                        (Boolean(this.billForm.get("bank1Id")?.value) &&
                            Boolean(this.billForm.get("creditCardId")?.value)) ||
                        (!Boolean(this.billForm.get("bank1Id")?.value) &&
                            !Boolean(this.billForm.get("creditCardId")?.value))
                      : !Boolean(this.billForm.value.creditCardId) ||
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

    onNextStep() {
        this.step = this.step + 1;
        this.modalState.changeFooter({
            type: "submit",
            submitLabel: this.step === 4 ? "create" : "advance",
            alertLabel: this.step === 1 ? "cancel" : "back",
        });
    }

    onPreviousStep() {
        this.step = this.step - 1;
        this.modalState.changeFooter({
            type: "submit",
            submitLabel: this.step === 4 ? "create" : "advance",
            alertLabel: this.step === 1 ? "cancel" : "back",
        });
    }

    onSubmit() {
        const defaultData = this.billForm.getRawValue();

        let observer;
        switch (this.billForm.value.type) {
            case "money":
                observer = this.billService.createBillBank({
                    ...defaultData,
                    creditCardId: null,
                    categoryId: defaultData.categoryId!,
                });
                break;
            case "creditCard":
                observer = this.billService.createBillCreditCard({
                    ...defaultData,
                    categoryId: defaultData.categoryId!,
                });
                break;
            case "companyCredit":
                const totalParcel = +defaultData.totalParcel;
                const parcels = +defaultData.parcels;
                const delta = +defaultData.delta;

                observer = this.billService.createBillCompany({
                    ...defaultData,
                    categoryId: defaultData.categoryId!,
                    total: totalParcel * parcels,
                    totalParcel,
                    parcels,
                    delta,
                });
                break;
            default:
                break;
        }
        observer?.subscribe({
            next: ({ bill, banks, creditCard }) => {
                if (banks) {
                    banks.forEach((bank) => this.bankState.updateBank(bank));
                }
                if (creditCard) {
                    this.creditCardState.updateCreditCard(creditCard);
                }
                this.billService.getBills().subscribe({
                    next: (bills) => this.billState.setBills(bills),
                });
                this.generalService.successSnackbar(
                    `bill [${bill?.name}] successfully created`,
                );
                this.handleClose();
            },
            error: () => {
                this.generalService.errorSnackbar("error creating bill");
            },
        });
    }

    handleClose() {
        this.onClose();
    }
}
