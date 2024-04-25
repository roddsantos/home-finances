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

@Injectable({
    providedIn: "root",
})
@Component({
    selector: "custom-filter",
    templateUrl: "./custom-filter.component.html",
    styleUrls: ["./custom-filter.component.css"],
    standalone: true,
    imports: [MatButton, MatIcon, CommonModule, MatChipsModule, MatExpansionModule],
})
export class CustomFilterComponent {
    public dialog = inject(Dialog);
    public filterState = inject(CustomFilterState);

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

    removeFilter(filter: FilterDisplay) {
        this.filterState.removeFilter(filter);
    }
}
