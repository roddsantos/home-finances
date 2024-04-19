import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FeedbackInfo } from "src/app/types/components";

@Component({
    selector: "feedback-container",
    templateUrl: "./feedback-container.component.html",
    styleUrls: ["./feedback-container.component.css"],
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButton, MatProgressSpinnerModule],
})
export class FeedbackContainerComponent {
    @Input() info: FeedbackInfo = {
        variant: "none",
        title: "",
        description: "",
        actionLabel: "",
        action: () => {},
    };

    constructor() {}
    ngOnInit() {}
}
