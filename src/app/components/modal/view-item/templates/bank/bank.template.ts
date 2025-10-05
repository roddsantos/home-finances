import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Bank } from "src/app/core/types/objects";
import { SavingsBankTemplate } from "./savings.bank.template";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "template-view-bank",
    templateUrl: "./bank.template.html",
    styleUrls: ["./bank.template.css"],
    standalone: true,
    imports: [CommonModule, SavingsBankTemplate, MatIconModule],
})
export class TemplateBank {
    @Input() bank: Bank;
}
