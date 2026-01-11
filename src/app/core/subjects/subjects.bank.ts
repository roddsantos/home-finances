import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FeedbackInfo, FeedbackVariant } from "src/app/core/types/components";
import { BankObjectType } from "../types/data/bank.types";

@Injectable({
    providedIn: "root",
})
export class BankState {
    private _banks$ = new BehaviorSubject<BankObjectType[]>([]);
    private _status$ = new BehaviorSubject<FeedbackInfo>({
        title: "loading",
        description: "",
        actionLabel: "reload",
        action: undefined,
        variant: "loading",
    });

    public readonly status$ = this._status$.asObservable();
    public readonly banks$ = this._banks$.asObservable();

    changeStatus(variant: FeedbackVariant, title: string) {
        this._status$.next({ ...this._status$.getValue(), variant, title });
        if (variant !== "none" && variant !== "loading") this._banks$.next([]);
    }

    changeVariant(variant: FeedbackVariant) {
        this._status$.next({ ...this._status$.getValue(), variant });
    }

    setBanks(banks: BankObjectType[]) {
        if (banks.length === 0) this.changeStatus("empty", "no banks");
        else this.changeVariant("none");

        this._banks$.next(banks);
    }

    addBank(bank: BankObjectType) {
        let auxBanks = [...this._banks$.getValue()];
        const indexBank = this._banks$.getValue().findIndex((b) => b.id === bank.id);

        if (indexBank >= 0) auxBanks[indexBank] = bank;
        else auxBanks = [bank, ...auxBanks];

        this._banks$.next(auxBanks);
    }

    setStatus(status: FeedbackInfo) {
        this._status$.next(status);
    }

    setAction(action: () => void) {
        this._status$.next({ ...this._status$.getValue(), action });
    }
}
