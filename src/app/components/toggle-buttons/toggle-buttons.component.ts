import { CommonModule } from "@angular/common";
import {
    booleanAttribute,
    Component,
    EventEmitter,
    Injectable,
    Input,
    Output,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material/icon";
import {
    StyleToggleType,
    ToggleButtonItemsType,
} from "src/app/core/types/components/toggle-buttons";
import { isValuesEqual } from "src/utils/validators";
import { CustonButton } from "../button/custom-button.component";

@Injectable({
    providedIn: "root",
})
@Component({
    selector: "toggle-button",
    templateUrl: "./toggle-buttons.component.html",
    styleUrls: ["./toggle-buttons.component.css"],
    standalone: true,
    imports: [
        CommonModule,
        CustonButton,
        MatButtonToggleModule,
        MatIconModule,
        ReactiveFormsModule,
    ],
})
export class ToggleButtonComponent {
    @Input() label: string = "";
    @Input() variant: StyleToggleType = "fill";
    @Input({ required: true }) items: ToggleButtonItemsType<any>[];
    @Input() formController: FormControl<unknown> = new FormControl<any>(null);
    @Input({ transform: booleanAttribute }) disabled: boolean = false;
    @Output() onClick = new EventEmitter<ToggleButtonItemsType<any>>();

    isEqual(item: ToggleButtonItemsType<any>) {
        return isValuesEqual(this.formController.getRawValue(), item.value);
    }

    getVariant(item: ToggleButtonItemsType<any>) {
        const isSelected = isValuesEqual(this.formController.getRawValue(), item.value);
        switch (this.variant) {
            case "outlined":
                return isSelected ? "outlined" : "text";
            case "text":
                return "text";
            default:
                return isSelected ? "primary" : "outlined";
        }
    }

    getClasses(item: ToggleButtonItemsType<any>) {
        const isSelected = isValuesEqual(this.formController.getRawValue(), item.value);
        if (this.variant === "text" && isSelected) return "selected";
        return "";
    }

    handleClick(item: ToggleButtonItemsType<any>) {
        if (this.formController) this.formController.patchValue(item.value);
        this.onClick.emit(item);
    }
}
