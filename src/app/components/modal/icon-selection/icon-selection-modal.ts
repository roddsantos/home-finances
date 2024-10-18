import { IconType } from "src/app/core/types/components";
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { MATERIAL_ICONS } from "src/utils/constants/icons";
import { ModalComponent } from "../modal.component";
import {
    MatFormField,
    MatFormFieldControl,
    MatLabel,
} from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { removeDiacritics } from "src/utils/validators";
import { BehaviorSubject, debounceTime, distinctUntilChanged } from "rxjs";

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
        MatInputModule,
        FormsModule,
        MatIconModule,
    ],
})
export class IconSelection {
    @ViewChild(ModalComponent) modalComponent: ModalComponent;
    @Output() selected = new EventEmitter<IconType>();
    @Output() onClose = new EventEmitter<string>();
    icons: IconType[] = MATERIAL_ICONS;
    filteredIcons: IconType[] = MATERIAL_ICONS;
    selectedIcon: IconType | null = null;
    searchTerm$ = new BehaviorSubject<string>("");

    constructor() {
        this.searchTerm$.pipe(debounceTime(300), distinctUntilChanged()).subscribe({
            next: (value) => {
                if (value === "") this.filteredIcons = MATERIAL_ICONS;
                else {
                    this.filteredIcons = this.icons.filter((icon) => {
                        const filteredTags = icon.tags.filter((tag) =>
                            removeDiacritics(tag).includes(removeDiacritics(value))
                        );
                        const filterName = removeDiacritics(icon.name).includes(value);
                        if (filteredTags.length > 0 || filterName) return true;
                        return false;
                    });
                }
            },
        });
    }

    onSubmit() {
        if (this.selectedIcon) {
            this.selected.emit(this.selectedIcon);
            this.modalComponent.onClose(this.selectedIcon.name);
        }
    }

    onSelect(icon: IconType) {
        this.selectedIcon = icon;
    }

    onType(e: Event) {
        const term = (<HTMLTextAreaElement>e.target).value;
        this.searchTerm$.next(term);
    }
}
