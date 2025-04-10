import { inject } from "@angular/core";
import { UserState } from "src/app/core/subjects/subjects.user";
import { Router } from "@angular/router";
import { GeneralState } from "../subjects/subjects.general";

export function authGuard() {
    const userState = inject(UserState);
    const router = inject(Router);
    const generalState = inject(GeneralState);

    userState.user$.subscribe({
        next: (user) => {
            if (user) return true;
            else {
                generalState.page$.subscribe({
                    next: (page) => console.log("ok", page),
                });
                router.navigate(["/login"]);
                return generalState.changePage("/login");
            }
        },
    });
}
