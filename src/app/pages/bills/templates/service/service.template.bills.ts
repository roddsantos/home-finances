import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { CustomTag } from "src/app/components/tag/tag.component";
import { BillDataObjectType } from "src/app/core/types/data/bills.types";

@Component({
    selector: "service-list-template",
    templateUrl: "./service.template.bills.html",
    styleUrls: ["../../pages.bills.css", "./service.template.bills.css"],
    standalone: true,
    imports: [
        CommonModule,
        MatExpansionModule,
        MatIconModule,
        MatTooltipModule,
        CustomTag,
    ],
})
export class ServiceTemplateMonthly {
    public general = inject(GeneralState);
    @Input() data: BillDataObjectType;
    isLineTheme: string = "";

    ngOnInit() {
        this.general.theme$.subscribe({
            next: (theme) => (this.isLineTheme = theme === "binary" ? "binary" : ""),
        });
    }
}
