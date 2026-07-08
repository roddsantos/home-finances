import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { CreditCardService } from "src/app/services/credit-card.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { CreditCardState } from "src/app/core/subjects//subjects.credit-card";
import { UserState } from "src/app/core/subjects//subjects.user";
import { ActionsComponent } from "src/app/components/actions/actions.component";
import { ActionItem } from "src/app/core/types/components";
import { ROUTES } from "src/utils/route";
import { ModalNewCreditCard } from "src/app/components/modal/new-credit-card/new-credit-card.modal";
import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";
import { CreditCardPipe } from "src/utils/pipes/creditCard";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { GeneralPage } from "src/app/core/general/page.general";
import { CreditCardObjectType } from "src/app/core/types/data/credit-card.types";
import { MONTHS } from "src/utils/constants/general";

@Component({
    selector: "page-credit-cards",
    templateUrl: "./pages.credit-cards.html",
    styleUrls: ["./pages.credit-cards.css"],
    standalone: true,
    imports: [
        ActionsComponent,
        CommonModule,
        CreditCardPipe,
        FeedbackContainerComponent,
        MatButtonModule,
        MatIconModule,
    ],
})
export class PageCreditCards extends GeneralPage {
    public creditCardState = inject(CreditCardState);
    public userState = inject(UserState);
    public storage = inject(LocalStorageService);

    public creditCardService = inject(CreditCardService);

    public style = getComputedStyle(document.body);
    public bhColor = this.style.getPropertyValue("--bh");
    public primaryColor = this.style.getPropertyValue("--primary");
    public secondaryColor = this.style.getPropertyValue("--secondary");
    public errorColor = this.style.getPropertyValue("--error");
    public successColor = this.style.getPropertyValue("--success");
    public infoColor = this.style.getPropertyValue("--info");
    public actualPage = window.location.pathname;
    public page = ROUTES.find((r) => r.page === this.actualPage);
    public theme = "default";
    public monthList = MONTHS;

    actions: ActionItem[] = [
        {
            name: "",
            icon: "edit",
            action: (data) => this.onEdit(data),
            color: this.infoColor,
        },
        {
            name: "",
            icon: "delete",
            action: () => this.onDelete(),
            color: this.errorColor,
        },
        {
            name: "end invoice",
            icon: "check_circle",
            action: (data) => this.onFinishInvoice(data),
            color: this.successColor,
            hidden: (data) => {
                const newDate = new Date();
                return !(
                    newDate.getMonth() > data.month && newDate.getDate() >= data.day
                );
            },
        },
    ];

    getCreditCards(reloaded?: boolean) {
        this.creditCardService.getCreditCards().subscribe({
            next: (ccs) => {
                this.creditCardState.setCreditCards(ccs);
            },
            error: () => {
                if (reloaded)
                    this.generalService.errorSnackbar("error fetching credit cards");
                this.creditCardState.changeStatus("error", "error fetching credit cards");
            },
        });
    }

    ngOnInit() {
        this.creditCardState.setAction(() => this.onReload());
        this.generalState.theme$.subscribe({
            next: (theme) => (this.theme = theme),
        });
    }

    onReload() {
        this.creditCardState.changeStatus("loading", "loading");
        this.getCreditCards(true);
    }

    onCreate() {
        let options = {};
        this.dialog.open(ModalNewCreditCard, options);
    }

    onEdit(creditCard: CreditCardObjectType) {
        let options = {
            data: creditCard,
        };
        this.dialog.open(ModalNewCreditCard, options);
    }

    onFinishInvoice(creditCard: CreditCardObjectType) {
        this.creditCardService.closeInvoice(creditCard.id).subscribe({
            next: () => {
                this.getCreditCards();
                this.generalService.successSnackbar("invoice closed successfully");
            },
            error: () => {
                this.generalService.errorSnackbar("error closing credit card invoice");
            },
        });
    }

    onDelete() {
        console.log("DELETE");
    }

    openDetails(creditCard: CreditCardObjectType, e: any) {
        const className = e.target.className;
        if (className !== "mat-mdc-button-touch-target") {
            const option = {
                data: creditCard,
            };
            this.dialog.open(ModalViewItem, option);
        }
    }
}
