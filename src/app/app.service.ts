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
        private companyState: CompanyState
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
                    default:
                        break;
                }
        });
    }

    appInitializer() {
        try {
            const user = this.localStorageService.getUser();
            if (user) this.userState.setUser(user);
            else return Promise.resolve();

            return firstValueFrom(
                forkJoin({
                    banks: this.bankService.getBanks().pipe(catchError(() => of(void 0))),
                    categories: this.categoryService
                        .getCategories()
                        .pipe(catchError(() => of(void 0))),
                    companies: this.companyService
                        .getCompanies()
                        .pipe(catchError(() => of(void 0))),
                }).pipe(
                    tap(({ banks, categories, companies }) => {
                        this.handleError({ banks, categories, companies });
                        this.bankState.setBanks(banks || []);
                        this.categoryState.setCategories(categories || []);
                        this.companyState.setCompanies(companies || []);
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
