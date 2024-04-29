import { Component, ViewEncapsulation, inject } from "@angular/core";
import { LocalStorageService } from "./services/local-storage.service";
import { UserState } from "src/app/subjects/subjects.user";
import { CategoryState } from "./subjects/subjects.category";
import { Category } from "./types/objects";
import { ServiceCategory } from "./services/category.service";
import { CustomFilterState } from "./components/custom-filter/custom-filter.subjects.component";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
    public storage = inject(LocalStorageService);
    public userState = inject(UserState);
    public catState = inject(CategoryState);
    public catService = inject(ServiceCategory);
    public filterState = inject(CustomFilterState);

    title = "bills-app";

    ngOnInit() {
        const user = this.storage.getUser();
        if (user) this.userState.setUser(user);
        // else
        //     this.catService.getCategories().subscribe({
        //         next: (cat) => this.catState.setCategory(cat as Category[]),
        //         error: () =>
        //             this.catState.changeStatus("error", "error fetching bills type"),
        //     });

        const filters = this.storage.getFilters();
        if (filters) this.filterState.setFilters(filters);
        else this.filterState.setFilters([]);
    }
}
