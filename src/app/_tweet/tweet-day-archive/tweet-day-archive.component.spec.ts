import {
  DebugElement,
  NO_ERRORS_SCHEMA,
  provideZonelessChangeDetection,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { expectText, findComponent } from 'src/app/testing/element.spec-helper';
import { fakeTweetArchiveArray } from 'src/app/testing/tweet-day-test-helper';
import { TweetDayArchiveComponent } from './tweet-day-archive.component';
import { TweetDayArchiveService } from './tweet-day-archive.service';
import { provideRouter } from '@angular/router';
import { blankRoutesArray } from 'src/app/testing/route-tests-helpers';

describe('TweetDayArchiveComponent', () => {
  describe('test when success', () => {
    let fixture: ComponentFixture<TweetDayArchiveComponent>;
    let debugElement: DebugElement;
    let fakeTweetDayArchiveService: TweetDayArchiveService;

    beforeEach(async () => {
      fakeTweetDayArchiveService = jasmine.createSpyObj<TweetDayArchiveService>(
        'TweetDayArchiveService',
        {
          getData: undefined,
        },
        {
          isLoading: of(false),
          isError: of(false),
          allLoaded: of(false),
          getTweets: of(fakeTweetArchiveArray),
        }
      );

      await TestBed.configureTestingModule({
        imports: [TweetDayArchiveComponent],
        providers: [
          provideRouter(blankRoutesArray),
          provideZonelessChangeDetection(),
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .overrideComponent(TweetDayArchiveComponent, {
          set: {
            providers: [
              {
                provide: TweetDayArchiveService,
                useValue: fakeTweetDayArchiveService,
              },
            ],
          },
        })
        .compileComponents();

      fixture = TestBed.createComponent(TweetDayArchiveComponent);
      fixture.detectChanges();
      debugElement = fixture.debugElement;
    });

    it('should call getData on init', () => {
      expect(fakeTweetDayArchiveService.getData).toHaveBeenCalled();
      expect(fakeTweetDayArchiveService.getData).toHaveBeenCalledTimes(1);
    });

    it('should render the Tweets', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="tweet-table"]')?.textContent
      ).toBeDefined();
    });

    it('should not show loading child component', () => {
      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeFalsy();
    });

    it('should not show error content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="error-content"]')?.textContent
      ).toBeUndefined();
    });

    it('should not show all loaded content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="all-loaded"]')?.textContent
      ).toBeUndefined();
    });
  });

  describe('test when success and all loaded', () => {
    let fixture: ComponentFixture<TweetDayArchiveComponent>;
    let debugElement: DebugElement;
    let fakeTweetDayArchiveService: TweetDayArchiveService;

    beforeEach(async () => {
      fakeTweetDayArchiveService = jasmine.createSpyObj<TweetDayArchiveService>(
        'TweetDayArchiveService',
        {
          getData: undefined,
        },
        {
          isLoading: of(false),
          isError: of(false),
          allLoaded: of(true),
          getTweets: of(fakeTweetArchiveArray),
        }
      );

      await TestBed.configureTestingModule({
        imports: [TweetDayArchiveComponent],
        providers: [
          provideRouter(blankRoutesArray),
          provideZonelessChangeDetection(),
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .overrideComponent(TweetDayArchiveComponent, {
          set: {
            providers: [
              {
                provide: TweetDayArchiveService,
                useValue: fakeTweetDayArchiveService,
              },
            ],
          },
        })

        .compileComponents();

      fixture = TestBed.createComponent(TweetDayArchiveComponent);
      fixture.detectChanges();
      debugElement = fixture.debugElement;
    });

    it('should call getData on init', () => {
      expect(fakeTweetDayArchiveService.getData).toHaveBeenCalled();
      expect(fakeTweetDayArchiveService.getData).toHaveBeenCalledTimes(1);
    });

    it('should render the Tweets', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="tweet-table"]')?.textContent
      ).toBeDefined();
    });

    it('should not show loading child component', () => {
      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeFalsy();
    });

    it('should not show error content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="error-content"]')?.textContent
      ).toBeUndefined();
    });

    it('should show all loaded content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="all-loaded"]')?.textContent
      ).toBeDefined();
    });
  });

  describe('test loading placeholder', () => {
    let fixture: ComponentFixture<TweetDayArchiveComponent>;
    let debugElement: DebugElement;
    let fakeTweetDayArchiveService: TweetDayArchiveService;

    beforeEach(async () => {
      fakeTweetDayArchiveService = jasmine.createSpyObj<TweetDayArchiveService>(
        'TweetDayArchiveService',
        {
          getData: undefined,
        },
        {
          isLoading: of(true),
          isError: of(false),
          allLoaded: of(false),
          getTweets: undefined,
        }
      );

      await TestBed.configureTestingModule({
        imports: [TweetDayArchiveComponent],
        providers: [
          provideRouter(blankRoutesArray),
          provideZonelessChangeDetection(),
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .overrideComponent(TweetDayArchiveComponent, {
          set: {
            providers: [
              {
                provide: TweetDayArchiveService,
                useValue: fakeTweetDayArchiveService,
              },
            ],
          },
        })

        .compileComponents();

      fixture = TestBed.createComponent(TweetDayArchiveComponent);
      fixture.detectChanges();
      debugElement = fixture.debugElement;
    });

    it('shows loading content', () => {
      const loading = findComponent(fixture, 'app-loading');
      expect(loading).toBeTruthy();
    });

    it('should not show error content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="error-content"]')?.textContent
      ).toBeUndefined();
    });
  });

  describe('test error content', () => {
    let fixture: ComponentFixture<TweetDayArchiveComponent>;
    let debugElement: DebugElement;
    let fakeTweetDayArchiveService: TweetDayArchiveService;

    beforeEach(async () => {
      fakeTweetDayArchiveService = jasmine.createSpyObj<TweetDayArchiveService>(
        'TweetDayArchiveService',
        {
          getData: undefined,
        },
        {
          isLoading: of(false),
          isError: of(true),
          allLoaded: of(false),
          getTweets: undefined,
        }
      );

      await TestBed.configureTestingModule({
        imports: [TweetDayArchiveComponent],
        providers: [
          provideRouter(blankRoutesArray),
          provideZonelessChangeDetection(),
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .overrideComponent(TweetDayArchiveComponent, {
          set: {
            providers: [
              {
                provide: TweetDayArchiveService,
                useValue: fakeTweetDayArchiveService,
              },
            ],
          },
        })

        .compileComponents();

      fixture = TestBed.createComponent(TweetDayArchiveComponent);
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
      expect(
        compiled.querySelector('[data-testid="main-title"]')?.textContent
      ).toBeUndefined();
    });

    it('shows error content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="error"]')?.textContent
      ).toBeDefined();
      expect(
        compiled.querySelector('[data-testid="reload-button"]')?.textContent
      ).toBeDefined();
      expectText(
        fixture,
        'error',
        'Whoops! There was an error retrieving the data.Try Again'
      );
    });

    it('tries data fetch again on retry button click', async () => {
      fixture.debugElement
        .query(By.css('.btn-try-again'))
        .triggerEventHandler('click', null);

      expect(fakeTweetDayArchiveService.getData).toHaveBeenCalled();
    });
  });
});
