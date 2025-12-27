import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { CardComponent } from "src/app/components/card/card.component";
import { ToggleButtonComponent } from "src/app/components/toggle-buttons/toggle-buttons.component";
import { ToggleButtonItemsType } from "src/app/core/types/components/toggle-buttons";
import {
    FontProfileType,
    GeneralMeasureType,
    UpdateProfileControlType,
} from "src/app/core/types/pages/profiles";
import {
    COLOR_THEMES,
    DEFAULT_COLORS,
    GENERAL_MEASURES,
    THEME_FONTS,
} from "src/utils/constants/colors";
import { ModalNewThemeProfile } from "../new-theme-profile.modal";
import { getPadding } from "src/utils/theme";
import { ModalComponent } from "../../modal.component";

@Component({
    selector: "step-two",
    standalone: true,
    templateUrl: "./step-two.html",
    styleUrls: ["./step-two.css", "../new-theme-profile.modal.css"],
    imports: [ToggleButtonComponent, CardComponent],
})
export class StepTwoNewProfileTheme extends ModalComponent {
    @Input() borderRadius: FormControl<number>;
    @Input() borderWidth: FormControl<GeneralMeasureType>;
    @Input() inputSize: FormControl<GeneralMeasureType>;
    @Input() font: FormControl<FontProfileType>;
    @Input() padding: FormControl<GeneralMeasureType>;

    @Output() onClick = new EventEmitter<UpdateProfileControlType<string>>();

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
            const iconName = getPadding(measure.value);
            return {
                ...measure,
                icon: {
                    color: "var(--text-1)",
                    name: iconName,
                },
            };
        }
    );

    ngOnInit() {
        this.modalState.changeHeader("new bill");
        this.modalState.changeFooter({
            type: "submit",
            submitLabel: "advance",
            alertLabel: "cancel",
        });
    }

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
