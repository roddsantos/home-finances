import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NewSavingModal } from "./new-saving.modal";

describe("NewSavingModal", () => {
    let component: NewSavingModal;
    let fixture: ComponentFixture<NewSavingModal>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NewSavingModal],
        }).compileComponents();

        fixture = TestBed.createComponent(NewSavingModal);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
