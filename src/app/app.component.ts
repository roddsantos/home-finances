import { Component, ViewEncapsulation, inject } from "@angular/core";
import { LocalStorageService } from "./services/local-storage.service";
import { UserState } from "src/app/core/subjects/subjects.user";
import { CategoryState } from "src/app/core/subjects/subjects.category";
import { CategoryService } from "./services/category.service";
import { CustomFilterState } from "./components/custom-filter/custom-filter.subjects.component";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { UserService } from "./services/user.service";
import { BINARY_THEME, DEFAULT_THEME, RED_AND_BLACK } from "src/utils/constants/colors";
import { ThemeService } from "./services/theme.service";
import { ThemeState } from "./core/subjects/subjects.theme";
import { ThemeObjectType } from "./core/types/pages/theme";

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
    public catService = inject(CategoryService);
    public filterState = inject(CustomFilterState);
    public userService = inject(UserService);
    public themeService = inject(ThemeService);
    public themeState = inject(ThemeState);

    title = "bills-app";
    theme = this.storage.getTheme();
    public allThemes: ThemeObjectType[] = [];

    ngOnInit() {
        // GET FILTERS
        const filters = this.storage.getFilters();
        if (filters) this.filterState.setFilters(filters);
        else this.filterState.setFilters([]);

        // GET BILLS LAYOUT
        const billsView = this.storage.getBillsLayout();
        this.generalState.changeBillsLayout(billsView);

        // GET FILTER CONTAINER
        const filterContainer = this.storage.getFilterContainerStatus();
        if (filterContainer === undefined || filterContainer === null) {
            this.generalState.changeFilterContainer(true);
        } else {
            this.generalState.changeFilterContainer(
                filterContainer === "true" ? true : false
            );
        }
    }
}
