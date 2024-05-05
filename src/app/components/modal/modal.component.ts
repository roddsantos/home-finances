import {
    Component,
    Input,
    Output,
    EventEmitter,
    Inject,
    TemplateRef,
} from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { ProfileDialogType } from "src/app/types/modal";
import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import {
    AsyncPipe,
    CommonModule,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    NgTemplateOutlet,
} from "@angular/common";
import { ModalState } from "src/app/subjects/subjects.modal";

@Component({
    selector: "modal-component",
    templateUrl: "./modal.component.html",
    styleUrls: ["./modal.component.css"],
    standalone: true,
    imports: [CommonModule, MatIcon, NgTemplateOutlet, MatButtonModule, AsyncPipe],
})
export class ModalComponent {
    constructor(
        public dialogRef: DialogRef,
        public modalState: ModalState,
        @Inject(DIALOG_DATA) public data: ProfileDialogType
    ) {}

    @Input() bodyTemplate!: TemplateRef<any>;
    @Input() disabled: boolean;
    @Output() actionSecondary = new EventEmitter<void>();
    @Output() actionPrimary = new EventEmitter<Object>();

    onPrimary() {
        if (!this.actionPrimary.observed) this.dialogRef.close();
        else this.actionPrimary.emit();
    }

    onSecondary() {
        if (!this.actionSecondary.observed) this.dialogRef.close();
        else this.actionSecondary.emit();
    }

    onClose() {
        this.dialogRef.close();
    }
}
