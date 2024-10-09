import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
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
    imports: [
        CommonModule,
        ColorPipe,
        CardComponent,
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
    ],
})
export class PageSettings {
    public storage = inject(LocalStorageService);
    public themes = THEMES;

    public theme: ThemeType;

    ngOnInit() {
        const themeFromStorage = this.storage.getTheme();
        if (themeFromStorage) this.theme = themeFromStorage as ThemeType;
    }
}
