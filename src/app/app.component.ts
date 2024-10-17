import { Component, ViewEncapsulation, inject } from "@angular/core";
import { LocalStorageService } from "./services/local-storage.service";
import { UserState } from "src/app/core/subjects/subjects.user";
import { CategoryState } from "src/app/core/subjects/subjects.category";
import { ServiceCategory } from "./services/category.service";
import { CustomFilterState } from "./components/custom-filter/custom-filter.subjects.component";
import { Router } from "@angular/router";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { ThemeType } from "./types/general";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
    public storage = inject(LocalStorageService);
    public generalState = inject(GeneralState);
    public userState = inject(UserState);
    public catState = inject(CategoryState);
    public catService = inject(ServiceCategory);
    public filterState = inject(CustomFilterState);

    title = "bills-app";
    theme = this.storage.getTheme();

    ngOnInit() {
        const user = this.storage.getUser();
        if (user) this.userState.setUser(user);

        const filters = this.storage.getFilters();
        if (filters) this.filterState.setFilters(filters);
        else this.filterState.setFilters([]);

        const theme = this.storage.getTheme();
        this.generalState.changeTheme((theme || "default") as ThemeType);
        if (theme) {
            document.body.className = "";
            document.body.className = theme === "default" ? "" : theme;
        }
    }
}
