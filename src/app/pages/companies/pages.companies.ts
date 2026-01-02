import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
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
import { ServiceCompany } from "src/app/services/company.service";
import { CompanyState } from "src/app/core/subjects/subjects.company";
import { ModalNewCompany } from "src/app/components/modal/new-company/new-company.modal";
import { ModalViewItem } from "src/app/components/modal/view-item/view-item.modal";

@Component({
    selector: "page-companies",
    templateUrl: "./pages.companies.html",
    styleUrls: ["./pages.companies.css"],
    standalone: true,
    imports: [
        FeedbackContainerComponent,
        CommonModule,
        ActionsComponent,
        MatIconModule,
        MatButtonModule,
    ],
})
export class PageCompanies {
    public companyService = inject(ServiceCompany);
    public companyState = inject(CompanyState);
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

    getCompanies(reloaded?: boolean) {
        this.companyService.getCompanies().subscribe({
            next: (companies) => {
                this.companyState.setCompanies(companies as Company[]);
                this.companyState.changeStatus(
                    (companies as Company[]).length === 0 ? "empty" : "none",
                    "no companies"
                );
            },
            error: () => {
                if (reloaded)
                    this.snack.openSnackBar("error fetching companies", "error");
                this.companyState.changeStatus("error", "error fetching companies");
            },
        });
    }

    ngOnInit() {
        this.companyState.setAction(() => this.onReload());
    }

    onReload() {
        this.companyState.changeStatus("loading", "loading");
        this.getCompanies(true);
    }

    onEdit(company: any) {
        let options = {
            data: company,
        };
        this.dialog.open(ModalNewCompany, options);
    }

    onCreate() {
        let options = {};
        this.dialog.open(ModalNewCompany, options);
    }

    onDelete() {
        console.log("DELETE");
    }

    openDetails(company: Company, e: any) {
        const className = e.target.className;
        if (className !== "mat-mdc-button-touch-target") {
            const option = {
                data: company,
            };
            this.dialog.open(ModalViewItem, option);
        }
    }
}
