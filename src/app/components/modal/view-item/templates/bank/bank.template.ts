import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Bank } from "src/app/core/types/objects";

@Component({
    selector: "template-view-bank",
    templateUrl: "./bank.template.html",
    styleUrls: ["./bank.template.css"],
    standalone: true,
    imports: [CommonModule],
})
export class TemplateBank {
    @Input() bank: Bank;
}
