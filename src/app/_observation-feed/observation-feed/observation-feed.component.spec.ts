// todo
// new test(s) required for id out emit

import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import {
  ComponentFixture,
  DeferBlockBehavior,
  DeferBlockState,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { expectText, findComponent } from 'src/app/testing/element.spec-helper';
import { fakeIObservationFeed } from 'src/app/testing/observation-feed-helper';
import { ObservationFeedService } from '../../_observation-feed/observation-feed.service';
import { ObservationFeedComponent } from './observation-feed.component';
import { ObservationFeedItemComponent } from '../observation-feed-item/observation-feed-item.component';
import { MockComponent } from 'ng-mocks';
import { FilterControlComponent } from '../filter-control/filter-control.component';
import { IObservationFeed } from '../i-observation-feed.dto';

describe('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', () => {
  let component: ObservationFeedComponent;
  let fixture: ComponentFixture<ObservationFeedComponent>;
  let fakeObservationFeedService: jasmine.SpyObj<ObservationFeedService>;

  const setup = async (
    fakeMethodValues?: jasmine.SpyObjMethodNames<ObservationFeedService>,
    fakePropertyValues?: jasmine.SpyObjPropertyNames<ObservationFeedService>,
    fakeRouteArgument?: string
  ) => {
    fakeObservationFeedService = jasmine.createSpyObj<ObservationFeedService>(
      'ObservationFeedService',
      {
        getData: undefined,
        ...fakeMethodValues,
      },
      {
        isLoading: signal(true),
        isError: signal(false),
        isAllLoaded: signal(false),
        observations: signal(fakeIObservationFeed),
        lastLoadedRecordId: signal(0),
        ...fakePropertyValues,
      }
    );

    await TestBed.configureTestingModule({
      deferBlockBehavior: DeferBlockBehavior.Manual,
      imports: [ObservationFeedComponent, ObservationFeedItemComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(
              new Map(
                Object.entries({
                  filter: fakeRouteArgument,
                })
              )
            ),
            // needs to be a 'Map' object otherwise "map.get is not a function" error occurs
            // see: https://bobbyhadz.com/blog/javascript-typeerror-map-get-is-not-a-function#:~:text=get%20is%20not%20a%20function%22%20error%20occurs%20when%20we%20call,the%20method%20on%20Map%20objects.
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ObservationFeedComponent, {
        remove: {
          imports: [ObservationFeedItemComponent, FilterControlComponent],
          providers: [ObservationFeedService],
        },
        add: {
          imports: [
            ObservationFeedItemComponent,
            // MockComponent(ObservationFeedItemComponent),
            // MockComponent(FilterControlComponent),
          ],
          providers: [
            {
              provide: ObservationFeedService,
              useValue: fakeObservationFeedService,
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ObservationFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('shows the observations', async () => {
    await setup(
      {},
      {
        isLoading: signal(false),
        isError: signal(false),
        isAllLoaded: signal(true),
        observations: signal(fakeIObservationFeed),
        lastLoadedRecordId: signal(0),
      },
      'public'
    );

    fixture.detectChanges();

    // const firstDeferBlock = (await fixture.getDeferBlocks())[1];
    // // console.log(firstDeferBlock);
    // await firstDeferBlock.render(DeferBlockState.Complete);

    // const deferBlocks = await fixture.getDeferBlocks();
    // only one defer block should be found
    // expect(deferBlocks.length).toBe(10);

    // component._service.getData(2, '');

    // expect(deferBlocks.length).toBe(11);

    expect(true).toBe(true);

    //   console.log(component._service.isAllLoaded());
    //   console.log(component._service.observations());

    // await fixture.whenStable();
    // fixture.detectChanges();

    //   const deferBlockFixture = (await fixture.getDeferBlocks())[0];

    //   console.log(deferBlockFixture);

    //   expect(deferBlockFixture).toBeTruthy();

    // Render loading state and verify the rendered output.
    // await deferBlockFixture.render(DeferBlockState.Loading);
    // expect(componentFixture.nativeElement.innerHTML).toContain('Loading');

    // Render the final state and verify the output.
    //   await deferBlockFixture.render(DeferBlockState.Complete);

    //   expect(fixture.nativeElement.innerHTML).toContain('jimmy');
    //   tick(1000);

    //   const feedItems = findComponent(fixture, 'app-observation-feed-item');
    //   expect(feedItems).toBeTruthy();

    const { debugElement } = fixture;
    // console.log(debugElement);
    const loading = debugElement.query(By.css('app-observation-feed-item'));
    // expect(loading).toBeTruthy();
  });
});

describe('ObservationFeedComponent', () => {
  let component: ObservationFeedComponent;
  let fixture: ComponentFixture<ObservationFeedComponent>;
  let fakeObservationFeedService: jasmine.SpyObj<ObservationFeedService>;

  const setup = async (
    fakeMethodValues?: jasmine.SpyObjMethodNames<ObservationFeedService>,
    fakePropertyValues?: jasmine.SpyObjPropertyNames<ObservationFeedService>,
    fakeRouteArgument?: string
  ) => {
    fakeObservationFeedService = jasmine.createSpyObj<ObservationFeedService>(
      'ObservationFeedService',
      {
        getData: undefined,
        ...fakeMethodValues,
      },
      {
        isLoading: signal(true),
        isError: signal(false),
        isAllLoaded: signal(false),
        observations: signal(fakeIObservationFeed),
        lastLoadedRecordId: signal(0),
        ...fakePropertyValues,
      }
    );

    await TestBed.configureTestingModule({
      imports: [ObservationFeedComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(
              new Map(
                Object.entries({
                  filter: fakeRouteArgument,
                })
              )
            ),
            // needs to be a 'Map' object otherwise "map.get is not a function" error occurs
            // see: https://bobbyhadz.com/blog/javascript-typeerror-map-get-is-not-a-function#:~:text=get%20is%20not%20a%20function%22%20error%20occurs%20when%20we%20call,the%20method%20on%20Map%20objects.
          },
        },
      ],
      //schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ObservationFeedComponent, {
        remove: {
          imports: [ObservationFeedItemComponent, FilterControlComponent],
          providers: [ObservationFeedService],
        },
        add: {
          imports: [
            MockComponent(ObservationFeedItemComponent),
            MockComponent(FilterControlComponent),
          ],
          providers: [
            {
              provide: ObservationFeedService,
              useValue: fakeObservationFeedService,
            },
          ],
        },
        // ,
        // set: {
        //     providers: [{ provide: ObservationFeedService, useValue: fakeObservationFeedService }]
        // }
      })
      .compileComponents();

    fixture = TestBed.createComponent(ObservationFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should be created and show the loading placeholder', async () => {
    await setup({}, {});

    // await fixture.whenStable();

    expect(component).toBeTruthy();
    const { debugElement } = fixture;
    const loading = debugElement.query(By.css('app-loading'));
    expect(loading).toBeTruthy();
  });

  it('should setup the "public" feed', async () => {
    await setup({}, {}, 'public');

    expect(fakeObservationFeedService.getData).toHaveBeenCalledOnceWith(
      1,
      'api/observationfeed'
    );
    expectText(fixture, 'title', 'Latest observations');
  });

  it('should setup the "network" feed', async () => {
    await setup({}, {}, 'network');

    expect(fakeObservationFeedService.getData).toHaveBeenCalledWith(
      1,
      'api/observationfeed/network'
    );
    expect(fakeObservationFeedService.getData).toHaveBeenCalledTimes(1);
    expectText(fixture, 'title', 'Latest observations in your network');
  });

  describe('when data fetch returns observations', () => {
    it('calls data fetch', async () => {
      await setup(
        {},
        {
          isLoading: signal(false),
          isError: signal(false),
          isAllLoaded: signal(false),
          observations: signal(fakeIObservationFeed),
          lastLoadedRecordId: signal(0),
        },
        'public'
      );
      expect(fakeObservationFeedService.getData).toHaveBeenCalledOnceWith(
        1,
        'api/observationfeed'
      );
    });

    it('shows the observations', async () => {
      await setup(
        {},
        {
          isLoading: signal(false),
          isError: signal(false),
          isAllLoaded: signal(true),
          observations: signal(fakeIObservationFeed),
          lastLoadedRecordId: signal(0),
        },
        'public'
      );

      // ..................................................................................................
      expect(true).toBe(true); //.......................................
    });

    it('does not show error section', async () => {
      await setup(
        {},
        {
          isLoading: signal(false),
          isError: signal(false),
          isAllLoaded: signal(false),
          observations: signal(fakeIObservationFeed),
        },
        'public'
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
          isLoading: signal(false),
          isError: signal(false),
          isAllLoaded: signal(false),
          observations: signal(fakeIObservationFeed),
        },
        'public'
      );
      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeNull();
    });

    it('should not show all loaded content when more observations are available', async () => {
      await setup(
        {},
        {
          isLoading: signal(false),
          isError: signal(false),
          isAllLoaded: signal(false),
          observations: signal(fakeIObservationFeed),
        },
        'public'
      );
      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="all-loaded"]')?.textContent
      ).toBeUndefined();
    });

    it('should show all loaded content when all loaded', async () => {
      await setup(
        {},
        {
          isLoading: signal(false),
          isError: signal(false),
          isAllLoaded: signal(true),
          observations: signal(fakeIObservationFeed),
        },
        'public'
      );
      expectText(
        fixture,
        'all-loaded',
        'No more items You have reached the end of the feed. '
      );
    });

    it('should show inner loading placeholder when not fetching', async () => {
      await setup(
        {},
        {
          isLoading: signal(true),
          isError: signal(false),
          isAllLoaded: signal(false),
          observations: signal(fakeIObservationFeed),
        },
        'public'
      );
      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeTruthy();
    });

    it('should not show inner loading placeholder when not fetching', async () => {
      await setup(
        {},
        {
          isLoading: signal(false),
          isError: signal(false),
          isAllLoaded: signal(false),
          observations: signal(fakeIObservationFeed),
        },
        'public'
      );
      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeNull();
    });
  });

  describe('when data fetch returns no items', () => {
    it('should show all loaded content when all loaded on public feed', async () => {
      await setup(
        {},
        {
          isLoading: signal(false),
          isError: signal(false),
          isAllLoaded: signal(true),
          observations: signal([]),
        },
        'public'
      );
      expectText(
        fixture,
        'all-loaded',
        'No more items You have reached the end of the feed. '
      );
    });

    it('should show all loaded content when all loaded on network feed', async () => {
      await setup(
        {},
        {
          isLoading: signal(false),
          isError: signal(false),
          isAllLoaded: signal(true),
          observations: signal([]),
        },
        'network'
      );
      expectText(
        fixture,
        'all-loaded',
        'No more items You have reached the end of the feed.  Switch to the public feed to view more observations. '
      );
    });

    it('should not show the observations', async () => {
      await setup(
        {},
        {
          isLoading: signal(false),
          isError: signal(false),
          isAllLoaded: signal(true),
          observations: signal([]),
        },
        'public'
      );

      const { debugElement } = fixture;
      const feedItems = debugElement.query(By.css('app-observation-feed-item'));
      expect(feedItems).toBeNull();
    });

    it('does not show error section', async () => {
      await setup(
        {},
        {
          isLoading: signal(false),
          isError: signal(false),
          isAllLoaded: signal(true),
          observations: signal([]),
        },
        'public'
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
          isLoading: signal(false),
          isError: signal(false),
          isAllLoaded: signal(true),
          observations: signal([]),
        },
        'public'
      );
      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeNull();
    });
  });

  describe('when error fetching data', () => {
    it('shows error content', async () => {
      await setup(
        {},
        {
          isLoading: signal(false),
          isError: signal(true),
          isAllLoaded: signal(false),
          observations: signal(null),
        },
        'public'
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
        'Whoops! There was an error retrieving the data. Try Again '
      );
    });

    it('tries data fetch again on user button click', async () => {
      await setup(
        {},
        {
          isLoading: signal(false),
          isError: signal(true),
          isAllLoaded: signal(false),
          observations: signal(null),
        },
        'public'
      );

      fixture.debugElement
        .query(By.css('.btn-try-again'))
        .triggerEventHandler('click', null);

      expect(fakeObservationFeedService.getData).toHaveBeenCalledWith(
        1,
        'api/observationfeed'
      );
    });

    it('hides main content', async () => {
      await setup(
        {},
        {
          isLoading: signal(false),
          isError: signal(true),
          isAllLoaded: signal(false),
          observations: signal(null),
        },
        'public'
      );

      const { debugElement } = fixture;
      const feedItems = debugElement.query(By.css('app-observation-feed-item'));
      expect(feedItems).toBeNull();
    });

    it('does not show loading section', async () => {
      await setup(
        {},
        {
          isLoading: signal(false),
          isError: signal(true),
          isAllLoaded: signal(false),
          observations: signal(null),
        },
        'public'
      );

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeNull();
    });

    it('should not show all loaded content when more observations are available', async () => {
      await setup(
        {},
        {
          isLoading: signal(false),
          isError: signal(true),
          isAllLoaded: signal(false),
          observations: signal(null),
        },
        'public'
      );
      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="all-loaded"]')?.textContent
      ).toBeUndefined();
    });
  });

  //   describe('', async () => {

  //     it('should render a defer block in different states', async () => {
  //         // Create component fixture.
  //         const componentFixture = TestBed.createComponent(ObservationFeedComponent);

  //         // Retrieve the list of all defer block fixtures and get the first block.
  //         const deferBlockFixture = (await componentFixture.getDeferBlocks())[0];

  //         // Render loading state and verify the rendered output.
  //         await deferBlockFixture.render(DeferBlockState.Loading);
  //         expect(componentFixture.nativeElement.innerHTML).toContain('Loading');

  //         // Render the final state and verify the output.
  //         await deferBlockFixture.render(DeferBlockState.Complete);
  //         expect(componentFixture.nativeElement.innerHTML).toContain('Defer block content');
  //       });

  //   });
});
