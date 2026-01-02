import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CustomSnackbarComponent } from "src/app/components/custom-snackbar/custom-snackbar.component";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { Bank } from "src/app/core/types/objects";
import { UserState } from "src/app/core/subjects//subjects.user";
import { ActionsComponent } from "src/app/components/actions/actions.component";
import { ActionItem } from "src/app/core/types/components";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { ROUTES } from "src/utils/route";
import { ServiceBank } from "src/app/services/bank.service";
import { BankState } from "src/app/core/subjects/subjects.bank";
import { Dialog } from "@angular/cdk/dialog";
import { ModalNewBank } from "src/app/components/modal/new-bank/new-bank.modal";
import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";
import { ModalNewSaving } from "src/app/components/modal/new-saving/new-saving.modal";

@Component({
    selector: "page-banks",
    templateUrl: "./pages.banks.html",
    styleUrls: ["./pages.banks.css"],
    standalone: true,
    imports: [
        FeedbackContainerComponent,
        CommonModule,
        ActionsComponent,
        MatIconModule,
        MatButtonModule,
    ],
})
export class PageBanks {
    public bankService = inject(ServiceBank);
    public bankState = inject(BankState);
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

    getBanks(reloaded?: boolean) {
        this.bankService.getBanks().subscribe({
            next: (banks) => {
                this.bankState.setBanks(banks as Bank[]);
                this.bankState.changeStatus(
                    (banks as Bank[]).length === 0 ? "empty" : "none",
                    "no banks"
                );
            },
            error: () => {
                if (reloaded) this.snack.openSnackBar("error fetching banks", "error");
                this.bankState.changeStatus("error", "error fetching banks");
            },
        });
    }

    ngOnInit() {
        this.bankState.setAction(() => this.onReload());
    }

    onReload() {
        this.bankState.changeStatus("loading", "loading");
        this.getBanks(true);
    }

    onCreateBank() {
        let options = {};
        this.dialog.open(ModalNewBank, options);
    }

    onCreateSaving() {
        let options = {};
        this.dialog.open(ModalNewSaving, options);
    }

    onEdit(bank: any) {
        const options = {
            data: bank,
        };
        this.dialog.open(ModalNewBank, options);
    }

    openDetails(bank: Bank, event: any) {
        const className = event.target.className;
        if (className !== "mat-mdc-button-touch-target") {
            const option = {
                data: bank,
            };
            this.dialog.open(ModalViewItem, option);
        }
    }

    onDelete() {
        console.log("DELETE");
    }
}
