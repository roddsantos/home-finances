import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageManagement } from './pages.management';

describe('PagesHome', () => {
  let component: PageManagement;
  let fixture: ComponentFixture<PageManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(PageManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
