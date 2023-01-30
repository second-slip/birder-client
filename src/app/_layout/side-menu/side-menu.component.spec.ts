import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SideMenuComponent } from './side-menu.component';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show count analysis', () => {
    const { debugElement } = fixture;
    const loading = debugElement.query(By.css('app-observation-count'));
    expect(loading).toBeTruthy();
  });

  it('should show tweet of the day', () => {
    const { debugElement } = fixture;
    const loading = debugElement.query(By.css('app-tweet-day'));
    expect(loading).toBeTruthy();
  });

  it('should show top 5 analysis', () => {
    const { debugElement } = fixture;
    const loading = debugElement.query(By.css('app-observation-top-five'));
    expect(loading).toBeTruthy();
  });

  it('should show network analysis', () => {
    const { debugElement } = fixture;
    const loading = debugElement.query(By.css('app-network-sidebar'));
    expect(loading).toBeTruthy();
  });
});