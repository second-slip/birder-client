import {
  DebugElement,
  NO_ERRORS_SCHEMA,
  provideZonelessChangeDetection,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { fakeIBirdArray } from 'src/app/testing/birds-helpers';
import { expectText, findComponent } from 'src/app/testing/element.spec-helper';
import { BirdIndexComponent } from './bird-index.component';
import { BirdIndexService } from './bird-index.service';
import { blankRoutesArray } from 'src/app/testing/route-tests-helpers';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';

describe('BirdIndexComponent unit tests', () => {
  describe('opens loading placeholder by default', () => {
    let fixture: ComponentFixture<BirdIndexComponent>;
    let debugElement: DebugElement;
    let fakeBirdIndexService: BirdIndexService;

    beforeEach(async () => {
      fakeBirdIndexService = jasmine.createSpyObj<BirdIndexService>(
        'BirdIndexService',
        {
          getData: undefined,
        },
        {
          isError: of(false),
          getBirds: undefined,
          getTotalItems: undefined,
        }
      );

      await TestBed.configureTestingModule({
        imports: [BirdIndexComponent, NoopAnimationsModule],
        providers: [
          provideRouter(blankRoutesArray),
          provideZonelessChangeDetection(),
        ],
        // schemas: [NO_ERRORS_SCHEMA],
      })
        .overrideComponent(BirdIndexComponent, {
          set: {
            providers: [
              { provide: BirdIndexService, useValue: fakeBirdIndexService },
            ],
          },
        })
        .compileComponents();

      fixture = TestBed.createComponent(BirdIndexComponent);
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

  describe('BirdIndexComponent service is called successfully with count > 0', () => {
    // beforeEach(() => {
    //   fixture.detectChanges();
    // });

    let fixture: ComponentFixture<BirdIndexComponent>;
    let debugElement: DebugElement;
    let fakeBirdIndexService: BirdIndexService;
    let loader: HarnessLoader;

    beforeEach(async () => {
      fakeBirdIndexService = jasmine.createSpyObj<BirdIndexService>(
        'BirdIndexService',
        {
          getData: undefined,
        },
        {
          isError: of(false),
          getBirds: of(fakeIBirdArray),
          getTotalItems: of(fakeIBirdArray.length), //
        }
      );

      await TestBed.configureTestingModule({
        imports: [BirdIndexComponent, NoopAnimationsModule],
        providers: [
          provideRouter(blankRoutesArray),
          provideZonelessChangeDetection(),
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .overrideComponent(BirdIndexComponent, {
          set: {
            providers: [
              { provide: BirdIndexService, useValue: fakeBirdIndexService },
            ],
          },
        })
        .compileComponents();

      fixture = TestBed.createComponent(BirdIndexComponent);
      fixture.detectChanges();
      debugElement = fixture.debugElement;
      loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should call getData on init', () => {
      expect(fakeBirdIndexService.getData).toHaveBeenCalled();
      expect(fakeBirdIndexService.getData).toHaveBeenCalledTimes(1);
    });

    it('should render the birds index for count >1', () => {
      const compiled = fixture.nativeElement as HTMLElement;

      expect(
        compiled.querySelector('[data-testid="main-content"]')?.textContent
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
        compiled.querySelector('[data-testid="error"]')?.textContent
      ).toBeUndefined();
    });

    describe('pagination control', () => {
      it('should load all paginator harnesses', async () => {
        //   await setup();

        const paginators = await loader.getAllHarnesses(MatPaginatorHarness);
        expect(paginators.length).toBe(1);
      });

      it('should be able to navigate between pages', async () => {
        //   await setup();

        spyOn(fixture.componentInstance, 'handlePageEvent').and.callThrough();

        const paginator = await loader.getHarness(MatPaginatorHarness);

        expect(fakeBirdIndexService.getData).toHaveBeenCalledTimes(1);

        expect(fixture.componentInstance.page).toBe(0);
        await paginator.goToNextPage();
        expect(fixture.componentInstance.handlePageEvent).toHaveBeenCalledTimes(
          1
        );
        expect(fakeBirdIndexService.getData).toHaveBeenCalledTimes(2);
        expect(fixture.componentInstance.page).toBe(1);
        await paginator.goToPreviousPage();
        expect(fixture.componentInstance.handlePageEvent).toHaveBeenCalledTimes(
          2
        );
        expect(fakeBirdIndexService.getData).toHaveBeenCalledTimes(3);
        expect(fixture.componentInstance.page).toBe(0);
      });

      it('should be able to go to the last page', async () => {
        //   await setup();

        const paginator = await loader.getHarness(MatPaginatorHarness);

        expect(fixture.componentInstance.page).toBe(0);
        await paginator.goToLastPage();
        // recordingsResponse.length = 55
        expect(fixture.componentInstance.page).toBe(1); // zero base, so second page
      });

      it('should be able to set the page size', async () => {
        //   await setup();

        const paginator = await loader.getHarness(MatPaginatorHarness);

        expect(fixture.componentInstance.pageSize).toBe(25);
        await paginator.setPageSize(10);
        expect(fixture.componentInstance.pageSize).toBe(10);
      });
    });
  });

  describe('BirdIndexComponent service is called successfully with count = 0', () => {
    let fixture: ComponentFixture<BirdIndexComponent>;
    let debugElement: DebugElement;
    let fakeBirdIndexService: BirdIndexService;

    beforeEach(async () => {
      fakeBirdIndexService = jasmine.createSpyObj<BirdIndexService>(
        'BirdIndexService',
        {
          getData: undefined,
        },
        {
          isError: of(false),
          getBirds: of([]),
          getTotalItems: undefined, //
        }
      );

      await TestBed.configureTestingModule({
        imports: [BirdIndexComponent, NoopAnimationsModule],
        providers: [
          provideRouter(blankRoutesArray),
          provideZonelessChangeDetection(),
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .overrideComponent(BirdIndexComponent, {
          set: {
            providers: [
              { provide: BirdIndexService, useValue: fakeBirdIndexService },
            ],
          },
        })
        .compileComponents();

      fixture = TestBed.createComponent(BirdIndexComponent);
      fixture.detectChanges();
      debugElement = fixture.debugElement;
    });

    it('should call getData on init', () => {
      expect(fakeBirdIndexService.getData).toHaveBeenCalled();
      expect(fakeBirdIndexService.getData).toHaveBeenCalledTimes(1);
    });

    it('should render the error section for count = 0', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="error-content-zero"]')
          ?.textContent
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
        compiled.querySelector('[data-testid="error"]')?.textContent
      ).toBeUndefined();
    });
  });

  describe('BirdIndexComponent - test when error', () => {
    let fixture: ComponentFixture<BirdIndexComponent>;
    let debugElement: DebugElement;
    let fakeBirdIndexService: BirdIndexService;

    beforeEach(async () => {
      fakeBirdIndexService = jasmine.createSpyObj<BirdIndexService>(
        'BirdIndexService',
        {
          getData: undefined,
        },
        {
          isError: of(true),
          getBirds: undefined,
          getTotalItems: undefined, //
        }
      );

      await TestBed.configureTestingModule({
        imports: [BirdIndexComponent, NoopAnimationsModule],
        providers: [
          provideRouter(blankRoutesArray),
          provideZonelessChangeDetection(),
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .overrideComponent(BirdIndexComponent, {
          set: {
            providers: [
              { provide: BirdIndexService, useValue: fakeBirdIndexService },
            ],
          },
        })
        .compileComponents();

      fixture = TestBed.createComponent(BirdIndexComponent);
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
      expect(
        compiled.querySelector('[data-testid="main-content"]')?.textContent
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
      expect(fakeBirdIndexService.getData).toHaveBeenCalled();
    });
  });

  describe('BirdIndexComponent - test loading placeholder', () => {
    let fixture: ComponentFixture<BirdIndexComponent>;
    let debugElement: DebugElement;
    let fakeBirdIndexService: BirdIndexService;

    beforeEach(async () => {
      fakeBirdIndexService = jasmine.createSpyObj<BirdIndexService>(
        'BirdIndexService',
        {
          getData: undefined,
        },
        {
          isError: of(false),
          getBirds: undefined,
          getTotalItems: undefined, //
        }
      );

      await TestBed.configureTestingModule({
        imports: [BirdIndexComponent, NoopAnimationsModule],
        providers: [
          provideRouter(blankRoutesArray),
          provideZonelessChangeDetection(),
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .overrideComponent(BirdIndexComponent, {
          set: {
            providers: [
              { provide: BirdIndexService, useValue: fakeBirdIndexService },
            ],
          },
        })
        .compileComponents();

      fixture = TestBed.createComponent(BirdIndexComponent);
      fixture.detectChanges();
      debugElement = fixture.debugElement;
    });

    it('shows loading content', () => {
      const loading = findComponent(fixture, 'app-loading');
      expect(loading).toBeTruthy();
    });

    it('should not show main content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="main-content"]')?.textContent
      ).toBeUndefined();
    });

    it('should not show error content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="error"]')?.textContent
      ).toBeUndefined();
    });
  });
});
