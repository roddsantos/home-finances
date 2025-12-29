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

@Component({
    selector: "themes-settings",
    templateUrl: "./themes.settings.html",
    styleUrls: ["./themes.settings.css"],
    standalone: true,
    imports: [CommonModule, CardComponent, MatButtonModule, MatIconModule, CustonButton],
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
        this.dialog.open(ModalNewThemeProfile, {});
    }
}
