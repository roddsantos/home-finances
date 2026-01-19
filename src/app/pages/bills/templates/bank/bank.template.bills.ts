import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CustomTag } from "src/app/components/tag/tag.component";
import { BillDataObjectType } from "src/app/core/types/data/bills.types";

@Component({
    selector: "bank-list-template",
    templateUrl: "./bank.template.bills.html",
    styleUrls: ["../../pages.bills.css", "./bank.template.bills.css"],
    standalone: true,
    imports: [
        CommonModule,
        CustomTag,
        MatExpansionModule,
        MatIconModule,
        MatTooltipModule,
    ],
})
export class BankListTemplateMonthly {
    public general = inject(GeneralState);
    @Input() data: BillDataObjectType;
    isLineTheme: string = "";

    ngOnInit() {
        this.general.theme$.subscribe({
            next: (theme) => (this.isLineTheme = theme === "binary" ? "binary" : ""),
        });
    }
}
