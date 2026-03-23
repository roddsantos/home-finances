import { Component, Inject } from "@angular/core";
import { ModalComponent } from "../modal.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import {
    ColorThemeType,
    FontThemeType,
    GeneralMeasureType,
    ModalDataProfileTheme,
    ThemeObjectType,
    ThemeUpdateType,
    UpdateProfileControlType,
} from "src/app/core/types/pages/theme";
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
import { DIALOG_DATA } from "@angular/cdk/dialog";

@Component({
    selector: "new-theme-profile",
    templateUrl: "./new-theme.modal.html",
    styleUrl: "./new-theme.modal.css",
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
export class ModalNewTheme extends ModalComponent {
    constructor(
        @Inject(DIALOG_DATA) public data: ModalDataProfileTheme,
        private themeService: ThemeService,
        private themeState: ThemeState,
    ) {
        super();
    }

    public step = 1;

    public themes: ToggleButtonItemsType<string>[] = Object.keys(COLOR_THEMES).map(
        (theme) => ({
            value: theme,
            label: theme,
        }),
    );

    public profileForm = new FormGroup({
        title: new FormControl<string>(this.data.theme?.title || "", {
            validators: [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
            ],
            nonNullable: true,
        }),
        description: new FormControl<string>(this.data.theme?.description || "", {
            validators: [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
            ],
            nonNullable: true,
        }),
        theme: new FormControl<ColorThemeType>(
            this.data.theme?.theme || COLOR_THEMES.default,
            {
                validators: [Validators.required],
                nonNullable: true,
            },
        ),
        primary: new FormControl<string>(
            this.data.theme?.primary || DEFAULT_COLORS.default.red.label,
            {
                validators: [Validators.required],
                nonNullable: true,
            },
        ),
        secondary: new FormControl<string>(
            this.data.theme?.secondary || DEFAULT_COLORS.default.black.label,
            {
                validators: [Validators.required],
                nonNullable: true,
            },
        ),
        background: new FormControl<string>(
            this.data.theme?.background || DEFAULT_BACKGROUND_COLORS.dark.base.label,
            {
                validators: [Validators.required],
                nonNullable: true,
            },
        ),
        text1: new FormControl<string>(
            this.data.theme?.text1 || DEFAULT_TEXT_COLORS.light.black.label,
            {
                validators: [Validators.required],
                nonNullable: true,
            },
        ),
        text2: new FormControl<string>(
            this.data.theme?.text2 || DEFAULT_TEXT_COLORS.dark.white.label,
            {
                validators: [Validators.required],
                nonNullable: true,
            },
        ),
        borderRadius: new FormControl<number>(this.data.theme?.borderRadius || 5, {
            validators: [Validators.required, Validators.max(20), Validators.min(0)],
            nonNullable: true,
        }),
        borderWidth: new FormControl<GeneralMeasureType>(
            this.data.theme?.borderWidth || GENERAL_MEASURES[1].value,
            {
                validators: [Validators.required],
                nonNullable: true,
            },
        ),
        font1: new FormControl<FontThemeType>(
            this.data.theme?.font1 || THEME_FONTS.roboto,
            {
                validators: [Validators.required],
                nonNullable: true,
            },
        ),
        font2: new FormControl<FontThemeType>(
            this.data.theme?.font2 || THEME_FONTS.commissioner,
            {
                validators: [Validators.required],
                nonNullable: true,
            },
        ),
        inputSize: new FormControl<GeneralMeasureType>(
            this.data.theme?.inputSize || GENERAL_MEASURES[1].value,
            {
                validators: [Validators.required],
                nonNullable: true,
            },
        ),
        padding: new FormControl<GeneralMeasureType>(
            this.data.theme?.padding || GENERAL_MEASURES[1].value,
            {
                validators: [Validators.required],
                nonNullable: true,
            },
        ),
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
                submitLabel:
                    this.step === 3 ? (this.data.theme ? "update" : "create") : "advance",
                alertLabel: this.step === 1 ? "cancel" : "back",
            });
        }
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

    onCreate() {
        this.themeService.createTheme(this.profileForm.getRawValue()).subscribe({
            next: (theme) => {
                this.themeState.addTheme(theme);
                this.generalService.successSnackbar("theme created successfully");
                this.onClose();
            },
            error: () => {
                this.generalService.errorSnackbar("error creating theme");
            },
        });
    }

    onUpdate() {
        const data: ThemeUpdateType = {
            ...this.profileForm.getRawValue(),
            id: this.data.theme.id,
        };
        this.themeService.updateTheme(data).subscribe({
            next: (theme) => {
                this.themeState.updateTheme(theme);

                if (this.data.selected) this.themeService.setTheme(theme);

                this.generalService.successSnackbar("theme updated successfully");
                this.onClose();
            },
            error: () => {
                this.generalService.errorSnackbar("error updating theme");
            },
        });
    }

    onSubmit() {
        if (this.profileForm.invalid) return;
        if (this.data.theme) this.onUpdate();
        else this.onCreate();
    }
}
