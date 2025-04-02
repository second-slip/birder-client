import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopFiveComponent } from './top-five.component';
import { signal } from '@angular/core';
import { TopFiveService } from './top-five.service';
import { AnnounceChangesService } from 'src/app/_sharedServices/announce-changes.service';
import { provideRouter } from '@angular/router';
import { blankRoutesArray } from 'src/app/testing/route-tests-helpers';
import { of } from 'rxjs';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader, parallel } from '@angular/cdk/testing';
import { MatTableHarness } from '@angular/material/table/testing';
import { fakeIObservationTopFive } from 'src/app/testing/analysis-helpers';
import { By } from '@angular/platform-browser';

describe('TopFiveComponent', () => {
  let component: TopFiveComponent;
  let fixture: ComponentFixture<TopFiveComponent>;
  let loader: HarnessLoader;

  let fakeService: jasmine.SpyObj<TopFiveService>;
  let fakeAnnounceChangesService: jasmine.SpyObj<AnnounceChangesService>;

  const setup = async (
    // fakeMethodValues?: jasmine.SpyObjMethodNames<TopFiveService>,
    fakePropertyValues?: jasmine.SpyObjPropertyNames<TopFiveService>
  ) => {
    fakeService = jasmine.createSpyObj<TopFiveService>(
      'TopFiveService',
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
      imports: [TopFiveComponent],
      providers: [
        provideRouter(blankRoutesArray),
        { provide: TopFiveService, useValue: fakeService },
        {
          provide: AnnounceChangesService,
          useValue: fakeAnnounceChangesService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TopFiveComponent);
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
