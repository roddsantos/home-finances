import { Component, Inject } from "@angular/core";
import { ModalComponent } from "../modal.component";
import { DIALOG_DATA } from "@angular/cdk/dialog";
import { DialogModalDataType } from "src/app/core/types/components/modal";

@Component({
    selector: "dialog-confirmation-modal",
    standalone: true,
    templateUrl: "./dialog-confirmation.modal.html",
    styleUrls: ["./dialog-confirmation.modal.css"],
    imports: [ModalComponent],
})
export class ModalDialogConfirmation extends ModalComponent {
    constructor(@Inject(DIALOG_DATA) public data: DialogModalDataType) {
        super();
    }

    ngOnInit() {
        this.modalState.changeFooter({
            type: "submit",
            submitLabel: this.data.button || "ok",
            alertLabel: "cancel",
        });
    }

    handleClose() {
        this.onClose();
    }

    handleAction() {
        this.data.action();
        this.onClose();
    }
}
