import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { CreditCard } from "src/app/core/types/objects";
import { MONTHS } from "src/utils/constants/general";

@Component({
    selector: "template-view-credit-card",
    templateUrl: "./credit-card.template.html",
    styleUrls: ["./credit-card.template.css"],
    standalone: true,
    imports: [CommonModule],
})
export class TemplateCreditCard {
    @Input() creditCard: CreditCard;
    public months = MONTHS;
}
