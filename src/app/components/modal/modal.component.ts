import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    Inject,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FooterModal, ProfileDialogType } from "src/app/types/modal";
import { DIALOG_DATA, DialogModule, DialogRef } from "@angular/cdk/dialog";
import { NgTemplateOutlet } from "@angular/common";

@Component({
    selector: "modal-component",
    templateUrl: "./modal.component.html",
    styleUrls: ["./modal.component.css"],
    standalone: true,
    imports: [MatIcon, NgTemplateOutlet, MatButtonModule],
})
export class ModalComponent {
    constructor(public dialogRef: DialogRef, @Inject(DIALOG_DATA) public data: ProfileDialogType) {}

    @Input() bodyTemplate!: TemplateRef<any>;
    @Input() footer: FooterModal;
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
