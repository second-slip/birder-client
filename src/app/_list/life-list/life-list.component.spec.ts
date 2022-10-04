import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
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
    fakeMethodValues?: jasmine.SpyObjMethodNames<LifeListService>,
    fakePropertyValues?: jasmine.SpyObjPropertyNames<LifeListService>) => {

    fakeListService = jasmine.createSpyObj<LifeListService>(
      'LifeListService',
      {
        getData: undefined,
        ...fakeMethodValues
      },
      {
        lifeList: of(null),
        isError: of(false),
        ...fakePropertyValues
      });

    await TestBed.configureTestingModule({
      declarations: [
        LifeListComponent
      ],
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
    await setup({}, {});

    expect(component).toBeTruthy();
    const { debugElement } = fixture;
    const loading = debugElement.query(By.css('app-loading'));
    expect(loading).toBeTruthy();
  }));



});
