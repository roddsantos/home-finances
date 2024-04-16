import { NgFor, NgIf } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { ServiceCreditCard } from "src/app/services/services.credit-card";
import { LocalStorageService } from "src/app/services/services.local-storage";
import { FeedbackInfo } from "src/app/types/components";
import { CreditCard, User } from "src/app/types/general";
import { CreditCardState } from "../../subjects/subjects.credit-card";
import { UserState } from "../../subjects/subjects.user";

@Component({
    selector: "management-credit-cards",
    templateUrl: "./pages.management.credit-cards.html",
    styleUrls: ["./pages.management.credit-cards.css"],
    standalone: true,
    imports: [MatIcon, MatButton, NgFor, NgIf, FeedbackContainerComponent],
})
export class CreditCardsManagementComponent {
    public ccApi = inject(ServiceCreditCard);
    public ccState = inject(CreditCardState);
    public userState = inject(UserState);
    public storage = inject(LocalStorageService);
    private snack = inject(CustomSnackbarComponent);

    creditCards: CreditCard[] = [];
    user: User | null = null;
    loading: boolean = false;

    typeObject: FeedbackInfo = {
        title: "no credit cards",
        actionLabel: "reload",
        action: () => this.onReload(),
        loading: this.loading,
    };

    getCreditCards() {
        if (this.user) {
            this.ccApi.getCreditCards({ userId: this.user.id }).subscribe({
                next: (data) => {
                    this.ccState.setCreditCards(data as CreditCard[]);
                },
                error: () => {
                    this.ccState.changeStatus("error");
                    this.ccState.setCreditCards([]);
                },
            });
            this.ccState.ceditCards$.subscribe({
                next: (data) => (this.creditCards = data),
            });
        } else this.ccState.changeStatus("empty");
        this.loading = false;
    }

    ngOnInit() {
        this.loading = true;
        this.userState.user$.subscribe({
            next: (u) => (this.user = u),
        });
        this.getCreditCards();
    }

    onReload() {
        this.loading = true;
        this.getCreditCards();
    }
}
