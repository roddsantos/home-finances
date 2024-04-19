import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { CustomFilterComponent } from "src/app/components/custom-filter/custom-filter.component";
import { BillState } from "src/app/subjects/subjects.bill";
import { Bill } from "src/app/types/objects";

@Component({
    selector: "page-monthly",
    templateUrl: "./pages.monthly.html",
    styleUrls: ["./pages.monthly.css"],
    standalone: true,
    imports: [CustomFilterComponent, MatExpansionModule, CommonModule],
})
export class PageMonthly {
    public bills = inject(BillState);

    titleItems: Partial<keyof Bill>[] = ["name", "updatedAt"];
    detailsItems: Partial<keyof Bill>[] = ["description", "total"];

    trackByFn(index: number, item: any) {
        return item.id;
    }
}
