import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObservationTopFiveComponent } from './observation-top-five.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatTabGroupHarness } from '@angular/material/tabs/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TopFiveComponent } from './top-five/top-five.component';
import { MockComponents } from 'ng-mocks';
import { TopFiveFilteredComponent } from './top-five-filtered/top-five-filtered.component';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ObservationTopFiveComponent', () => {
  let component: ObservationTopFiveComponent;
  let fixture: ComponentFixture<ObservationTopFiveComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MockComponents(TopFiveComponent, TopFiveFilteredComponent),
      ],
      providers: [provideZonelessChangeDetection()],
      declarations: [ObservationTopFiveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObservationTopFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load harness for tab-group', async () => {
    const tabGroups = await loader.getAllHarnesses(MatTabGroupHarness);
    expect(tabGroups.length).toBe(1);
  });

  it('should load harness for tab-group with selected tab label', async () => {
    const tabGroups = await loader.getAllHarnesses(
      MatTabGroupHarness.with({
        selectedTabLabel: 'All time',
      })
    );
    expect(tabGroups.length).toBe(1);
  });

  it('should be able to get tabs of tab-group', async () => {
    const tabGroup = await loader.getHarness(MatTabGroupHarness);
    const tabs = await tabGroup.getTabs();
    expect(tabs.length).toBe(2);
  });

  it('should be able to select tab from tab-group', async () => {
    const tabGroup = await loader.getHarness(MatTabGroupHarness);
    expect(await (await tabGroup.getSelectedTab()).getLabel()).toBe('All time');
    await tabGroup.selectTab({ label: 'Month' });
    expect(await (await tabGroup.getSelectedTab()).getLabel()).toBe('Month');
  });
});
