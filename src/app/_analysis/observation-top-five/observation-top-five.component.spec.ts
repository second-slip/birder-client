import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObservationTopFiveComponent } from './observation-top-five.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatTabGroupHarness } from '@angular/material/tabs/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TopFiveComponent } from './top-five/top-five.component';
import { MockComponents } from 'ng-mocks';
import { TopFiveFilteredComponent } from './top-five-filtered/top-five-filtered.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

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

// describe('ObservationTopFiveComponent service is called successfully with count > 0', () => {

//     // beforeEach(() => {
//     //   fixture.detectChanges();
//     // });

//     let fixture: ComponentFixture<ObservationTopFiveComponent>;
//     let debugElement: DebugElement;
//     let fakeObservationTopFiveService: ObservationTopFiveService;

//     beforeEach(async () => {

//         fakeObservationTopFiveService = jasmine.createSpyObj<ObservationTopFiveService>(
//             'ObservationTopFiveService',
//             {
//                 getData: undefined,
//             },
//             {
//                 // isLoading: of(false),
//                 isError: of(false),
//                 getTop: of(fakeIObservationTopFive)
//             }
//         );

//         await TestBed.configureTestingModule({
//             schemas: [NO_ERRORS_SCHEMA],
//             imports: [NoopAnimationsModule, ObservationTopFiveComponent],
//             providers: [
//                 provideRouter(blankRoutesArray),
//                 { provide: ObservationTopFiveService, useValue: fakeObservationTopFiveService },
//                 { provide: AuthenticationService, useValue: fakeAuthService }
//             ]
//         }).compileComponents();

//         fixture = TestBed.createComponent(ObservationTopFiveComponent);
//         fixture.detectChanges();
//         debugElement = fixture.debugElement;
//     });

//     it('should call getData on init', () => {
//         expect(fakeObservationTopFiveService.getData).toHaveBeenCalled();
//         expect(fakeObservationTopFiveService.getData).toHaveBeenCalledTimes(1);
//     });

//     it('should render the analysis section for count >1', fakeAsync(() => {
//         const compiled = fixture.nativeElement as HTMLElement;
//         tick();

//         expect(compiled.querySelector('[data-testid="top-five-content"]')?.textContent).toBeDefined();
//         //expect(compiled.querySelector('[data-testid="analysis-text"]')?.textContent).toContain('You have spotted 57');

//         expect(compiled.querySelector('[data-testid="top-five-content-zero"]')?.textContent).toBeUndefined();
//     }));

//     it('should not show loading child component', () => {
//         fixture.detectChanges();
//         const { debugElement } = fixture;
//         const loading = debugElement.query(By.css('app-loading'));
//         expect(loading).toBeFalsy();
//     });

//     it('should not show error content', () => {
//         const compiled = fixture.nativeElement as HTMLElement;
//         expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();
//     });
// });

// describe('ObservationTopFiveComponent service is called successfully with count = 0', () => {

//     let fixture: ComponentFixture<ObservationTopFiveComponent>;
//     let debugElement: DebugElement;
//     let fakeObservationTopFiveService: ObservationTopFiveService;

//     beforeEach(async () => {

//         fakeObservationTopFiveService = jasmine.createSpyObj<ObservationTopFiveService>(
//             'ObservationTopFiveService',
//             {
//                 getData: undefined,
//             },
//             {
//                 // isLoading: of(false),
//                 isError: of(false),
//                 getTop: of(fakeIObservationTopFiveEmpty)
//             }
//         );

//         await TestBed.configureTestingModule({
//             schemas: [NO_ERRORS_SCHEMA],
//             imports: [NoopAnimationsModule, ObservationTopFiveComponent],
//             providers: [
//                 provideRouter(blankRoutesArray),
//                 { provide: ObservationTopFiveService, useValue: fakeObservationTopFiveService },
//                 { provide: AuthenticationService, useValue: fakeAuthService }
//             ]
//         }).compileComponents();

//         fixture = TestBed.createComponent(ObservationTopFiveComponent);
//         fixture.detectChanges();
//         debugElement = fixture.debugElement;
//     });

//     it('should call getData on init', () => {
//         expect(fakeObservationTopFiveService.getData).toHaveBeenCalled();
//         expect(fakeObservationTopFiveService.getData).toHaveBeenCalledTimes(1);
//     });

//     it('should render the analysis section for count = 0', fakeAsync(() => {
//         const compiled = fixture.nativeElement as HTMLElement;
//         tick();

