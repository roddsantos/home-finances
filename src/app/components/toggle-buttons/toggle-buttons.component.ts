import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Injectable, Input, Output } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { ToggleButtonItemsType } from "src/app/core/types/components/toggle-buttons";

@Injectable({
    providedIn: "root",
})
@Component({
    selector: "toggle-button",
    templateUrl: "./toggle-buttons.component.html",
    styleUrls: ["./toggle-buttons.component.css"],
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonToggleModule, ReactiveFormsModule],
})
export class ToggleButtonComponent {
    @Input() items: ToggleButtonItemsType[];
    @Input() formController: FormControl<unknown>;
    @Output() handleClick = new EventEmitter<ToggleButtonItemsType>();

    onClick(item: ToggleButtonItemsType) {
        this.formController.patchValue(item.value);
        this.handleClick.emit(item);
    }
}
