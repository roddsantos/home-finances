import { Injectable } from "@angular/core";
import { FooterModal, SetupModalType } from "src/app/core/types/modal";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { SizeType } from "../types/components";

@Injectable({
    providedIn: "root",
})
export class ModalState {
    private _header$ = new BehaviorSubject<string | false>("");
    private _size$ = new BehaviorSubject<SizeType>("md");
    private _footer$ = new BehaviorSubject<FooterModal>({
        type: "submit",
        submitLabel: "ok",
        alertLabel: "cancel",
    });
    private _actionPrimary$ = new BehaviorSubject<VoidFunction | null>(null);
    private _actionSecondary$ = new BehaviorSubject<VoidFunction | null>(null);
    private _disabled$ = new BehaviorSubject<boolean>(true);
    private _data$ = new BehaviorSubject<any>(null);

    public header$ = this._header$.asObservable();
    public size$ = this._size$.asObservable();
    public footer$ = this._footer$.asObservable();
    public actionPrimary$ = this._actionPrimary$.asObservable();
    public actionSecondary$ = this._actionSecondary$.asObservable();
    public disabled$ = this._disabled$.asObservable();
    public data$ = this._data$.asObservable();

    changeHeader(header: string | false) {
        this._header$.next(header);
    }

    changeSize(size: SizeType) {
        this._size$.next(size);
    }

    changeFooter(footer: FooterModal) {
        this._footer$.next(footer);
    }

    changeActionPrimary(action: VoidFunction | null) {
        this._actionPrimary$.next(action);
    }

    changeActionSecondary(action: VoidFunction | null) {
        this._actionSecondary$.next(action);
    }

    changeDisabled(disabled: boolean) {
        this._disabled$.next(disabled);
    }

    changeSubmitFooter(submitLabel?: string, alertLabel?: string): void {
        this._footer$.next({
            type: "submit",
            submitLabel,
            alertLabel,
        });
    }

    changeAlertFooter(submitLabel?: string, alertLabel?: string): void {
        this._footer$.next({
            type: "alert",
            submitLabel,
            alertLabel,
        });
    }

    changeNoFooter(): void {
        this._footer$.next({
            type: "none",
            submitLabel: "",
            alertLabel: "",
        });
    }

    setupModal(modal: SetupModalType) {
        this._header$.next(modal.header);
        this._size$.next(modal.size || "md");
        this._disabled$.next(modal.disabled || true);
        // if (modal.footerType === "none") this.changeAlertFooter("ok", "cancel");
        // if (modal.footerType === "submit") this.changeAlertFooter("ok", "cancel");
    }

    changeData(data: any) {
        this._data$.next(data);
    }

    resetModal() {
        this._header$.next("");
        this._size$.next("md");
        this._disabled$.next(true);
        this._data$.next(false);
    }
}
