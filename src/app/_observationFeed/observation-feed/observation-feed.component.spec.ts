import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { findComponent } from 'src/app/testing/element.spec-helper';
import { fakeIObservationFeed, fakeIObservationFeedWithOneElement } from 'src/app/testing/observation-feed-helper';
import { ObservationFeedService } from '../observation-feed.service';



import { ObservationFeedComponent } from './observation-feed.component';

describe('ObservationFeedComponent', () => {
  
  describe('test when success', () => {
    let fixture: ComponentFixture<ObservationFeedComponent>;
    let debugElement: DebugElement;
    let fakeObservationFeedService: ObservationFeedService;

    beforeEach(async () => {

        fakeObservationFeedService = jasmine.createSpyObj<ObservationFeedService>(
            'ObservationFeedService',
            {
                getData: undefined,
            },
            {
                isLoading: of(false),
                isError: of(false),
                allLoaded: of(false),
                getObservations: of(fakeIObservationFeed)
            }
        );

        await TestBed.configureTestingModule({
            declarations: [
                ObservationFeedComponent
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .overrideComponent(ObservationFeedComponent,
                {
                    set: {
                        providers: [{ provide: ObservationFeedService, useValue: fakeObservationFeedService }]
                    }
                })

            .compileComponents();

        fixture = TestBed.createComponent(ObservationFeedComponent);
        fixture.detectChanges();
        debugElement = fixture.debugElement;
    });

    it('should call getData on init', () => {
        expect(fakeObservationFeedService.getData).toHaveBeenCalled();
        expect(fakeObservationFeedService.getData).toHaveBeenCalledTimes(1);
    });

    it('should render the observation child component', fakeAsync(() => {
        const feed = findComponent(fixture, 'app-observation-feed-item');
        expect(feed).toBeTruthy();
    }));

    it('should not show loading child component', () => {
        const { debugElement } = fixture;
        const loading = debugElement.query(By.css('app-loading'));
        expect(loading).toBeFalsy();
    });

    it('should not show error content', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('[data-testid="error-content"]')?.textContent).toBeUndefined();
    });

    it('should not show all loaded content', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('[data-testid="all-loaded"]')?.textContent).toBeUndefined();
    });
});

describe('test when success and all loaded', () => {
    let fixture: ComponentFixture<ObservationFeedComponent>;
    let debugElement: DebugElement;
    let fakeObservationFeedService: ObservationFeedService;

    beforeEach(async () => {

        fakeObservationFeedService = jasmine.createSpyObj<ObservationFeedService>(
            'ObservationFeedService',
            {
                getData: undefined,
            },
            {
                isLoading: of(false),
                isError: of(false),
                allLoaded: of(true),
                getObservations: of(fakeIObservationFeedWithOneElement)
            }
        );

        await TestBed.configureTestingModule({
            declarations: [
                ObservationFeedComponent
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .overrideComponent(ObservationFeedComponent,
                {
                    set: {
                        providers: [{ provide: ObservationFeedService, useValue: fakeObservationFeedService }]
                    }
                })

            .compileComponents();

        fixture = TestBed.createComponent(ObservationFeedComponent);
        fixture.detectChanges();
        debugElement = fixture.debugElement;
    });

    it('should call getData on init', () => {
        expect(fakeObservationFeedService.getData).toHaveBeenCalled();
        expect(fakeObservationFeedService.getData).toHaveBeenCalledTimes(1);
    });

    it('should render the observation child component', fakeAsync(() => {
        const feed = findComponent(fixture, 'app-observation-feed-item');
        expect(feed).toBeTruthy();
    }));

    it('should not show loading child component', () => {
        const { debugElement } = fixture;
        const loading = debugElement.query(By.css('app-loading'));
        expect(loading).toBeFalsy();
    });

    it('should not show error content', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('[data-testid="error-content"]')?.textContent).toBeUndefined();
    });

    it('should show all loaded content', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('[data-testid="all-loaded"]')?.textContent).toBeDefined();
    });
});

describe('test loading placeholder', () => {
    let fixture: ComponentFixture<ObservationFeedComponent>;
    let debugElement: DebugElement;
    let fakeObservationFeedService: ObservationFeedService;

    beforeEach(async () => {

        fakeObservationFeedService = jasmine.createSpyObj<ObservationFeedService>(
            'ObservationFeedService',
            {
                getData: undefined,
            },
            {
                isLoading: of(true),
                isError: of(false),
                allLoaded: of(false),
                getObservations: undefined
            }
        );

        await TestBed.configureTestingModule({
            declarations: [
                ObservationFeedComponent
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .overrideComponent(ObservationFeedComponent,
                {
                    set: {
                        providers: [{ provide: ObservationFeedService, useValue: fakeObservationFeedService }]
                    }
                })

            .compileComponents();

        fixture = TestBed.createComponent(ObservationFeedComponent);
        fixture.detectChanges();
        debugElement = fixture.debugElement;
    });


    it('shows loading content', () => {
        const loading = findComponent(fixture, 'app-loading');
        expect(loading).toBeTruthy();
    });

    it('should not show error content', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('[data-testid="error-content"]')?.textContent).toBeUndefined();
    });
});

describe('test error content', () => {
    let fixture: ComponentFixture<ObservationFeedComponent>;
    let debugElement: DebugElement;
    let fakeObservationFeedService: ObservationFeedService;

    beforeEach(async () => {

        fakeObservationFeedService = jasmine.createSpyObj<ObservationFeedService>(
            'ObservationFeedService',
            {
                getData: undefined,
            },
            {
                isLoading: of(false),
                isError: of(true),
                allLoaded: of(false),
                getObservations: undefined //of(fakeITweet)
            }
        );

        await TestBed.configureTestingModule({
            declarations: [
                ObservationFeedComponent
            ],
            schemas: [NO_ERRORS_SCHEMA]//,
            // providers: [
            //     { provide: ObservationFeedService, useValue: fakeObservationFeedService }
            // ]
        })
            .overrideComponent(ObservationFeedComponent,
                {
                    set: {
                        providers: [{ provide: ObservationFeedService, useValue: fakeObservationFeedService }]
                    }
                })

            .compileComponents();

        fixture = TestBed.createComponent(ObservationFeedComponent);
        fixture.detectChanges();
        debugElement = fixture.debugElement;
    });

    // it('hides loading content', () => {
    //     const { debugElement } = fixture;
    //     const loading = debugElement.query(By.css('app-loading'));
    //     expect(loading).toBeFalsy();
    // });

    it('hides main content', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('[data-testid="main-title"]')?.textContent).toBeUndefined();
    });

    it('shows error content', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('[data-testid="error-content"]')?.textContent).toBeDefined();
        expect(compiled.querySelector('[data-testid="reload-button"]')?.textContent).toBeDefined();
        expect(compiled.querySelector('[data-testid="error-content"]')?.textContent).toContain('Whoops');
    });

    // 
    it('error reload button on click calls reload()', fakeAsync(() => {
        // Arrange
        const component = fixture.componentInstance;
        const reloadMethod = spyOn(component, 'reload');
        const incrementButton = debugElement.query(
            By.css('[data-testid="reload-button"]')
        );

        // Act
        incrementButton.triggerEventHandler('click', null);

        tick();

        // Assert
        expect(reloadMethod).toHaveBeenCalled();
    }));
});
});
