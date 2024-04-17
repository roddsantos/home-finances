import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { ServiceCreditCard } from "src/app/services/services.credit-card";
import { LocalStorageService } from "src/app/services/services.local-storage";
import { FeedbackInfo } from "src/app/types/components";
import { CreditCard, User } from "src/app/types/general";
import { CreditCardState } from "src/app/subjects//subjects.credit-card";
import { UserState } from "src/app/subjects//subjects.user";
import { mergeMap } from "rxjs";

@Component({
    selector: "management-credit-cards",
    templateUrl: "./pages.management.credit-cards.html",
    styleUrls: ["./pages.management.credit-cards.css"],
    standalone: true,
    imports: [MatIcon, MatButton, NgFor, NgIf, FeedbackContainerComponent, AsyncPipe],
})
export class CreditCardsManagementComponent {
    public ccApi = inject(ServiceCreditCard);
    public ccState = inject(CreditCardState);
    public userState = inject(UserState);
    public storage = inject(LocalStorageService);
    private snack = inject(CustomSnackbarComponent);

    loading: boolean = false;

    typeObject: FeedbackInfo = {
        title: "no credit cards",
        actionLabel: "reload",
        action: () => this.onReload(),
        loading: this.loading,
    };

    getCreditCards(reloaded?: boolean) {
        this.userState.user$
            .pipe(
                mergeMap((user) =>
                    this.ccApi.getCreditCards({
                        userId: user!.id,
                    })
                )
            )
            .subscribe({
                next: (ccs) => {
                    this.ccState.setCreditCards(ccs as CreditCard[]);
                },
                error: () => {
                    if (reloaded)
                        this.snack.openSnackBar("Error fetching banks", "error");
                    this.ccState.changeStatus("error");
                },
            });
        this.loading = false;
    }

    ngOnInit() {
        this.loading = true;
        this.getCreditCards();
    }

    onReload() {
        this.loading = true;
        this.getCreditCards(true);
    }
}
