import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutSidebarComponent } from './layout-sidebar.component';

import { By } from '@angular/platform-browser';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { MockComponent } from 'ng-mocks';

describe('LayoutSidebarComponent', () => {
  let component: LayoutSidebarComponent;
  let fixture: ComponentFixture<LayoutSidebarComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [LayoutSidebarComponent]
    })
      .overrideComponent(LayoutSidebarComponent, {
        remove: { imports: [SideMenuComponent] },
        add: { imports: [MockComponent(SideMenuComponent)] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutSidebarComponent);
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

  it('should show the side menu', () => {
    const { debugElement } = fixture;
    const loading = debugElement.query(By.css('app-side-menu'));
    expect(loading).toBeTruthy();
  });
});
