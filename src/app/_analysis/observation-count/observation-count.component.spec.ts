import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import {
  fakeIObservationCount,
  fakeIObservationCountIsZero,
} from 'src/app/testing/analysis-helpers';
import { ObservationCountComponent } from './observation-count.component';
import { ObservationCountService } from './observation-count.service';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideRouter } from '@angular/router';
import { blankRoutesArray } from 'src/app/testing/route-tests-helpers';
import { MatButtonHarness } from '@angular/material/button/testing';
import { AnnounceChangesService } from 'src/app/_sharedServices/announce-changes.service';

describe('ObservationCountComponent unit tests', () => {
  let component: ObservationCountComponent;
  let fixture: ComponentFixture<ObservationCountComponent>;
  let loader: HarnessLoader;
  let fakeObservationCountService: ObservationCountService;
  let fakeAnnounceChangesService: jasmine.SpyObj<AnnounceChangesService>;

  const setup = async (
    fakePropertyValues?: jasmine.SpyObjPropertyNames<ObservationCountService>
  ) => {
    fakeObservationCountService = jasmine.createSpyObj<ObservationCountService>(
      'ObservationCountService',
      {
        getData: undefined,
      },
      {
        isError: of(false),
        count: undefined,
        ...fakePropertyValues,
      }
    );

    fakeAnnounceChangesService = jasmine.createSpyObj<AnnounceChangesService>(
      'AnnounceChangesService',
      {
        announceNetworkChanged: undefined,
        announceObservationsChanged: undefined,
      },
      {
        observationsChanged$: of(''),
        networkChanged$: of(''),
      }
    );

    await TestBed.configureTestingModule({
      imports: [ObservationCountComponent],
      providers: [
        {
          provide: ObservationCountService,
          useValue: fakeObservationCountService,
        },
        {
          provide: AnnounceChangesService,
          useValue: fakeAnnounceChangesService,
        },
        provideRouter(blankRoutesArray),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ObservationCountComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  };

  describe('on initialisation', () => {
    it('should create', async () => {
      await setup();
      expect(component).toBeTruthy();
    });

    it('should show loading child component', async () => {
      await setup();

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeTruthy();
    });

    // it('should call service method', async () => {
    //     await setup();

    //     expect(fakeObservationCountService.getData).toHaveBeenCalledTimes(1);
    // });
  });

  describe('when service returns success response', () => {
    describe('when count is 0', async () => {
      // it('should call getData on init', async () => {
      //     await setup({
      //         count: of(fakeIObservationCountIsZero)
      //     });

      //     expect(fakeObservationCountService.getData).toHaveBeenCalledTimes(1);
      // });

      it('should render the analysis section for count = 0', async () => {
        await setup({
          count: of(fakeIObservationCountIsZero),
        });
        const compiled = fixture.nativeElement as HTMLElement;
        expect(
          compiled.querySelector('[data-testid="analysis-count-zero"]')
            ?.textContent
        ).toBeDefined();
        expect(
          compiled.querySelector('[data-testid="analysis-count-zero"]')
            ?.textContent
        ).toContain('You have not yet logged any observations');

        expect(
          compiled.querySelector('[data-testid="analysis-count-more-than-one"]')
            ?.textContent
        ).toBeUndefined();
      });

      it('should not show loading child component', async () => {
        await setup({
          count: of(fakeIObservationCountIsZero),
        });

        const { debugElement } = fixture;
        const loading = debugElement.query(By.css('app-loading'));
        expect(loading).toBeFalsy();
      });

      it('should not show error content', async () => {
        await setup({
          count: of(fakeIObservationCountIsZero),
        });

        const compiled = fixture.nativeElement as HTMLElement;
        expect(
          compiled.querySelector('[data-testid="error"]')?.textContent
        ).toBeUndefined();
      });
    });

    describe('when count is > 0', () => {
      // it('should call getData on init', async () => {
      //     await setup({
      //         count: of(fakeIObservationCount)
      //     });

      //     expect(fakeObservationCountService.getData).toHaveBeenCalledTimes(1);
      // });

      it('should render the analysis section with count from service response', async () => {
        await setup({
          count: of(fakeIObservationCount),
        });
        const compiled = fixture.nativeElement as HTMLElement;
        expect(
          compiled.querySelector('[data-testid="analysis-text"]')?.textContent
        ).toBeDefined();

        const expectedText = `You have spotted ${fakeIObservationCount.uniqueSpeciesCount} species in ${fakeIObservationCount.totalObservationsCount} observations `;
        expect(
          compiled.querySelector('[data-testid="analysis-text"]')?.textContent
        ).toBe(expectedText);

        expect(
          compiled.querySelector('[data-testid="analysis-count-zero"]')
            ?.textContent
        ).toBeUndefined();
      });

      it('should not show loading child component', async () => {
        await setup({
          count: of(fakeIObservationCount),
        });

        const { debugElement } = fixture;
        const loading = debugElement.query(By.css('app-loading'));
        expect(loading).toBeFalsy();
      });

      it('should not show error content', async () => {
        await setup({
          count: of(fakeIObservationCount),
        });

        const compiled = fixture.nativeElement as HTMLElement;
        expect(
          compiled.querySelector('[data-testid="error"]')?.textContent
        ).toBeUndefined();
      });
    });
  });

  describe('when service returns error response', () => {
    it('hides loading content', async () => {
      await setup({
        isError: of(true),
      });

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeFalsy();
    });

    it('hides main content', async () => {
      await setup({
        isError: of(true),
      });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="analysis-text"]')
      ).toBeFalsy();
      expect(
        compiled.querySelector('[data-testid="analysis-count-zero"]')
      ).toBeFalsy();
    });

    it('shows error content', async () => {
      await setup({
        isError: of(true),
      });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="error"]')).toBeDefined();
      expect(
        compiled.querySelector('[data-testid="error"]')?.textContent
      ).toContain('Whoops! There was an error retrieving the data');
    });

    it('should load button harness', async () => {
      await setup({
        isError: of(true),
      });

      const button = await loader.getAllHarnesses(MatButtonHarness);
      expect(button.length).toBe(1);
    });

    it('should load Try Again button', async () => {
      await setup({
        isError: of(true),
      });

      const button = await loader.getAllHarnesses(
        MatButtonHarness.with({ text: 'Try Again' })
      );
      expect(button.length).toBe(1);
      expect(await button[0].getText()).toBe('Try Again');
    });

    it('calls data fetch again on retry button click', async () => {
      await setup({
        isError: of(true),
      });

      expect(fakeObservationCountService.getData).toHaveBeenCalled();

      const button = await loader.getHarness(
        MatButtonHarness.with({ text: 'Try Again' })
      );
      await button.click();

      expect(fakeObservationCountService.getData).toHaveBeenCalledTimes(2);
    });
  });
});
