import { IconType } from "src/app/types/components";
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import { MATERIAL_ICONS } from "src/utils/constants/icons";
import { ModalComponent } from "../modal.component";
import {
    MatFormField,
    MatFormFieldControl,
    MatLabel,
} from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "icon-selection",
    templateUrl: "./icon-selection.modal.html",
    styleUrls: ["./icon-selection.modal.css"],
    standalone: true,
    imports: [
        CommonModule,
        ModalComponent,
        MatFormField,
        MatLabel,
        FormsModule,
        MatIconModule,
    ],
})
export class IconSelection {
    @Output() selected = new EventEmitter<IconType>();
    icons: IconType[] = MATERIAL_ICONS;
    selectedIcon: IconType | null = null;
    searchTerm: string = "";

    onSubmit() {
        if (this.selectedIcon) this.selected.emit(this.selectedIcon);
    }

    onSelect(icon: IconType) {
        this.selectedIcon = icon;
    }
}
