import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CardComponent } from "src/app/components/card/card.component";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { GeneralState } from "src/app/subjects/subjects.general";
import { ThemeType } from "src/app/types/general";
import { THEMES } from "src/utils/constants/general";
import { ColorPipe } from "src/utils/pipes/colors";

@Component({
    selector: "themes-settings",
    templateUrl: "./themes.settings.html",
    styleUrls: ["./themes.settings.css"],
    standalone: true,
    imports: [CommonModule, ColorPipe, CardComponent, MatButtonModule, MatIconModule],
})
export class ThemeSettingsComponent implements OnInit {
    @Input() selectedTheme: ThemeType;
    @Output() onSelect = new EventEmitter<ThemeType>();

    public general = inject(GeneralState);
    public storage = inject(LocalStorageService);
    public themes = THEMES;

    public actualTheme: ThemeType;

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

    clickedTheme(t: string) {
        this.onSelect.emit(t as ThemeType);
    }
}
