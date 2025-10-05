import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BanksManagementComponent } from "./pages.management.banks";

describe("BanksManagementComponent", () => {
    let component: BanksManagementComponent;
    let fixture: ComponentFixture<BanksManagementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BanksManagementComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BanksManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
