import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { CreditCardObjectType } from "src/app/core/types/data/credit-card.types";
import { MONTHS } from "src/utils/constants/general";
import { CreditCardPipe } from "src/utils/pipes/creditCard";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
    selector: "template-view-credit-card",
    templateUrl: "./credit-card.template.html",
    styleUrls: ["./credit-card.template.css", "../../view-item.modal.css"],
    standalone: true,
    imports: [CommonModule, CreditCardPipe, MatIconModule, MatTooltipModule],
})
export class TemplateCreditCard {
    @Input() creditCard: CreditCardObjectType;
    @Input() theme: string;
    public style = getComputedStyle(document.body);
    public bhColor = this.style.getPropertyValue("--bh");
    public primaryColor = this.style.getPropertyValue("--primary");
    public secondaryColor = this.style.getPropertyValue("--secondary");
    public errorColor = this.style.getPropertyValue("--error");
    public successColor = this.style.getPropertyValue("--success");
    public months = MONTHS;
    public status = "";

    ngOnInit() {}
}
