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
        path: "dashboard",
        canActivate: [authGuard],
        loadComponent: () =>
            import("./pages/dashboard/pages.dashboard").then((m) => m.PageDashboard),
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
        path: "banks",
        canActivate: [authGuard],
        loadComponent: () => import("./pages/banks/pages.banks").then((m) => m.PageBanks),
    },
    {
        path: "companies",
        canActivate: [authGuard],
        loadComponent: () =>
            import("./pages/companies/pages.companies").then((m) => m.PageCompanies),
    },
    {
        path: "categories",
        canActivate: [authGuard],
        loadComponent: () =>
            import("./pages/categories/pages.categories").then((m) => m.PageCategories),
    },
    {
        path: "settings",
        canActivate: [authGuard],
        loadComponent: () =>
            import("./pages/settings/settings.page").then((m) => m.PageSettings),
    },
    {
        path: "bills",
        canActivate: [authGuard],
        loadComponent: () => import("./pages/bills/pages.bills").then((m) => m.PageBills),
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
