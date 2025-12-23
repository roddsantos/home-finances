import { Component } from "@angular/core";
import { ModalComponent } from "../modal.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import {
    ColorThemeType,
    FontProfileType,
    UpdateProfileControlType,
} from "src/app/core/types/pages/profiles";
import {
    COLOR_THEMES,
    DEFAULT_BACKGROUND_COLORS,
    DEFAULT_COLORS,
    DEFAULT_TEXT_COLORS,
} from "src/utils/constants/colors";
import { ToggleButtonItemsType } from "src/app/core/types/components/toggle-buttons";
import { CommonModule } from "@angular/common";
import { StepOneNewProfileTheme } from "./step-one/step-one";

@Component({
    selector: "new-theme-profile",
    templateUrl: "./new-theme-profile.modal.html",
    styleUrl: "./new-theme-profile.modal.css",
    imports: [
        CommonModule,
        ModalComponent,
        MatExpansionModule,
        ReactiveFormsModule,
        StepOneNewProfileTheme,
    ],
    standalone: true,
})
export class ModalNewThemeProfile extends ModalComponent {
    constructor() {
        super();
    }

    public step = 1;

    public themes: ToggleButtonItemsType<string>[] = Object.keys(COLOR_THEMES).map(
        (theme) => ({
            value: theme,
            label: theme,
        })
    );

    public primaryColors: ToggleButtonItemsType<string>[] = Object.keys(
        DEFAULT_COLORS.default
    ).map((color) => ({
        value: DEFAULT_COLORS.default[color as keyof typeof DEFAULT_COLORS.default],
        label: color,
        icon: {
            name: "colors",
            color: DEFAULT_COLORS.default[color as keyof typeof DEFAULT_COLORS.default],
        },
    }));

    public profileForm = new FormGroup({
        title: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(50)],
            nonNullable: true,
        }),
        description: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(50)],
            nonNullable: true,
        }),
        theme: new FormControl<ColorThemeType>(COLOR_THEMES.default, {
            validators: [Validators.required, Validators.maxLength(20)],
            nonNullable: true,
        }),
        primary: new FormControl<string>(DEFAULT_COLORS.default.red, {
            validators: [Validators.required, Validators.maxLength(20)],
            nonNullable: true,
        }),
        secondary: new FormControl<string>(DEFAULT_COLORS.default.black, {
            validators: [Validators.required, Validators.maxLength(20)],
            nonNullable: true,
        }),
        background: new FormControl<string>(DEFAULT_BACKGROUND_COLORS.grey, {
            validators: [Validators.required, Validators.maxLength(20)],
            nonNullable: true,
        }),
        text1: new FormControl<string>(DEFAULT_TEXT_COLORS.white, {
            validators: [Validators.required, Validators.maxLength(20)],
            nonNullable: true,
        }),
        text2: new FormControl<string>(DEFAULT_TEXT_COLORS.blue, {
            validators: [Validators.required, Validators.maxLength(20)],
            nonNullable: true,
        }),
        borderRadius: new FormControl<number>(5, {
            validators: [Validators.required, Validators.max(20), Validators.min(0)],
            nonNullable: true,
        }),
        borderWidth: new FormControl<number>(1, {
            validators: [Validators.required, Validators.max(5), Validators.min(0)],
            nonNullable: true,
        }),
        font: new FormControl<FontProfileType>("Roboto", {
            validators: [Validators.required, Validators.maxLength(20)],
            nonNullable: true,
        }),
    });

    onChangeTheme(theme: string) {
        this.primaryColors = Object.keys(
            DEFAULT_COLORS[theme as keyof typeof DEFAULT_COLORS]
        ).map((color) => ({
            value: DEFAULT_COLORS[theme as keyof typeof DEFAULT_COLORS][
                color as keyof typeof DEFAULT_COLORS.default
            ],
            label: color,
            icon: {
                name: "colors",
                color: DEFAULT_COLORS[theme as keyof typeof DEFAULT_COLORS][
                    color as keyof typeof DEFAULT_COLORS.default
                ],
            },
        }));
    }

    handleClose() {
        this.onClose();
    }

    handleStepOneClick(event: UpdateProfileControlType<string>) {
        console.log(event, this.profileForm.getRawValue());
    }
}
