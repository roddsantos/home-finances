import { Injectable } from "@angular/core";
import { LocalStorageService } from "./services/local-storage.service";
import { UserState } from "./core/subjects/subjects.user";
import { GeneralState } from "./core/subjects/subjects.general";
import { ThemeService } from "./services/theme.service";
import { DEFAULT_THEME } from "src/utils/constants/colors";
import { CustomFilterState } from "./components/custom-filter/custom-filter.subjects.component";

@Injectable({
    providedIn: "root",
})
export class AppService {
    constructor(
        private localStorageService: LocalStorageService,
        private userState: UserState,
        private generalState: GeneralState,
        private themeService: ThemeService,
        private filterState: CustomFilterState,
    ) {}

    appInitializer() {
        try {
            this.generalState.changePage(window.location.pathname);

            const user = this.localStorageService.getUser();
            if (user) this.userState.setUser(user);

            const theme = this.localStorageService.getTheme();
            this.themeService.setTheme(theme ?? DEFAULT_THEME);

            const filters = this.localStorageService.getFilters();
            this.filterState.setFilters(filters ?? []);

            const billsView = this.localStorageService.getBillsLayout();
            this.generalState.changeBillsLayout(billsView);

            const filterContainer = this.localStorageService.getFilterContainerStatus();
            this.generalState.changeFilterContainer(filterContainer === "true");

            return Promise.resolve();
        } catch (error) {
            console.error("Initializer error", error);
            return Promise.resolve();
        }
    }
}
