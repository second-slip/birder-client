import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { expectText } from 'src/app/testing/element.spec-helper';
import { recordingsResponse } from 'src/app/testing/flickr-recordings-api-tests-helper';
import { RecordingsComponent } from './recordings.component';
import { RecordingsService } from './recordings.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';

describe('RecordingsComponent', () => {
  let component: RecordingsComponent;
  let fixture: ComponentFixture<RecordingsComponent>;
  let fakeRecordingsService: jasmine.SpyObj<RecordingsService>;
  let loader: HarnessLoader;

  const setup = async (
    fakePropertyValues?: jasmine.SpyObjPropertyNames<RecordingsService>) => {

    fakeRecordingsService = jasmine.createSpyObj<RecordingsService>(
      'FlickrService',
      {
        getData: undefined
      },
      {
        recordings: of(recordingsResponse),
        isError: of(false),
        ...fakePropertyValues
      }
    );

    await TestBed.configureTestingModule({
      imports: [RecordingsComponent, NoopAnimationsModule]
    })
      .overrideComponent(RecordingsComponent,
        {
          set: {
            providers: [{ provide: RecordingsService, useValue: fakeRecordingsService }]
          }
        })
      .compileComponents();

    fixture = TestBed.createComponent(RecordingsComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  };

  it('should be created', fakeAsync(async () => {
    await setup(
      {
        recordings: of(null),
        isError: of(false),
      }
    );

    expect(component).toBeTruthy();
    const { debugElement } = fixture;
    const loading = debugElement.query(By.css('app-loading'));
    expect(loading).toBeTruthy();
  }));

  describe('when recordings are fetched', () => {
    it('calls data fetch', fakeAsync(async () => {
      await setup();
      expect(fakeRecordingsService.getData).toHaveBeenCalledTimes(1);
    }));

    it('shows the recordings', fakeAsync(async () => {
      await setup();
      const carousel = fixture.nativeElement as HTMLElement;
      expect(carousel.querySelector('[data-testid="recordings"]')?.textContent).toBeDefined();
    }));

    it('does not show error section', fakeAsync(async () => {
      await setup();
      const w = fixture.nativeElement as HTMLElement;
      expect(w.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();
    }));

    it('does not show the loading section', fakeAsync(async () => {
      await setup();

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeNull();
    }));

    describe('pagination control', () => {
      it('should load all paginator harnesses', async () => {
        await setup();

        const paginators = await loader.getAllHarnesses(MatPaginatorHarness);
        expect(paginators.length).toBe(1);
      });

      it('should be able to navigate between pages', async () => {
        await setup();

        spyOn(component, 'handlePageEvent').and.callThrough();

        const paginator = await loader.getHarness(MatPaginatorHarness);

        expect(component.page).toBe(0);
        await paginator.goToNextPage();
        expect(component.handlePageEvent).toHaveBeenCalledTimes(1);
        expect(component.page).toBe(1);
        await paginator.goToPreviousPage();
        expect(component.handlePageEvent).toHaveBeenCalledTimes(2);
        expect(component.page).toBe(0);
      });

      it('should be able to go to the last page', async () => {
        await setup();

        const paginator = await loader.getHarness(MatPaginatorHarness);

        expect(component.page).toBe(0);
        await paginator.goToLastPage();
        // recordingsResponse.length = 55
        expect(component.page).toBe(5);
      });

      it('should be able to set the page size', async () => {
        await setup();

        const paginator = await loader.getHarness(MatPaginatorHarness);

        expect(component.pageSize).toBe(10);
        await paginator.setPageSize(25);
        expect(component.pageSize).toBe(25);
      });
    });
  });


  describe('when fetched zero recordings', () => {
    it('calls data fetch', fakeAsync(async () => {
      await setup({
        recordings: of([])
      });
      expect(fakeRecordingsService.getData).toHaveBeenCalledTimes(1);
    }));

    it('shows no recordings section', fakeAsync(async () => {
      await setup({
        recordings: of([])
      });
      const noRecords = fixture.nativeElement as HTMLElement;
      expect(noRecords.querySelector('[data-testid="no-recordings"]')?.textContent).toBeDefined();
    }));

    it('does not show error section', fakeAsync(async () => {
      await setup({
        recordings: of([])
      });
      const error = fixture.nativeElement as HTMLElement;
      expect(error.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();
    }));

    it('does not show loading section', fakeAsync(async () => {
      await setup({
        recordings: of([])
      });
      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeNull();
    }));
  });

  describe('on error', () => {
    it('calls data fetch', fakeAsync(async () => {
      await setup({
        recordings: of(null),
        isError: of(true)
      });
      expect(fakeRecordingsService.getData).toHaveBeenCalledTimes(1);
    }));

    it('does not show no recordings section', fakeAsync(async () => {
      await setup({
        recordings: of(null),
        isError: of(true)
      });
      const records = fixture.nativeElement as HTMLElement;
      expect(records.querySelector('[data-testid="no-recordings"]')?.textContent).toBeUndefined();
      const noRecords = fixture.nativeElement as HTMLElement;
      expect(noRecords.querySelector('[data-testid="no-recordings"]')?.textContent).toBeUndefined();
    }));

    it('shows error section', fakeAsync(async () => {
      await setup({
        recordings: of(null),
        isError: of(true)
      });
      expectText(fixture, 'error', 'Whoops! An error occurred. Please try again. ');
      const error = fixture.nativeElement as HTMLElement;
      expect(error.querySelector('[data-testid="error"]')?.textContent).toBeDefined();
    }));

    it('does not show loading section', fakeAsync(async () => {
      await setup({
        recordings: of(null),
        isError: of(true)
      });
      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeNull();
    }));
  });
});