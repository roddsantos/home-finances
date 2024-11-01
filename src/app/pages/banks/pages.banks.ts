import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
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

@Component({
    selector: "page-banks",
    templateUrl: "./pages.banks.html",
    styleUrls: ["./pages.banks.css"],
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

    onEdit(bank: any) {
        let options = {
            data: {
                header: "edit bank",
                size: "md",
                bank,
            },
            hasBackdrop: true,
            backdropClass: "modal-backdrop",
        };
        this.dialog.open(ModalNewBank, options);
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
