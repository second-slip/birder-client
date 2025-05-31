import {
  NO_ERRORS_SCHEMA,
  provideZonelessChangeDetection,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import {
  expectText,
  findComponent,
  findEl,
} from 'src/app/testing/element.spec-helper';
import {
  lifeListLongList,
  lifeListModel,
} from 'src/app/testing/list-test-helpers';
import { ObservationCountService } from 'src/app/_analysis/observation-count/observation-count.service';
import { LifeListComponent } from './life-list.component';
import { LifeListService } from './life-list.service';
import { provideRouter } from '@angular/router';
import { blankRoutesArray } from 'src/app/testing/route-tests-helpers';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';

describe('LifeListComponent', () => {
  let component: LifeListComponent;
  let fixture: ComponentFixture<LifeListComponent>;
  let fakeCountService: jasmine.SpyObj<ObservationCountService>;
  let fakeListService: jasmine.SpyObj<LifeListService>;
  let loader: HarnessLoader;

  fakeCountService = jasmine.createSpyObj<ObservationCountService>(
    'ObservationCountService',
    {
      getData: undefined,
    },
    {
      count: undefined,
      isError: undefined,
    }
  );

  const setup = async (
    fakePropertyValues?: jasmine.SpyObjPropertyNames<LifeListService>
  ) => {
    fakeListService = jasmine.createSpyObj<LifeListService>(
      'LifeListService',
      {
        getData: undefined,
      },
      {
        lifeList: of(null),
        isError: of(false),
        ...fakePropertyValues,
      }
    );

    await TestBed.configureTestingModule({
      imports: [LifeListComponent, NoopAnimationsModule],
      providers: [
        { provide: ObservationCountService, useValue: fakeCountService },
        provideZonelessChangeDetection(),
        provideRouter(blankRoutesArray),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(LifeListComponent, {
        set: {
          providers: [{ provide: LifeListService, useValue: fakeListService }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LifeListComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  };

  it('should be created and show the loading placeholder', async () => {
    await setup({});

    expect(findComponent(fixture, 'app-loading')).toBeTruthy();
  });

  describe('when data fetch returns observations', () => {
    it('calls data fetch', async () => {
      await setup({
        isError: of(false),
        lifeList: of(lifeListModel),
      });

      expect(fakeListService.getData).toHaveBeenCalledTimes(1);
    });

    it('shows the list', async () => {
      await setup({
        isError: of(false),
        lifeList: of(lifeListModel),
      });

      expect(findEl(fixture, 'life-list-table')).toBeTruthy();
    });

    it('does not show error section', async () => {
      await setup({
        isError: of(false),
        lifeList: of(lifeListModel),
      });

      const error = fixture.nativeElement as HTMLElement;
      expect(
        error.querySelector('[data-testid="error"]')?.textContent
      ).toBeUndefined();
    });

    it('does not show loading section', async () => {
      await setup({
        isError: of(false),
        lifeList: of(lifeListModel),
      });

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeNull();
    });

    it('does not show no-items section when >0 items', async () => {
      await setup({
        isError: of(false),
        lifeList: of(lifeListModel),
      });

      const error = fixture.nativeElement as HTMLElement;
      expect(
        error.querySelector('[data-testid="no-items"]')?.textContent
      ).toBeUndefined();
    });

    it('does show no-items section when =0 items', async () => {
      await setup({
        isError: of(false),
        lifeList: of([]),
      });

      expect(findEl(fixture, 'no-items')).toBeTruthy();
    });

    describe('pagination control', () => {
      it('should load all paginator harnesses', async () => {
        await setup({
          isError: of(false),
          lifeList: of(lifeListLongList),
        });

        const paginators = await loader.getAllHarnesses(MatPaginatorHarness);
        expect(paginators.length).toBe(1);
      });

      it('should be able to navigate between pages', async () => {
        await setup({
          isError: of(false),
          lifeList: of(lifeListLongList),
        });

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
        await setup({
          isError: of(false),
          lifeList: of(lifeListLongList),
        });

        const paginator = await loader.getHarness(MatPaginatorHarness);

        expect(component.page).toBe(0);
        await paginator.goToLastPage();
        // list.length = 40
        expect(component.page).toBe(7);
      });

      it('should be able to set the page size', async () => {
        await setup({
          isError: of(false),
          lifeList: of(lifeListLongList),
        });

        const paginator = await loader.getHarness(MatPaginatorHarness);

        expect(component.pageSize).toBe(5);
        await paginator.setPageSize(25);
        expect(component.pageSize).toBe(25);
      });
    });
  });

  describe('when error fetching data', () => {
    it('shows error content', async () => {
      await setup({
        isError: of(true),
        lifeList: of(null),
      });

      expect(findEl(fixture, 'error')).toBeTruthy();
      expectText(
        fixture,
        'error',
        'Whoops! There was an error retrieving the data.Try Again'
      );
    });

    it('tries data fetch again on user button click', async () => {
      await setup({
        isError: of(true),
        lifeList: of(null),
      });

      fixture.debugElement
        .query(By.css('.btn-try-again'))
        .triggerEventHandler('click', null);

      expect(fakeListService.getData).toHaveBeenCalled();
    });

    it('hides list content', async () => {
      await setup({
        isError: of(true),
        lifeList: of(null),
      });

      const error = fixture.nativeElement as HTMLElement;
      expect(
        error.querySelector('[data-testid="life-list-table"]')?.textContent
      ).toBeUndefined();
    });

    it('does not show loading section', async () => {
      await setup({
        isError: of(true),
        lifeList: of(null),
      });

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeNull();
    });
  });
});
