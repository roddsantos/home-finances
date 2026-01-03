import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatTooltipModule } from "@angular/material/tooltip";
import { GeneralState } from "src/app/core/subjects/subjects.general";
import {
    RouteItemActionType,
    RouteItemType,
    RoutesType,
} from "src/app/core/types/general";
import { Dialog } from "@angular/cdk/dialog";
import { ModalNewBill } from "src/app/components/modal/new-bill/new-bill.modal";
import { ModalNewBank } from "src/app/components/modal/new-bank/new-bank.modal";
import { ModalNewSaving } from "src/app/components/modal/new-saving/new-saving.modal";
import { ModalNewCreditCard } from "src/app/components/modal/new-credit-card/new-credit-card.modal";
import { ModalNewCompany } from "src/app/components/modal/new-company/new-company.modal";
import { ModalNewCategory } from "src/app/components/modal/new-category/new-category.modal";
import { ROUTES } from "src/utils/route";
import { PagePipe } from "src/utils/pipes/page";

@Component({
    standalone: true,
    selector: "item-layout-component",
    templateUrl: "./item.layout.component.html",
    styleUrls: ["./item.layout.component.css"],
    imports: [MatIconModule, RouterModule, CommonModule, MatTooltipModule],
})
export class ItemLayoutComponent {
    public generalState = inject(GeneralState);
    public dialog = inject(Dialog);

    @Input() item: RouteItemType;
    @Output() onClick = new EventEmitter<RoutesType>();

    public page: RoutesType;
    public title: string;
    public icon: string;
    public actions: RouteItemActionType[] | undefined;

    public style = getComputedStyle(document.body);
    public isLineThemed: boolean = false;
    public secondaryColor = this.style.getPropertyValue("--secondary");
    public primaryColor = this.style.getPropertyValue("--primary");
    public text1Color = this.style.getPropertyValue("--text-1");
    public text3Color = this.style.getPropertyValue("--text-2");

    constructor() {}

    ngOnInit() {
        this.page = this.item.page;
        this.title = this.item.title;
        this.icon = this.item.icon;
        this.actions = ROUTES.find((route) => {
            return route.page === this.item.page;
        })?.actions;
    }

    onClickItem(ref: RoutesType) {
        this.onClick.emit(ref);
    }

    openModal(page: RoutesType, event?: string) {
        let options = {};
        switch (page) {
            case "/bills":
                this.dialog.open(ModalNewBill, options);
                break;
            case "/banks":
                if (event === "creating") this.dialog.open(ModalNewBank, options);
                else this.dialog.open(ModalNewSaving, options);
                break;
            case "/credit-cards":
                this.dialog.open(ModalNewCreditCard, options);
                break;
            case "/companies":
                this.dialog.open(ModalNewCompany, options);
                break;
            case "/categories":
                this.dialog.open(ModalNewCategory, options);
                break;
            default:
                return;
        }
    }
}
