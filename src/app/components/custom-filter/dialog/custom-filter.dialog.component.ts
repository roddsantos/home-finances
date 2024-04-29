import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { ModalState } from "src/app/subjects/subjects.modal";
import { ModalComponent } from "src/app/components/modal/modal.component";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { AvailableDataFilters, FilterDisplay } from "src/app/types/components";
import { CategoryState } from "src/app/subjects/subjects.category";
import { CommonModule } from "@angular/common";
import { MatSelect, MatSelectChange, MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import {
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatInput, MatInputModule } from "@angular/material/input";
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
import { MatButtonToggle, MatButtonToggleModule } from "@angular/material/button-toggle";
import { BillState } from "src/app/subjects/subjects.bill";
import { Bill, BillData } from "src/app/types/objects";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule, provideNativeDateAdapter } from "@angular/material/core";

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
        MatButtonToggleModule,
        MatDatepickerModule,
        MatNativeDateModule,
    ],
    providers: [provideNativeDateAdapter()],
})
export class DialogCustomList implements OnInit {
    public modalState = inject(ModalState);
    public catState = inject(CategoryState);
    public ccState = inject(CreditCardState);
    public compState = inject(CompanyState);
    public bankState = inject(BankState);
    public filterState = inject(CustomFilterState);
    public billService = inject(ServiceBill);
    public billState = inject(BillState);
    public snack = inject(CustomSnackbarComponent);
    public localStorage = inject(LocalStorageService);

    @ViewChild(ModalComponent) modalComponent: ModalComponent;
    @ViewChild("category") category: MatSelect;
    @ViewChild("creditcard") creditcard: MatSelect;
    @ViewChild("company") company: MatSelect;
    @ViewChild("bank") bank: MatSelect;
    @ViewChild("month") month: MatSelect;
    @ViewChild("year") year: MatSelect;
    @ViewChild("min") min: MatSelect;
    @ViewChild("max") max: MatSelect;
    @ViewChild("startDate") startDate: MatInput;
    @ViewChild("endDate") endDate: MatInput;
    @ViewChild("status") status: MatButtonToggle;

    months = MONTHS;
    catCtrl = new FormControl<string>("");
    ccCrtl = new FormControl<string>("");
    compCtrl = new FormControl<string>("");
    bkCtrl = new FormControl<string>("");
    monthCtrl = new FormControl<string>("");
    yCtrl = new FormControl<number>(new Date().getFullYear(), {
        validators: [Validators.min(2023), Validators.max(2080)],
        nonNullable: true,
    });
    minCtrl = new FormControl<number>(0, { nonNullable: true });
    maxCtrl = new FormControl<number>(0, { nonNullable: true });
    statusCtrl = new FormControl<"all" | "settled" | "pending" | "">("", {
        nonNullable: true,
    });
    rangeDateCtrl = new FormControl<any>("");
    startDateCtrl = new FormControl<Date | null>(null);
    endDateCtrl = new FormControl<Date | null>(null);
    selectedFilters: FilterDisplay[] = [];

    ngOnInit() {
        this.modalState.onSubmitFooter("OK", "cancel");
        this.modalState.changeHeader("add filters");

        this.filterState.filters$.subscribe({
            next: (filters) => (this.selectedFilters = [...filters]),
            error: () => (this.selectedFilters = []),
        });
    }

    addFilter(event: MatSelectChange, identifier: AvailableDataFilters | "type") {
        const filter = event.value;
        const hasFilter = this.selectedFilters.find((f) => f.id === filter.id);
        if (!hasFilter) {
            this.selectedFilters.push({
                id: filter.id,
                identifier,
                name: filter.name,
            });
            this[identifier as AvailableDataFilters | "month"].value = "";
        }
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
            if (hasFilter) {
                if (identifier === hasFilter.identifier)
                    this.snack.openSnackBar("only one " + identifier + " value allowed");
                else if ((hasFilter.name as number) !== value)
                    this.snack.openSnackBar(identifier + " value not allowed");
            } else {
                this.selectedFilters.push({
                    id: value,
                    identifier,
                    name: value,
                });
                this[identifier].value = "";
            }
        }
    }

    addYear(event: any) {
        let value: string | number | null = (event.target as HTMLInputElement).value;
        value = value === "" ? null : parseFloat(value);
        if (value) {
            const hasFilter = this.selectedFilters.find((f) => f.id === value);
            if (!hasFilter) {
                this.selectedFilters.push({
                    id: value,
                    identifier: "year",
                    name: value,
                });
                this.year.value = "";
            }
        }
    }

    addMonth(event: any) {
        const filter = event.value;
        const hasFilter = this.selectedFilters.filter((f) => f.identifier === "month");
        if (hasFilter.length < 2 || !hasFilter.find((f) => f.id === filter.id))
            this.selectedFilters.push({
                id: filter.order,
                identifier: "month",
                name: filter.name,
            });
        this.month.value = "";
    }

    addStatus(event: MatSelectChange) {
        const value = event.value;
        const hasFilter = this.selectedFilters.findIndex(
            (f) => f.identifier === "status"
        );
        if (hasFilter < 0) {
            this.selectedFilters.push({
                id: value,
                identifier: "status",
                name: value,
            });
        } else {
            this.selectedFilters.splice(hasFilter, 1, {
                id: value,
                identifier: "status",
                name: value,
            });
        }
        this.status.value = "";
    }

    addDate(event1: any, event2: any) {
        console.log(event1.value, event2.value);
    }

    removeFilter(index: number) {
        this.selectedFilters.splice(index, 1);
    }

    onSubmit() {
        this.filterState.setFilters([...this.selectedFilters]);
        this.localStorage.setFilters(JSON.stringify(this.selectedFilters));
        this.billService.getBills().subscribe({
            next: (bills) => {
                if (bills.data.length === 0)
                    this.billState.changeStatus("empty", "no bills");
                else this.billState.setBills(bills);
                this.modalComponent.onClose();
            },
            error: () => {
                this.snack.openSnackBar("error fetching bills", "error");
                this.billState.changeStatus("error", "error fetching bills");
            },
        });
    }
}