//         expect(compiled.querySelector('[data-testid="top-five-content-zero"]')?.textContent).toBeDefined();
//         //expect(compiled.querySelector('[data-testid="analysis-zero-text"]')?.textContent).toContain('You have not yet logged any observations');
//         expect(compiled.querySelector('[data-testid="top-five-content"]')?.textContent).toBeUndefined();
//     }));

//     it('should not show loading child component', () => {
//         const { debugElement } = fixture;
//         const loading = debugElement.query(By.css('app-loading'));
//         expect(loading).toBeFalsy();
//     });

//     it('should not show error content', () => {
//         const compiled = fixture.nativeElement as HTMLElement;
//         expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();
//     });
// });

// describe('ObservationTopFiveComponent - test when error', () => {
//     let fixture: ComponentFixture<ObservationTopFiveComponent>;
//     let debugElement: DebugElement;
//     let fakeObservationTopFiveService: ObservationTopFiveService;

//     beforeEach(async () => {

//         fakeObservationTopFiveService = jasmine.createSpyObj<ObservationTopFiveService>(
//             'ObservationTopFiveService',
//             {
//                 getData: undefined,
//             },
//             {
//                 // isLoading: of(false),
//                 isError: of(true),
//                 getTop: undefined //of(fakeITweet)
//             }
//         );

//         await TestBed.configureTestingModule({
//             schemas: [NO_ERRORS_SCHEMA],
//             imports: [NoopAnimationsModule, ObservationTopFiveComponent],
//             providers: [
//                 provideRouter(blankRoutesArray),
//                 { provide: ObservationTopFiveService, useValue: fakeObservationTopFiveService },
//                 { provide: AuthenticationService, useValue: fakeAuthService }
//             ]
//         }).compileComponents();

//         fixture = TestBed.createComponent(ObservationTopFiveComponent);
//         fixture.detectChanges();
//         debugElement = fixture.debugElement;
//     });

//     it('hides loading content', () => {
//         const { debugElement } = fixture;
//         const loading = debugElement.query(By.css('app-loading'));
//         expect(loading).toBeFalsy();
//     });

//     it('hides main content', () => {
//         const compiled = fixture.nativeElement as HTMLElement;
//         expect(compiled.querySelector('[data-testid="main-title"]')?.textContent).toBeUndefined();
//     });

//     it('shows error content', () => {
//         const compiled = fixture.nativeElement as HTMLElement;
//         expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeDefined();
//         expect(compiled.querySelector('[data-testid="reload-button"]')?.textContent).toBeDefined();
//         expectText(fixture, 'error', 'Whoops! There was an error retrieving the data.Try Again');
//     });

//     it('tries data fetch again on retry button click', fakeAsync(async () => {
//         fixture.debugElement.query(By.css('.btn-try-again')).triggerEventHandler('click', null);
//         expect(fakeObservationTopFiveService.getData).toHaveBeenCalled();
//     }));
// });

// describe('ObservationTopFiveComponent - test loading placeholder', () => {
//     let fixture: ComponentFixture<ObservationTopFiveComponent>;
//     let debugElement: DebugElement;
//     let fakeObservationTopFiveService: ObservationTopFiveService;

//     beforeEach(async () => {

//         fakeObservationTopFiveService = jasmine.createSpyObj<ObservationTopFiveService>(
//             'ObservationTopFiveService',
//             {
//                 getData: undefined,
//             },
//             {
//                 // isLoading: of(true),
//                 isError: of(false),
//                 getTop: undefined //of(fakeITweet)
//             }
//         );

//         await TestBed.configureTestingModule({
//             schemas: [NO_ERRORS_SCHEMA],
//             imports: [NoopAnimationsModule, ObservationTopFiveComponent],
//             providers: [
//                 provideRouter(blankRoutesArray),
//                 { provide: ObservationTopFiveService, useValue: fakeObservationTopFiveService },
//                 { provide: AuthenticationService, useValue: fakeAuthService }
//             ]
//         }).compileComponents();

//         fixture = TestBed.createComponent(ObservationTopFiveComponent);
//         fixture.detectChanges();
//         debugElement = fixture.debugElement;
//     });

//     it('shows loading content', () => {
//         const { debugElement } = fixture;
//         const loading = debugElement.query(By.css('app-loading'));
//         expect(loading).toBeTruthy();
//     });

//     it('should not show main content', () => {
//         const compiled = fixture.nativeElement as HTMLElement;
//         expect(compiled.querySelector('[data-testid="main-title"]')?.textContent).toBeUndefined();
//     });

//     it('should not show error content', () => {
//         const compiled = fixture.nativeElement as HTMLElement;
//         expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();
//     });
// });
