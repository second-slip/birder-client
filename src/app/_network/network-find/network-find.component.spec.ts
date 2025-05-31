import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import {
  expectText,
  findComponent,
  findEl,
  setFieldValue,
} from 'src/app/testing/element.spec-helper';
import {
  fakeNetworkUserModelArray,
  networkSearchTerm,
} from 'src/app/testing/network-test-helpers';

import { NetworkFindComponent } from './network-find.component';
import { NetworkFindService } from './network-find.service';
import { MockComponent } from 'ng-mocks';
import { NetworkUserComponent } from '../network-user/network-user.component';
import { provideRouter } from '@angular/router';
import { blankRoutesArray } from 'src/app/testing/route-tests-helpers';
import { provideZonelessChangeDetection } from '@angular/core';

describe('NetworkFindComponent', () => {
  let component: NetworkFindComponent;
  let fixture: ComponentFixture<NetworkFindComponent>;

  let fakeService: jasmine.SpyObj<NetworkFindService>;

  const setup = async (
    fakePropertyValues?: jasmine.SpyObjPropertyNames<NetworkFindService>
  ) => {
    fakeService = jasmine.createSpyObj<NetworkFindService>(
      'NetworkSummaryService',
      {
        getData: undefined,
      },
      {
        isError: of(false),
        getSearchResults: of(null),
        ...fakePropertyValues,
      }
    );

    await TestBed.configureTestingModule({
      imports: [FormsModule, NetworkFindComponent],
      providers: [
        { provide: NetworkFindService, useValue: fakeService },
        provideRouter(blankRoutesArray),
        provideZonelessChangeDetection(),
      ],
    })
      .overrideComponent(NetworkFindComponent, {
        // set: {
        //   providers: [
        //     { provide: NetworkFindService, useValue: fakeService }
        //   ]
        // },
        remove: {
          imports: [NetworkUserComponent],
          providers: [NetworkFindService],
        },
        add: {
          imports: [MockComponent(NetworkUserComponent)],
          providers: [{ provide: NetworkFindService, useValue: fakeService }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NetworkFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('"SMOKE TEST": should be created and show the loading placeholder', async () => {
    await setup({});
    expect(component).toBeTruthy();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelector('[data-testid="search-results"]')?.textContent
    ).toBeUndefined();
  });

  // clear form
  // check searchRequested is true after search
  // data-testid="search-form"
  // data-testid="search-field"

  const requiredFields = ['searchTerm'];

  const fillForm = () => {
    setFieldValue(fixture, 'searchTerm', networkSearchTerm);
  };

  describe('when using the form to search', () => {
    it('calls data fetch service method', async () => {
      await setup({
        getSearchResults: of(fakeNetworkUserModelArray),
      });

      fillForm();

      findEl(fixture, 'search-form').triggerEventHandler('submit', {});

      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="search-results"]')?.textContent
      ).toBeDefined();

      const feedItems = findComponent(fixture, 'app-network-user');
      expect(feedItems).toBeTruthy();

      expect(fakeService.getData).toHaveBeenCalledOnceWith(networkSearchTerm);
      expect(component.searchRequested).toBeTrue();
      expect(component.searchTerm).toBe('');
    });

    it('does not submit an invalid form', async () => {
      await setup({});

      findEl(fixture, 'search-form').triggerEventHandler('submit', {});

      expect(fakeService.getData).not.toHaveBeenCalled();
    });
  });

  describe('when response is unsuccessful', () => {
    it('shows error content', async () => {
      await setup({
        isError: of(true),
        getSearchResults: of(null),
      });

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
      await setup({
        isError: of(true),
        getSearchResults: of(null),
      });

      component.searchTerm = 'test';

      fixture.debugElement
        .query(By.css('.btn-try-again'))
        .triggerEventHandler('click', null);

      expect(fakeService.getData).toHaveBeenCalled();
    });

    it('does not show success content', async () => {
      await setup({
        isError: of(true),
        getSearchResults: of(null),
      });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="search-results"]')?.textContent
      ).toBeUndefined();
      expect(
        compiled.querySelector('[data-testid="no-search-results"]')?.textContent
      ).toBeUndefined();
    });

    it('does not show loading section', async () => {
      await setup({
        isError: of(true),
        getSearchResults: of(null),
      });

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeNull();
    });
  });
});
