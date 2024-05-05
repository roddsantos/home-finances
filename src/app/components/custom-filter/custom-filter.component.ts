import { Component, inject, Injectable, Input, Output } from "@angular/core";
import { CustomFilterState } from "./custom-filter.subjects.component";
import { AvailableFilters, FilterDisplay, ListAction } from "src/app/types/components";
import { Dialog } from "@angular/cdk/dialog";
import { DialogCustomList } from "./dialog/custom-filter.dialog.component";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatChipsModule } from "@angular/material/chips";
import { ServiceBill } from "src/app/services/bill.service";
import { BillState } from "src/app/subjects/subjects.bill";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CustomSnackbarComponent } from "../custom-snackbar/custom-snackbar.component";

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
    ],
})
export class CustomFilterComponent {
    public dialog = inject(Dialog);
    public filterState = inject(CustomFilterState);
    public billService = inject(ServiceBill);
    public billState = inject(BillState);
    public snack = inject(CustomSnackbarComponent);

    @Input() availableFilters: AvailableFilters[];
    @Input() data: Array<any> = [];
    @Input() columnsTitle: Array<any>;
    @Input() columnsExp: Array<any>;
    @Output() action: ListAction[];

    openDialog() {
        this.dialog.open<string>(DialogCustomList, {
            data: {
                header: "add filters",
                size: "lg",
            },
        });
    }

    removeFilter(filter?: FilterDisplay) {
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
        } else this.filterState.removeAll();
    }
}
