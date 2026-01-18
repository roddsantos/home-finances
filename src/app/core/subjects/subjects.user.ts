import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ListStatus } from "src/app/core/types/general";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { UserObjectType } from "../types/data/user.types";

@Injectable({
    providedIn: "root",
})
export class UserState {
    private storageService = inject(LocalStorageService);

    private _user$ = new BehaviorSubject<UserObjectType | null>(null);
    private _status$ = new BehaviorSubject<ListStatus>("empty");

    public readonly status$ = this._status$.asObservable();
    public readonly user$ = this._user$.asObservable();

    changeStatus(newStatus: ListStatus) {
        this._status$.next(newStatus);
    }

    setUser(u: UserObjectType | null) {
        this._user$.next(u);
        if (u !== null) this.storageService.setUser(u);
    }

    removeUser() {
        this._user$.next(null);
        this.storageService.removeUser();
    }
}
