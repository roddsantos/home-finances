import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { ServiceCreditCard } from "src/app/services/credit-card.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { CreditCard } from "src/app/core/types/objects";
import { CreditCardState } from "src/app/core/subjects//subjects.credit-card";
import { UserState } from "src/app/core/subjects//subjects.user";
import { zip } from "rxjs";
import { ActionsComponent } from "src/app/components/actions/actions.component";
import { ActionItem } from "src/app/core/types/components";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { ROUTES } from "src/utils/route";
import { ModalNewCreditCard } from "src/app/components/modal/new-credit-card/new-credit-card.modal";
import { Dialog } from "@angular/cdk/dialog";
import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";
import { CreditCardPipe } from "src/utils/pipes/creditCard";

@Component({
    selector: "page-credit-cards",
    templateUrl: "./pages.credit-cards.html",
    styleUrls: ["./pages.credit-cards.css"],
    standalone: true,
    imports: [FeedbackContainerComponent, CommonModule, ActionsComponent, CreditCardPipe],
})
export class PageCreditCards {
    public ccState = inject(CreditCardState);
    public generalState = inject(GeneralState);
    public userState = inject(UserState);
    public storage = inject(LocalStorageService);

    private snack = inject(CustomSnackbarComponent);
    public dialog = inject(Dialog);

    public ccApi = inject(ServiceCreditCard);

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
        },
    ];

    getCreditCards(reloaded?: boolean) {
        this.ccApi.getCreditCards({}).subscribe({
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
        this.generalState.theme$.subscribe({
            next: (theme) => (this.theme = theme),
        });
    }

    onReload() {
        this.ccState.changeStatus("loading", "loading");
        this.getCreditCards(true);
    }

    onEdit(creditCard: CreditCard) {
        let options = {
            data: {
                header: "edit credit card",
                size: "md",
                creditCard,
            },
            hasBackdrop: true,
            backdropClass: "modal-backdrop",
        };
        this.dialog.open(ModalNewCreditCard, options);
    }

    onFinishInvoice(creditCard: CreditCard) {
        const updatedCreditCard: CreditCard = { ...creditCard, isClosed: true };

        zip(
            this.ccApi.updateCreditCard(updatedCreditCard),
            this.ccApi.createCreditCard({
                name: creditCard.name,
                description: creditCard.description,
                color: creditCard.color,
                day: creditCard.day,
                due: creditCard.due,
                month: creditCard.month === 11 ? 0 : creditCard.month + 1,
                year: creditCard.month === 11 ? creditCard.year + 1 : creditCard.year,
                flag: creditCard.flag,
                limit: creditCard.limit,
                isClosed: false,
            })
        ).subscribe({
            next: ([update, created]) => {
                this.ccState.addCreditCard(updatedCreditCard as CreditCard);
                this.ccState.addCreditCard(created as CreditCard);
                this.snack.openSnackBar("invoice closed successfully", "success");
            },
            error: () => {
                this.snack.openSnackBar("error updating credit card", "error");
            },
        });
    }

    onDelete() {
        console.log("DELETE");
    }

    openDetails(creditCard: CreditCard, e: any) {
        const className = e.target.className;
        if (className !== "mat-mdc-button-touch-target") {
            const option = {
                data: {
                    item: { ...creditCard, sector: "credit-card" },
                    header: "view item: " + creditCard.name,
                    size: "md",
                },
            };
            this.dialog.open(ModalViewItem, option);
        }
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
