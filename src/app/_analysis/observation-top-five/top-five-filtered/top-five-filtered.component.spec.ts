import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopFiveFilteredComponent } from './top-five-filtered.component';
import { TopFiveFilterService } from './top-five-filter.service';
import { HarnessLoader, parallel } from '@angular/cdk/testing';
import { AnnounceChangesService } from 'src/app/_sharedServices/announce-changes.service';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { blankRoutesArray } from 'src/app/testing/route-tests-helpers';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { fakeIObservationTopFive } from 'src/app/testing/analysis-helpers';
import { MatTableHarness } from '@angular/material/table/testing';
import { By } from '@angular/platform-browser';
import { MatButtonHarness } from '@angular/material/button/testing';

describe('TopFiveFilteredComponent', () => {
  let component: TopFiveFilteredComponent;
  let fixture: ComponentFixture<TopFiveFilteredComponent>;
  let loader: HarnessLoader;

  let fakeService: jasmine.SpyObj<TopFiveFilterService>;
  let fakeAnnounceChangesService: jasmine.SpyObj<AnnounceChangesService>;

  const setup = async (
    fakePropertyValues?: jasmine.SpyObjPropertyNames<TopFiveFilterService>
  ) => {
    fakeService = jasmine.createSpyObj<TopFiveFilterService>(
      'TopFiveFilterService',
      {
        getData: undefined,
        // ...fakeMethodValues,
      },
      {
        isLoading: signal(false),
        isError: signal(false),
        records: signal([]),
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
      imports: [TopFiveFilteredComponent],
      providers: [
        provideRouter(blankRoutesArray),
        { provide: TopFiveFilterService, useValue: fakeService },
        {
          provide: AnnounceChangesService,
          useValue: fakeAnnounceChangesService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TopFiveFilteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  };

  it('should create', async () => {
    await setup();
    expect(component).toBeTruthy();
  });

  // success
  // error
  // loading

  describe('success server response', () => {
    it('should render the mat-table', async () => {
      await setup({
        records: signal(fakeIObservationTopFive),
      });

      const tables = await loader.getAllHarnesses(MatTableHarness);
      expect(tables.length).toBe(1);
    });

    it('should not show the loading symbol', async () => {
      await setup({
        records: signal(fakeIObservationTopFive),
      });

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeFalsy();
    });

    it('should not show the error content', async () => {
      await setup({
        records: signal(fakeIObservationTopFive),
      });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="error"]')?.textContent
      ).toBeUndefined();
    });

    it('should render a table with one header and five rows (records)', async () => {
      await setup({
        records: signal(fakeIObservationTopFive),
      });

      const table = await loader.getHarness(MatTableHarness);
      const headerRows = await table.getHeaderRows();
      const rows = await table.getRows();
      expect(headerRows.length).toBe(1);
      expect(rows.length).toBe(fakeIObservationTopFive.length);
    });

    it('should get three cells per row', async () => {
      await setup({
        records: signal(fakeIObservationTopFive),
      });

      const table = await loader.getHarness(MatTableHarness);
      const headerRows = await table.getHeaderRows();
      const rows = await table.getRows();
      const headerCells = (
        await parallel(() => headerRows.map((row) => row.getCells()))
      ).map((row) => row.length);

      const cells = (
        await parallel(() => rows.map((row) => row.getCells()))
      ).map((row) => row.length);

      expect(headerCells).toEqual([3]);
      expect(cells).toEqual([3, 3, 3, 3, 3]);
    });

    it('should be able to get the column name of a cell', async () => {
      await setup({
        records: signal(fakeIObservationTopFive),
      });

      const table = await loader.getHarness(MatTableHarness);
      const fifthRow = (await table.getRows())[1];
      const cells = await fifthRow.getCells();
      const cellColumnNames = await parallel(() =>
        cells.map((cell) => cell.getColumnName())
      );
      expect(cellColumnNames).toEqual(['index', 'name', 'count']);
    });

    describe('if success response is empty array', () => {
      it('should not render the mat-table', async () => {
        await setup({
          records: signal([]),
        });

        const tables = await loader.getAllHarnesses(MatTableHarness);
        expect(tables.length).toBe(0);
      });

      it('should show empty array message', async () => {
        await setup({
          records: signal([]),
        });

        const compiled = fixture.nativeElement as HTMLElement;
        expect(
          compiled.querySelector('[data-testid="empty-array"]')?.textContent
        ).toBeDefined();
        expect(
          compiled.querySelector('[data-testid="empty-array"]')?.textContent
        ).toContain('You have not yet logged any observations');
      });
    });
  });

  //

  describe('error server response', () => {
    it('should not render the mat-table', async () => {
      await setup({
        records: signal([]),
        isError: signal(true),
      });

      const tables = await loader.getAllHarnesses(MatTableHarness);
      expect(tables.length).toBe(0);
    });

    it('should show the error content', async () => {
      await setup({
        records: signal([]),
        isError: signal(true),
      });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="error"]')?.textContent
      ).toBeDefined();

      expect(
        compiled.querySelector('[data-testid="error"]')?.textContent
      ).toContain('There was an error retrieving the data');
    });

    it('should not show the loading symbol', async () => {
      await setup({
        records: signal([]),
        isError: signal(true),
      });

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeFalsy();
    });

    it('should load button harness', async () => {
      await setup({
        records: signal([]),
        isError: signal(true),
      });

      const button = await loader.getAllHarnesses(MatButtonHarness);
      expect(button.length).toBe(1);
    });

    it('should load Try Again button', async () => {
      await setup({
        records: signal([]),
        isError: signal(true),
      });

      const button = await loader.getAllHarnesses(
        MatButtonHarness.with({ text: 'Try Again' })
      );
      expect(button.length).toBe(1);
      expect(await button[0].getText()).toBe('Try Again');
    });

    it('calls data fetch again on retry button click', async () => {
      await setup({
        records: signal([]),
        isError: signal(true),
      });

      expect(fakeService.getData).toHaveBeenCalledTimes(2);

      const button = await loader.getHarness(
        MatButtonHarness.with({ text: 'Try Again' })
      );
      await button.click();

      expect(fakeService.getData).toHaveBeenCalledTimes(3);
    });
  });

  //

  describe('when loading', () => {
    it('should not render the mat-table', async () => {
      await setup({
        isLoading: signal(true)
      });

      const tables = await loader.getAllHarnesses(MatTableHarness);
      expect(tables.length).toBe(0);
    });

    it('should not show the error content', async () => {
      await setup({
        isLoading: signal(true)
      });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="error"]')?.textContent
      ).toBeUndefined();
    });

    it('should show the loading symbol', async () => {
      await setup({
        isLoading: signal(true)
      });

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeTruthy();
    });
  });
});
