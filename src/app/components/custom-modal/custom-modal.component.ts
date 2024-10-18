import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
    selector: "custom-modal",
    templateUrl: "./custom-modal.component.html",
    styleUrls: ["./custom-modal.component.css"],
    standalone: true,
    imports: [CommonModule],
})
export class CustomModalComponent {}
