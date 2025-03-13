import { Component, ViewEncapsulation, inject } from "@angular/core";
import { LocalStorageService } from "./services/local-storage.service";
import { UserState } from "src/app/core/subjects/subjects.user";
import { CategoryState } from "src/app/core/subjects/subjects.category";
import { ServiceCategory } from "./services/category.service";
import { CustomFilterState } from "./components/custom-filter/custom-filter.subjects.component";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { ThemeObjectType, ThemeType } from "src/app/core/types/general";
import { UserService } from "./services/user.service";
import { THEMES } from "src/utils/constants/general";
import { PageLogin } from "./pages/login/login.page";

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
    public userService = inject(UserService);

    title = "bills-app";
    theme = this.storage.getTheme();

    ngOnInit() {
        const user = this.storage.getUser();
        if (user) this.userState.setUser(user);

        const filters = this.storage.getFilters();
        if (filters) this.filterState.setFilters(filters);
        else this.filterState.setFilters([]);

        const theme = this.storage.getTheme();
        if (theme) {
            const selectedTheme = THEMES.find((th) => th.id === theme);
            this.generalState.changeTheme((theme || "default") as ThemeType);
            this.generalState.changeThemeObject(selectedTheme!);
            Object.keys(selectedTheme!).forEach((key) => {
                document.documentElement.style.setProperty(
                    key,
                    selectedTheme![key as keyof ThemeObjectType]
                );
            });
            document.body.className = "";
            document.body.className = theme === "default" ? "" : theme;
        }

        const filterContainer = this.storage.getFilterContainerStatus();
        if (filterContainer === undefined || filterContainer === null)
            this.generalState.changeFilterContainer(true);
        else
            this.generalState.changeFilterContainer(
                filterContainer === "true" ? true : false
            );
    }
}
