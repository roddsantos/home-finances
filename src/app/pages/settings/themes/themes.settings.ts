import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CardComponent } from "src/app/components/card/card.component";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { ThemeObjectType } from "src/app/core/types/general";
import { THEMES } from "src/utils/constants/general";
import { Router } from "@angular/router";
import { Dialog } from "@angular/cdk/dialog";
import { ModalNewThemeProfile } from "src/app/components/modal/new-theme-profile/new-theme-profile.modal";
import { ProfileThemeType } from "src/app/core/types/pages/profiles";
import { BINARY_THEME, DEFAULT_THEME, RED_AND_BLACK } from "src/utils/constants/colors";

@Component({
    selector: "themes-settings",
    templateUrl: "./themes.settings.html",
    styleUrls: ["./themes.settings.css"],
    standalone: true,
    imports: [CommonModule, CardComponent, MatButtonModule, MatIconModule],
})
export class ThemeSettingsComponent implements OnInit {
    public dialog = inject(Dialog);
    public selectedTheme: string;
    public router = inject(Router);

    public generalState = inject(GeneralState);
    public storage = inject(LocalStorageService);
    public themes = [BINARY_THEME, RED_AND_BLACK, DEFAULT_THEME];

    private style = getComputedStyle(document.body);
    public secondaryColor = this.style.getPropertyValue("--secondary");

    ngOnInit() {
        this.generalState.theme$.subscribe({
            next: (theme) => (this.selectedTheme = theme),
        });
    }

    clickedTheme(theme: ProfileThemeType) {
        this.generalState.changeThemeObject(theme);
        // Object.keys(theme).forEach((key) => {
        //     document.documentElement.style.setProperty(
        //         key,
        //         theme[key as keyof ThemeObjectType]
        //     );
        // });
        document.body.className = "";
        document.body.className = theme.id === "default" ? "" : theme.id;
        console.log(theme);
        this.storage.setTheme(theme.id);
    }

    onNewProfileTheme() {
        this.dialog.open(ModalNewThemeProfile, {});
    }
}
