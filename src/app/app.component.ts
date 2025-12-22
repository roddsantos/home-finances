import { Component, ViewEncapsulation, inject } from "@angular/core";
import { LocalStorageService } from "./services/local-storage.service";
import { UserState } from "src/app/core/subjects/subjects.user";
import { CategoryState } from "src/app/core/subjects/subjects.category";
import { ServiceCategory } from "./services/category.service";
import { CustomFilterState } from "./components/custom-filter/custom-filter.subjects.component";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { UserService } from "./services/user.service";
import { ProfileThemeType } from "./core/types/pages/profiles";
import {
    BINARY_THEME,
    COLOR_STATUS,
    DEFAULT_THEME,
    FIELD_TO_PROPERTY,
    RED_AND_BLACK,
} from "src/utils/constants/colors";
import { ThemeService } from "./services/theme.service";

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
    public themeService = inject(ThemeService);

    title = "bills-app";
    theme = this.storage.getTheme();

    setupTheme(profileTheme: ProfileThemeType) {
        const { primary, secondary, theme, borderWidth, borderRadius } = profileTheme;

        Object.keys(FIELD_TO_PROPERTY).map((field) => {
            const property = FIELD_TO_PROPERTY[field as keyof typeof FIELD_TO_PROPERTY];

            document.documentElement.style.setProperty(
                property,
                // @ts-ignore
                profileTheme[field]
            );
        });
        Object.keys(COLOR_STATUS[theme]).map((field) => {
            // @ts-ignore
            const value = COLOR_STATUS[theme][field as keyof typeof COLOR_STATUS];
            document.documentElement.style.setProperty("--" + field, value);
        });
        document.documentElement.style.setProperty(
            "--bh",
            "rgb(from var(--background) calc(r - 10) calc(g - 10) calc(b - 10))"
        );
        document.documentElement.style.setProperty(
            "--border-color",
            this.theme === "binary" ? secondary : primary
        );
        document.documentElement.style.setProperty("--border-width", `${borderWidth}px`);
        document.documentElement.style.setProperty(
            "--border-radius",
            `${borderRadius}px`
        );
    }

    ngOnInit() {
        // GET USER INFO
        const user = this.storage.getUser();
        if (user) this.userState.setUser(user);

        // GET FILTERS
        const filters = this.storage.getFilters();
        if (filters) this.filterState.setFilters(filters);
        else this.filterState.setFilters([]);

        // GET THEME
        const theme = this.storage.getTheme();
        if (theme) {
            const selectedTheme = [BINARY_THEME, RED_AND_BLACK, DEFAULT_THEME].find(
                (th) => th.id === theme
            );
            this.themeService.setTheme(selectedTheme!);
        }

        // GET BILLS LAYOUT
        const billsView = this.storage.getBillsLayout();
        this.generalState.changeBillsLayout(billsView);

        // GET FILTER CONTAINER
        const filterContainer = this.storage.getFilterContainerStatus();
        if (filterContainer === undefined || filterContainer === null)
            this.generalState.changeFilterContainer(true);
        else
            this.generalState.changeFilterContainer(
                filterContainer === "true" ? true : false
            );
    }
}
