import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { LayoutComponent } from "./components/layout/layout.component";
import { PageHome } from "./pages/home/pages.home";
import { PageManagement } from "./pages/management/pages.management";
import { MatTabsModule } from "@angular/material/tabs";
import { AppRoutingModule } from "./app-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ManagementCompaniesComponent } from "./pages/management/companies/pages.management.companies";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { ModalProfile } from "./components/modal/profile/profile.modal";
import { ModalComponent } from "./components/modal/modal.component";
import { MatInputModule } from "@angular/material/input";
import { TextfieldComponent } from "./components/textfield/textfield.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { TypeBillsManagementComponent } from "./pages/management/type-bills/pages.management.type-bills";
import { CustomButtonComponent } from "./components/custom-button/custom-button.component";

@NgModule({
    declarations: [AppComponent, TextfieldComponent, CustomButtonComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        MatTabsModule,
        AppRoutingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        FormsModule,
        CommonModule,
        LayoutComponent,
        ModalComponent,
        ModalProfile,
        TypeBillsManagementComponent,
        ManagementCompaniesComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
