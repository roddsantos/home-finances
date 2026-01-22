import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Router } from "express";
import { Observable } from "rxjs";
import { LocalStorageService } from "./local-storage.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private localStorageService: LocalStorageService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.localStorageService.getToken()}`,
            },
        });
        return next.handle(request);
    }
}
