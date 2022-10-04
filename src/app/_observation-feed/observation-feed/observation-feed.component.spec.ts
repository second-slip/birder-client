import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { expectText, findComponent } from 'src/app/testing/element.spec-helper';
import { fakeIObservationFeed } from 'src/app/testing/observation-feed-helper';
import { ObservationFeedService } from '../../_observation-feed/observation-feed.service';
import { ObservationFeedComponent } from './observation-feed.component';

describe('ObservationFeedComponent', () => {
    let component: ObservationFeedComponent;
    let fixture: ComponentFixture<ObservationFeedComponent>;
    let fakeObservationFeedService: jasmine.SpyObj<ObservationFeedService>;

    const setup = async (
        fakeMethodValues?: jasmine.SpyObjMethodNames<ObservationFeedService>,
        fakePropertyValues?: jasmine.SpyObjPropertyNames<ObservationFeedService>,
        fakeRouteArgument?: string) => {

        fakeObservationFeedService = jasmine.createSpyObj<ObservationFeedService>(
            'ObservationFeedService',
            {
                getData: undefined,
                ...fakeMethodValues
            },
            {
                isLoading: of(false),
                isError: of(false),
                allLoaded: of(false),
                observations: of(null),
                ...fakePropertyValues
            }
        );

        await TestBed.configureTestingModule({
            declarations: [
                ObservationFeedComponent
            ],
            providers: [{
                provide: ActivatedRoute,
                useValue: {
                    paramMap: of(new Map(Object.entries({
                        filter: fakeRouteArgument
                    })))
                    // needs to be a 'Map' object otherwise "map.get is not a function" error occurs
                    // see: https://bobbyhadz.com/blog/javascript-typeerror-map-get-is-not-a-function#:~:text=get%20is%20not%20a%20function%22%20error%20occurs%20when%20we%20call,the%20method%20on%20Map%20objects.
                }
            }],
            schemas: [NO_ERRORS_SCHEMA]
        }).overrideComponent(ObservationFeedComponent,
            {
                set: {
                    providers: [{ provide: ObservationFeedService, useValue: fakeObservationFeedService }]
                }
            }).compileComponents();

        fixture = TestBed.createComponent(ObservationFeedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    it('should be created and show the loading placeloader', fakeAsync(async () => {
        await setup({}, {});

        expect(component).toBeTruthy();
        const { debugElement } = fixture;
        const loading = debugElement.query(By.css('app-loading'));
        expect(loading).toBeTruthy();
    }));

    it('should setup the "public" feed', fakeAsync(async () => {
        await setup({}, {}, 'public');

        expect(fakeObservationFeedService.getData).toHaveBeenCalledOnceWith(1, 'api/ObservationFeed');
        expectText(fixture, 'title', "Latest observations");
    }));

    it('should setup the "network" feed', fakeAsync(async () => {
        await setup({}, {}, 'network');

        expect(fakeObservationFeedService.getData).toHaveBeenCalledWith(1, 'api/ObservationFeed/NetworkFeed');
        expect(fakeObservationFeedService.getData).toHaveBeenCalledTimes(1);
        expectText(fixture, 'title', "Latest observations in your network");
    }));



    describe('when data fetch returns observations', () => {

        it('calls data fetch', fakeAsync(async () => {
            await setup({},
                {
                    isLoading: of(false),
                    isError: of(false),
                    allLoaded: of(false),
                    observations: of(fakeIObservationFeed)
                },
                'public');
            expect(fakeObservationFeedService.getData).toHaveBeenCalledOnceWith(1, 'api/ObservationFeed');
        }));

        it('shows the observations', fakeAsync(async () => {
            await setup({},
                {
                    isLoading: of(false),
                    isError: of(false),
                    allLoaded: of(false),
                    observations: of(fakeIObservationFeed)
                },
                'public');

            tick(1000);

            const feedItems = findComponent(fixture, 'app-observation-feed-item');
            expect(feedItems).toBeTruthy();
        }));

        it('does not show error section', fakeAsync(async () => {
            await setup({},
                {
                    isLoading: of(false),
                    isError: of(false),
                    allLoaded: of(false),
                    observations: of(fakeIObservationFeed)
                },
                'public');
            const error = fixture.nativeElement as HTMLElement;
            expect(error.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();
        }));

        it('does not show loading section', fakeAsync(async () => {
            await setup({},
                {
                    isLoading: of(false),
                    isError: of(false),
                    allLoaded: of(false),
                    observations: of(fakeIObservationFeed)
                },
                'public');
            const { debugElement } = fixture;
            const loading = debugElement.query(By.css('app-loading'));
            expect(loading).toBeNull();
        }));

        it('should not show all loaded content when more observations are available', fakeAsync(async () => {
            await setup({},
                {
                    isLoading: of(false),
                    isError: of(false),
                    allLoaded: of(false),
                    observations: of(fakeIObservationFeed)
                },
                'public');
            const compiled = fixture.nativeElement as HTMLElement;
            expect(compiled.querySelector('[data-testid="all-loaded"]')?.textContent).toBeUndefined();
        }));

        it('should show all loaded content when all loaded', fakeAsync(async () => {
            await setup({},
                {
                    isLoading: of(false),
                    isError: of(false),
                    allLoaded: of(true),
                    observations: of(fakeIObservationFeed)
                },
                'public');
            expectText(fixture, 'all-loaded', 'No more items You have reached the end of the feed. ');
        }));

        it('should show inner loading placeholder when not fetching', fakeAsync(async () => {
            await setup({},
                {
                    isLoading: of(true),
                    isError: of(false),
                    allLoaded: of(false),
                    observations: of(fakeIObservationFeed)
                },
                'public');
            const { debugElement } = fixture;
            const loading = debugElement.query(By.css('app-loading'));
            expect(loading).toBeTruthy();
        }));

        it('should not show inner loading placeholder when not fetching', fakeAsync(async () => {
            await setup({},
                {
                    isLoading: of(false),
                    isError: of(false),
                    allLoaded: of(false),
                    observations: of(fakeIObservationFeed)
                },
                'public');
            const { debugElement } = fixture;
            const loading = debugElement.query(By.css('app-loading'));
            expect(loading).toBeNull();
        }));
    });


    describe('when data fetch returns no items', () => {

        it('should show all loaded content when all loaded on public feed', fakeAsync(async () => {
            await setup({},
                {
                    isLoading: of(false),
                    isError: of(false),
                    allLoaded: of(true),
                    observations: of([])
                },
                'public');
            expectText(fixture, 'all-loaded', 'No more items You have reached the end of the feed. ');
        }));

        it('should show all loaded content when all loaded on network feed', fakeAsync(async () => {
            await setup({},
                {
                    isLoading: of(false),
                    isError: of(false),
                    allLoaded: of(true),
                    observations: of([])
                },
                'network');
            expectText(fixture, 'all-loaded', 'No more items You have reached the end of the feed.  Switch to the public feed to view more observations. ');
        }));

        it('should not show the observations', fakeAsync(async () => {
            await setup({},
                {
                    isLoading: of(false),
                    isError: of(false),
                    allLoaded: of(true),
                    observations: of([])
                },
                'public');

            const { debugElement } = fixture;
            const feedItems = debugElement.query(By.css('app-observation-feed-item'));
            expect(feedItems).toBeNull();
        }));

        it('does not show error section', fakeAsync(async () => {
            await setup({},
                {
                    isLoading: of(false),
                    isError: of(false),
                    allLoaded: of(true),
                    observations: of([])
                },
                'public');
            const error = fixture.nativeElement as HTMLElement;
            expect(error.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();
        }));

        it('does not show loading section', fakeAsync(async () => {
            await setup({},
                {
                    isLoading: of(false),
                    isError: of(false),
                    allLoaded: of(true),
                    observations: of([])
                },
                'public');
            const { debugElement } = fixture;
            const loading = debugElement.query(By.css('app-loading'));
            expect(loading).toBeNull();
        }));
    });


    describe('when error fetching data', () => {

        it('shows error content', fakeAsync(async () => {
            await setup({},
                {
                    isLoading: of(false),
                    isError: of(true),
                    allLoaded: of(false),
                    observations: of(null)
                },
                'public');

            const compiled = fixture.nativeElement as HTMLElement;
            expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeDefined();
            expect(compiled.querySelector('[data-testid="reload-button"]')?.textContent).toBeDefined();
            expectText(fixture, 'error', 'Whoops! There was an error retrieving the data.Try Again');
        }));

        it('tries data fetch again on user button click', fakeAsync(async () => {
            await setup({},
                {
                    isLoading: of(false),
                    isError: of(true),
                    allLoaded: of(false),
                    observations: of(null)
                },
                'public');

            fixture.debugElement.query(By.css('.btn-try-again')).triggerEventHandler('click', null);

            expect(fakeObservationFeedService.getData).toHaveBeenCalledWith(1, 'api/ObservationFeed');
        }));

        it('hides main content', fakeAsync(async () => {
            await setup({},
                {
                    isLoading: of(false),
                    isError: of(true),
                    allLoaded: of(false),
                    observations: of(null)
                },
                'public');

            const { debugElement } = fixture;
            const feedItems = debugElement.query(By.css('app-observation-feed-item'));
            expect(feedItems).toBeNull();
        }));

        it('does not show loading section', fakeAsync(async () => {
            await setup({},
                {
                    isLoading: of(false),
                    isError: of(true),
                    allLoaded: of(false),
                    observations: of(null)
                },
                'public');

            const { debugElement } = fixture;
            const loading = debugElement.query(By.css('app-loading'));
            expect(loading).toBeNull();
        }));

        it('should not show all loaded content when more observations are available', fakeAsync(async () => {
            await setup({},
                {
                    isLoading: of(false),
                    isError: of(true),
                    allLoaded: of(false),
                    observations: of(null)
                },
                'public');
            const compiled = fixture.nativeElement as HTMLElement;
            expect(compiled.querySelector('[data-testid="all-loaded"]')?.textContent).toBeUndefined();
        }));
    });
});