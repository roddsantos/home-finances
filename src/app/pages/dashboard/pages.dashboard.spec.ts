import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PageDashboard } from "./pages.dashboard";

describe("PageDashboard", () => {
    let component: PageDashboard;
    let fixture: ComponentFixture<PageDashboard>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PageDashboard],
        }).compileComponents();

        fixture = TestBed.createComponent(PageDashboard);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
