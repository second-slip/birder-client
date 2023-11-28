import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SideMenuComponent } from './side-menu.component';
import { ObservationCountComponent } from 'src/app/_analysis/observation-count/observation-count.component';
import { TweetDayComponent } from 'src/app/_tweet/tweet-day/tweet-day.component';
import { ObservationTopFiveComponent } from 'src/app/_analysis/observation-top-five/observation-top-five.component';
import { NetworkSidebarComponent } from 'src/app/_network/network-sidebar/network-sidebar.component';
import { MockComponent } from 'ng-mocks';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideMenuComponent]
    })
      .overrideComponent(SideMenuComponent, {
        remove: { imports: [ObservationCountComponent, TweetDayComponent, ObservationTopFiveComponent, NetworkSidebarComponent] },
        add: { imports: [MockComponent(ObservationCountComponent), MockComponent(ObservationTopFiveComponent), MockComponent(NetworkSidebarComponent)] },
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