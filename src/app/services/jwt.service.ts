import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LocalStorageService } from "./local-storage.service";
import { URL } from "src/utils/constants/services";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private localStorageService: LocalStorageService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const excludedUrl = `${URL}/auth/login`;

        if (request.url === excludedUrl) {
            return next.handle(request);
        }

        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.localStorageService.getToken()}`,
            },
        });
        return next.handle(request);
    }
}
