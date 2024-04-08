import { Component, OnInit, QueryList, ViewChildren, ViewEncapsulation } from "@angular/core";
import { MatTab, MatTabGroup, MatTabsModule } from "@angular/material/tabs";
import { COMPANIES } from "src/utils/data";
import { TypeBillsManagementComponent } from "./type-bills/pages.management.type-bills";
import { ManagementCompaniesComponent } from "./companies/pages.management.companies";
import { MatButton } from "@angular/material/button";

@Component({
    selector: "page-management",
    templateUrl: "./pages.management.html",
    styleUrls: ["./pages.management.css"],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [MatTabsModule, TypeBillsManagementComponent, ManagementCompaniesComponent, MatButton],
})
export class PageManagement implements OnInit {
    genTab: number;
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
        console.log("TESTE", event);

        this.childTabs.forEach((childTab) => {
            childTab.realignInkBar();
        });
    }

    openModal(tab: number) {
        if (tab === 1) {
            console.log("TESTE");
        }
    }
}
