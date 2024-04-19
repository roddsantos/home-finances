import { Component, inject, Injectable, Input } from "@angular/core";
import { CustomListState } from "./custom-list.subjects.component";
import { MonthType } from "src/app/types/general";
import { AvailableFilters } from "src/app/types/components";
import { Dialog } from "@angular/cdk/dialog";
import { DialogCustomList } from "./dialog/custom-list.dialog.component";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";

@Injectable({
    providedIn: "root",
})
@Component({
    selector: "custom-list",
    templateUrl: "./custom-list.component.html",
    styleUrls: ["./custom-list.component.css"],
    standalone: true,
    imports: [MatButton, MatIcon],
})
export class CustomListComponent {
    public dialog = inject(Dialog);
    public listState = inject(CustomListState);

    @Input() availableFilter: AvailableFilters[];

    ngOnInit() {
        // this.listState.setAvailableFilters(this.availableFilter);
    }

    openDialog() {
        this.dialog.open<string>(DialogCustomList, {
            data: {
                header: "add filters",
                size: "lg",
            },
        });
    }
}
