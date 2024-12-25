import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { CreditCard } from "src/app/core/types/objects";
import { MONTHS } from "src/utils/constants/general";
import { CreditCardPipe } from "src/utils/pipes/creditCard";

@Component({
    selector: "template-view-credit-card",
    templateUrl: "./credit-card.template.html",
    styleUrls: ["./credit-card.template.css"],
    standalone: true,
    imports: [CommonModule, CreditCardPipe],
})
export class TemplateCreditCard {
    @Input() creditCard: CreditCard;
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
