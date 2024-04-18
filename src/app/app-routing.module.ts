import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "",
        loadComponent: () => import("./pages/home/pages.home").then((m) => m.PageHome),
    },
    {
        path: "management",
        loadComponent: () =>
            import("./pages/management/pages.management").then((m) => m.PageManagement),
    },
];

@NgModule({
    declarations: [],
    imports: [CommonModule, RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
