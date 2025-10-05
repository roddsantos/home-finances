import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHome } from './pages.home';

describe('PagesHome', () => {
  let component: PageHome;
  let fixture: ComponentFixture<PageHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageHome],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
