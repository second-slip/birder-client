import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopTableComponent } from './top-table.component';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { blankRoutesArray } from 'src/app/testing/route-tests-helpers';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IObservationTopFiveRecord } from '../i-observation-top-five-record.dto';
import { fakeTopObservationsArray } from 'src/app/testing/analysis-helpers';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTableHarness } from '@angular/material/table/testing';
import { userModel } from 'src/app/testing/auth-test-helpers';

describe('TopTableComponent', () => {
  let component: TopTableComponent;
  let fixture: ComponentFixture<TopTableComponent>;
  let loader: HarnessLoader;

  let fakeAuthService: AuthenticationService;

  const setup = async (
    fakePropertyValues?: jasmine.SpyObjPropertyNames<AuthenticationService>,
    fakeInputValue: IObservationTopFiveRecord[] = []) => {

    fakeAuthService = jasmine.createSpyObj<AuthenticationService>(
      'AuthenticationService',
      {
        checkAuthStatus: undefined,
        logout: undefined
      },
      {
        isAuthorisedObservable: of(false),
        getAuthUser: of(null),
        ...fakePropertyValues
      }
    );

    await TestBed.configureTestingModule({
      imports: [TopTableComponent],
      providers: [{ provide: AuthenticationService, useValue: fakeAuthService },
      provideRouter(blankRoutesArray), NoopAnimationsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TopTableComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    component.topObservations = fakeInputValue;
    fixture.detectChanges();
  };

  describe('on initialisation', () => {

    it('should create', async () => {
      await setup();
      expect(component).toBeTruthy();
    });

    it('should show no records content when array is empty', async () => {
      await setup();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="empty-array"]')).toBeTruthy();
      expect(compiled.querySelector('[data-testid="empty-array"]')?.textContent).toContain('You have not yet logged any observations...');
    });

    it('should not load harness for a table', async () => {
      await setup();
      const tables = await loader.getAllHarnesses(MatTableHarness);
      expect(tables.length).toBe(0);
    });
  });

  describe('MONKEY', () => {

    it('should load harness for a table', async () => {
      await setup({}, fakeTopObservationsArray);
      const tables = await loader.getAllHarnesses(MatTableHarness);
      expect(tables.length).toBe(1);
    });

    it('should get the different kinds of rows in the table', async () => {
      await setup({}, fakeTopObservationsArray);

      const table = await loader.getHarness(MatTableHarness);
      const headerRows = await table.getHeaderRows();
      const footerRows = await table.getFooterRows();
      const rows = await table.getRows();
      expect(headerRows.length).toBe(1);
      expect(footerRows.length).toBe(0);
      expect(rows.length).toBe(fakeTopObservationsArray.length);
    });

    it('should NOT show no records content', async () => {
      await setup({}, fakeTopObservationsArray);

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="empty-array"]')).toBeFalsy();
    });
  });

  describe('authorised user check', () => {

    it('should NOT message when user is not known', async () => {
      await setup({}, fakeTopObservationsArray);

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="auth-user-msg"]')).toBeFalsy();
    });

    it('should NOT message when user is not known', async () => {
      await setup({
        getAuthUser: of(userModel)
      }, fakeTopObservationsArray);

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="auth-user-msg"]')).toBeTruthy();
      expect(compiled.querySelector('[data-testid="auth-user-msg"]')?.textContent).toContain('See the full list in your Life List page');
    });
  });
});
