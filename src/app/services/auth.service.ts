import { Injectable } from "@angular/core";
import { GeneralService } from "./general.service";
import {
    LoginPayloadType,
    LoginResponseType,
    ValidatedTokenResponseType,
} from "../core/types/auth";
import { AUTH } from "src/utils/constants/services";

@Injectable({
    providedIn: "root",
})
export class AuthService extends GeneralService {
    login(payload: LoginPayloadType) {
        return this.http.post<LoginResponseType>(`${AUTH}/login`, payload);
    }

    validateToken() {
        return this.http.get<ValidatedTokenResponseType>(`${AUTH}/validate`);
    }

    logout() {
        this.user.removeUser();
        this.localStorageService.removeToken();
        this.localStorageService.removeUser();
        this.navigateTo("/login");
    }
}
