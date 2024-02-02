import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { expectText } from 'src/app/testing/element.spec-helper'
import { BirdDetailComponent } from './bird-detail.component';
import { BirdDetailService } from './bird-detail.service';
import { NavigationService } from '../../_sharedServices/navigation.service';
import { fakeIBirdDetail } from 'src/app/testing/birds-helpers';
import { ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('BirdDetailComponent', () => {
    let component: BirdDetailComponent;
    let fixture: ComponentFixture<BirdDetailComponent>;
    let fakeService: jasmine.SpyObj<BirdDetailService>;
    let fakeNavService: NavigationService;

    fakeNavService = jasmine.createSpyObj<NavigationService>(
        'NavigationService',
        {
            back: undefined
        }
    );

    const setup = async (fakeRouteArgument: string,
        fakePropertyValues?: jasmine.SpyObjPropertyNames<BirdDetailService>) => {

        fakeService = jasmine.createSpyObj<BirdDetailService>(
            'BirdDetailService',
            {
                getData: undefined,
            },
            {
                isError: of(false),
                getBird: of(null),
                ...fakePropertyValues
            }
        );

        await TestBed.configureTestingModule({
            providers: [{ provide: NavigationService, useValue: fakeNavService }, {
                provide: ActivatedRoute,
                useValue: {
                    paramMap: of(new Map(Object.entries({
                        id: fakeRouteArgument
                    })))
                    // needs to be a 'Map' object otherwise "map.get is not a function" error occurs
                    // see: https://bobbyhadz.com/blog/javascript-typeerror-map-get-is-not-a-function#:~:text=get%20is%20not%20a%20function%22%20error%20occurs%20when%20we%20call,the%20method%20on%20Map%20objects.
                }
            }],
            imports: [NoopAnimationsModule, BirdDetailComponent],
            schemas: [NO_ERRORS_SCHEMA]
        }).overrideComponent(BirdDetailComponent,
            {
                set: {
                    providers: [
                        { provide: BirdDetailService, useValue: fakeService },
                    ]
                }
            }).compileComponents();

        fixture = TestBed.createComponent(BirdDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    it('"SMOKE TEST": should be created and show the loading placeloader', async () => {
        await setup(fakeIBirdDetail.birdId.toString(), {});

        expect(component).toBeTruthy();
        const { debugElement } = fixture;
        const loading = debugElement.query(By.css('app-loading'));
        expect(loading).toBeTruthy();
    });


    describe('when data fetch is successful', () => {

        it('should call getData on init', async () => {
            await setup(fakeIBirdDetail.birdId.toString(), {});
            expect(fakeService.getData).toHaveBeenCalledOnceWith(fakeIBirdDetail.birdId.toString());
        });

        it('should render the Bird', async () => {
            await setup(fakeIBirdDetail.birdId.toString(), {
                isError: of(false),
                getBird: of(fakeIBirdDetail)
            });

            const compiled = fixture.nativeElement as HTMLElement;
            expect(compiled.querySelector('[data-testid="main-title"]')?.textContent).toBeDefined();
            const title = `${fakeIBirdDetail.englishName} ${fakeIBirdDetail.species}`;
            expectText(fixture, 'main-title', title);
        });

        it('should render the Bird child component', async () => {
            await setup(fakeIBirdDetail.birdId.toString(), {
                isError: of(false),
                getBird: of(fakeIBirdDetail)
            });

            const { debugElement } = fixture;
            const loading = debugElement.query(By.css('app-bird-info'));
            expect(loading).toBeTruthy();
        });

        // **** INFO: lazy rendered so not in template UNTIL tab 2 is active

        // it('should render the Flickr child component', async () => {
        //     await setup(fakeIBirdDetail.birdId.toString(), {
        //         isError: of(false),
        //         getBird: of(fakeIBirdDetail)
        //     });

        //     const { debugElement } = fixture;
        //     const flickr = debugElement.query(By.css('app-flickr'));
        //     expect(flickr).toBeTruthy();
        // }));

        // **** INFO: lazy rendered so not in template UNTIL tab 3 is active


        // it('should render the Recordings child component', async () => {
        //     await setup(fakeIBirdDetail.birdId.toString(), {
        //         isError: of(false),
        //         getBird: of(fakeIBirdDetail)
        //     });

        //     const { debugElement } = fixture;
        //     const loading = debugElement.query(By.css('app-recordings'));
        //     expect(loading).toBeTruthy();
        // }));
    });

    describe('when response is unsuccessful', () => {

        it('shows error content', async () => {
            await setup(fakeIBirdDetail.birdId.toString(), {
                isError: of(true),
                getBird: of(null)
            });

            const compiled = fixture.nativeElement as HTMLElement;
            expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeDefined();
            expect(compiled.querySelector('[data-testid="reload-button"]')?.textContent).toBeDefined();
            expectText(fixture, 'error', 'Whoops! There was an error retrieving the data.Try Again');
        });

        it('tries data fetch again on retry button click', async () => {
            await setup(fakeIBirdDetail.birdId.toString(), {
                isError: of(true),
                getBird: of(null)
            });

            fixture.debugElement.query(By.css('.btn-try-again')).triggerEventHandler('click', null);
            expect(fakeService.getData).toHaveBeenCalledWith(fakeIBirdDetail.birdId.toString());
        });

        it('tries redirects on retry button click when id is null or empty', async () => {
            await setup('', {
                isError: of(true),
                getBird: of(null)
            });

            fixture.debugElement.query(By.css('.btn-try-again')).triggerEventHandler('click', null);
            expect(fakeNavService.back).toHaveBeenCalled();
            expect(fakeService.getData).not.toHaveBeenCalled();
        });

        it('does not show success content', async () => {
            await setup(fakeIBirdDetail.birdId.toString(), {
                isError: of(true),
                getBird: of(null)
            });

            const compiled = fixture.nativeElement as HTMLElement;
            expect(compiled.querySelector('[data-testid="bird-detail-tabs"]')?.textContent).toBeUndefined();
        });

        it('does not show loading section', async () => {
            await setup(fakeIBirdDetail.birdId.toString(), {
                isError: of(true),
                getBird: of(null)
            });

            const { debugElement } = fixture;
            const loading = debugElement.query(By.css('app-loading'));
            expect(loading).toBeNull();
        });
    });

    describe('when route argument is null or empty', () => {

        it('it redirects on init', async () => {
            await setup('', {});
            expect(fakeNavService.back).toHaveBeenCalled();
            expect(fakeService.getData).not.toHaveBeenCalled();
        });
    });
});