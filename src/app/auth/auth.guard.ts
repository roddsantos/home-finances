import { inject } from "@angular/core";
import { UserState } from "../subjects/subjects.user";
import { Router } from "@angular/router";

export function authGuard() {
    const userState = inject(UserState);
    const router = inject(Router);

    userState.user$.subscribe({
        next: (user) => {
            if (user) return true;
            else return router.navigate(["/login"]);
        },
    });
}
