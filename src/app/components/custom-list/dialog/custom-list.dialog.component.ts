import { AvailableDataFilters } from "./../../../types/components";
import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { ModalState } from "src/app/subjects/subjects.modal";
import { ModalComponent } from "src/app/components/modal/modal.component";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { AvailableFilters, FilterDisplay } from "src/app/types/components";
import { TypeBillState } from "src/app/subjects/subjects.type-bills";
import { CommonModule } from "@angular/common";
import { MatSelect, MatSelectChange, MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import {
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButton } from "@angular/material/button";
import { CustomListState } from "../custom-list.subjects.component";
import { CreditCardState } from "src/app/subjects/subjects.credit-card";
import { CompanyState } from "src/app/subjects/subjects.company";
import { BankState } from "src/app/subjects/subjects.bank";
import { MONTHS } from "src/utils/constants/general";

@Component({
    selector: "dialog-custom-list",
    templateUrl: "./custom-list.dialog.component.html",
    styleUrls: ["./custom-list.dialog.component.css"],
    standalone: true,
    imports: [
        CommonModule,
        MatInputModule,
        MatButton,
        ModalComponent,
        MatSelectModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
    ],
})
export class DialogCustomList implements OnInit {
    public modalState = inject(ModalState);
    public tbState = inject(TypeBillState);
    public ccState = inject(CreditCardState);
    public compState = inject(CompanyState);
    public bankState = inject(BankState);
    public clState = inject(CustomListState);
    @ViewChild(ModalComponent) modalComponent: any;
    @ViewChild("typebill") typebill: MatSelect;
    @ViewChild("creditcard") creditcard: MatSelect;
    @ViewChild("company") company: MatSelect;
    @ViewChild("bank") bank: MatSelect;
    @ViewChild("month") month: MatSelect;
    @ViewChild("year") year: MatSelect;

    months = MONTHS;
    tbCtrl = new FormControl("");
    ccCrtl = new FormControl("");
    cCtrl = new FormControl("");
    bkCtrl = new FormControl("");
    monthCtrl = new FormControl("");
    yCtrl = new FormControl(new Date().getFullYear(), {
        validators: [Validators.min(2023), Validators.max(2080)],
        nonNullable: true,
    });
    selectedFilters: FilterDisplay[] = [];

    ngOnInit() {
        this.modalState.onSubmitFooter("OK", "cancel");
        this.modalState.disableButton();
        this.modalState.changeHeader("new credit card");
    }

    isData(item: AvailableFilters): item is AvailableDataFilters {
        return (item as AvailableDataFilters) !== undefined;
    }

    addFilter(event: MatSelectChange, identifier: AvailableFilters) {
        const filter = event.value;
        const hasFilter = this.selectedFilters.find((f) => f.id === filter.id);
        if (this.isData(identifier)) {
            this.clState.datafilters$.subscribe({
                next: (data) => {
                    const hasFilterDefined = data.find((f) => f.id === filter.id);
                    if (!hasFilter && !hasFilterDefined)
                        this.selectedFilters.push({
                            id: filter.id,
                            identifier,
                            name: filter.name,
                        });
                },
            });
        } else {
            const hasFilter = this.selectedFilters.find(
                (f) => f.id === (identifier === "month" ? filter.order : filter)
            );
            if (!hasFilter)
                this.selectedFilters.push({
                    id: identifier === "month" ? filter.order : filter,
                    identifier,
                    name: identifier === "month" ? filter.name : filter,
                });
        }
        this[identifier as AvailableDataFilters | "month"].value = "";
    }

    addYear() {
        if (this.yCtrl.valid) {
            const hasFilter = this.selectedFilters.find((f) => f.id === this.yCtrl.value);
            this.clState.yearFilter$.subscribe({
                next: (data) => {
                    const hasFilterDefined = data.find((f) => f.id === this.yCtrl.value);
                    if (!hasFilter && !hasFilterDefined)
                        this.selectedFilters.push({
                            id: this.yCtrl.value,
                            identifier: "year",
                            name: this.yCtrl.value,
                        });
                },
            });
            this.year.value = "";
        }
    }

    removeFilter(index: number) {
        this.selectedFilters.splice(index, 1);
    }

    onSubmit() {
        console.log("CHIPS", this.selectedFilters);
    }
}
