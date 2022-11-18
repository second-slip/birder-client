import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { fakeIObservationTopFive, fakeIObservationTopFiveEmpty } from 'src/app/testing/analysis-helpers';
import { findComponent } from 'src/app/testing/element.spec-helper';

import { ObservationTopFiveComponent } from './observation-top-five.component';
import { ObservationTopFiveService } from './observation-top-five.service';
import { AuthenticationService } from 'src/app/_auth/authentication.service';

describe('ObservationTopFiveComponent unit tests', () => {
  let fakeAuthService: AuthenticationService;

  fakeAuthService = jasmine.createSpyObj<AuthenticationService>(
    'AuthenticationService',
    {
      checkAuthStatus: undefined,
      logout: undefined
    },
    {
      isAuthorisedObservable: of(false),
      getAuthUser: of(null)
    }
  )

  describe('ObservationTopFiveComponent - opens loading placeholder by default', () => {
    let fixture: ComponentFixture<ObservationTopFiveComponent>;
    let debugElement: DebugElement;
    let fakeObservationTopFiveService: ObservationTopFiveService;

    beforeEach(async () => {

      fakeObservationTopFiveService = jasmine.createSpyObj<ObservationTopFiveService>(
        'ObservationTopFiveService',
        {
          getData: undefined,
        },
        {
          isLoading: of(false),
          isError: of(false),
          getTop: undefined
        }
      );

      await TestBed.configureTestingModule({
        declarations: [
          ObservationTopFiveComponent
        ],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [NgbNavModule],
        providers: [
          { provide: ObservationTopFiveService, useValue: fakeObservationTopFiveService },
          { provide: AuthenticationService, useValue: fakeAuthService }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ObservationTopFiveComponent);
      //fixture.detectChanges();
      debugElement = fixture.debugElement;
    });


    it('should create the app', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });

    it('should show loading child component', () => {
      fixture.detectChanges();
      const loading = findComponent(fixture, 'app-loading');
      expect(loading).toBeTruthy();
    });
  });

  describe('ObservationTopFiveComponent service is called successfully with count > 0', () => {

    // beforeEach(() => {
    //   fixture.detectChanges();
    // });

    let fixture: ComponentFixture<ObservationTopFiveComponent>;
    let debugElement: DebugElement;
    let fakeObservationTopFiveService: ObservationTopFiveService;

    beforeEach(async () => {

      fakeObservationTopFiveService = jasmine.createSpyObj<ObservationTopFiveService>(
        'ObservationTopFiveService',
        {
          getData: undefined,
        },
        {
          isLoading: of(false),
          isError: of(false),
          getTop: of(fakeIObservationTopFive)
        }
      );

      await TestBed.configureTestingModule({
        declarations: [
          ObservationTopFiveComponent
        ],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [NgbNavModule],
        providers: [
          { provide: ObservationTopFiveService, useValue: fakeObservationTopFiveService },
          { provide: AuthenticationService, useValue: fakeAuthService }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ObservationTopFiveComponent);
      fixture.detectChanges();
      debugElement = fixture.debugElement;
    });

    it('should call getData on init', () => {
      expect(fakeObservationTopFiveService.getData).toHaveBeenCalled();
      expect(fakeObservationTopFiveService.getData).toHaveBeenCalledTimes(1);
    });

    it('should render the analysis section for count >1', fakeAsync(() => {
      const compiled = fixture.nativeElement as HTMLElement;
      tick();

      expect(compiled.querySelector('[data-testid="top-five-content"]')?.textContent).toBeDefined();
      //expect(compiled.querySelector('[data-testid="analysis-text"]')?.textContent).toContain('You have spotted 57');

      expect(compiled.querySelector('[data-testid="top-five-content-zero"]')?.textContent).toBeUndefined();
    }));


    it('should not show loading child component', () => {
      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeFalsy();
    });

    it('should not show error content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="error-content"]')?.textContent).toBeUndefined();
    });
  });

  describe('ObservationTopFiveComponent service is called successfully with count = 0', () => {

    let fixture: ComponentFixture<ObservationTopFiveComponent>;
    let debugElement: DebugElement;
    let fakeObservationTopFiveService: ObservationTopFiveService;

    beforeEach(async () => {

      fakeObservationTopFiveService = jasmine.createSpyObj<ObservationTopFiveService>(
        'ObservationTopFiveService',
        {
          getData: undefined,
        },
        {
          isLoading: of(false),
          isError: of(false),
          getTop: of(fakeIObservationTopFiveEmpty)
        }
      );

      await TestBed.configureTestingModule({
        declarations: [
          ObservationTopFiveComponent
        ],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [NgbNavModule],
        providers: [
          { provide: ObservationTopFiveService, useValue: fakeObservationTopFiveService },
          { provide: AuthenticationService, useValue: fakeAuthService }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ObservationTopFiveComponent);
      fixture.detectChanges();
      debugElement = fixture.debugElement;
    });

    it('should call getData on init', () => {
      expect(fakeObservationTopFiveService.getData).toHaveBeenCalled();
      expect(fakeObservationTopFiveService.getData).toHaveBeenCalledTimes(1);
    });

    it('should render the analysis section for count = 0', fakeAsync(() => {
      const compiled = fixture.nativeElement as HTMLElement;
      tick();

      expect(compiled.querySelector('[data-testid="top-five-content-zero"]')?.textContent).toBeDefined();
      //expect(compiled.querySelector('[data-testid="analysis-zero-text"]')?.textContent).toContain('You have not yet logged any observations');
      expect(compiled.querySelector('[data-testid="top-five-content"]')?.textContent).toBeUndefined();
    }));


    it('should not show loading child component', () => {
      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeFalsy();
    });

    it('should not show error content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="error-content"]')?.textContent).toBeUndefined();
    });
  });


  describe('ObservationTopFiveComponent - test when error', () => {
    let fixture: ComponentFixture<ObservationTopFiveComponent>;
    let debugElement: DebugElement;
    let fakeObservationTopFiveService: ObservationTopFiveService;

    beforeEach(async () => {

      fakeObservationTopFiveService = jasmine.createSpyObj<ObservationTopFiveService>(
        'ObservationTopFiveService',
        {
          getData: undefined,
        },
        {
          isLoading: of(false),
          isError: of(true),
          getTop: undefined //of(fakeITweet)
        }
      );

      await TestBed.configureTestingModule({
        declarations: [
          ObservationTopFiveComponent
        ],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [NgbNavModule],
        providers: [
          { provide: ObservationTopFiveService, useValue: fakeObservationTopFiveService },
          { provide: AuthenticationService, useValue: fakeAuthService }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ObservationTopFiveComponent);
      fixture.detectChanges();
      debugElement = fixture.debugElement;
    });

    it('hides loading content', () => {
      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeFalsy();
    });

    it('hides main content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="main-title"]')?.textContent).toBeUndefined();
    });

    it('shows error content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="error-content"]')?.textContent).toBeDefined();
      expect(compiled.querySelector('[data-testid="reload-button"]')?.textContent).toBeDefined();
      expect(compiled.querySelector('[data-testid="error-content"]')?.textContent).toContain('Whoops');
    });

    // 
    it('error reload button on click calls reload()', fakeAsync(() => {
      // Arrange
      const component = fixture.componentInstance;
      const reloadMethod = spyOn(component, 'reload');
      const incrementButton = debugElement.query(
        By.css('[data-testid="reload-button"]')
      );

      // Act
      incrementButton.triggerEventHandler('click', null);

      tick();

      // Assert
      expect(reloadMethod).toHaveBeenCalled();
    }));
  });


  describe('ObservationTopFiveComponent - test loading placeholder', () => {
    let fixture: ComponentFixture<ObservationTopFiveComponent>;
    let debugElement: DebugElement;
    let fakeObservationTopFiveService: ObservationTopFiveService;

    beforeEach(async () => {

      fakeObservationTopFiveService = jasmine.createSpyObj<ObservationTopFiveService>(
        'ObservationTopFiveService',
        {
          getData: undefined,
        },
        {
          isLoading: of(true),
          isError: of(false),
          getTop: undefined //of(fakeITweet)
        }
      );

      await TestBed.configureTestingModule({
        declarations: [
          ObservationTopFiveComponent
        ],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [NgbNavModule],
        providers: [
          { provide: ObservationTopFiveService, useValue: fakeObservationTopFiveService },
          { provide: AuthenticationService, useValue: fakeAuthService }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ObservationTopFiveComponent);
      fixture.detectChanges();
      debugElement = fixture.debugElement;
    });


    it('shows loading content', () => {
      const loading = findComponent(fixture, 'app-loading');
      expect(loading).toBeTruthy();
    });

    it('should not show main content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="main-title"]')?.textContent).toBeUndefined();
    });

    it('should not show error content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="error-content"]')?.textContent).toBeUndefined();
    });
  });
});
