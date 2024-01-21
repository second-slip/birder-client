import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutComponent } from './about.component';
import { provideRouter } from '@angular/router';
import { blankRoutesArray } from 'src/app/testing/route-tests-helpers';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTabGroupHarness } from '@angular/material/tabs/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { By } from '@angular/platform-browser';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent, NoopAnimationsModule],
      providers: [
        provideRouter(blankRoutesArray),
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('only renders the About General component in the default About tab', () => {
    const { debugElement } = fixture;
    expect(debugElement.query(By.css('app-about-general'))).toBeTruthy();
    expect(debugElement.query(By.css('app-features'))).toBeFalsy();
  });

  it('should load harness for tab-group', async () => {
    const tabGroups = await loader.getAllHarnesses(MatTabGroupHarness);
    expect(tabGroups.length).toBe(1);
  });

  it('should load harness for tab-group with selected tab label', async () => {
    const tabGroups = await loader.getAllHarnesses(
      MatTabGroupHarness.with({
        selector: '#about-tab-group',
      }),
    );
    expect(tabGroups.length).toBe(1);
  });

  describe('test tab group functuionality', () => {

    it('should be able to get tabs of tab-group', async () => {
      const tabGroup = await loader.getHarness(MatTabGroupHarness);
      const tabs = await tabGroup.getTabs();
      expect(tabs.length).toBe(3);
    });

    it('should be able to select and switch tabs from tab-group and render the correct content', async () => {
      const { debugElement } = fixture;

      const tabGroup = await loader.getHarness(MatTabGroupHarness);
      expect(await (await tabGroup.getSelectedTab()).getLabel()).toBe('sentiment_very_satisfied About');

      expect(debugElement.query(By.css('app-about-general'))).toBeTruthy();
      expect(debugElement.query(By.css('app-features'))).toBeFalsy();

      await tabGroup.selectTab({ label: 'list_alt Features' });
      expect(await (await tabGroup.getSelectedTab()).getLabel()).toBe('list_alt Features');

      expect(debugElement.query(By.css('app-about-general'))).toBeFalsy();
      expect(debugElement.query(By.css('app-features'))).toBeTruthy();
    });
  });
});
