import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { authGuard } from "./auth/auth.guard";

const routes: Routes = [
    {
        path: "",
        canActivate: [authGuard],
        loadComponent: () => import("./pages/home/pages.home").then((m) => m.PageHome),
    },
    {
        path: "manager",
        canActivate: [authGuard],
        loadComponent: () =>
            import("./pages/management/pages.management").then((m) => m.PageManagement),
    },
    {
        path: "monthly",
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
