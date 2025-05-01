import { Injectable } from "@angular/core";
import { FooterModal } from "src/app/core/types/modal";
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
    private _actionPrimary$ = new Subject<Observable<any>>();
    private _actionSecondary$ = new Subject<Observable<any>>();
    private _disabled$ = new BehaviorSubject<boolean>(true);

    public header$ = this._header$.asObservable();
    public size$ = this._size$.asObservable();
    public footer$ = this._footer$.asObservable();
    public actionPrimary$ = this._actionPrimary$.asObservable();
    public actionSecondary$ = this._actionSecondary$.asObservable();
    public disabled$ = this._disabled$.asObservable();

    changeHeader(header: string | false) {
        this._header$.next(header);
    }

    changeSize(size: SizeType) {
        this._size$.next(size);
    }

    changeFooter(footer: FooterModal) {
        this._footer$.next(footer);
    }

    changeActionPrimary(action: Observable<any>) {
        this._actionPrimary$.next(action);
    }

    changeActionSecondary(action: Observable<any>) {
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

    setupModal() {
        this._header$.next;
    }
}
