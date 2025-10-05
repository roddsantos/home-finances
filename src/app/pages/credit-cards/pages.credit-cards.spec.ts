import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CreditCardsManagementComponent } from "./pages.credit-cards";

describe("TypeBillsManagementComponent", () => {
    let component: CreditCardsManagementComponent;
    let fixture: ComponentFixture<CreditCardsManagementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CreditCardsManagementComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CreditCardsManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
