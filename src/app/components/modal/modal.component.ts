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
import { AsyncPipe, NgSwitch, NgSwitchCase, NgTemplateOutlet } from "@angular/common";
import { ModalState } from "src/app/subjects/subjects.modal";

@Component({
    selector: "modal-component",
    templateUrl: "./modal.component.html",
    styleUrls: ["./modal.component.css"],
    standalone: true,
    imports: [
        MatIcon,
        NgTemplateOutlet,
        MatButtonModule,
        NgSwitch,
        NgSwitchCase,
        AsyncPipe,
    ],
})
export class ModalComponent {
    constructor(
        public dialogRef: DialogRef,
        public modalState: ModalState,
        @Inject(DIALOG_DATA) public data: ProfileDialogType
    ) {}

    @Input() bodyTemplate!: TemplateRef<any>;
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

    onSubmitFooter(submit?: string, alert?: string): void {
        this.modalState.changeFooter({
            type: "submit",
            submit,
            alert,
            disabled: false,
        });
    }

    onAlertFooter(submit?: string, alert?: string): void {
        this.modalState.changeFooter({
            type: "alert",
            submit,
            alert,
            disabled: false,
        });
    }

    onNoFooter(submit?: string, alert?: string): void {
        this.modalState.changeFooter({
            type: "none",
            submit,
            alert,
            disabled: false,
        });
    }

    disableButton() {
        this.modalState.footer$.subscribe({
            next: (footer) =>
                this.modalState.changeFooter({
                    ...footer,
                    disabled: true,
                }),
        });
    }

    enableButton() {
        this.modalState.footer$.subscribe({
            next: (footer) =>
                this.modalState.changeFooter({
                    ...footer,
                    disabled: false,
                }),
        });
    }
}
