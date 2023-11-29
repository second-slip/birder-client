import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { AnnounceChangesService } from 'src/app/_sharedServices/announce-changes.service';
import { ObservationCrudService } from '../observation-crud.service';
import { ObservationReadComponent } from '../observation-read/observation-read.component';
import { ObservationCreateComponent } from './observation-create.component';
import { SelectSpeciesComponent } from '../select-species/select-species.component';
import { SelectDateTimeComponent } from '../select-date-time/select-date-time.component';
import { ReadWriteMapComponent } from 'src/app/_map/read-write-map/read-write-map.component';
import { MockComponent } from 'ng-mocks';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Routes } from '@angular/router';

// STUB the select species child component...
const routes: Routes = [
  { path: 'login', component: ObservationReadComponent }
];


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
    imports: [FormsModule, ReactiveFormsModule, MatStepperModule, BrowserAnimationsModule, ObservationCreateComponent],
    providers: [{ provide: AnnounceChangesService, useValue: fakeAnnounceChangesService },
        { provide: ObservationCrudService, useValue: fakeObservationCrudService },
        { provide: AuthenticationService, useValue: fakeAuthService },
        provideRouter(routes)],
    schemas: [NO_ERRORS_SCHEMA]
})
.overrideComponent(ObservationCreateComponent, {
  remove: { imports: [SelectSpeciesComponent, SelectDateTimeComponent, ReadWriteMapComponent] },
  add: { imports: [MockComponent(SelectSpeciesComponent), MockComponent(SelectDateTimeComponent), MockComponent(ReadWriteMapComponent)] },
})
.compileComponents();

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
