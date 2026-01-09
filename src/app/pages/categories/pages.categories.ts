import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { Company } from "src/app/core/types/objects";
import { UserState } from "src/app/core/subjects//subjects.user";
import { ActionsComponent } from "src/app/components/actions/actions.component";
import { ActionItem } from "src/app/core/types/components";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { ROUTES } from "src/utils/route";
import { Dialog } from "@angular/cdk/dialog";
import { CategoryService } from "src/app/services/category.service";
import { CategoryState } from "src/app/core/subjects/subjects.category";
import { ModalNewCategory } from "src/app/components/modal/new-category/new-category.modal";
import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";
import { CategoryObjectType } from "src/app/core/types/data/category.types";

@Component({
    selector: "page-categories",
    templateUrl: "./pages.categories.html",
    styleUrls: ["./pages.categories.css"],
    standalone: true,
    imports: [
        MatIcon,
        MatButtonModule,
        FeedbackContainerComponent,
        CommonModule,
        ActionsComponent,
    ],
})
export class PageCategories {
    public categoryService = inject(CategoryService);
    public categoryState = inject(CategoryState);
    public userState = inject(UserState);
    public storage = inject(LocalStorageService);
    private snack = inject(CustomSnackbarComponent);
    public generalState = inject(GeneralState);
    public dialog = inject(Dialog);

    public actualPage = window.location.pathname;
    public page = ROUTES.find((r) => r.page === this.actualPage);

    actions: ActionItem[] = [
        { name: "", icon: "edit", action: (data) => this.onEdit(data), color: "#00328f" },
        {
            name: "",
            icon: "delete",
            action: () => this.onDelete(),
            color: "#8f0000",
        },
    ];

    getCategories(reloaded?: boolean) {
        this.categoryService.getCategories().subscribe({
            next: (categories) => {
                this.categoryState.setCategory(categories as CategoryObjectType[]);
                this.categoryState.changeStatus(
                    (categories as Company[]).length === 0 ? "empty" : "none",
                    "no categories"
                );
            },
            error: () => {
                if (reloaded)
                    this.snack.openSnackBar("error fetching categories", "error");
                this.categoryState.changeStatus("error", "error fetching categories");
            },
        });
    }

    ngOnInit() {
        this.categoryState.setAction(() => this.onReload());
    }

    onReload() {
        this.categoryState.changeStatus("loading", "loading");
        this.getCategories(true);
    }

    onEdit(category: any) {
        let options = {
            data: category,
        };
        this.dialog.open(ModalNewCategory, options);
    }

    onCreate() {
        let options = {};
        this.dialog.open(ModalNewCategory, options);
    }

    onDelete() {
        console.log("DELETE");
    }

    openDetails(category: CategoryObjectType, e: any) {
        const className = e.target.className;
        if (className !== "mat-mdc-button-touch-target") {
            const option = {
                data: category,
            };
            this.dialog.open(ModalViewItem, option);
        }
    }
}
