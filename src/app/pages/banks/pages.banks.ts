import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { ActionsComponent } from "src/app/components/actions/actions.component";
import { ActionItem } from "src/app/core/types/components";
import { BankService } from "src/app/services/bank.service";
import { BankState } from "src/app/core/subjects/subjects.bank";
import { ModalNewBank } from "src/app/components/modal/new-bank/new-bank.modal";
import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";
import { ModalNewSaving } from "src/app/components/modal/new-saving/new-saving.modal";
import { BankObjectType } from "src/app/core/types/data/bank.types";
import { GeneralPage } from "src/app/core/general/page.general";

@Component({
    selector: "page-banks",
    templateUrl: "./pages.banks.html",
    styleUrls: ["./pages.banks.css"],
    standalone: true,
    imports: [
        ActionsComponent,
        CommonModule,
        FeedbackContainerComponent,
        MatButtonModule,
        MatIconModule,
    ],
})
export class PageBanks extends GeneralPage {
    public bankService = inject(BankService);
    public bankState = inject(BankState);

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
                this.bankState.setBanks(banks);
            },
            error: () => {
                if (reloaded) this.generalService.errorSnackbar("error fetching banks");
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

    openDetails(bank: BankObjectType, event: any) {
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
