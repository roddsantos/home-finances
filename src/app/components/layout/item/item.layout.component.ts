import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { ModalComponent } from "../../modal/modal.component";
import { ModalProfile } from "../../modal/profile/profile.modal";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatTooltipModule } from "@angular/material/tooltip";
import { GeneralState } from "src/app/subjects/subjects.general";
import { RouteItemType, RoutesType } from "src/app/types/general";
import { ColorPipe } from "src/utils/pipes/colors";

@Component({
    standalone: true,
    selector: "item-layout-component",
    templateUrl: "./item.layout.component.html",
    styleUrls: ["./item.layout.component.css"],
    imports: [
        ColorPipe,
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
    @Output() onClick = new EventEmitter<RoutesType>();

    public page: RoutesType;
    public title: string;
    public icon: string;
    public onClickAction: (ref: string) => void;

    public style = getComputedStyle(document.body);
    public secondaryColor = this.style.getPropertyValue("--secondary");

    ngOnInit() {
        this.page = this.item.page;
        this.title = this.item.title;
        this.icon = this.item.icon;
    }

    onClickItem(ref: RoutesType) {
        this.onClick.emit(ref);
    }
}
