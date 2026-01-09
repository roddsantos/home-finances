import { Injectable } from "@angular/core";
import { BankService } from "./services/bank.service";
import { catchError, firstValueFrom, forkJoin, map, of, tap } from "rxjs";
import { BankState } from "./core/subjects/subjects.bank";
import { LocalStorageService } from "./services/local-storage.service";
import { UserState } from "./core/subjects/subjects.user";
import { CategoryService } from "./services/category.service";
import { CategoryState } from "./core/subjects/subjects.category";

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
        private categoryState: CategoryState
    ) {}

    handleError(object: any) {
        Object.keys(object).map((key) => {
            console.log(!object[key], key);
            switch (key) {
                case "banks":
                    if (!object[key])
                        this.bankState.changeStatus("http", "error fetching banks");
                    break;
                case "categories":
                    if (!object[key])
                        this.categoryState.changeStatus(
                            "http",
                            "error fetching categories"
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
                }).pipe(
                    tap(({ banks, categories }) => {
                        this.handleError({ banks, categories });
                        this.bankState.setBanks(banks || []);
                        this.categoryState.setCategories(categories || []);
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
