import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutNoSidebarComponent } from './layout-no-sidebar.component';
import { By } from '@angular/platform-browser';

describe('LayoutNoSidebarComponent', () => {
  let component: LayoutNoSidebarComponent;
  let fixture: ComponentFixture<LayoutNoSidebarComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
    imports: [LayoutNoSidebarComponent]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutNoSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show router outlet', () => {
    const { debugElement } = fixture;
    const loading = debugElement.query(By.css('router-outlet'));
    expect(loading).toBeTruthy();
  });
});