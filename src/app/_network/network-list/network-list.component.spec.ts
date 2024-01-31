import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkListComponent } from './network-list.component';
import { MockComponent } from 'ng-mocks';
import { FollowersComponent } from '../followers/followers.component';
import { FollowingComponent } from '../following/following.component';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatTabGroupHarness } from '@angular/material/tabs/testing';
import { authUserName, userModel } from 'src/app/testing/auth-test-helpers';
import { ActivatedRoute } from '@angular/router';

describe('NetworkListComponent', () => {
  let component: NetworkListComponent;
  let fixture: ComponentFixture<NetworkListComponent>;
  let fakeAuthService: AuthenticationService;
  let loader: HarnessLoader;

  const setup = async (
    fakeUsernameInput?: string,
    fakeAuthPropertyValues?: jasmine.SpyObjPropertyNames<AuthenticationService>) => {

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

    await TestBed.configureTestingModule({
      imports: [NetworkListComponent, NoopAnimationsModule, MockComponent(FollowersComponent), MockComponent(FollowingComponent)],
      providers: [{ provide: AuthenticationService, useValue: fakeAuthService },
      {
        provide: ActivatedRoute,
        useValue: {
          paramMap: of(new Map(Object.entries({
            username: 'andrew'
          })))
          // needs to be a 'Map' object otherwise "map.get is not a function" error occurs
          // see: https://bobbyhadz.com/blog/javascript-typeerror-map-get-is-not-a-function#:~:text=get%20is%20not%20a%20function%22%20error%20occurs%20when%20we%20call,the%20method%20on%20Map%20objects.
        }
      }]
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkListComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    component.username = fakeUsernameInput ?? '';
    fixture.detectChanges();
  }

  describe('when loaded', () => {

    it('should create', async () => {
      await setup();
      expect(component).toBeTruthy();
    });

    it('should load harness for tab-group', async () => {
      await setup();

      const tabGroups = await loader.getAllHarnesses(MatTabGroupHarness);
      expect(tabGroups.length).toBe(1);
    });

    it('should load harness for tab-group with selected tab label', async () => {
      await setup();

      const tabGroups = await loader.getAllHarnesses(
        MatTabGroupHarness.with({
          selectedTabLabel: 'Following',
        }),
      );
      expect(tabGroups.length).toBe(1);
    });

    it('should be able to get tabs of tab-group', async () => {
      await setup();

      const tabGroup = await loader.getHarness(MatTabGroupHarness);
      const tabs = await tabGroup.getTabs();
      expect(tabs.length).toBe(2);
    });

    it('should be able to select tab from tab-group', async () => {
      await setup();

      const tabGroup = await loader.getHarness(MatTabGroupHarness);
      expect(await (await tabGroup.getSelectedTab()).getLabel()).toBe('Following');
      await tabGroup.selectTab({ label: 'Followers' });
      expect(await (await tabGroup.getSelectedTab()).getLabel()).toBe('Followers');
    });
  });

  describe('header section', () => {

    it('title should render username when other users profile', async () => {
      await setup('andrew',
        {
          getAuthUser: of(userModel)
        }
      );

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="title"]')?.textContent).toBeTruthy();
      expect(compiled.querySelector('[data-testid="title"]')?.textContent).toContain("andrew's network");
    });

    it('title should render "your" when own profile', async () => {
      await setup(authUserName,
        {
          getAuthUser: of(userModel)
        }
      );

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="title"]')?.textContent).toBeTruthy();
      expect(compiled.querySelector('[data-testid="title"]')?.textContent).toContain("Your network");
    });
  });
});
