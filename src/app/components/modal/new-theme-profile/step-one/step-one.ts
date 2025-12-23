import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { CardComponent } from "src/app/components/card/card.component";
import { ToggleButtonComponent } from "src/app/components/toggle-buttons/toggle-buttons.component";
import { ToggleButtonItemsType } from "src/app/core/types/components/toggle-buttons";
import { UpdateProfileControlType } from "src/app/core/types/pages/profiles";
import { COLOR_THEMES, DEFAULT_COLORS } from "src/utils/constants/colors";

@Component({
    selector: "step-one",
    standalone: true,
    templateUrl: "./step-one.html",
    styleUrls: ["./step-one.css", "../new-theme-profile.modal.css"],
    imports: [ToggleButtonComponent, CardComponent],
})
export class StepOneNewProfileTheme {
    @Input() themeControl: FormControl<string>;
    @Input() primaryControl: FormControl<string>;
    @Input() secondaryControl: FormControl<string>;
    @Output() onClick = new EventEmitter<UpdateProfileControlType<string>>();

    public themes: ToggleButtonItemsType<string>[] = Object.keys(COLOR_THEMES).map(
        (theme) => ({
            value: theme,
            label: theme,
        })
    );

    public defaultColors: ToggleButtonItemsType<string>[] = Object.keys(
        DEFAULT_COLORS.default
    ).map((color) => ({
        value: DEFAULT_COLORS.default[color as keyof typeof DEFAULT_COLORS.default],
        label: color,
        icon: {
            name: "colors",
            color: DEFAULT_COLORS.default[color as keyof typeof DEFAULT_COLORS.default],
        },
    }));

    handleThemeClick(item: ToggleButtonItemsType<string>) {
        if (this.themeControl) this.themeControl.patchValue(item.value);
    }

    handlePrimaryClick(item: ToggleButtonItemsType<string>) {
        if (this.primaryControl) this.primaryControl.patchValue(item.value);
    }

    handleSecondaryClick(item: ToggleButtonItemsType<string>) {
        if (this.secondaryControl) this.secondaryControl.patchValue(item.value);
    }
}
