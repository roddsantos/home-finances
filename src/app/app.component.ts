import { Component, ViewEncapsulation, inject } from "@angular/core";
import { LocalStorageService } from "./services/services.local-storage";
import { UserState } from "./pages/subjects/subjects.user";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
    public storage = inject(LocalStorageService);
    public userState = inject(UserState);

    title = "bills-app";

    ngOnInit() {
        const user = this.storage.getUser();
        if (user) {
            this.userState.setUser(user);
        }
    }
}
