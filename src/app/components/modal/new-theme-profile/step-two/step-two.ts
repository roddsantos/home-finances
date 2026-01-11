import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CardComponent } from "src/app/components/card/card.component";
import { ToggleButtonComponent } from "src/app/components/toggle-buttons/toggle-buttons.component";
import { ToggleButtonItemsType } from "src/app/core/types/components/toggle-buttons";
import { ColorThemeType, UpdateProfileControlType } from "src/app/core/types/pages/theme";
import {
    DEFAULT_BACKGROUND_COLORS,
    DEFAULT_TEXT_COLORS,
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
    selector: "step-two",
    standalone: true,
    templateUrl: "./step-two.html",
    styleUrls: ["./step-two.css", "../new-theme-profile.modal.css"],
    imports: [
        ToggleButtonComponent,
        CardComponent,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatIconModule,
        MatInputModule,
    ],
})
export class StepTwoNewProfileTheme extends ModalComponent {
    @Input() background: FormControl<string>;
    @Input() text1: FormControl<string>;
    @Input() text2: FormControl<string>;
    @Input() themeControl: FormControl<ColorThemeType>;

    @Output() onClick = new EventEmitter<UpdateProfileControlType<string>>();

    public invalidError = GENERAL_FORM.invalidValue + " (between 0 and 20)";
    public theme: ColorThemeType = "default";
    public text1Colors: ToggleButtonItemsType<string>[] = [];
    public text2Colors: ToggleButtonItemsType<string>[] = [];
    public backgroundColors: ToggleButtonItemsType<string>[] = [];
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

    getText1Theme() {
        switch (this.theme) {
            case "dark":
                return "dark";
            default:
                return "light";
        }
    }

    getText2Theme() {
        switch (this.theme) {
            case "light":
                return "dark";
            default:
                return "light";
        }
    }

    setText1Colors() {
        const textTheme = this.getText1Theme();
        this.text1Colors = Object.keys(DEFAULT_TEXT_COLORS[textTheme]).map((color) => {
            const colorKey = color as keyof typeof DEFAULT_TEXT_COLORS.default;
            return {
                value: colorKey,
                label: DEFAULT_TEXT_COLORS[textTheme][colorKey].label,
                icon: {
                    name: "colors",
                    color: DEFAULT_TEXT_COLORS[textTheme][colorKey].value,
                },
            };
        });
    }

    setText2Colors() {
        const textTheme = this.getText2Theme();
        this.text2Colors = Object.keys(DEFAULT_TEXT_COLORS[textTheme]).map((color) => {
            const colorKey = color as keyof typeof DEFAULT_TEXT_COLORS.default;
            return {
                value: colorKey,
                label: DEFAULT_TEXT_COLORS[textTheme][colorKey].label,
                icon: {
                    name: "colors",
                    color: DEFAULT_TEXT_COLORS[textTheme][colorKey].value,
                },
            };
        });
    }

    setBackgroundColors() {
        const bcTheme = this.getText1Theme();
        this.backgroundColors = Object.keys(DEFAULT_BACKGROUND_COLORS[bcTheme]).map(
            (color) => {
                const colorKey = color as keyof typeof DEFAULT_BACKGROUND_COLORS.dark;
                return {
                    value: colorKey,
                    label: DEFAULT_BACKGROUND_COLORS[bcTheme][colorKey].label,
                    icon: {
                        name: "colors",
                        color: DEFAULT_BACKGROUND_COLORS[bcTheme][colorKey].value,
                    },
                };
            }
        );
    }

    ngOnInit() {
        this.theme = this.themeControl.value;

        this.setText1Colors();
        this.setText2Colors();
        this.setBackgroundColors();
    }
}
