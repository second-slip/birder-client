import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { userModel } from 'src/app/testing/auth-test-helpers';
import { expectText } from 'src/app/testing/element.spec-helper';
import { fakeNetworkSummary } from 'src/app/testing/network-test-helpers';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { INetworkSummary } from './i-network-summary.dto';

import { NetworkSummaryComponent } from './network-summary.component';
import { NetworkSummaryService } from './network-summary.service';

describe('NetworkSummaryComponent', () => {
  let component: NetworkSummaryComponent;
  let fixture: ComponentFixture<NetworkSummaryComponent>;

  let fakeService: jasmine.SpyObj<NetworkSummaryService>;
  let fakeAuthService: jasmine.SpyObj<AuthenticationService>;

  const setup = async (showTitle: boolean,
    fakePropertyValues?: jasmine.SpyObjPropertyNames<NetworkSummaryService>) => {

    fakeService = jasmine.createSpyObj<NetworkSummaryService>(
      'NetworkSummaryService',
      {
        getData: undefined
      },
      {
        isError: of(false),
        getSummary: of(null),
        ...fakePropertyValues
      }
    );

    fakeAuthService = jasmine.createSpyObj<AuthenticationService>(
      'AuthenticationService',
      {
        checkAuthStatus: undefined,
        logout: undefined,
      },
      {
        isAuthorisedObservable: of(true),
        getAuthUser: of(userModel),
      }
    )


    await TestBed.configureTestingModule({
      declarations: [
        NetworkSummaryComponent
      ],
      providers: [
        { provide: NetworkSummaryService, useValue: fakeService },
        { provide: AuthenticationService, useValue: fakeAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkSummaryComponent);
    component = fixture.componentInstance;
    component.showTitle = showTitle;
    fixture.detectChanges();
  };

  it('"SMOKE TEST": should be created and show the loading placeloader', fakeAsync(async () => {
    await setup(false, {});

    expect(component).toBeTruthy();
    const { debugElement } = fixture;
    const loading = debugElement.query(By.css('app-loading'));
    expect(loading).toBeTruthy();
  }));

  describe('when component is instantiated', () => {

    it('calls data fetch service method', fakeAsync(async () => {
      await setup(false, {
        getSummary: of(fakeNetworkSummary)
      });

      expect(fakeService.getData).toHaveBeenCalledTimes(1);
    }));

    it('does not render the title when showTitle is false', fakeAsync(async () => {
      await setup(false, {
        getSummary: of(fakeNetworkSummary)
      });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="h1-title"]')?.textContent).toBeUndefined();
    }));

    it('renders the title when showTitle is true', fakeAsync(async () => {
      await setup(true, {
        getSummary: of(fakeNetworkSummary)
      });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="h1-title"]')?.textContent).toBeDefined();
    }));
  })


  describe('when the response is successful', () => {

    it('shows the network summary section', fakeAsync(async () => {
      await setup(false, {
        getSummary: of(fakeNetworkSummary)
      });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="summary"]')?.textContent).toBeDefined();
      const summaryText = `${fakeNetworkSummary.followersCount} followers / ${fakeNetworkSummary.followingCount} following`;
      expectText(fixture, 'summary', summaryText);
    }));

    it('shows the correct summary text when followers > 1', fakeAsync(async () => {
      await setup(false, {
        getSummary: of(fakeNetworkSummary)
      });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="summary"]')?.textContent).toBeDefined();
      // 'followers', plural
      const summaryText = `${fakeNetworkSummary.followersCount} followers / ${fakeNetworkSummary.followingCount} following`;
      expectText(fixture, 'summary', summaryText);
    }));

    it('shows the correct summary text when followers < 1', fakeAsync(async () => {
      const oneFollowerModel: INetworkSummary = {
        followersCount: 1,
        followingCount: 1
      };

      await setup(false, {
        getSummary: of(oneFollowerModel)
      });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="summary"]')?.textContent).toBeDefined();
      // 'follower', singular
      const summaryText = `${oneFollowerModel.followersCount} follower / ${oneFollowerModel.followingCount} following`;
      expectText(fixture, 'summary', summaryText);
    }));
  });

  describe('when response is unsuccessful', () => {

    it('shows error content', fakeAsync(async () => {
      await setup(false,
        {
          isError: of(true),
          getSummary: of(null)
        });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeDefined();
      expect(compiled.querySelector('[data-testid="reload-button"]')?.textContent).toBeDefined();
      expectText(fixture, 'error', 'Whoops! There was an error retrieving the data.Try Again');
    }));

    it('tries data fetch again on retry button click', fakeAsync(async () => {
      await setup(false,
        {
          isError: of(true),
          getSummary: of(null)
        });

      fixture.debugElement.query(By.css('.btn-try-again')).triggerEventHandler('click', null);

      expect(fakeService.getData).toHaveBeenCalled();
    }));

    it('does not show success content', fakeAsync(async () => {
      await setup(false,
        {
          isError: of(true),
          getSummary: of(null)
        });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="summary"]')?.textContent).toBeUndefined();
    }));

    it('does not show loading section', fakeAsync(async () => {
      await setup(false,
        {
          isError: of(true),
          getSummary: of(null)
        });

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeNull();
    }));
  });
});