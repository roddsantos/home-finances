import { Component } from "@angular/core";
import { ModalComponent } from "../modal.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import {
    ColorThemeType,
    FontProfileType,
    GeneralMeasureType,
    ThemeBodyType,
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
import { StepThreeNewProfileTheme } from "./step-three/step-three";
import { ThemeService } from "src/app/services/theme.service";
import { ThemeState } from "src/app/core/subjects/subjects.theme";

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
        StepThreeNewProfileTheme,
    ],
    standalone: true,
})
export class ModalNewThemeProfile extends ModalComponent {
    constructor(private themeService: ThemeService, private themeState: ThemeState) {
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
        background: new FormControl<string>(DEFAULT_BACKGROUND_COLORS.dark.base.label, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        text1: new FormControl<string>(DEFAULT_TEXT_COLORS.light.base.label, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        text2: new FormControl<string>(DEFAULT_TEXT_COLORS.dark.base.label, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        borderRadius: new FormControl<number>(5, {
            validators: [Validators.required, Validators.max(20), Validators.min(0)],
            nonNullable: true,
        }),
        borderWidth: new FormControl<GeneralMeasureType>(GENERAL_MEASURES[1].value, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        font1: new FormControl<FontProfileType>(THEME_FONTS.roboto, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        font2: new FormControl<FontProfileType>(THEME_FONTS.commissioner, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        inputSize: new FormControl<GeneralMeasureType>(GENERAL_MEASURES[1].value, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        padding: new FormControl<GeneralMeasureType>(GENERAL_MEASURES[1].value, {
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

    handlePreviousStep() {
        if (this.step === 1) this.handleClose();
        else {
            this.step = this.step - 1;
            this.modalState.changeFooter({
                type: "submit",
                submitLabel: this.step === 3 ? "create" : "advance",
                alertLabel: this.step === 1 ? "cancel" : "back",
            });
        }
    }

    handleNextStep() {
        if (this.step === 3) this.onSubmit();
        else {
            this.step = this.step + 1;
            this.modalState.changeFooter({
                type: "submit",
                submitLabel: this.step === 3 ? "create" : "advance",
                alertLabel: this.step === 1 ? "cancel" : "back",
            });
        }
    }

    handleStepOneClick(event: UpdateProfileControlType<string>) {
        console.log(event, this.profileForm.getRawValue());
    }

    handleStepTwoClick(event: UpdateProfileControlType<string>) {
        console.log(event, this.profileForm.getRawValue());
    }

    stepOneInvalid() {
        const isNameInvalid = this.profileForm.get("title")!.status === "INVALID";
        const isDescInvalid = this.profileForm.get("description")!.status === "INVALID";

        return isNameInvalid || isDescInvalid;
    }

    stepThreeInvalid() {
        return this.profileForm.get("borderRadius")!.status === "INVALID";
    }

    onDisableButton() {
        switch (this.step) {
            case 1:
                return this.stepOneInvalid();
            case 2:
                return false;
            case 3:
                return this.stepThreeInvalid();
            default:
                return true;
        }
    }

    onSubmit() {
        this.themeService
            .createTheme(this.profileForm.getRawValue() as unknown as ThemeBodyType)
            .subscribe({
                next: (theme) => {
                    this.themeState.addTheme(theme);
                    this.generalService.successSnackbar("Theme created successfully");
                    this.onClose();
                },
                error: () => {
                    this.generalService.errorSnackbar("Error creating theme");
                },
            });
    }
}
