import { CommonModule } from "@angular/common";
import { booleanAttribute, Component, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { ButtonVariantsType } from "src/app/core/types/components/button";
import { contrastText, getBackgroundColor } from "src/utils/color";

@Component({
    selector: "btn",
    imports: [CommonModule, MatButtonModule],
    templateUrl: "./custom-button.component.html",
    styleUrls: ["./custom-button.component.css"],
    standalone: true,
})
export class CustonButton {
    @Input() classes: string = "";
    @Input() variant: ButtonVariantsType = "primary";
    @Input({ transform: booleanAttribute }) extended: boolean = true;
    @Input() disabled: boolean = false;
    @Output() onClick = new EventEmitter<any>();

    public id = Math.floor(Math.random() * 1001);
    public textColor = "text-1";

    ngAfterViewInit() {
        const textColorString = this.setTextColor();
        if (textColorString === "var(--text-1) !important") {
            this.textColor = "text-1";
        } else this.textColor = "text-2";
    }

    handleClick() {
        this.onClick.emit();
    }

    setTextColor() {
        const backgroundColor = getBackgroundColor("custom-button-" + this.id);

        return contrastText(backgroundColor);
    }
}
