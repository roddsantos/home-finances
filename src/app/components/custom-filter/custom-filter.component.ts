import { Component, inject, Injectable, Input, Output, ViewChild } from "@angular/core";
import { CustomFilterState } from "./custom-filter.subjects.component";
import {
    AvailableFilters,
    FilterDisplay,
    ListAction,
} from "src/app/core/types/components";
import { Dialog } from "@angular/cdk/dialog";
import { DialogCustomList } from "./dialog/custom-filter.dialog.component";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatChipsModule } from "@angular/material/chips";
import { ServiceBill } from "src/app/services/bill.service";
import { BillState } from "src/app/core/subjects/subjects.bill";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CustomSnackbarComponent } from "../custom-snackbar/custom-snackbar.component";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { MonthType, PaymentTypes } from "src/app/core/types/general";
import { MONTHS } from "src/utils/constants/general";
import { MatInput, MatInputModule } from "@angular/material/input";

@Injectable({
    providedIn: "root",
})
@Component({
    selector: "custom-filter",
    templateUrl: "./custom-filter.component.html",
    styleUrls: ["./custom-filter.component.css"],
    standalone: true,
    imports: [
        MatButton,
        MatIcon,
        CommonModule,
        MatChipsModule,
        MatExpansionModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatIconButton,
        MatTooltipModule,
    ],
})
export class CustomFilterComponent {
    public dialog = inject(Dialog);
    public filterState = inject(CustomFilterState);
    public billService = inject(ServiceBill);
    public billState = inject(BillState);
    public generalState = inject(GeneralState);
    public storage = inject(LocalStorageService);
    public snack = inject(CustomSnackbarComponent);
    @ViewChild("year") year: MatInput;

    months = MONTHS;

    @Input() availableFilters: AvailableFilters[];
    @Input() data: Array<any> = [];
    @Input() columnsTitle: Array<any>;
    @Input() columnsExp: Array<any>;
    @Output() action: ListAction[];

    public monthCtrl = new FormControl<MonthType | null>(null);
    public yearCtrl = new FormControl<number | null>(null, {
        validators: [Validators.min(2023), Validators.max(2080)],
        nonNullable: true,
    });
    public minCtrl = new FormControl<number>(0, { nonNullable: true });
    public maxCtrl = new FormControl<number>(0, { nonNullable: true });
    public statusCtrl = new FormControl<"all" | "settled" | "pending">("all", {
        nonNullable: true,
    });
    public typeCtrl = new FormControl<"all" | PaymentTypes>("all", {
        nonNullable: true,
    });

    ngOnInit() {
        const filters: FilterDisplay[] = this.storage.getFilters();
        const hasMonth = filters.find((filter) => filter.identifier === "month");
        if (hasMonth) {
            this.monthCtrl.patchValue(
                this.months.find((month) => month.order === hasMonth?.id) || null
            );
        }
        const hasYear = filters.find((filter) => filter.identifier === "year");
        if (hasYear) this.yearCtrl.patchValue(hasYear.id as number);

        const hasType = filters.find((filter) => filter.identifier === "type");
        if (hasType) this.typeCtrl.patchValue(hasType.id as PaymentTypes | "all");
    }

    getFilters() {
        let filtersFromState: FilterDisplay[] = [];
        this.filterState.filters$
            .subscribe({
                next: (filters) => {
                    filtersFromState = filters;
                },
            })
            .unsubscribe();
        return filtersFromState;
    }

    openDialog() {
        this.dialog.open<string>(DialogCustomList, {
            data: {
                header: "add filters",
                size: "lg",
            },
        });
    }

    closeFilterContainer() {
        this.generalState.changeFilterContainer(false);
        this.storage.setFilterContainer(false);
    }

    addMonth(event: any) {
        const selectedFilter = event.value as MonthType;
        let filtersFromState: FilterDisplay[] = this.getFilters();
        const filterIndex = filtersFromState.findIndex(
            (filter) => filter.identifier === "month"
        );
        if (filterIndex >= 0) {
            this.filterState.removeFilter(filtersFromState[filterIndex]);
            filtersFromState.splice(filterIndex, 1);
        }
        this.filterState.setFilters([
            ...filtersFromState,
            {
                id: selectedFilter.order,
                identifier: "month",
                name: selectedFilter.name,
            },
        ]);
        if (filtersFromState.find((filter) => filter.identifier === "year"))
            this.getBills();
    }

