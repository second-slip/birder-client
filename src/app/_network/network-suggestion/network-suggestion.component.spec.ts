import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { expectText, findComponent } from 'src/app/testing/element.spec-helper';
import { fakeNetworkUserModelArray } from 'src/app/testing/network-test-helpers';
import { NetworkSuggestionComponent } from './network-suggestion.component';
import { NetworkSuggestionService } from './network-suggestion.service';
import { MockComponent } from 'ng-mocks';
import { NetworkUserComponent } from '../network-user/network-user.component';
import { provideRouter } from '@angular/router';
import { blankRoutesArray } from 'src/app/testing/route-tests-helpers';
import { AnnounceChangesService } from 'src/app/_sharedServices/announce-changes.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('NetworkSuggestionComponent', () => {
  let component: NetworkSuggestionComponent;
  let fixture: ComponentFixture<NetworkSuggestionComponent>;

  let fakeService: jasmine.SpyObj<NetworkSuggestionService>;
  let fakeAnnounceChangesService: jasmine.SpyObj<AnnounceChangesService>;

  const setup = async (
    fakeMethodValues?: jasmine.SpyObjMethodNames<NetworkSuggestionService>,
    fakePropertyValues?: jasmine.SpyObjPropertyNames<NetworkSuggestionService>
  ) => {
    fakeService = jasmine.createSpyObj<NetworkSuggestionService>(
      'NetworkSuggestionService',
      {
        getData: undefined,
        ...fakeMethodValues,
      },
      {
        isError: of(false),
        getNetworkSuggestions: of(null),
        ...fakePropertyValues,
      }
    );

    fakeAnnounceChangesService = jasmine.createSpyObj<AnnounceChangesService>(
      'AnnounceChangesService',
      {
        announceNetworkChanged: undefined,
        announceObservationsChanged: undefined,
      },
      {
        observationsChanged$: of(''),
        networkChanged$: of(''),
      }
    );

    await TestBed.configureTestingModule({
      imports: [NetworkSuggestionComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter(blankRoutesArray),
        {
          provide: AnnounceChangesService,
          useValue: fakeAnnounceChangesService,
        },
      ],
    })
      .overrideComponent(NetworkSuggestionComponent, {
        remove: {
          imports: [NetworkUserComponent],
          providers: [NetworkSuggestionService],
        },
        add: {
          imports: [MockComponent(NetworkUserComponent)],
          providers: [
            { provide: NetworkSuggestionService, useValue: fakeService },
          ],
        },
        // {
        //   set: {
        //     providers: [
        //       { provide: NetworkSuggestionService, useValue: fakeService }
        //     ]
        //   }
      })
      .compileComponents();

    fixture = TestBed.createComponent(NetworkSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('"SMOKE TEST": should be created and show the loading placeholder', async () => {
    await setup({}, {});

    expect(component).toBeTruthy();
    const { debugElement } = fixture;
    const loading = debugElement.query(By.css('app-loading'));
    expect(loading).toBeTruthy();
  });

  describe('when response is successful', () => {
    it('calls data fetch service method', async () => {
      await setup(
        {},
        {
          isError: of(false),
          getNetworkSuggestions: of(fakeNetworkUserModelArray),
        }
      );

      expect(fakeService.getData).toHaveBeenCalledTimes(2);
    });

    it('shows the suggestions list when suggestions > 0', async () => {
      await setup(
        {},
        {
          isError: of(false),
          getNetworkSuggestions: of(fakeNetworkUserModelArray),
        }
      );

      const feedItems = findComponent(fixture, 'app-network-user');
      expect(feedItems).toBeTruthy();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="suggestions-list"]')?.textContent
      ).toBeDefined();
      expect(
        compiled.querySelector('[data-testid="suggestions-list-is-zero"]')
          ?.textContent
      ).toBeUndefined();
    });

    it('shows the no suggestions content when suggestions = 0 ([])', async () => {
      await setup(
        {},
        {
          isError: of(false),
          getNetworkSuggestions: of([]),
        }
      );

      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="suggestions-list"]')?.textContent
      ).toBeUndefined();
      expect(
        compiled.querySelector('[data-testid="suggestions-list-is-zero"]')
          ?.textContent
      ).toBeDefined();
      expectText(
        fixture,
        'suggestions-list-is-zero',
        ' No suggestions at this time... '
      );
    });

    it('does not show error section', async () => {
      await setup(
        {},
        {
          isError: of(false),
          getNetworkSuggestions: of(fakeNetworkUserModelArray),
        }
      );

      const error = fixture.nativeElement as HTMLElement;
      expect(
        error.querySelector('[data-testid="error"]')?.textContent
      ).toBeUndefined();
    });

    it('does not show loading section', async () => {
      await setup(
        {},
        {
          isError: of(false),
          getNetworkSuggestions: of(fakeNetworkUserModelArray),
        }
      );

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeNull();
    });
  });

  describe('when response is unsuccessful', () => {
    it('shows error content', async () => {
      await setup(
        {},
        {
          isError: of(true),
          getNetworkSuggestions: of(null),
        }
      );

      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="error"]')?.textContent
      ).toBeDefined();
      expect(
        compiled.querySelector('[data-testid="reload-button"]')?.textContent
      ).toBeDefined();
      expectText(
        fixture,
        'error',
        'Whoops! There was an error retrieving the data.Try Again'
      );
    });

    it('tries data fetch again on retry button click', async () => {
      await setup(
        {},
        {
          isError: of(true),
          getNetworkSuggestions: of(null),
        }
      );

      fixture.debugElement
        .query(By.css('.btn-try-again'))
        .triggerEventHandler('click', null);

      expect(fakeService.getData).toHaveBeenCalled();
    });

    it('does not show success content', async () => {
      await setup(
        {},
        {
          isError: of(true),
          getNetworkSuggestions: of(null),
        }
      );

      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="followers-list"]')?.textContent
      ).toBeUndefined();
      expect(
        compiled.querySelector('[data-testid="followers-list-is-zero"]')
          ?.textContent
      ).toBeUndefined();
    });

    it('does not show loading section', async () => {
      await setup(
        {},
        {
          isError: of(true),
          getNetworkSuggestions: of(null),
        }
      );

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeNull();
    });
  });
});
