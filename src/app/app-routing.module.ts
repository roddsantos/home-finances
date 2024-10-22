import { PageCreditCards } from "./pages/credit-cards/pages.credit-cards";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/auth.guard";

const routes: Routes = [
    {
        path: "",
        canActivate: [authGuard],
        loadComponent: () => import("./pages/home/pages.home").then((m) => m.PageHome),
    },
    {
        path: "credit-cards",
        canActivate: [authGuard],
        loadComponent: () =>
            import("./pages/credit-cards/pages.credit-cards").then(
                (m) => m.PageCreditCards
            ),
    },
    {
        path: "settings",
        canActivate: [authGuard],
        loadComponent: () =>
            import("./pages/settings/settings.page").then((m) => m.PageSettings),
    },
    {
        path: "manager",
        canActivate: [authGuard],
        loadComponent: () =>
            import("./pages/management/pages.management").then((m) => m.PageManagement),
    },
    {
        path: "bills",
        canActivate: [authGuard],
        loadComponent: () =>
            import("./pages/monthly/pages.monthly").then((m) => m.PageMonthly),
    },
    {
        path: "login",
        loadComponent: () => import("./pages/login/login.page").then((m) => m.PageLogin),
    },
];

@NgModule({
    declarations: [],
    imports: [CommonModule, RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