    addYear(event: any) {
        let selectedFilter: string | number | null = (event.target as HTMLInputElement)
            .value;
        selectedFilter =
            selectedFilter === "" || !Boolean(selectedFilter)
                ? null
                : parseInt(selectedFilter, 10);
        let filtersFromState: FilterDisplay[] = [];
        if (selectedFilter) {
            filtersFromState = this.getFilters();
            const filterIndex = filtersFromState.findIndex(
                (filter) => filter.identifier === "year"
            );
            if (filterIndex >= 0) {
                this.filterState.removeFilter(filtersFromState[filterIndex]);
                filtersFromState.splice(filterIndex, 1);
            }
            this.filterState.setFilters([
                ...filtersFromState,
                {
                    id: selectedFilter,
                    identifier: "year",
                    name: selectedFilter,
                },
            ]);
            if (filtersFromState.find((filter) => filter.identifier === "month"))
                this.getBills();
        }
        this.year.focus();
    }

    addStatus(event: MatSelectChange) {
        const value = event.value;
        let filtersFromState: FilterDisplay[] = this.getFilters();
        const hasFilter = filtersFromState.find((f) => f.identifier === "status");
        if (hasFilter) this.filterState.removeFilter(hasFilter);
        if (value !== "all")
            this.filterState.addFilters([
                {
                    id: value,
                    identifier: "status",
                    name: value,
                },
            ]);
        this.getBills();
    }

    addLimit(event: any, identifier: "min" | "max") {
        let filtersFromState: FilterDisplay[] = [];
        let value: string | number | null = (event.target as HTMLInputElement).value;
        value = value === "" ? null : parseFloat(value);
        if (value !== null) {
            filtersFromState = this.getFilters();
            const hasFilter = filtersFromState.find(
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
            } else
                this.filterState.addFilters([
                    {
                        id: value,
                        identifier,
                        name: value,
                    },
                ]);
        }
    }

    addType(event: MatSelectChange) {
        const filter = event.value;
        let filtersFromState: FilterDisplay[] = this.getFilters();
        const hasFilter = filtersFromState.find((f) => f.identifier === "type");
        if (hasFilter) this.filterState.removeFilter(hasFilter);
        if (filter !== "all")
            this.filterState.addFilters([
                {
                    id: filter,
                    identifier: "type",
                    name: filter,
                },
            ]);
    }

    getBills() {
        this.billService.getBills().subscribe({
            next: (bills) => {
                if (bills.data.length === 0)
                    this.billState.changeStatus("empty", "no bills");
                else this.billState.setBills(bills);
            },
            error: () => {
                this.snack.openSnackBar("error fetching bills", "error");
                this.billState.changeStatus("error", "error fetching bills");
            },
        });
    }

    removeFilter(filter?: FilterDisplay) {
        let countMonths = 0;
        let countYears = 0;
        if (filter?.identifier === "year") {
            this.filterState.filters$.subscribe({
                next: (filters) => {
                    countYears = filters.filter((f) => f.identifier === "year").length;
                    countMonths = filters.filter((f) => f.identifier === "month").length;
                },
            });
        }
        if (countYears === 1 && countMonths > 0) {
            this.snack.openSnackBar(
                "you need at least one year when filtering months",
                "warning"
            );
            return;
        }
        if (filter) {
            this.filterState.removeFilter(filter);
            this.billService.getBills().subscribe({
                next: (bills) => {
                    if (bills.data.length === 0)
                        this.billState.changeStatus("empty", "no bills");
                    else this.billState.setBills(bills);
                },
                error: () => {
                    this.snack.openSnackBar("error fetching bills", "error");
                    this.billState.changeStatus("error", "error fetching bills");
                },
            });
        } else {
            this.filterState.removeAll();
            this.clearAllFiltersForms();
        }
    }

    clearAllFiltersForms() {
        this.monthCtrl.patchValue(null);
        this.yearCtrl.patchValue(null);
        this.minCtrl.patchValue(0);
        this.maxCtrl.patchValue(0);
        this.statusCtrl.patchValue("all");
        this.typeCtrl.patchValue("all");
    }
}
