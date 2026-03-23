import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BillDataObjectType } from "src/app/core/types/data/bills.types";
import { CustomTag } from "src/app/components/tag/tag.component";

@Component({
    selector: "credit-card-list-template",
    templateUrl: "./credit-card.template.bills.html",
    styleUrls: ["../../pages.bills.css", "./credit-card.template.bills.css"],
    standalone: true,
    imports: [
        CommonModule,
        MatExpansionModule,
        MatIconModule,
        MatTooltipModule,
        CustomTag,
    ],
})
export class CreditCardTemplateMonthly {
    public general = inject(GeneralState);
    @Input() data: BillDataObjectType;
    isLineTheme: string = "";

    ngOnInit() {
        this.general.theme$.subscribe({
            next: (theme) => (this.isLineTheme = theme === "binary" ? "binary" : ""),
        });
    }
}
