import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
    standalone: true,
    selector: "custom-icon",
    templateUrl: "./icon.component.html",
    imports: [CommonModule, MatIconModule],
})
export class CustomIcon {
    @Input() isNotSymbol: boolean = false;
    @Input() class: string = "";
    @Input() fontIcon!: string;
}
