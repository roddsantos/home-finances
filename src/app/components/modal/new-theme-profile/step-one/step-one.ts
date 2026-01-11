import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { CardComponent } from "src/app/components/card/card.component";
import { ToggleButtonComponent } from "src/app/components/toggle-buttons/toggle-buttons.component";
import { ToggleButtonItemsType } from "src/app/core/types/components/toggle-buttons";
import { ColorThemeType, UpdateProfileControlType } from "src/app/core/types/pages/theme";
import { COLOR_THEMES, DEFAULT_COLORS } from "src/utils/constants/colors";
import { GENERAL_FORM } from "src/utils/constants/forms";

@Component({
    selector: "step-one",
    standalone: true,
    templateUrl: "./step-one.html",
    styleUrls: ["./step-one.css", "../new-theme-profile.modal.css"],
    imports: [
        ToggleButtonComponent,
        CardComponent,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatIconModule,
    ],
})
export class StepOneNewProfileTheme {
    @Input() title: FormControl<string>;
    @Input() description: FormControl<string>;
    @Input() themeControl: FormControl<ColorThemeType>;
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
    ).map((color) => {
        const colorKey = color as keyof typeof DEFAULT_COLORS.default;
        return {
            value: colorKey,
            label: DEFAULT_COLORS.default[colorKey].label,
            icon: {
                name: "colors",
                color: DEFAULT_COLORS.default[colorKey].value,
            },
        };
    });

    public errorMessages = {
        name: GENERAL_FORM.noName,
        description: GENERAL_FORM.noDescription,
    };

    handleThemeClick(item: ToggleButtonItemsType<string>) {
        const themeKey = item.value as keyof typeof DEFAULT_COLORS;

        this.defaultColors = Object.keys(DEFAULT_COLORS[themeKey]).map((color) => {
            const colorKey = color as keyof typeof DEFAULT_COLORS.default;

            return {
                value: colorKey,
                label: DEFAULT_COLORS[themeKey][colorKey].label,
                icon: {
                    name: "colors",
                    color: DEFAULT_COLORS[themeKey][colorKey].value,
                },
            };
        });
    }
}
