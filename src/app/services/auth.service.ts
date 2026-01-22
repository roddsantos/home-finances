import { Injectable } from "@angular/core";
import { GeneralService } from "./general.service";
import { LoginPayloadType, LoginResponseType } from "../core/types/auth";
import { AUTH } from "src/utils/constants/services";

@Injectable({
    providedIn: "root",
})
export class UserService extends GeneralService {
    login(payload: LoginPayloadType) {
        return this.http.post<LoginResponseType>(`${AUTH}/login`, payload);
    }

    validateToken() {
        return this.http.get<LoginResponseType>(`${AUTH}/validate`);
    }
}
