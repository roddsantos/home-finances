import { Injectable } from "@angular/core";
import { BankService } from "./services/bank.service";
import { catchError, firstValueFrom, forkJoin, map, of, tap } from "rxjs";
import { BankState } from "./core/subjects/subjects.bank";
import { LocalStorageService } from "./services/local-storage.service";
import { UserState } from "./core/subjects/subjects.user";
import { CategoryService } from "./services/category.service";
import { CategoryState } from "./core/subjects/subjects.category";
import { CompanyService } from "./services/company.service";
import { CompanyState } from "./core/subjects/subjects.company";
import { CreditCardService } from "./services/credit-card.service";
import { CreditCardState } from "./core/subjects/subjects.credit-card";
import { GeneralState } from "./core/subjects/subjects.general";
import { ThemeState } from "./core/subjects/subjects.theme";
import { ThemeService } from "./services/theme.service";
import { ALL_ROOT_THEMES, DEFAULT_THEME } from "src/utils/constants/colors";

@Injectable({
    providedIn: "root",
})
export class AppService {
    constructor(
        private localStorageService: LocalStorageService,
        private userState: UserState,
        private bankService: BankService,
        private bankState: BankState,
        private categoryService: CategoryService,
        private categoryState: CategoryState,
        private companyService: CompanyService,
        private companyState: CompanyState,
        private creditCardService: CreditCardService,
        private creditCardState: CreditCardState,
        private generalState: GeneralState,
        private themeState: ThemeState,
        private themeService: ThemeService
    ) {}

    handleError(object: any) {
        Object.keys(object).map((key) => {
            if (!object[key])
                switch (key) {
                    case "banks":
                        this.bankState.changeStatus("http", "error fetching banks");
                        break;
                    case "categories":
                        this.categoryState.changeStatus(
                            "http",
                            "error fetching categories"
                        );
                        break;
                    case "companies":
                        this.companyState.changeStatus(
                            "http",
                            "error fetching companies"
                        );
                        break;
                    case "creditCards":
                        this.creditCardState.changeStatus(
                            "http",
                            "error fetching credit cards"
                        );
                        break;
                    default:
                        break;
                }
        });
    }

    appInitializer() {
        try {
            this.generalState.changePage(window.location.pathname);
            const user = this.localStorageService.getUser();
            if (user) this.userState.setUser(user);
            else return Promise.resolve();

            const theme = this.localStorageService.getTheme();
            if (!theme) this.themeService.setTheme(DEFAULT_THEME);
            else this.themeService.setTheme(theme);

            return firstValueFrom(
                forkJoin({
                    banks: this.bankService.getBanks().pipe(catchError(() => of(void 0))),
                    categories: this.categoryService
                        .getCategories()
                        .pipe(catchError(() => of(void 0))),
                    companies: this.companyService
                        .getCompanies()
                        .pipe(catchError(() => of(void 0))),
                    creditCards: this.creditCardService
                        .getCreditCards()
                        .pipe(catchError(() => of(void 0))),
                    themes: this.themeService.getThemes().pipe(
                        catchError(() => {
                            this.themeState.setThemeList([...ALL_ROOT_THEMES]);
                            return of(void 0);
                        })
                    ),
                }).pipe(
                    tap(({ banks, categories, companies, creditCards, themes }) => {
                        this.handleError({ banks, categories, companies, creditCards });
                        this.bankState.setBanks(banks || []);
                        this.categoryState.setCategories(categories || []);
                        this.companyState.setCompanies(companies || []);
                        this.creditCardState.setCreditCards(creditCards || []);
                        this.themeState.setThemeList(
                            themes
                                ? [...themes, ...ALL_ROOT_THEMES]
                                : [...ALL_ROOT_THEMES]
                        );
                    }),
                    map(() => void 0),
                    catchError(() => of(void 0))
                )
            );
        } catch (error) {
            console.error("Initializer error", error);
            return Promise.resolve();
        }
    }
}
