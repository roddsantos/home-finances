import {
    Component,
    Input,
    Output,
    EventEmitter,
    TemplateRef,
    OnChanges,
    SimpleChanges,
    inject,
} from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { DialogRef } from "@angular/cdk/dialog";
import { AsyncPipe, CommonModule, NgTemplateOutlet } from "@angular/common";
import { ModalState } from "src/app/core/subjects/subjects.modal";
import { SizeType } from "src/app/core/types/components";
import { GeneralComponent } from "../general/general.component";
import { CustonButton } from "../button/custom-button.component";

@Component({
    selector: "modal-component",
    templateUrl: "./modal.component.html",
    styleUrls: ["./modal.component.css"],
    standalone: true,
    imports: [
        CommonModule,
        MatIcon,
        NgTemplateOutlet,
        MatButtonModule,
        AsyncPipe,
        CustonButton,
    ],
})
export class ModalComponent extends GeneralComponent implements OnChanges {
    constructor() {
        super();
    }

    public modalState = inject(ModalState);
    public dialogRef = inject(DialogRef);

    @Input() bodyTemplate!: TemplateRef<any>;
    @Input() disabled: boolean;
    @Input() hideHeader: boolean = false;
    @Input() size: SizeType = "md";
    @Input() header: string = "";
    @Output() actionSecondary = new EventEmitter<void>();
    @Output() actionPrimary = new EventEmitter<Object>();

    public disableButton = false;

    ngAfterViewInit() {
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
