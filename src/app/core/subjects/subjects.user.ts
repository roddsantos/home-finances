import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ListStatus } from "src/app/core/types/general";
import { User } from "src/app/core/types/objects";

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
