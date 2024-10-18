import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatIconButton } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActionItem } from "src/app/core/types/components";

@Component({
    selector: "actions",
    templateUrl: "./actions.component.html",
    styleUrls: ["./actions.component.css"],
    standalone: true,
    imports: [CommonModule, MatIconModule, MatIconButton, MatTooltipModule],
})
export class ActionsComponent {
    @Input() actions: ActionItem[];
    @Output() onEdit = new EventEmitter<void>();
    @Output() onDelete = new EventEmitter<void>();
    @Output() onCheck = new EventEmitter<void>();
}
