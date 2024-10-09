import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { ColorPipe } from "src/utils/pipes/colors";

@Component({
    standalone: true,
    selector: "card-component",
    templateUrl: "./card.component.html",
    styleUrls: ["./card.component.css"],
    imports: [CommonModule, ColorPipe],
})
export class CardComponent {
    @Input() title?: string;
    @Input() description?: string;
}
