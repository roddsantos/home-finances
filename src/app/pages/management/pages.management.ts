import {
    Component,
    inject,
    QueryList,
    ViewChildren,
    ViewEncapsulation,
} from "@angular/core";
import { MatTabChangeEvent, MatTabGroup, MatTabsModule } from "@angular/material/tabs";
import { ManagementCompaniesComponent } from "./companies/pages.management.companies";
import { MatButton } from "@angular/material/button";
import { ModalNewBank } from "src/app/components/modal/new-bank/new-bank.modal";
import { Dialog } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { ModalNewCompany } from "src/app/components/modal/new-company/new-company.modal";
import { FeedbackContainerComponent } from "src/app/components/feedback-container/feedback-container.component";
import { CreditCardsManagementComponent } from "./credit-cards/pages.management.credit-cards";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { ManagerTabs } from "src/app/types/general";
import { BanksManagementComponent } from "./banks/pages.management.banks";
import { ModalNewCreditCard } from "src/app/components/modal/new-credit-card/new-credit-card.modal";
import { CategoriesManagementComponent } from "./categories/pages.management.categories";
import { ModalNewCategory } from "src/app/components/modal/new-category/new-category.modal";

@Component({
    selector: "page-management",
    templateUrl: "./pages.management.html",
    styleUrls: ["./pages.management.css"],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatTabsModule,
        CategoriesManagementComponent,
        ManagementCompaniesComponent,
        CreditCardsManagementComponent,
        BanksManagementComponent,
        MatButton,
        CommonModule,
        FeedbackContainerComponent,
    ],
})
export class PageManagement {
    public dialog = inject(Dialog);
    public general = inject(GeneralState);

    nameTab: string[] = ["credit card", "bank", "company", "category"];
    @ViewChildren("childTabs") childTabs: QueryList<MatTabGroup>;

    onChangeTab(event: MatTabChangeEvent) {
        this.general.changeTab(event.index.toString() as ManagerTabs);

        this.childTabs.forEach((childTab) => {
            childTab.realignInkBar();
        });
    }

    openModal(refTab: ManagerTabs): void {
        this.dialog.open<string>(
            refTab === "0"
                ? ModalNewCreditCard
                : refTab === "1"
                ? ModalNewBank
                : refTab === "2"
                ? ModalNewCompany
                : ModalNewCategory,
            {
                data: {
                    header: "new " + this.nameTab[refTab],
                    size: "md",
                },
                hasBackdrop: true,
                backdropClass: "modal-backdrop",
            }
        );
    }
}
