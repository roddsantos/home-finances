import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FeedbackInfo, FeedbackVariant } from "src/app/core/types/components";
import { CreditCardObjectType } from "../types/data/credit-card.types";

@Injectable({
    providedIn: "root",
})
export class CreditCardState {
    private _creditCards$ = new BehaviorSubject<CreditCardObjectType[]>([]);
    private _status$ = new BehaviorSubject<FeedbackInfo>({
        title: "loading",
        description: "",
        actionLabel: "reload",
        action: undefined,
        variant: "loading",
    });

    public readonly status$ = this._status$.asObservable();
    public readonly creditCards$ = this._creditCards$.asObservable();

    changeStatus(variant: FeedbackVariant, title: string) {
        this._status$.next({ ...this._status$.getValue(), variant, title });
        if (variant !== "none" && variant !== "loading") this._creditCards$.next([]);
    }

    changeVariant(variant: FeedbackVariant) {
        this._status$.next({ ...this._status$.getValue(), variant });
    }

    setCreditCards(creditCards: CreditCardObjectType[]) {
        if (creditCards.length === 0) this.changeStatus("empty", "no credit cards");
        else this.changeVariant("none");

        this._creditCards$.next(creditCards);
    }

    updateCreditCard(cCard: CreditCardObjectType) {
        let auxCCards = [...this._creditCards$.getValue()];
        const indexCCard = this._creditCards$
            .getValue()
            .findIndex((cc) => cc.id === cCard.id);

        if (indexCCard >= 0) auxCCards[indexCCard] = cCard;
        this._creditCards$.next(auxCCards);
    }

    addCreditCard(cCard: CreditCardObjectType) {
        let auxCCards = [...this._creditCards$.getValue()];

        const creditCardArray = [cCard, ...auxCCards].sort((cc1, cc2) => {
            if (cc1.name > cc2.name) return -1;
            return 1;
        });

        this._creditCards$.next(creditCardArray);
    }

    setStatus(status: FeedbackInfo) {
        this._status$.next(status);
    }

    setAction(action: () => void) {
        this._status$.next({ ...this._status$.getValue(), action });
    }
}
