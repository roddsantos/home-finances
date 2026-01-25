import { inject } from "@angular/core";
import { BankService } from "../services/bank.service";
import { CategoryService } from "../services/category.service";
import { CompanyService } from "../services/company.service";
import { CreditCardService } from "../services/credit-card.service";
import { ThemeService } from "../services/theme.service";
import { BankState } from "./subjects/subjects.bank";
import { CategoryState } from "./subjects/subjects.category";
import { CompanyState } from "./subjects/subjects.company";
import { CreditCardState } from "./subjects/subjects.credit-card";
import { ThemeState } from "./subjects/subjects.theme";
import { catchError, forkJoin, map, of, tap } from "rxjs";
import { ALL_ROOT_THEMES } from "src/utils/constants/colors";
import { ResolveFn } from "@angular/router";

export const initialDataResolver: ResolveFn<void> = () => {
    const bankService = inject(BankService);
    const categoryService = inject(CategoryService);
    const companyService = inject(CompanyService);
    const creditCardService = inject(CreditCardService);
    const themeService = inject(ThemeService);

    const bankState = inject(BankState);
    const categoryState = inject(CategoryState);
    const companyState = inject(CompanyState);
    const creditCardState = inject(CreditCardState);
    const themeState = inject(ThemeState);

    const handleError = (object: any) => {
        Object.keys(object).map((key) => {
            if (!object[key])
                switch (key) {
                    case "banks":
                        bankState.changeStatus("http", "error fetching banks");
                        break;
                    case "categories":
                        categoryState.changeStatus("http", "error fetching categories");
                        break;
                    case "companies":
                        companyState.changeStatus("http", "error fetching companies");
                        break;
                    case "creditCards":
                        creditCardState.changeStatus(
                            "http",
                            "error fetching credit cards",
                        );
                        break;
                    default:
                        break;
                }
        });
    };

    return forkJoin({
        banks: bankService.getBanks().pipe(catchError(() => of([]))),
        categories: categoryService.getCategories().pipe(catchError(() => of([]))),
        companies: companyService.getCompanies().pipe(catchError(() => of([]))),
        creditCards: creditCardService.getCreditCards().pipe(catchError(() => of([]))),
        themes: themeService.getThemes().pipe(catchError(() => of(ALL_ROOT_THEMES))),
    }).pipe(
        tap(({ banks, categories, companies, creditCards, themes }) => {
            handleError({ banks, categories, companies, creditCards, themes });
            bankState.setBanks(banks);
            categoryState.setCategories(categories);
            companyState.setCompanies(companies);
            creditCardState.setCreditCards(creditCards);
            themeState.setThemeList([...themes, ...ALL_ROOT_THEMES]);
        }),
        map(() => void 0),
    );
};
