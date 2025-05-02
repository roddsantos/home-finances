import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ModalNewSaving } from "./new-saving.modal";

describe("NewSavingModal", () => {
    let component: ModalNewSaving;
    let fixture: ComponentFixture<ModalNewSaving>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ModalNewSaving],
        }).compileComponents();

        fixture = TestBed.createComponent(ModalNewSaving);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
