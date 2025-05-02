import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { UserState } from "../core/subjects/subjects.user";

@Injectable({
    providedIn: "root",
})
export class Service {
    public httpClient = inject(HttpClient);
    public userState = inject(UserState);
}
