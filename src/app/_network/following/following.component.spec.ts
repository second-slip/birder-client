import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { expectText, findComponent } from 'src/app/testing/element.spec-helper';
import { fakeNetworkUserModelArray } from 'src/app/testing/network-test-helpers';
import { FollowingComponent } from './following.component';
import { FollowingService } from './following.service';
import { NetworkUserComponent } from '../network-user/network-user.component';
import { MockComponent } from 'ng-mocks';

describe('FollowingComponent', () => {
  let component: FollowingComponent;
  let fixture: ComponentFixture<FollowingComponent>;
  let fakeService: jasmine.SpyObj<FollowingService>;

  const setup = async (
    fakeMethodValues?: jasmine.SpyObjMethodNames<FollowingService>,
    fakePropertyValues?: jasmine.SpyObjPropertyNames<FollowingService>,
    fakeInput?: string) => {

    fakeService = jasmine.createSpyObj<FollowingService>(
      'FollowingService',
      {
        getData: undefined,
        ...fakeMethodValues
      },
      {
        isError: of(false),
        getFollowing: of(null),
        ...fakePropertyValues
      }
    );

    await TestBed.configureTestingModule({
      imports: [FollowingComponent]
    }).overrideComponent(FollowingComponent,
      {
        remove: { imports: [NetworkUserComponent], providers: [FollowingService] },
        add: {
          imports: [MockComponent(NetworkUserComponent)],
          providers: [
            { provide: FollowingService, useValue: fakeService }
          ]
        }
      }).compileComponents();

    fixture = TestBed.createComponent(FollowingComponent);
    component = fixture.componentInstance;

    component.username = fakeInput ?? '';

    fixture.detectChanges();
  };

  it('"SMOKE TEST": should be created and show the loading placeloader', fakeAsync(async () => {
    await setup();

    expect(component).toBeTruthy();
    const { debugElement } = fixture;
    const loading = debugElement.query(By.css('app-loading'));
    expect(loading).toBeTruthy();
  }));


  describe('when response is successful', () => {

    it('calls data fetch service method', fakeAsync(async () => {
      await setup({},
        {
          isError: of(false),
          getFollowing: of(fakeNetworkUserModelArray)
        },
        'test-username');

      expect(fakeService.getData).toHaveBeenCalledTimes(1);
      expect(fakeService.getData).toHaveBeenCalledOnceWith('test-username');
    }));

    it('shows the following list when following > 0', fakeAsync(async () => {
      await setup({},
        {
          isError: of(false),
          getFollowing: of(fakeNetworkUserModelArray)
        },
        'test-username');

      const feedItems = findComponent(fixture, 'app-network-user');
      expect(feedItems).toBeTruthy();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="following-list"]')?.textContent).toBeDefined();
      expect(compiled.querySelector('[data-testid="following-list-is-zero"]')?.textContent).toBeUndefined();
    }));

    it('shows the no following content when following = 0 ([])', fakeAsync(async () => {
      await setup({},
        {
          isError: of(false),
          getFollowing: of([])
        },
        'test-username');

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="following-list"]')?.textContent).toBeUndefined();
      expect(compiled.querySelector('[data-testid="following-list-is-zero"]')?.textContent).toBeDefined();
    }));

    it('does not show error section', fakeAsync(async () => {
      await setup({},
        {
          isError: of(false),
          getFollowing: of(fakeNetworkUserModelArray)
        },
        'test-username');

      const error = fixture.nativeElement as HTMLElement;
      expect(error.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();
    }));

    it('does not show loading section', fakeAsync(async () => {
      await setup({},
        {
          isError: of(false),
          getFollowing: of(fakeNetworkUserModelArray)
        },
        'test-username');

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeNull();
    }));


    describe('when response is unsuccessful', () => {

      it('shows error content', fakeAsync(async () => {
        await setup({},
          {
            isError: of(true),
            getFollowing: of(null)
          },
          'test-username');

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeDefined();
        expect(compiled.querySelector('[data-testid="reload-button"]')?.textContent).toBeDefined();
        expectText(fixture, 'error', 'Whoops! There was an error retrieving the data.Try Again');
      }));

      it('tries data fetch again on retry button click', fakeAsync(async () => {
        await setup({},
          {
            isError: of(true),
            getFollowing: of(null)
          },
          'test-username');

        fixture.debugElement.query(By.css('.btn-try-again')).triggerEventHandler('click', null);

        expect(fakeService.getData).toHaveBeenCalledWith('test-username');
      }));

      it('does not show success content', fakeAsync(async () => {
        await setup({},
          {
            isError: of(true),
            getFollowing: of(null)
          },
          'test-username');

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('[data-testid="following-list"]')?.textContent).toBeUndefined();
        expect(compiled.querySelector('[data-testid="following-list-is-zero"]')?.textContent).toBeUndefined();
      }));

      it('does not show loading section', fakeAsync(async () => {
        await setup({},
          {
            isError: of(true),
            getFollowing: of(null)
          },
          'test-username');

        const { debugElement } = fixture;
        const loading = debugElement.query(By.css('app-loading'));
        expect(loading).toBeNull();
      }));
    });
  })
});