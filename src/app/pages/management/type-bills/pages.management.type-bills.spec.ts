import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeBillsManagementComponent } from './pages.management.type-bills';

describe('TypeBillsManagementComponent', () => {
  let component: TypeBillsManagementComponent;
  let fixture: ComponentFixture<TypeBillsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeBillsManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TypeBillsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
