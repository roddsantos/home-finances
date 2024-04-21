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
import { TypeBill } from "src/app/types/objects";
import { BankTemplateNewBill } from "./templates/bank/bank.template.new-bill";
import { TypeBillState } from "src/app/subjects/subjects.type-bills";
import { CommonModule } from "@angular/common";
import { CompanyTemplateNewBill } from "./templates/company/company.template.new-bill";
import { CreditCardTemplateNewBill } from "./templates/credit-card/credit-card.template.new-bill";

@Component({
    selector: "modal-new-bill",
    templateUrl: "./new-bill.modal.html",
    styleUrls: ["./new-bill.modal.css"],
    standalone: true,
    imports: [
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
    ],
})
export class ModalNewBill implements OnInit {
    public modalState = inject(ModalState);
    public billState = inject(BillState);
    public tbState = inject(TypeBillState);
    public snack = inject(CustomSnackbarComponent);
    @ViewChild(ModalComponent) modalComponent: ModalComponent;
    @ViewChild(BankTemplateNewBill) bankTemplate: BankTemplateNewBill;
    @ViewChild(CompanyTemplateNewBill) companyTemplate: CompanyTemplateNewBill;
    @ViewChild(CreditCardTemplateNewBill) creditCardTemplate: CreditCardTemplateNewBill;

    @Input() addTemplate!: TemplateRef<any>;

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
        settled: new FormControl<boolean>(false),
        // parcels: new FormControl<number>(0, { nonNullable: false }),
        // taxes: new FormControl<number>(0, { nonNullable: false }),
        // delta: new FormControl<number>(0, { nonNullable: false }),
        // due: new FormControl<Date>(new Date(), { nonNullable: false }),
        // year: new FormControl<number>(new Date().getFullYear(), {
        //     nonNullable: true,
        //     validators: [Validators.min(2023)],
        // }),
        // month: new FormControl<MonthType>(MONTHS[new Date().getMonth()], {
        //     nonNullable: true,
        // }),
        typebill: new FormControl<TypeBill | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
        // company: new FormControl<Company | null>(null, { nonNullable: false }),
        // creditcard: new FormControl<CreditCard | null>(null, { nonNullable: false }),
        // bank1: new FormControl<Bank | null>(null, { nonNullable: false }),
        // bank2: new FormControl<Bank | null>(null, { nonNullable: false }),
    });

    inputType: string = "";

    constructor() {
        switch (this.billForm.value.typebill?.referTo) {
            case "banks":
                this.modalState.setDisableButton(
                    this.billForm.invalid || this.bankTemplate.bankForm.invalid
                );
                break;
            case "creditCard":
                this.modalState.setDisableButton(
                    this.billForm.invalid || this.creditCardTemplate.ccForm.invalid
                );
                break;
            case "company":
                this.modalState.setDisableButton(
                    this.billForm.invalid || this.companyTemplate.compForm.invalid
                );
                break;
            // case "service":
            //     this.modalState.setDisableButton(
            //         this.billForm.invalid || this.bankTemplate.bankForm.invalid
            //     );
            //     break;
            default:
                break;
        }
    }

    errorMessage = {
        name: "you must enter a name",
        description: "you must enter a description",
        total: "you must enter a valid bill value",
    };

    onSubmit() {}

    onChangeType($event: TypeBill) {
        this.inputType = $event.referTo;
    }

    ngOnInit() {}
}
