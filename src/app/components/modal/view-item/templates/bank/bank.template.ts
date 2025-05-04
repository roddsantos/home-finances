import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Bank } from "src/app/core/types/objects";
import { SavingsBankTemplate } from "./savings.bank.template";

@Component({
    selector: "template-view-bank",
    templateUrl: "./bank.template.html",
    styleUrls: ["./bank.template.css"],
    standalone: true,
    imports: [CommonModule, SavingsBankTemplate],
})
export class TemplateBank {
    @Input() bank: Bank;
}
