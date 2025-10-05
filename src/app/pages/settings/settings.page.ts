import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { ThemeSettingsComponent } from "./themes/themes.settings";
import { ProfileSettingsComponent } from "./profile/profile.settings";
import { UserState } from "src/app/core/subjects/subjects.user";

@Component({
    selector: "page-settings",
    templateUrl: "./settings.page.html",
    styleUrls: ["./settings.page.css"],
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        ThemeSettingsComponent,
        ProfileSettingsComponent,
    ],
})
export class PageSettings {
    public general = inject(GeneralState);
    public storage = inject(LocalStorageService);
    public user = inject(UserState);

    private style = getComputedStyle(document.body);
    public secondaryColor = this.style.getPropertyValue("--secondary");
    public changedTheme: boolean;
    public changedUser: boolean;

    ngOnInit() {}
}
