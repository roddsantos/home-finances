import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CardComponent } from "src/app/components/card/card.component";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { GeneralState } from "src/app/subjects/subjects.general";
import { ThemeType } from "src/app/types/general";
import { THEMES } from "src/utils/constants/general";
import { ColorPipe } from "src/utils/pipes/colors";

@Component({
    selector: "page-settings",
    templateUrl: "./settings.page.html",
    styleUrls: ["./settings.page.css"],
    standalone: true,
    imports: [CommonModule, ColorPipe, CardComponent, MatButtonModule, MatIconModule],
})
export class PageSettings {
    public general = inject(GeneralState);
    public storage = inject(LocalStorageService);
    public themes = THEMES;

    public actualTheme: ThemeType;
    public selectedTheme: ThemeType;

    private style = getComputedStyle(document.body);
    public secondaryColor = this.style.getPropertyValue("--secondary");

    ngOnInit() {
        this.general.theme$.subscribe({
            next: (theme) => {
                this.actualTheme = theme as ThemeType;
            },
        });
        if (this.actualTheme) this.selectedTheme = this.actualTheme as ThemeType;
    }

    onSelect(t: string) {
        this.selectedTheme = t as ThemeType;
    }

    hasChanges() {
        return this.actualTheme !== this.selectedTheme;
    }

    onSaveChanges() {
        if (this.actualTheme !== this.selectedTheme) {
            document.body.className = "";
            document.body.className =
                this.selectedTheme === "default" ? "" : this.selectedTheme;
            this.actualTheme = this.selectedTheme;
            this.storage.setTheme(this.selectedTheme);
        }
    }
}
