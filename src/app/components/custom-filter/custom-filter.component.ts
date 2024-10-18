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
import { MatSelectModule } from "@angular/material/select";
import { MonthType } from "src/app/core/types/general";
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
    public statusCtrl = new FormControl<"all" | "settled" | "pending" | "">("", {
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
        if (hasYear) {
            this.yearCtrl.patchValue(hasYear.id as number);
        }
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
        let filtersFromState: FilterDisplay[] = [];
        this.filterState.filters$
            .subscribe({
                next: (filters) => {
                    filtersFromState = filters;
                },
            })
            .unsubscribe();
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
            this.filterState.filters$
                .subscribe({
                    next: (filters) => {
                        filtersFromState = filters;
                    },
                })
                .unsubscribe();
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
    }
}
