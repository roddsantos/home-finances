import { NgClass, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FeedbackInfo, FeedbackVariant } from "src/app/types/components";

@Component({
    selector: "feedback-container",
    templateUrl: "./feedback-container.component.html",
    styleUrls: ["./feedback-container.component.css"],
    standalone: true,
    imports: [
        NgIf,
        MatIconModule,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        NgClass,
        MatButton,
        MatProgressSpinnerModule,
    ],
})
export class FeedbackContainerComponent {
    @Input() variant: FeedbackVariant = "none";
    @Input() info: FeedbackInfo = {
        title: "",
        description: "",
        actionLabel: "",
        action: () => {},
    };

    constructor() {}
    ngOnInit() {}
}
