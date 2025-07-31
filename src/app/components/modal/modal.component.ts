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
import { ModalDataType } from "src/app/core/types/modal";
import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import { AsyncPipe, CommonModule, NgTemplateOutlet } from "@angular/common";
import { ModalState } from "src/app/core/subjects/subjects.modal";
import { SizeType } from "src/app/core/types/components";

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
        @Inject(DIALOG_DATA) public data: ModalDataType
    ) {}

    @Input() bodyTemplate!: TemplateRef<any>;
    @Input() disabled: boolean;
    @Input() hideHeader: boolean = false;
    @Input() size: SizeType = "md";
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
        if (!this.actionSecondary.observed) this.dialogRef.close();
        else this.actionSecondary.emit();
    }

    onClose(data?: any) {
        this.dialogRef.close(data);
        this.modalState.resetModal();
    }
}
