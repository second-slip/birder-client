import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { expectText, findComponent, findEl } from 'src/app/testing/element.spec-helper';
import { lifeListModel } from 'src/app/testing/list-test-helpers';
import { ObservationCountService } from 'src/app/_analysis/observation-count/observation-count.service';
import { LifeListComponent } from './life-list.component';
import { LifeListService } from './life-list.service';

describe('LifeListComponent', () => {
  let component: LifeListComponent;
  let fixture: ComponentFixture<LifeListComponent>;
  let fakeCountService: jasmine.SpyObj<ObservationCountService>;
  let fakeListService: jasmine.SpyObj<LifeListService>;

  fakeCountService = jasmine.createSpyObj<ObservationCountService>(
    'ObservationCountService',
    {
      getData: undefined
    },
    {
      count: undefined,
      isError: undefined
    });

  const setup = async (
    fakePropertyValues?: jasmine.SpyObjPropertyNames<LifeListService>) => {

    fakeListService = jasmine.createSpyObj<LifeListService>(
      'LifeListService',
      {
        getData: undefined
      },
      {
        lifeList: of(null),
        isError: of(false),
        ...fakePropertyValues
      });

    await TestBed.configureTestingModule({
    imports: [LifeListComponent],
    providers: [{ provide: ObservationCountService, useValue: fakeCountService }],
    schemas: [NO_ERRORS_SCHEMA]
}).overrideComponent(LifeListComponent,
      {
        set: {
          providers: [{ provide: LifeListService, useValue: fakeListService }]
        }
      }).compileComponents();

    fixture = TestBed.createComponent(LifeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };


  it('should be created and show the loading placeloader', fakeAsync(async () => {
    await setup({});

    expect(findComponent(fixture, 'app-loading')).toBeTruthy();;
  }));

  describe('when data fetch returns observations', () => {

    it('calls data fetch', fakeAsync(async () => {
      await setup(
        {
          isError: of(false),
          lifeList: of(lifeListModel)
        });

      expect(fakeListService.getData).toHaveBeenCalledTimes(1);
    }));

    it('shows the list', fakeAsync(async () => {
      await setup(
        {
          isError: of(false),
          lifeList: of(lifeListModel)
        });

      expect(findEl(fixture, 'life-list-table')).toBeTruthy();
    }));

    it('does not show error section', fakeAsync(async () => {
      await setup(
        {
          isError: of(false),
          lifeList: of(lifeListModel)
        });

      const error = fixture.nativeElement as HTMLElement;
      expect(error.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();
    }));

    it('does not show loading section', fakeAsync(async () => {
      await setup(
        {
          isError: of(false),
          lifeList: of(lifeListModel)
        });

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeNull();
    }));

    it('does not show no-items section when >0 items', fakeAsync(async () => {
      await setup(
        {
          isError: of(false),
          lifeList: of(lifeListModel)
        });

      const error = fixture.nativeElement as HTMLElement;
      expect(error.querySelector('[data-testid="no-items"]')?.textContent).toBeUndefined();
    }));

    it('does show no-items section when =0 items', fakeAsync(async () => {
      await setup(
        {
          isError: of(false),
          lifeList: of([])
        });

      expect(findEl(fixture, 'no-items')).toBeTruthy();
    }));
  });


  describe('when error fetching data', () => {

    it('shows error content', fakeAsync(async () => {
      await setup(
        {

          isError: of(true),
          lifeList: of(null)
        });

      expect(findEl(fixture, 'error')).toBeTruthy();
      expectText(fixture, 'error', 'Whoops! There was an error retrieving the data.Try Again');
    }));

    it('tries data fetch again on user button click', fakeAsync(async () => {
      await setup(
        {
          isError: of(true),
          lifeList: of(null)
        });

      fixture.debugElement.query(By.css('.btn-try-again')).triggerEventHandler('click', null);

      expect(fakeListService.getData).toHaveBeenCalled();
    }));

    it('hides list content', fakeAsync(async () => {
      await setup(
        {
          isError: of(true),
          lifeList: of(null)
        });

      const error = fixture.nativeElement as HTMLElement;
      expect(error.querySelector('[data-testid="life-list-table"]')?.textContent).toBeUndefined();
    }));

    it('does not show loading section', fakeAsync(async () => {
      await setup(
        {
          isError: of(true),
          lifeList: of(null)
        });

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeNull();
    }));
  });
});