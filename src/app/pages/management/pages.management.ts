import { Component, inject, OnInit, QueryList, ViewChildren, ViewEncapsulation } from "@angular/core";
import { MatTab, MatTabGroup, MatTabsModule } from "@angular/material/tabs";
import { COMPANIES } from "src/utils/data";
import { TypeBillsManagementComponent } from "./type-bills/pages.management.type-bills";
import { ManagementCompaniesComponent } from "./companies/pages.management.companies";
import { MatButton } from "@angular/material/button";
import { ModalNewBank } from "src/app/components/modal/new-bank/new-bank.modal";
import { Dialog } from "@angular/cdk/dialog";
import { NgIf } from "@angular/common";
import { ModalNewCompany } from "src/app/components/modal/new-company/new-company.modal";

@Component({
    selector: "page-management",
    templateUrl: "./pages.management.html",
    styleUrls: ["./pages.management.css"],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [MatTabsModule, TypeBillsManagementComponent, ManagementCompaniesComponent, MatButton, NgIf],
})
export class PageManagement implements OnInit {
    public dialog = inject(Dialog);

    genTab: number;
    nameTab: String[] = ["company", "bank", "", ""];
    companies = COMPANIES;
    @ViewChildren("childTabs") childTabs: QueryList<MatTabGroup>;

    styleButton: Object = {
        marginLeft: "auto",
        display: "flex",
    };

    ngOnInit() {
        this.genTab = 0;
    }

    onChangeTab(event: any) {
        this.genTab = event.index;

        this.childTabs.forEach((childTab) => {
            childTab.realignInkBar();
        });
    }

    openModal(): void {
        this.dialog.open<string>(this.genTab === 0 ? ModalNewCompany : ModalNewBank, {
            width: "250px",
            data: {
                header: "new " + this.nameTab[this.genTab],
            },
            hasBackdrop: true,
            backdropClass: "modal-backdrop",
        });
    }
}
