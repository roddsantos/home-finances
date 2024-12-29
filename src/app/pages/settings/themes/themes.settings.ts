import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CardComponent } from "src/app/components/card/card.component";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { ThemeObjectType, ThemeType } from "src/app/core/types/general";
import { THEMES } from "src/utils/constants/general";
import { Router } from "@angular/router";

@Component({
    selector: "themes-settings",
    templateUrl: "./themes.settings.html",
    styleUrls: ["./themes.settings.css"],
    standalone: true,
    imports: [CommonModule, CardComponent, MatButtonModule, MatIconModule],
})
export class ThemeSettingsComponent implements OnInit {
    public selectedTheme: ThemeType;
    public router = inject(Router);

    public generalState = inject(GeneralState);
    public storage = inject(LocalStorageService);
    public themes = THEMES;

    private style = getComputedStyle(document.body);
    public secondaryColor = this.style.getPropertyValue("--secondary");

    ngOnInit() {
        this.generalState.theme$.subscribe({
            next: (theme) => (this.selectedTheme = theme as ThemeType),
        });
    }

    clickedTheme(theme: ThemeObjectType) {
        this.generalState.changeThemeObject(theme);
        Object.keys(theme).forEach((key) => {
            document.documentElement.style.setProperty(
                key,
                theme[key as keyof ThemeObjectType]
            );
        });
        document.body.className = "";
        document.body.className = theme.id === "default" ? "" : theme.id;
        this.storage.setTheme(theme.id);
    }
}
