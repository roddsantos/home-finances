import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { ServiceCreditCard } from "src/app/services/credit-card.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { CreditCard } from "src/app/types/objects";
import { CreditCardState } from "src/app/subjects//subjects.credit-card";
import { UserState } from "src/app/subjects//subjects.user";
import { mergeMap } from "rxjs";
import { ActionsComponent } from "src/app/components/actions/actions.component";
import { ActionItem } from "src/app/types/components";
import { GeneralState } from "src/app/subjects/subjects.general";
import { ROUTES } from "src/utils/route";

@Component({
    selector: "page-credit-cards",
    templateUrl: "./pages.credit-cards.html",
    styleUrls: ["./pages.credit-cards.css"],
    standalone: true,
    imports: [
        MatIcon,
        MatButton,
        FeedbackContainerComponent,
        CommonModule,
        MatIconButton,
        ActionsComponent,
    ],
})
export class PageCreditCards {
    public ccApi = inject(ServiceCreditCard);
    public ccState = inject(CreditCardState);
    public userState = inject(UserState);
    public storage = inject(LocalStorageService);
    private snack = inject(CustomSnackbarComponent);
    public generalState = inject(GeneralState);

    public actualPage = window.location.pathname;
    public page = ROUTES.find((r) => r.page === this.actualPage);

    actions: ActionItem[] = [
        { name: "", icon: "edit", action: () => this.onEdit(), color: "#00328f" },
        {
            name: "",
            icon: "delete",
            action: () => this.onDelete(),
            color: "#8f0000",
        },
    ];

    getCreditCards(reloaded?: boolean) {
        this.userState.user$
            .pipe(mergeMap((user) => this.ccApi.getCreditCards({})))
            .subscribe({
                next: (ccs) => {
                    this.ccState.setCreditCards(ccs as CreditCard[]);
                    this.ccState.changeStatus(
                        (ccs as CreditCard[]).length === 0 ? "empty" : "none",
                        "no companies"
                    );
                },
                error: () => {
                    if (reloaded)
                        this.snack.openSnackBar("error fetching credit cards", "error");
                    this.ccState.changeStatus("error", "error fetching credit cards");
                },
            });
    }

    ngOnInit() {
        this.ccState.setAction(() => this.onReload());
    }

    onReload() {
        this.ccState.changeStatus("loading", "loading");
        this.getCreditCards(true);
    }

    onEdit() {
        console.log("EDIT");
    }

    onDelete() {
        console.log("DELETE");
    }

    getColorContrast(color: string) {
        var expectedColor = color;
        this.generalState.theme$.subscribe({
            next: (theme) => {
                if (theme === "binary") expectedColor = "#000000";
            },
        });
        let r = parseInt(expectedColor.substring(0, 2), 16); // hexToR - max 76,245
        let g = parseInt(expectedColor.substring(2, 4), 16); // hexToG - max 149,685
        let b = parseInt(expectedColor.substring(4, 6), 16); // hexToB - max 29,07
        return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#ffffff"; // max 255
    }
}
