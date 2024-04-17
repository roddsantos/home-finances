import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ListStatus, User } from "src/app/types/general";

@Injectable({
    providedIn: "root",
})
export class UserState {
    private _user$ = new BehaviorSubject<User | null>(null);
    private _status$ = new BehaviorSubject<ListStatus>("empty");

    public readonly status$ = this._status$.asObservable();
    public readonly user$ = this._user$.asObservable();

    changeStatus(newStatus: ListStatus) {
        this._status$.next(newStatus);
    }

    setUser(u: User | null) {
        this._user$.next(u);
    }
}
