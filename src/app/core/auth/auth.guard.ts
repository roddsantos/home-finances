import { inject } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { LocalStorageService } from "src/app/services/local-storage.service";

export function authGuard(): Observable<boolean> {
    const authService = inject(AuthService);
    const localStorageService = inject(LocalStorageService);

    const token = localStorageService.getToken();
    if (token.length === 0) {
        authService.logout();
        return of(false);
    }

    return authService.validateToken().pipe(
        map(() => true),
        catchError(() => {
            authService.logout();
            return of(false);
        }),
    );
}
