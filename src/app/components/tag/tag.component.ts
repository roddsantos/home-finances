import { CommonModule } from "@angular/common";
import { booleanAttribute, Component, Input } from "@angular/core";
import { contrastText, getBackgroundColor } from "src/utils/color";

@Component({
    selector: "tag",
    imports: [CommonModule],
    styleUrls: ["./tag.component.css"],
    templateUrl: "./tag.component.html",
    standalone: true,
})
export class CustomTag {
    @Input({ required: true }) id: string;
    @Input() color: string = "transparent";
    @Input() border: string = "var(--border-color)";
    @Input() theme: string;
    @Input() classes: string = "";
    @Input({ transform: booleanAttribute }) transform: boolean = false;

    public transformedColor = "transparent";

    ngOnInit() {
        const auxColor = this.transform
            ? `rgb(from ${this.color} r g b / 0.25)`
            : this.color;
        const auxTheme = this.theme
            ? this.transform
                ? `rgb(from ${this.theme} r g b / 0.25)`
                : this.theme
            : auxColor;
        this.transformedColor = this.theme ? auxTheme : auxColor;
    }
}
