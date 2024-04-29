import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { ServiceCategory } from "src/app/services/category.service";
import { FeedbackInfo } from "src/app/types/components";
import { CategoryState } from "src/app/subjects/subjects.category";
import { Category } from "src/app/types/objects";

@Component({
    selector: "management-categories",
    templateUrl: "./pages.management.categories.html",
    styleUrls: ["./pages.management.categories.css"],
    standalone: true,
    imports: [MatIcon, MatButton, FeedbackContainerComponent, CommonModule],
})
export class CategoriesManagementComponent {
    public typebillApi = inject(ServiceCategory);
    public catState = inject(CategoryState);
    public storage = inject(LocalStorageService);
    private snack = inject(CustomSnackbarComponent);

    getCategories(reloaded?: boolean) {
        this.typebillApi.getCategories().subscribe({
            next: (data) => {
                this.catState.setCategory(data as Category[]);
                this.catState.changeStatus(
                    (data as Category[]).length === 0 ? "empty" : "none",
                    "no categories"
                );
            },
            error: () => {
                if (reloaded)
                    this.snack.openSnackBar("error fetching categories", "error");
                this.catState.changeStatus("error", "error fetching categories");
            },
        });
    }

    ngOnInit() {
        this.catState.setAction(() => this.onReload());
    }

    onReload() {
        this.catState.changeStatus("loading", "loading");
        this.getCategories(true);
    }
}
