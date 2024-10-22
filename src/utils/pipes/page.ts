import { Pipe, PipeTransform } from "@angular/core";
import { RoutesType } from "src/app/core/types/general";

@Pipe({
    name: "page",
    standalone: true,
})
export class PagePipe implements PipeTransform {
    transform(page: RoutesType | "", format?: "plural" | "singular") {
        switch (page) {
            case "/":
                return "home";
            case "/banks":
                if (format === "plural") return "banks";
                return "bank";
            case "/categories":
                if (format === "plural") return "categories";
                return "category";
            case "/companies":
                if (format === "plural") return "companies";
                return "company";
            case "/credit-cards":
                if (format === "plural") return "credit cards";
                return "credit card";
            case "/dashboard":
                return "dashboard";
            case "/bills":
                if (format === "plural") return "bills";
                return "bill";
            case "/settings":
                if (format === "plural") return "settings";
                return "setting";
            default:
                return "";
        }
    }
}
