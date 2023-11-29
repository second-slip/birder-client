import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TweetDayComponent } from './tweet-day.component';
import { TweetDayService } from './tweet-day.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { expectText, findComponent } from 'src/app/testing/element.spec-helper'
import { fakeITweet } from 'src/app/testing/tweet-day-test-helper';
import { findEl } from 'src/app/testing/element.spec-helper';
import { blankRoutesArray } from 'src/app/testing/route-tests-helpers';
import { provideRouter } from '@angular/router';


describe('TweetDayComponent unit tests', () => {

    describe('TweetDayComponent - opens loading placeholder by default', () => {
        let fixture: ComponentFixture<TweetDayComponent>;
        let debugElement: DebugElement;
        let fakeTweetDayService: TweetDayService;

        beforeEach(async () => {

            fakeTweetDayService = jasmine.createSpyObj<TweetDayService>(
                'TweetDayService',
                {
                    getData: undefined,
                },
                {
                    isError: of(false),
                    getTweet: undefined //of(fakeITweet)
                }
            );

            await TestBed.configureTestingModule({
                imports: [TweetDayComponent],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [
                    provideRouter(blankRoutesArray),
                    { provide: TweetDayService, useValue: fakeTweetDayService }
                ]
            }).compileComponents();

            fixture = TestBed.createComponent(TweetDayComponent);
            //fixture.detectChanges();
            debugElement = fixture.debugElement;
        });


        it('should create the app', () => {
            const component = fixture.componentInstance;
            expect(component).toBeTruthy();
        });


        it('should show loading child component', () => {
            fixture.detectChanges();

            // Test without the helper
            const { debugElement } = fixture;
            const loading = debugElement.query(By.css('app-loading'));
            expect(loading).toBeTruthy();

            // Test using the spec-helper function
            const loading1 = findComponent(fixture, 'app-loading');
            expect(loading1).toBeTruthy();
        });
    });

    describe('TweetDayComponent service is called successfully', () => {

        // beforeEach(() => {
        //   fixture.detectChanges();
        // });

        let fixture: ComponentFixture<TweetDayComponent>;
        let debugElement: DebugElement;
        let fakeTweetDayService: TweetDayService;

        beforeEach(async () => {

            fakeTweetDayService = jasmine.createSpyObj<TweetDayService>(
                'TweetDayService',
                {
                    getData: undefined,
                },
                {
                    isError: of(false),
                    getTweet: of(fakeITweet)
                }
            );

            await TestBed.configureTestingModule({
                imports: [TweetDayComponent],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [
                    provideRouter(blankRoutesArray),
                    { provide: TweetDayService, useValue: fakeTweetDayService }
                ]
            }).compileComponents();

            fixture = TestBed.createComponent(TweetDayComponent);
            fixture.detectChanges();
            debugElement = fixture.debugElement;
        });

        it('should call getData on init', () => {
            expect(fakeTweetDayService.getData).toHaveBeenCalled();
            expect(fakeTweetDayService.getData).toHaveBeenCalledTimes(1);
        });

        it('should render the Tweet', fakeAsync(() => {
            const compiled = fixture.nativeElement as HTMLElement;
            tick();

            expect(compiled.querySelector('[data-testid="main-title"]')?.textContent).toBeDefined();
            expect(compiled.querySelector('[data-testid="main-title"]')?.textContent).toContain('Tweet of the Day');
            expect(compiled.querySelector('[data-testid="english-name"]')?.textContent).toContain('Lapwing');
            expect(compiled.querySelector('[data-testid="scientific-name"]')?.textContent).toContain('Vanellus vanellus');
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

        it('links to the correct archive page', () => {
            // interpolated link to bird/detail means the test doesn't work
            // .get('bird-detail-link') is NULL
            // bird/detail/${fakeITweet.birdId}`);

            const address = findEl(fixture, 'archive-link').nativeElement
                .getAttribute('routerlink');

            expect(address).toEqual('/tweet/archive');
        });
    });


    describe('TweetDayComponent - test when error', () => {
        let fixture: ComponentFixture<TweetDayComponent>;
        let debugElement: DebugElement;
        let fakeTweetDayService: TweetDayService;

        beforeEach(async () => {

            fakeTweetDayService = jasmine.createSpyObj<TweetDayService>(
                'TweetDayService',
                {
                    getData: undefined,
                },
                {
                    isError: of(true),
                    getTweet: undefined //of(fakeITweet)
                }
            );

            await TestBed.configureTestingModule({
                imports: [TweetDayComponent],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [
                    provideRouter(blankRoutesArray),
                    { provide: TweetDayService, useValue: fakeTweetDayService }
                ]
            }).compileComponents();

            fixture = TestBed.createComponent(TweetDayComponent);
            fixture.detectChanges();
            debugElement = fixture.debugElement;
        });

        it('hides loading content', () => {
            const { debugElement } = fixture;
            const loading = debugElement.query(By.css('app-loading'));
            expect(loading).toBeFalsy();
        });

        it('hides main content', () => {
            const compiled = fixture.nativeElement as HTMLElement;
            expect(compiled.querySelector('[data-testid="main-title"]')?.textContent).toBeUndefined();
        });

        it('shows error content', () => {
            const compiled = fixture.nativeElement as HTMLElement;
            expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeDefined();
            expect(compiled.querySelector('[data-testid="reload-button"]')?.textContent).toBeDefined();
            expectText(fixture, 'error', 'Whoops! There was an error retrieving the data.Try Again');
        });

        it('tries data fetch again on retry button click', fakeAsync(async () => {
            fixture.debugElement.query(By.css('.btn-try-again')).triggerEventHandler('click', null);

            expect(fakeTweetDayService.getData).toHaveBeenCalled();
        }));
    });


    describe('TweetDayComponent - test loading placeholder', () => {
        let fixture: ComponentFixture<TweetDayComponent>;
        let debugElement: DebugElement;
        let fakeTweetDayService: TweetDayService;

        beforeEach(async () => {

            fakeTweetDayService = jasmine.createSpyObj<TweetDayService>(
                'TweetDayService',
                {
                    getData: undefined,
                },
                {
                    isError: of(false),
                    getTweet: undefined //of(fakeITweet)
                }
            );

            await TestBed.configureTestingModule({
                imports: [TweetDayComponent],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [
                    provideRouter(blankRoutesArray),
                    { provide: TweetDayService, useValue: fakeTweetDayService }
                ]
            }).compileComponents();

            fixture = TestBed.createComponent(TweetDayComponent);
            fixture.detectChanges();
            debugElement = fixture.debugElement;
        });


        it('shows loading content', () => {
            const loading = findComponent(fixture, 'app-loading');
            expect(loading).toBeTruthy();
        });

        it('should not show main content', () => {
            const compiled = fixture.nativeElement as HTMLElement;
            expect(compiled.querySelector('[data-testid="main-title"]')?.textContent).toBeUndefined();
        });

        it('should not show error content', () => {
            const compiled = fixture.nativeElement as HTMLElement;
            expect(compiled.querySelector('[data-testid="error-content"]')?.textContent).toBeUndefined();
        });
    });
});