import { Injectable } from "@angular/core";
import { BankService } from "./services/bank.service";
import { catchError, firstValueFrom, forkJoin, map, of, tap } from "rxjs";
import { BankState } from "./core/subjects/subjects.bank";
import { LocalStorageService } from "./services/local-storage.service";
import { UserState } from "./core/subjects/subjects.user";

@Injectable({
    providedIn: "root",
})
export class AppService {
    constructor(
        private localStorageService: LocalStorageService,
        private userState: UserState,
        private bankService: BankService,
        private bankState: BankState
    ) {}

    appInitializer() {
        try {
            const user = this.localStorageService.getUser();
            if (user) this.userState.setUser(user);
            else return Promise.resolve();

            return firstValueFrom(
                forkJoin({
                    banks: this.bankService.getBanks(),
                }).pipe(
                    tap(({ banks }) => {
                        this.bankState.setBanks(banks);
                        this.bankState.changeVariant(banks.length > 0 ? "none" : "empty");
                    }),
                    map(() => void 0),
                    catchError((err) => {
                        this.bankState.changeStatus("http", "error fetching banks");
                        return of(void 0);
                    })
                )
            );
        } catch (error) {
            console.error("Initializer error", error);
            return Promise.resolve();
        }
    }
}
