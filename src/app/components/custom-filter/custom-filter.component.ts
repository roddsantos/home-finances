import { Component, inject, Injectable, Input, Output, ViewChild } from "@angular/core";
import { CustomFilterState } from "./custom-filter.subjects.component";
import {
    AvailableFilters,
    FilterDisplay,
    ListAction,
} from "src/app/core/types/components";
import { Dialog } from "@angular/cdk/dialog";
import { DialogCustomList } from "./dialog/custom-filter.dialog.component";
import { MatButton } from "@angular/material/button";
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
import { MonthType, PaymentTypes } from "src/app/core/types/general";
import { MONTHS } from "src/utils/constants/general";
import { MatInput, MatInputModule } from "@angular/material/input";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { ToggleButtonComponent } from "../toggle-buttons/toggle-buttons.component";
import { ToggleButtonItemsType } from "src/app/core/types/components/toggle-buttons";
import { PAYMENT_ITEMS, STATUS_ITEMS, TYPE_ITEMS } from "src/utils/constants/bills";

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
        MatButtonToggleModule,
        ToggleButtonComponent,
        MatInputModule,
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
    public typeItems = TYPE_ITEMS;
    public statusItems = STATUS_ITEMS;
    public moneyFluxItems = PAYMENT_ITEMS;

    @Input() availableFilters: AvailableFilters[];
    @Input() data: Array<any> = [];
    @Input() columnsTitle: Array<any>;
    @Input() columnsExp: Array<any>;
    @Output() action: ListAction[];

    public termCtrl = new FormControl<string>("");
    public monthCtrl = new FormControl<MonthType | null>(null);
    public yearCtrl = new FormControl<number | null>(null, {
        validators: [Validators.min(2023), Validators.max(2080)],
        nonNullable: true,
    });
    public moneyFluxCtrl = new FormControl<"all" | "income" | "outcome">("all", {
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
    public style = getComputedStyle(document.body);
    public primaryColor = this.style.getPropertyValue("--primary");
    public secondaryColor = this.style.getPropertyValue("--secondary");

    ngOnInit() {
        const filters: FilterDisplay[] = this.storage.getFilters();

        const hasTerm = filters.find((filter) => filter.identifier === "name");
        if (hasTerm) this.termCtrl.patchValue(hasTerm.id as string);

        const hasPayment = filters.find((filter) => filter.identifier === "moneyflux");
        if (hasPayment)
            this.moneyFluxCtrl.patchValue(hasPayment.id as "income" | "all" | "outcome");

        const hasMonth = filters.find((filter) => filter.identifier === "month");
        if (hasMonth)
            this.monthCtrl.patchValue(
                this.months.find((month) => month.order === hasMonth?.id) || null
            );

        const hasMin = filters.find((filter) => filter.identifier === "min");
        if (hasMin) this.minCtrl.patchValue(hasMin.id as number);

        const hasMax = filters.find((filter) => filter.identifier === "max");
        if (hasMax) this.maxCtrl.patchValue(hasMax.id as number);

        const hasYear = filters.find((filter) => filter.identifier === "year");
        if (hasYear) this.yearCtrl.patchValue(hasYear.id as number);

        const hasType = filters.find((filter) => filter.identifier === "type");
        if (hasType) this.typeCtrl.patchValue(hasType.id as PaymentTypes | "all");

        const hasStatus = filters.find((filter) => filter.identifier === "status");
        if (hasStatus)
            this.statusCtrl.patchValue(hasStatus.id as "all" | "settled" | "pending");
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
                size: "md",
            },
        });
    }

    closeFilterContainer() {
        this.generalState.changeFilterContainer(false);
        this.storage.setFilterContainer(false);
    }

    addTerm(event: any) {
        const value = event.target.value;
        let filtersFromState: FilterDisplay[] = this.getFilters();
        const filterIndex = filtersFromState.findIndex(
            (filter) => filter.identifier === "name"
        );
        if (filterIndex >= 0) {
            this.filterState.removeFilter(filtersFromState[filterIndex]);
            filtersFromState.splice(filterIndex, 1);
        }
        this.filterState.setFilters([
            ...filtersFromState,
            {
                id: value,
                identifier: "name",
                name: value,
            },
        ]);
        this.getBills();
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
        this.getBills();
    }

    addYear(event: any) {
        let selectedFilter: string | number | null = (event.target as HTMLInputElement)
            .value;
        selectedFilter =
            selectedFilter === "" || !Boolean(selectedFilter)
                ? null
                : parseInt(selectedFilter, 10);
        let filtersFromState: FilterDisplay[] = this.getFilters();
        if (selectedFilter) {
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
            this.getBills();
        }
    }

    addStatus(item: ToggleButtonItemsType<string>) {
        const { label, value } = item;
        if (!label || !value) return;

        let filtersFromState: FilterDisplay[] = this.getFilters();
        const hasFilter = filtersFromState.find((f) => f.identifier === "status");

        if (hasFilter) this.filterState.removeFilter(hasFilter);
        if (value !== "all")
            this.filterState.addFilters([
                {
                    id: value,
                    identifier: "status",
                    name: label,
                },
            ]);

        this.getBills();
    }

    addMoneyFlux(item: ToggleButtonItemsType<string>) {
        const { label, value } = item;
        if (!label || !value) return;

        let filtersFromState: FilterDisplay[] = this.getFilters();
        const hasFilter = filtersFromState.find((f) => f.identifier === "moneyflux");

        if (hasFilter) this.filterState.removeFilter(hasFilter);
        if (value !== "all")
            this.filterState.addFilters([
                {
                    id: value,
                    identifier: "moneyflux",
                    name: label,
                },
            ]);

        this.getBills();
    }

    addType(item: ToggleButtonItemsType<string>) {
        const { label, value } = item;
        if (!label || !value) return;

        let filtersFromState: FilterDisplay[] = this.getFilters();
        const hasFilter = filtersFromState.find((f) => f.identifier === "type");

        if (hasFilter) this.filterState.removeFilter(hasFilter);
        if (value !== "all")
            this.filterState.addFilters([
                {
                    id: value,
                    identifier: "type",
                    name: label,
                },
            ]);

        this.getBills();
    }

    getBills() {
        this.billService.getBills().subscribe({
            next: (bills) => {
                this.billState.setBills(bills);
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
        } else {
            this.filterState.removeAll();
            this.clearAllFiltersForms();
        }
        this.getBills();
    }

    clearAllFiltersForms() {
        this.termCtrl.patchValue("");
        this.monthCtrl.patchValue(null);
        this.yearCtrl.patchValue(null);
        this.minCtrl.patchValue(0);
        this.maxCtrl.patchValue(0);
        this.statusCtrl.patchValue("all");
        this.typeCtrl.patchValue("all");
    }
}
