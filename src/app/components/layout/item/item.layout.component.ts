import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { ModalComponent } from "../../modal/modal.component";
import { ModalProfile } from "../../modal/profile/profile.modal";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatTooltipModule } from "@angular/material/tooltip";
import { GeneralState } from "src/app/subjects/subjects.general";
import { RouteItemType } from "src/app/types/general";

@Component({
    standalone: true,
    selector: "item-layout-component",
    templateUrl: "./item.layout.component.html",
    styleUrls: ["./item.layout.component.css"],
    imports: [
        MatIconModule,
        ModalComponent,
        ModalProfile,
        RouterModule,
        CommonModule,
        MatTooltipModule,
    ],
})
export class ItemLayoutComponent {
    public generalState = inject(GeneralState);
    @Input() item: RouteItemType;
    @Input() actualPage: string;

    public page: string;
    public title: string;
    public icon: string;
    public onClickAction: (ref: string) => void;

    ngOnInit() {
        this.page = this.item.page;
        this.title = this.item.title;
        this.icon = this.item.icon;
        this.onClickAction = this.item.onClick;
    }

    onClickItem(ref: string) {
        this.onClickAction(ref);
    }
}
