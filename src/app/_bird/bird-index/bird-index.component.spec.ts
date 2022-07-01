import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { fakeIBirdArray } from 'src/app/testing/birds-helpers';
import { findComponent } from 'src/app/testing/element.spec-helper';
import { BirdIndexComponent } from './bird-index.component';
import { BirdIndexService } from './bird-index.service';

describe('BirdIndexComponent unit tests', () => {

  describe('opens loading placeholder by default', () => {
      let fixture: ComponentFixture<BirdIndexComponent>;
      let debugElement: DebugElement;
      let fakeBirdIndexService: BirdIndexService;

      beforeEach(async () => {

          fakeBirdIndexService = jasmine.createSpyObj<BirdIndexService>(
              'BirdIndexService',
              {
                  getData: undefined,
              },
              {
                  isLoading: of(false),
                  isError: of(false),
                  getBirds: undefined,
                  getTotalItems: undefined
              }
          );

          await TestBed.configureTestingModule({
              declarations: [
                  BirdIndexComponent
              ],
              schemas: [NO_ERRORS_SCHEMA]
          })
          .overrideComponent(BirdIndexComponent,
            {
              set: {
                providers: [{ provide: BirdIndexService, useValue: fakeBirdIndexService }]
              }
            })
          .compileComponents();

          fixture = TestBed.createComponent(BirdIndexComponent);
          //fixture.detectChanges();
          debugElement = fixture.debugElement;
      });


      it('should create the app', () => {
          const component = fixture.componentInstance;
          expect(component).toBeTruthy();
      });


      it('should show loading child component', () => {
          fixture.detectChanges();

          // Test without the helper
          const { debugElement } = fixture;
          const loading = debugElement.query(By.css('app-loading'));
          expect(loading).toBeTruthy();

          // Test using the spec-helper function
          const loading1 = findComponent(fixture, 'app-loading');
          expect(loading1).toBeTruthy();
      });
  });

  describe('BirdIndexComponent service is called successfully with count > 0', () => {

      // beforeEach(() => {
      //   fixture.detectChanges();
      // });

      let fixture: ComponentFixture<BirdIndexComponent>;
      let debugElement: DebugElement;
      let fakeBirdIndexService: BirdIndexService;

      beforeEach(async () => {

          fakeBirdIndexService = jasmine.createSpyObj<BirdIndexService>(
              'BirdIndexService',
              {
                  getData: undefined,
              },
              {
                  isLoading: of(false),
                  isError: of(false),
                  getBirds: of(fakeIBirdArray),
                  getTotalItems: undefined //
              }
          );

          await TestBed.configureTestingModule({
              declarations: [
                  BirdIndexComponent
              ],
              schemas: [NO_ERRORS_SCHEMA]
          })
          .overrideComponent(BirdIndexComponent,
            {
              set: {
                providers: [{ provide: BirdIndexService, useValue: fakeBirdIndexService }]
              }
            })
          .compileComponents();

          fixture = TestBed.createComponent(BirdIndexComponent);
          fixture.detectChanges();
          debugElement = fixture.debugElement;
      });

      it('should call getData on init', () => {
          expect(fakeBirdIndexService.getData).toHaveBeenCalled();
          expect(fakeBirdIndexService.getData).toHaveBeenCalledTimes(1);
      });

      it('should render the birds index for count >1', fakeAsync(() => {
          const compiled = fixture.nativeElement as HTMLElement;
          tick();

          expect(compiled.querySelector('[data-testid="main-content"]')?.textContent).toBeDefined();
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

  describe('BirdIndexComponent service is called successfully with count = 0', () => {

    let fixture: ComponentFixture<BirdIndexComponent>;
    let debugElement: DebugElement;
    let fakeBirdIndexService: BirdIndexService;

    beforeEach(async () => {

        fakeBirdIndexService = jasmine.createSpyObj<BirdIndexService>(
            'BirdIndexService',
            {
                getData: undefined,
            },
            {
                isLoading: of(false),
                isError: of(false),
                getBirds: of([]),
                getTotalItems: undefined //
            }
        );

        await TestBed.configureTestingModule({
            declarations: [
                BirdIndexComponent
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .overrideComponent(BirdIndexComponent,
          {
            set: {
              providers: [{ provide: BirdIndexService, useValue: fakeBirdIndexService }]
            }
          })
        .compileComponents();

        fixture = TestBed.createComponent(BirdIndexComponent);
        fixture.detectChanges();
        debugElement = fixture.debugElement;
    });

    it('should call getData on init', () => {
        expect(fakeBirdIndexService.getData).toHaveBeenCalled();
        expect(fakeBirdIndexService.getData).toHaveBeenCalledTimes(1);
    });

    it('should render the error section for count = 0', fakeAsync(() => {
        const compiled = fixture.nativeElement as HTMLElement;
        tick();

        expect(compiled.querySelector('[data-testid="error-content-zero"]')?.textContent).toBeDefined();
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


  describe('BirdIndexComponent - test when error', () => {
      let fixture: ComponentFixture<BirdIndexComponent>;
      let debugElement: DebugElement;
      let fakeBirdIndexService: BirdIndexService;

      beforeEach(async () => {

          fakeBirdIndexService = jasmine.createSpyObj<BirdIndexService>(
              'BirdIndexService',
              {
                  getData: undefined,
              },
              {
                  isLoading: of(false),
                  isError: of(true),
                  getBirds: undefined,
                  getTotalItems: undefined //
              }
          );

          await TestBed.configureTestingModule({
              declarations: [
                  BirdIndexComponent
              ],
              schemas: [NO_ERRORS_SCHEMA]
          })
          .overrideComponent(BirdIndexComponent,
            {
              set: {
                providers: [{ provide: BirdIndexService, useValue: fakeBirdIndexService }]
              }
            })
          .compileComponents();

          fixture = TestBed.createComponent(BirdIndexComponent);
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
          expect(compiled.querySelector('[data-testid="main-content"]')?.textContent).toBeUndefined();
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


  describe('BirdIndexComponent - test loading placeholder', () => {
      let fixture: ComponentFixture<BirdIndexComponent>;
      let debugElement: DebugElement;
      let fakeBirdIndexService: BirdIndexService;

      beforeEach(async () => {

          fakeBirdIndexService = jasmine.createSpyObj<BirdIndexService>(
              'BirdIndexService',
              {
                  getData: undefined,
              },
              {
                  isLoading: of(true),
                  isError: of(false),
                  getBirds: undefined,
                  getTotalItems: undefined //
              }
          );

          await TestBed.configureTestingModule({
              declarations: [
                  BirdIndexComponent
              ],
              schemas: [NO_ERRORS_SCHEMA]
          })
          .overrideComponent(BirdIndexComponent,
            {
              set: {
                providers: [{ provide: BirdIndexService, useValue: fakeBirdIndexService }]
              }
            })
          .compileComponents();

          fixture = TestBed.createComponent(BirdIndexComponent);
          fixture.detectChanges();
          debugElement = fixture.debugElement;
      });


      it('shows loading content', () => {
          const loading = findComponent(fixture, 'app-loading');
          expect(loading).toBeTruthy();
      });

      it('should not show main content', () => {
          const compiled = fixture.nativeElement as HTMLElement;
          expect(compiled.querySelector('[data-testid="main-content"]')?.textContent).toBeUndefined();
      });

      it('should not show error content', () => {
          const compiled = fixture.nativeElement as HTMLElement;
          expect(compiled.querySelector('[data-testid="error-content"]')?.textContent).toBeUndefined();
      });
  });
});