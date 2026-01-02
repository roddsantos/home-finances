import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CardComponent } from "src/app/components/card/card.component";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { Router } from "@angular/router";
import { Dialog } from "@angular/cdk/dialog";
import { ModalNewThemeProfile } from "src/app/components/modal/new-theme-profile/new-theme-profile.modal";
import { ProfileThemeType } from "src/app/core/types/pages/profiles";
import { ThemeService } from "src/app/services/theme.service";
import { CustonButton } from "src/app/components/button/custom-button.component";
import { ThemeState } from "src/app/core/subjects/subjects.theme";
import { MatTooltip } from "@angular/material/tooltip";
import { ActionsComponent } from "src/app/components/actions/actions.component";
import { ActionItem } from "src/app/core/types/components";

@Component({
    selector: "themes-settings",
    templateUrl: "./themes.settings.html",
    styleUrls: ["./themes.settings.css"],
    standalone: true,
    imports: [
        CommonModule,
        CardComponent,
        MatButtonModule,
        MatIconModule,
        CustonButton,
        MatTooltip,
        ActionsComponent,
    ],
})
export class ThemeSettingsComponent implements OnInit {
    public dialog = inject(Dialog);
    public selectedTheme: string;
    public router = inject(Router);

    public generalState = inject(GeneralState);
    private themeService = inject(ThemeService);
    public themeState = inject(ThemeState);
    public storage = inject(LocalStorageService);

    private style = getComputedStyle(document.body);
    public secondaryColor = this.style.getPropertyValue("--secondary");

    actions: ActionItem[] = [
        {
            name: "",
            icon: "edit",
            action: (data: ProfileThemeType) => this.onEdit(data),
            color: "var(--info)",
        },
        {
            name: "",
            icon: "delete",
            action: (data: ProfileThemeType) => this.onDelete(data),
            color: "var(--error)",
        },
    ];

    ngOnInit() {
        this.generalState.theme$.subscribe({
            next: (theme) => {
                this.selectedTheme = theme;
            },
        });
    }

    clickedTheme(theme: ProfileThemeType) {
        this.selectedTheme = theme.id;
        this.themeService.setTheme(theme);
    }

    onNewProfileTheme() {
        this.dialog.open(ModalNewThemeProfile, {
            data: {},
        });
    }

    onEdit(theme: ProfileThemeType) {
        this.dialog.open(ModalNewThemeProfile, {
            data: { theme, selected: this.selectedTheme === theme.id },
        });
    }

    onDelete(data: ProfileThemeType) {
        console.log("to do");
    }
}
