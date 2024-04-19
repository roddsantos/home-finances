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
import { MonthType } from "src/app/types/general";
import { MONTHS } from "src/utils/constants/general";
import { Bank, Company, CreditCard, TypeBill } from "src/app/types/objects";
import { Dialog } from "@angular/cdk/dialog";
import { BankTemplateNewBill } from "./templates/bank/bank.template.new-bill";
import { TypeBillState } from "src/app/subjects/subjects.type-bills";
import { CommonModule } from "@angular/common";

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
    ],
})
export class ModalNewBill implements OnInit {
    public modalState = inject(ModalState);
    public billState = inject(BillState);
    public tbState = inject(TypeBillState);
    public snack = inject(CustomSnackbarComponent);
    @ViewChild(ModalComponent) modalComponent: any;

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

    errorMessage = {
        name: "you must enter a name",
        description: "you must enter a description",
        total: "you must enter a valid bill value",
    };

    itsBankType =
        this.billForm.value.typebill?.referTo === "betweenBanks" ||
        this.billForm.value.typebill?.referTo === "referToBank";

    onSubmit() {
        console.log("FORM", this.billForm);
    }

    ngOnInit() {
        // this.tbState.typeBill$.subscribe({
        //     next: (tb) =>
        //         this.billForm.patchValue({
        //             typebill: tb,
        //         }),
        // });
    }
}
