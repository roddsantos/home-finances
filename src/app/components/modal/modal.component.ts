import {
    Component,
    Input,
    Output,
    EventEmitter,
    Inject,
    TemplateRef,
    OnChanges,
    SimpleChanges,
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
export class ModalComponent implements OnChanges {
    constructor(
        public dialogRef: DialogRef,
        public modalState: ModalState,
        @Inject(DIALOG_DATA) public data: ProfileDialogType
    ) {}

    @Input() bodyTemplate!: TemplateRef<any>;
    @Input() disabled: boolean;
    @Output() actionSecondary = new EventEmitter<void>();
    @Output() actionPrimary = new EventEmitter<Object>();
    disableButton = false;

    ngOnInit() {
        this.disableButton = this.disabled;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes["disabled"]) {
            this.disableButton = this.disabled;
        }
    }

    onPrimary() {
        if (!this.actionPrimary.observed) this.dialogRef.close();
        else this.actionPrimary.emit();
    }

    onSecondary() {
        console.log("HEYYY", this.actionSecondary);
        if (!this.actionSecondary.observed) this.dialogRef.close();
        else this.actionSecondary.emit();
    }

    onClose() {
        this.dialogRef.close();
    }
}
