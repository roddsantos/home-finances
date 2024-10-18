import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CardComponent } from "src/app/components/card/card.component";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { ThemeType } from "src/app/core/types/general";
import { THEMES } from "src/utils/constants/general";
import { ColorPipe } from "src/utils/pipes/colors";
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
        ColorPipe,
        CardComponent,
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
    public themes = THEMES;

    public actualTheme: ThemeType;
    public selectedTheme: ThemeType;

    private style = getComputedStyle(document.body);
    public secondaryColor = this.style.getPropertyValue("--secondary");

    public profileForm = new FormGroup({
        name: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        surname: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
        username: new FormControl<string>("", {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
        }),
    });
    public changedTheme: boolean;
    public changedUser: boolean;

    ngOnInit() {
        this.general.theme$.subscribe({
            next: (theme) => {
                this.actualTheme = theme as ThemeType;
            },
        });
        if (this.actualTheme) this.selectedTheme = this.actualTheme as ThemeType;
        this.user.user$.subscribe({
            next: (user) => this.profileForm.patchValue({ ...user }),
        });
    }

    getProfileForm() {
        return {
            name: this.profileForm.get("name")?.value || "",
            surname: this.profileForm.get("surname")?.value || "",
            username: this.profileForm.get("username")?.value || "",
        };
    }

    onPatch(e: any) {
        this.profileForm.patchValue(e);
        this.user.user$.subscribe({
            next: (user) => {
                if (
                    this.profileForm.get("name")?.value !== user?.name ||
                    this.profileForm.get("surname")?.value !== user?.surname ||
                    this.profileForm.get("username")?.value !== user?.username
                )
                    this.changedUser = true;
                else this.changedUser = false;
            },
        });
    }

    onSelect(t: ThemeType) {
        this.selectedTheme = t;
        this.changedTheme = this.actualTheme !== t;
    }

    changedUserInfo(flag: boolean) {
        this.changedUser = flag;
    }

    onSaveChanges() {
        if (this.actualTheme !== this.selectedTheme) {
            document.body.className = "";
            document.body.className =
                this.selectedTheme === "default" ? "" : this.selectedTheme;
            this.actualTheme = this.selectedTheme;
            this.storage.setTheme(this.selectedTheme);
            this.changedTheme = false;
        }
    }
}
