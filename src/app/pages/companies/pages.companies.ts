import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
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

@Component({
    selector: "page-companies",
    templateUrl: "./pages.companies.html",
    styleUrls: ["./pages.companies.css"],
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
            data: {
                header: "edit company",
                size: "md",
                company,
            },
            hasBackdrop: true,
            backdropClass: "modal-backdrop",
        };
        this.dialog.open(ModalNewCompany, options);
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
