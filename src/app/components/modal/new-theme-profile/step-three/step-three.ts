import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CardComponent } from "src/app/components/card/card.component";
import { ToggleButtonComponent } from "src/app/components/toggle-buttons/toggle-buttons.component";
import { ToggleButtonItemsType } from "src/app/core/types/components/toggle-buttons";
import {
    FontProfileType,
    GeneralMeasureType,
    UpdateProfileControlType,
} from "src/app/core/types/pages/profiles";
import {
    DEFAULT_COLORS,
    GENERAL_MEASURES,
    THEME_FONTS,
} from "src/utils/constants/colors";
import { getBorderWidthIcon, getInputSizeIcon, getPaddingIcon } from "src/utils/theme";
import { ModalComponent } from "../../modal.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { GENERAL_FORM } from "src/utils/constants/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

@Component({
    selector: "step-three",
    standalone: true,
    templateUrl: "./step-three.html",
    styleUrls: ["./step-three.css", "../new-theme-profile.modal.css"],
    imports: [
        ToggleButtonComponent,
        CardComponent,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatIconModule,
        MatInputModule,
    ],
})
export class StepThreeNewProfileTheme extends ModalComponent {
    @Input() borderRadius: FormControl<number>;
    @Input() borderWidth: FormControl<GeneralMeasureType>;
    @Input() inputSize: FormControl<GeneralMeasureType>;
    @Input() font: FormControl<FontProfileType>;
    @Input() padding: FormControl<GeneralMeasureType>;

    @Output() onClick = new EventEmitter<UpdateProfileControlType<string>>();

    public invalidError = GENERAL_FORM.invalidValue + " (between 0 and 20)";

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
    public fonts: ToggleButtonItemsType<string>[] = Object.keys(THEME_FONTS).map(
        (key) => {
            const fontKey = key as keyof typeof THEME_FONTS;
            return {
                value: THEME_FONTS[fontKey],
                label: THEME_FONTS[fontKey],
            };
        }
    );

    public paddingMeasures: ToggleButtonItemsType<string>[] = GENERAL_MEASURES.map(
        (measure) => {
            const iconName = getPaddingIcon(measure.value);
            return {
                ...measure,
                icon: {
                    color: "var(--text-1)",
                    name: iconName,
                },
            };
        }
    );

    public inputSizeMeasures: ToggleButtonItemsType<string>[] = GENERAL_MEASURES.map(
        (measure) => {
            const iconName = getInputSizeIcon(measure.value);
            return {
                ...measure,
                icon: {
                    color: "var(--text-1)",
                    name: iconName,
                },
            };
        }
    );

    public borderWidthMeasures: ToggleButtonItemsType<string>[] = GENERAL_MEASURES.map(
        (measure) => {
            const iconName = getBorderWidthIcon(measure.value);
            return {
                ...measure,
                icon: {
                    color: "var(--text-1)",
                    name: iconName,
                },
            };
        }
    );

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
