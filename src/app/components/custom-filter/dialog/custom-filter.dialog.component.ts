import { AvailableDataFilters } from "../../../types/components";
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
import { CustomFilterState } from "../custom-filter.subjects.component";
import { CreditCardState } from "src/app/subjects/subjects.credit-card";
import { CompanyState } from "src/app/subjects/subjects.company";
import { BankState } from "src/app/subjects/subjects.bank";
import { MONTHS } from "src/utils/constants/general";
import { CustomSnackbarComponent } from "../../custom-snackbar/custom-snackbar.component";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { ServiceBill } from "src/app/services/bill.service";

@Component({
    selector: "dialog-custom-filter",
    templateUrl: "./custom-filter.dialog.component.html",
    styleUrls: ["./custom-filter.dialog.component.css"],
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
    public filterState = inject(CustomFilterState);
    public billService = inject(ServiceBill);
    public snack = inject(CustomSnackbarComponent);
    public localStorage = inject(LocalStorageService);

    @ViewChild(ModalComponent) modalComponent: any;
    @ViewChild("typebill") typebill: MatSelect;
    @ViewChild("creditcard") creditcard: MatSelect;
    @ViewChild("company") company: MatSelect;
    @ViewChild("bank") bank: MatSelect;
    @ViewChild("month") month: MatSelect;
    @ViewChild("year") year: MatSelect;
    @ViewChild("min") min: MatSelect;
    @ViewChild("max") max: MatSelect;

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
    minCtrl = new FormControl(0, { nonNullable: true });
    maxCtrl = new FormControl(0, { nonNullable: true });
    selectedFilters: FilterDisplay[] = [];

    ngOnInit() {
        this.modalState.onSubmitFooter("OK", "cancel");
        this.modalState.changeHeader("add filters");

        this.filterState.filters$.subscribe({
            next: (filters) => (this.selectedFilters = [...filters]),
            error: () => (this.selectedFilters = []),
        });
    }

    isData(item: AvailableFilters): item is AvailableDataFilters {
        return (item as AvailableDataFilters) !== undefined;
    }

    addFilter(event: MatSelectChange, identifier: AvailableFilters) {
        const filter = event.value;
        const hasFilter = this.selectedFilters.find((f) => f.id === filter.id);
        if (this.isData(identifier)) {
            this.filterState.datafilters$.subscribe({
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

    addLimit(event: any, identifier: "min" | "max") {
        let value: string | number | null = (event.target as HTMLInputElement).value;
        value = value === "" ? null : parseFloat(value);
        if (value !== null) {
            const hasFilter = this.selectedFilters.find(
                (f) =>
                    f.identifier === identifier ||
                    (identifier === "max" &&
                        f.identifier === "min" &&
                        (f.name as number) > value) ||
                    (identifier === "min" &&
                        f.identifier === "max" &&
                        (f.name as number) < value)
            );
            this.filterState.limitFilter$.subscribe({
                next: (data) => {
                    const hasFilterDefined = data.find(
                        (f) =>
                            f.identifier === identifier ||
                            (identifier === "max" &&
                                f.identifier === "min" &&
                                f.name > value) ||
                            (identifier === "min" &&
                                f.identifier === "max" &&
                                f.name < value)
                    );
                    if (hasFilter) {
                        if (identifier === hasFilter.identifier)
                            this.snack.openSnackBar(
                                "only one " + identifier + " value allowed"
                            );
                        else if ((hasFilter.name as number) !== value)
                            this.snack.openSnackBar(identifier + " value not allowed");
                    } else if (hasFilterDefined) {
                        if (identifier === hasFilterDefined.identifier)
                            this.snack.openSnackBar(
                                "only one " + identifier + " value allowed"
                            );
                        else if ((hasFilterDefined.name as number) !== value)
                            this.snack.openSnackBar(identifier + " value not allowed");
                    } else
                        this.selectedFilters.push({
                            id: value,
                            identifier,
                            name: value,
                        });
                },
            });
            this[identifier].value = "";
        }
    }

    addYear(event: any) {
        let value: string | number | null = (event.target as HTMLInputElement).value;
        value = value === "" ? null : parseFloat(value);
        if (value) {
            const hasFilter = this.selectedFilters.find((f) => f.id === value);
            this.filterState.yearFilter$.subscribe({
                next: (data) => {
                    const hasFilterDefined = data.find((f) => f.id === value);
                    if (!hasFilter && !hasFilterDefined)
                        this.selectedFilters.push({
                            id: value,
                            identifier: "year",
                            name: value,
                        });
                },
            });
            this.year.value = "";
        }
    }

    removeFilter(index: number) {
        this.selectedFilters.splice(index, 1);
    }

    reduceToFilter() {
        return {
            page: 1,
            limit: 10,
        };
    }

    onSubmit() {
        this.filterState.setFilters([...this.selectedFilters]);
        this.localStorage.setFilters(JSON.stringify(this.selectedFilters));
        this.billService.getBills(this.reduceToFilter());
        console.log("CHIPS", this.selectedFilters);
    }
}
