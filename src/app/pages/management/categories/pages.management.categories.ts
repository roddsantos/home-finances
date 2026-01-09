import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { CategoryService } from "src/app/services/category.service";
import { CategoryState } from "src/app/core/subjects/subjects.category";
import { ActionsComponent } from "src/app/components/actions/actions.component";
import { ActionItem } from "src/app/core/types/components";
import { CategoryObjectType } from "src/app/core/types/data/category.types";

@Component({
    selector: "management-categories",
    templateUrl: "./pages.management.categories.html",
    styleUrls: ["./pages.management.categories.css", "../pages.management.css"],
    standalone: true,
    imports: [MatIcon, FeedbackContainerComponent, CommonModule, ActionsComponent],
})
export class CategoriesManagementComponent {
    public typebillApi = inject(CategoryService);
    public catState = inject(CategoryState);
    public storage = inject(LocalStorageService);
    private snack = inject(CustomSnackbarComponent);

    actions: ActionItem[] = [
        { name: "", icon: "edit", action: () => this.onEdit(), color: "#00328f" },
        {
            name: "",
            icon: "delete",
            action: () => this.onDelete(),
            color: "#8f0000",
        },
    ];

    getCategories(reloaded?: boolean) {
        this.typebillApi.getCategories().subscribe({
            next: (data) => {
                this.catState.setCategory(data as CategoryObjectType[]);
                this.catState.changeStatus(
                    (data as CategoryObjectType[]).length === 0 ? "empty" : "none",
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

    onEdit() {
        console.log("EDIT");
    }

    onDelete() {
        console.log("DELETE");
    }
}
