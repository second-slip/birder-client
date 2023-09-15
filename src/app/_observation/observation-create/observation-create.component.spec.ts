import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { AnnounceChangesService } from 'src/app/_sharedServices/announce-changes.service';
import { ObservationCrudService } from '../observation-crud.service';
import { ObservationReadComponent } from '../observation-read/observation-read.component';

import { ObservationCreateComponent } from './observation-create.component';

// STUB the select species child component...

describe('ObservationCreateComponent', () => {
  let component: ObservationCreateComponent;
  let fixture: ComponentFixture<ObservationCreateComponent>;

  let fakeAuthService: AuthenticationService;
  let fakeAnnounceChangesService: jasmine.SpyObj<AnnounceChangesService>;
  let fakeObservationCrudService: jasmine.SpyObj<ObservationCrudService>;


  const setup = async (
    fakeAuthPropertyValues?: jasmine.SpyObjPropertyNames<AuthenticationService>) => {

    fakeObservationCrudService = jasmine.createSpyObj<ObservationCrudService>(
      'ObservationCrudService',
      {
        getObservation: undefined,
        updateObservation: undefined,
        addObservation: undefined,
        deleteObservation: undefined
      });

    fakeAuthService = jasmine.createSpyObj<AuthenticationService>(
      'AuthenticationService',
      {
        checkAuthStatus: undefined,
        logout: undefined
      },
      {
        isAuthorisedObservable: undefined,
        getAuthUser: of(null),
        ...fakeAuthPropertyValues
      }
    );

    fakeAnnounceChangesService = jasmine.createSpyObj<AnnounceChangesService>(
      'AnnounceChangesService',
      {
        announceNetworkChanged: undefined,
        announceObservationsChanged: undefined
      });

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: ObservationReadComponent },
        ])],
      declarations: [
        ObservationCreateComponent
      ],
      providers: [{ provide: AnnounceChangesService, useValue: fakeAnnounceChangesService },
      { provide: ObservationCrudService, useValue: fakeObservationCrudService },
      { provide: AuthenticationService, useValue: fakeAuthService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ObservationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };


  it('SMOKE TEST: should be created', fakeAsync(async () => {
    await setup();
    expect(component).toBeTruthy();
  }));


  // describe('', () => {


  // });


});
