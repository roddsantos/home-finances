import { inject, Pipe, PipeTransform } from "@angular/core";
import { UserObjectType } from "src/app/core/types/data/user.types";
import { LocalStorageService } from "src/app/services/local-storage.service";

@Pipe({
    name: "user",
    standalone: true,
})
export class UserPipe implements PipeTransform {
    private storage = inject(LocalStorageService);
    transform(value: Partial<UserObjectType>, format?: "compare") {
        if (format === "compare") {
            if (!Boolean(value)) return true;
            const user = this.storage.getUser();
            let flag = true;

            if (value.name) flag = flag && value.name === user?.name;
            if (value.surname) flag = flag && value.surname === user?.surname;
            if (value.username) flag = flag && value.username === user?.username;
            return flag;
        }
        return value;
    }
}
