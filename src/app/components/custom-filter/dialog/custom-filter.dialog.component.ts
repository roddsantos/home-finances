import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { ModalState } from "src/app/core/subjects/subjects.modal";
import { ModalComponent } from "src/app/components/modal/modal.component";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { AvailableDataFilters, FilterDisplay } from "src/app/core/types/components";
import { CategoryState } from "src/app/core/subjects/subjects.category";
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
import { CustomFilterState } from "../custom-filter.subjects.component";
import { CreditCardState } from "src/app/core/subjects/subjects.credit-card";
import { CompanyState } from "src/app/core/subjects/subjects.company";
import { BankState } from "src/app/core/subjects/subjects.bank";
import { MONTHS } from "src/utils/constants/general";
import { ServiceBill } from "src/app/services/bill.service";
import { MatButtonToggle, MatButtonToggleModule } from "@angular/material/button-toggle";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule, provideNativeDateAdapter } from "@angular/material/core";
import { Subscription } from "rxjs";
import { CustonButton } from "../../button/custom-button.component";

@Component({
    selector: "dialog-custom-filter",
    templateUrl: "./custom-filter.dialog.component.html",
    styleUrls: ["./custom-filter.dialog.component.css"],
    standalone: true,
    imports: [
        CommonModule,
        MatInputModule,
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
        CustonButton,
    ],
    providers: [provideNativeDateAdapter()],
})
export class DialogCustomList extends ModalComponent implements OnInit {
    public filterState = inject(CustomFilterState);

    public catState = inject(CategoryState);
    public ccState = inject(CreditCardState);
    public compState = inject(CompanyState);
    public bankState = inject(BankState);

    public billService = inject(ServiceBill);
    public billState = inject(BillState);

    @ViewChild(ModalComponent) modalComponent: ModalComponent;
    @ViewChild("category") category: MatSelect;
    @ViewChild("creditcard") creditcard: MatSelect;
    @ViewChild("company") company: MatSelect;
    @ViewChild("bank") bank: MatSelect;
    @ViewChild("month") month: MatSelect;
    @ViewChild("year") year: MatInput;
    @ViewChild("min") min: ElementRef;
    @ViewChild("max") max: ElementRef;
    @ViewChild("date1") date1: MatInput;
    @ViewChild("date2") date2: MatInput;
    @ViewChild("status") status: MatButtonToggle;

    months = MONTHS;
    catCtrl = new FormControl<string>("");
    ccCrtl = new FormControl<string>("");
    compCtrl = new FormControl<string>("");
    bkCtrl = new FormControl<string>("");
    monthCtrl = new FormControl<string>("");
    yearCtrl = new FormControl<number>(new Date().getFullYear(), {
        validators: [Validators.min(2023), Validators.max(2080)],
        nonNullable: true,
    });
    minCtrl = new FormControl<number>(0, { nonNullable: true });
    maxCtrl = new FormControl<number>(0, { nonNullable: true });
    statusCtrl = new FormControl<"all" | "settled" | "pending" | "">("", {
        nonNullable: true,
    });
    startDateCtrl = new FormControl<Date | null>(null);
    endDateCtrl = new FormControl<Date | null>(null);
    selectedFilters: FilterDisplay[] = [];

    public filterSubscription: Subscription;

    ngOnInit() {
        this.modalState.changeSubmitFooter("OK", "cancel");

        this.filterSubscription = this.filterState.filters$.subscribe({
            next: (filters) => {
                this.selectedFilters = [...filters];
            },
            error: () => (this.selectedFilters = []),
        });
    }

    addFilter(event: MatSelectChange, identifier: AvailableDataFilters) {
        const filter = event.value;
        const hasFilterIndex = this.selectedFilters.findIndex(
            (f) => f.identifier === identifier
        );
        if (hasFilterIndex >= 0 || filter === null)
            this.selectedFilters.splice(hasFilterIndex, 1);
        if (filter !== null)
            this.selectedFilters.push({
                id: filter.id,
                identifier,
                name: filter.name,
            });
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
                    this.generalService.warningSnackbar(
                        "only one " + identifier + " value allowed"
                    );
                else if ((hasFilter.name as number) !== value)
                    this.generalService.warningSnackbar(
                        identifier + " value not allowed"
                    );
            } else {
                this.selectedFilters.push({
                    id: value,
                    identifier,
                    name: value,
                });
                this[identifier].nativeElement.disabled = true;
            }
        }
    }

    addYear(event: any) {
        let value: string | number | null = (event.target as HTMLInputElement).value;
        value = value === "" ? null : parseFloat(value);

        if (!value) return;

        const hasFilter = [...this.selectedFilters].find((f) => f.id === value);
        if (hasFilter) return;

        this.selectedFilters.push({
            id: value,
            identifier: "year",
            name: value,
        });
        this.year.value = "";
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

    addDate(event: any, start: boolean) {
        const date = new Date(event.value);
        const hasDateIndex = this.selectedFilters.findIndex(
            (sf) => sf.identifier === (start ? "date1" : "date2")
        );
        if (hasDateIndex >= 0) this.selectedFilters.splice(hasDateIndex, 1);
        this.selectedFilters.push({
            id: date.toISOString(),
            identifier: start ? "date1" : "date2",
            name: date.toLocaleDateString("en-GB"),
        });
    }

    removeFilter(index: number) {
        const removed = this.selectedFilters.splice(index, 1);
        if (removed[0].identifier === "min" || removed[0].identifier === "max")
            this[removed[0].identifier].nativeElement.disabled = false;
    }

    removeAllFilters() {
        this.selectedFilters = [];
    }

    onSubmit() {
        let countMonths = 0;
        let countYears = 0;
        countYears = this.selectedFilters.filter((f) => f.identifier === "year").length;
        countMonths = this.selectedFilters.filter((f) => f.identifier === "month").length;
        if (countYears === 0 && countMonths > 0) {
            this.generalService.warningSnackbar(
                "you need at least one year when filtering months"
            );
            return;
        }
        this.filterState.setFilters([...this.selectedFilters]);
        this.billService.getBills().subscribe({
            next: (bills) => {
                if (bills.data.length === 0)
                    this.billState.changeStatus("empty", "no bills");
                else this.billState.setBills(bills);
                this.modalComponent.onClose();
            },
            error: () => {
                this.generalService.errorSnackbar("error fetching bills");
                this.billState.changeStatus("error", "error fetching bills");
            },
        });
    }

    handleClose() {
        this.onClose();
    }

    ngOnDestroy() {
        this.filterSubscription.unsubscribe();
    }
}
