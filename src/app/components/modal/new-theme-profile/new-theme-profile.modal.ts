import { Component } from "@angular/core";
import { ModalComponent } from "../modal.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import {
    ColorThemeType,
    FontProfileType,
    GeneralMeasureType,
    UpdateProfileControlType,
} from "src/app/core/types/pages/profiles";
import {
    COLOR_THEMES,
    DEFAULT_BACKGROUND_COLORS,
    DEFAULT_COLORS,
    DEFAULT_TEXT_COLORS,
    GENERAL_MEASURES,
    THEME_FONTS,
} from "src/utils/constants/colors";
import { ToggleButtonItemsType } from "src/app/core/types/components/toggle-buttons";
import { CommonModule } from "@angular/common";
import { StepOneNewProfileTheme } from "./step-one/step-one";
import { StepTwoNewProfileTheme } from "./step-two/step-two";

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
        StepTwoNewProfileTheme,
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

    public profileForm = new FormGroup({
        title: new FormControl<string>("", {
            validators: [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
            ],
            nonNullable: true,
        }),
        description: new FormControl<string>("", {
            validators: [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
            ],
            nonNullable: true,
        }),
        theme: new FormControl<ColorThemeType>(COLOR_THEMES.default, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        primary: new FormControl<string>(DEFAULT_COLORS.default.red.label, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        secondary: new FormControl<string>(DEFAULT_COLORS.default.black.label, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        background: new FormControl<string>(DEFAULT_BACKGROUND_COLORS.grey, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        text1: new FormControl<string>(DEFAULT_TEXT_COLORS.white, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        text2: new FormControl<string>(DEFAULT_TEXT_COLORS.blue, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        borderRadius: new FormControl<number>(5, {
            validators: [Validators.required, Validators.max(20), Validators.min(0)],
            nonNullable: true,
        }),
        borderWidth: new FormControl<GeneralMeasureType>(GENERAL_MEASURES[0].value, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        font: new FormControl<FontProfileType>(THEME_FONTS.roboto, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        inputSize: new FormControl<GeneralMeasureType>(GENERAL_MEASURES[0].value, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        padding: new FormControl<GeneralMeasureType>(GENERAL_MEASURES[0].value, {
            validators: [Validators.required],
            nonNullable: true,
        }),
    });

    ngOnInit() {
        this.modalState.changeFooter({
            type: "submit",
            submitLabel: "advance",
            alertLabel: "cancel",
        });
    }

    handleClose() {
        this.onClose();
    }

    handleNextStep() {
        if (!this.stepOneInvalid()) this.step = 2;
    }

    handleStepOneClick(event: UpdateProfileControlType<string>) {
        console.log(event, this.profileForm.getRawValue());
    }

    stepOneInvalid() {
        const isNameInvalid = this.profileForm.get("title")!.status === "INVALID";
        const isDescInvalid = this.profileForm.get("description")!.status === "INVALID";

        return isNameInvalid || isDescInvalid;
    }

    onDisableButton() {
        switch (this.step) {
            case 1:
                return this.stepOneInvalid();
            default:
                return true;
        }
    }
}
