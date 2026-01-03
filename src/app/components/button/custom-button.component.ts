import { CommonModule } from "@angular/common";
import {
    booleanAttribute,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
} from "@angular/core";
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
    constructor(private cdRef: ChangeDetectorRef) {}
    @Input() classes: string = "";
    @Input() variant: ButtonVariantsType = "primary";
    @Input({ transform: booleanAttribute }) extended: boolean = false;
    @Input() disabled: boolean = false;
    @Output() onClick = new EventEmitter<any>();

    public id = Math.floor(Math.random() * 100001);

    ngAfterViewChecked(): void {
        this.cdRef.detectChanges();
    }

    handleClick() {
        this.onClick.emit();
    }

    getTextClass() {
        if (this.disabled) return "text-1";
        const backgroundColor = getBackgroundColor("custom-button-" + this.id);
        const textColorString = contrastText(backgroundColor);
        if (textColorString === "var(--text-1) !important") return "text-1";
        return "text-2";
    }
}
