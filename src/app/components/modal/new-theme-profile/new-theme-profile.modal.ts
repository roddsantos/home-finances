import { Component } from "@angular/core";
import { ModalComponent } from "../modal.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ColorThemeType, FontProfileType } from "src/app/core/types/pages/profiles";
import {
    COLOR_THEMES,
    DEFAULT_BACKGROUND_COLORS,
    DEFAULT_COLORS,
    DEFAULT_TEXT_COLORS,
} from "src/utils/constants/colors";
import { ToggleButtonComponent } from "../../toggle-buttons/toggle-buttons.component";
import { ToggleButtonItemsType } from "src/app/core/types/components/toggle-buttons";
import { CommonModule } from "@angular/common";
import { CardComponent } from "../../card/card.component";

@Component({
    selector: "new-theme-profile",
    templateUrl: "./new-theme-profile.modal.html",
    styleUrl: "./new-theme-profile.modal.css",
    imports: [
        CommonModule,
        ModalComponent,
        MatExpansionModule,
        ReactiveFormsModule,
        ToggleButtonComponent,
        CardComponent,
    ],
    standalone: true,
})
export class ModalNewThemeProfile extends ModalComponent {
    constructor() {
        super();
    }

    public themes: ToggleButtonItemsType<string>[] = Object.keys(COLOR_THEMES).map(
        (theme) => ({
            value: theme,
            label: theme,
        })
    );

    public x = DEFAULT_COLORS["blue"];

    public primaryColors: ToggleButtonItemsType<string>[] = Object.keys(
        DEFAULT_COLORS
    ).map((color) => ({
        value: DEFAULT_COLORS[color as keyof typeof DEFAULT_COLORS],
        label: color,
        icon: {
            name: "colors",
            color: DEFAULT_COLORS[color as keyof typeof DEFAULT_COLORS],
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
        primary: new FormControl<string>(DEFAULT_COLORS.red, {
            validators: [Validators.required, Validators.maxLength(20)],
            nonNullable: true,
        }),
        secondary: new FormControl<string>(DEFAULT_COLORS.black, {
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

    onChangeTheme() {}

    handleClose() {
        this.onClose();
    }
}
