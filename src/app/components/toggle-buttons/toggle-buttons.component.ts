import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Injectable, Input, Output } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import {
    StyleToggleType,
    ToggleButtonItemsType,
} from "src/app/core/types/components/toggle-buttons";
import { isValuesEqual } from "src/utils/validators";

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
    @Input() label: string = "";
    @Input() variant: StyleToggleType = "fill";
    @Input() items: ToggleButtonItemsType<any>[];
    @Input() formController: FormControl<unknown> = new FormControl<any>(null);
    @Input() disabled: boolean;
    @Output() onClick = new EventEmitter<ToggleButtonItemsType<any>>();

    isEqual(item: ToggleButtonItemsType<any>) {
        return isValuesEqual(this.formController.getRawValue(), item.value);
    }

    getSelectedClass(item: ToggleButtonItemsType<any>) {
        const isSelected = isValuesEqual(this.formController.getRawValue(), item.value);
        switch (this.variant) {
            case "outlined":
                return isSelected ? "button-outlined" : "button-text";
            case "text":
                return isSelected ? "button-text selected" : "button-text";
            default:
                return isSelected ? "button-primary" : "button-outlined";
        }
    }

    handleClick(item: ToggleButtonItemsType<any>) {
        if (this.formController) this.formController.patchValue(item.value);
        this.onClick.emit(item);
    }
}
