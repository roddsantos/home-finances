import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { RouteItemType, RoutesType } from "src/app/core/types/general";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import { MatSidenavModule } from "@angular/material/sidenav";
import { ItemLayoutComponent } from "./item/item.layout.component";
import { ROUTES } from "src/utils/route";
import { HeaderLayoutComponent } from "./header/header.layout.component";
import { GeneralService } from "src/app/services/general.service";

@Component({
    standalone: true,
    selector: "app-layout",
    templateUrl: "./layout.component.html",
    styleUrls: ["./layout.component.css", "./item/item.layout.component.css"],
    imports: [
        MatIconModule,
        RouterModule,
        CommonModule,
        MatSidenavModule,
        ItemLayoutComponent,
        HeaderLayoutComponent,
    ],
})
export class LayoutComponent {
    constructor() {}

    public generalState = inject(GeneralState);
    private generalService = inject(GeneralService);

    public items: RouteItemType[] = ROUTES;

    onChangeRoute(route: RoutesType) {
        this.generalService.navigateTo(route);
    }
}
