import { Injectable } from "@angular/core";
import { FooterModal } from "../types/modal";
import { BehaviorSubject, Observable, Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ModalState {
    private _footer$ = new BehaviorSubject<FooterModal>({
        type: "submit",
        submit: "ok",
        alert: "cancel",
        disabled: false,
    });

    private _header$ = new BehaviorSubject<string>("");
    private _actionPrimary$ = new Subject<Observable<any>>();
    private _actionSecondary$ = new Subject<any>();

    public footer$ = this._footer$.asObservable();
    public header$ = this._header$.asObservable();
    public actionPrimary$ = this._actionPrimary$.asObservable();
    public actionSecondary$ = this._actionSecondary$.asObservable();

    changeFooter(footer: FooterModal) {
        this._footer$.next(footer);
    }

    changeHeader(header: string) {
        this._header$.next(header);
    }

    useActionPrimary(action: Observable<any>) {
        this._actionPrimary$.next(action);
    }

    changeActionSecondary(action: any) {
        this._actionSecondary$.next(action);
    }

    onSubmitFooter(submit?: string, alert?: string): void {
        this._footer$.next({
            type: "submit",
            submit,
            alert,
            disabled: false,
        });
    }

    onAlertFooter(submit?: string, alert?: string): void {
        this._footer$.next({
            type: "alert",
            submit,
            alert,
            disabled: false,
        });
    }

    onNoFooter(submit?: string, alert?: string): void {
        this._footer$.next({
            type: "none",
            submit,
            alert,
            disabled: false,
        });
    }

    setDisableButton(flag: boolean) {
        this._footer$.next({
            ...this._footer$.getValue(),
            disabled: flag,
        });
    }

    disableButton() {
        this._footer$.next({
            ...this._footer$.getValue(),
            disabled: true,
        });
    }

    enableButton() {
        this._footer$.next({
            ...this._footer$.getValue(),
            disabled: false,
        });
    }
}
