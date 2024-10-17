import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { ServiceCreditCard } from "src/app/services/credit-card.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { CreditCard } from "src/app/types/objects";
import { CreditCardState } from "src/app/core/subjects//subjects.credit-card";
import { UserState } from "src/app/core/subjects//subjects.user";
import { mergeMap } from "rxjs";
import { ActionsComponent } from "src/app/components/actions/actions.component";
import { ActionItem } from "src/app/types/components";

@Component({
    selector: "management-credit-cards",
    templateUrl: "./pages.management.credit-cards.html",
    styleUrls: ["./pages.management.credit-cards.css", "../pages.management.css"],
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
export class CreditCardsManagementComponent {
    public ccApi = inject(ServiceCreditCard);
    public ccState = inject(CreditCardState);
    public userState = inject(UserState);
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
}
