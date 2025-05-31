import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { UserState } from "../core/subjects/subjects.user";
import { firstValueFrom, Observable, Subscription } from "rxjs";
import { User } from "../core/types/objects";

@Injectable({
    providedIn: "root",
})
export class Service {
    public httpClient = inject(HttpClient);
    public userState = inject(UserState);

    private user$: Subscription;
    private _user: User | null = null;

    getUser(): User | null {
        this.user$ = this.userState.user$.subscribe({
            next: (u) => {
                this._user = u;
            },
        });
        return this._user;
    }

    ngOnDestroy() {
        this.user$.unsubscribe();
    }
}
