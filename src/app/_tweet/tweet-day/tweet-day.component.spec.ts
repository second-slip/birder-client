// import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
// import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

// import { TweetDayComponent } from './tweet-day.component';
// import { TweetDayService } from './tweet-day.service';

// import { of } from 'rxjs';
// import { fakeITweet } from 'src/app/_unit-test-helpers/tweet-day-test-helper';
// import { By } from '@angular/platform-browser';
// import { findComponent } from 'src/app/test-spec-helpers/element.spec-helper';

// describe('TweetDayComponent unit tests', () => {

//   describe('TweetDayComponent - opens loading placeholder by default', () => {
//     let fixture: ComponentFixture<TweetDayComponent>;
//     let debugElement: DebugElement;
//     let fakeTweetDayService: TweetDayService;

//     beforeEach(async () => {

//       fakeTweetDayService = jasmine.createSpyObj<TweetDayService>(
//         'TweetDayService',
//         {
//           getData: undefined,
//         },
//         {
//           isLoading: of(false),
//           isError: of(false),
//           getTweet: undefined //of(fakeITweet)
//         }
//       );

//       await TestBed.configureTestingModule({
//         declarations: [
//           TweetDayComponent
//         ],
//         schemas: [NO_ERRORS_SCHEMA],
//         providers: [
//           { provide: TweetDayService, useValue: fakeTweetDayService }
//         ]
//       }).compileComponents();

//       fixture = TestBed.createComponent(TweetDayComponent);
//       //fixture.detectChanges();
//       debugElement = fixture.debugElement;
//     });


//     it('should create the app', () => {
//       const component = fixture.componentInstance;
//       expect(component).toBeTruthy();
//     });


//     it('XXXXXXX ---should show loading child component', () => {
//       // fixture.detectChanges();
//       // const { debugElement } = fixture;
//       // const loading = debugElement.query(By.css('app-loading'));
//       // expect(loading).toBeTruthy();

//       const loading = findComponent(fixture, 'app-loading');
//       expect(loading).toBeTruthy();
//     });
//   });

//   describe('TweetDayComponent service is called successfully', () => {

//     // beforeEach(() => {
//     //   fixture.detectChanges();
//     // });

//     let fixture: ComponentFixture<TweetDayComponent>;
//     let debugElement: DebugElement;
//     let fakeTweetDayService: TweetDayService;

//     beforeEach(async () => {

//       fakeTweetDayService = jasmine.createSpyObj<TweetDayService>(
//         'TweetDayService',
//         {
//           getData: undefined,
//         },
//         {
//           isLoading: of(false),
//           isError: of(false),
//           getTweet: of(fakeITweet)
//         }
//       );

//       await TestBed.configureTestingModule({
//         declarations: [
//           TweetDayComponent
//         ],
//         schemas: [NO_ERRORS_SCHEMA],
//         providers: [
//           { provide: TweetDayService, useValue: fakeTweetDayService }
//         ]
//       }).compileComponents();

//       fixture = TestBed.createComponent(TweetDayComponent);
//       fixture.detectChanges();
//       debugElement = fixture.debugElement;
//     });

//     it('should call getData on init', () => {
//       expect(fakeTweetDayService.getData).toHaveBeenCalled();
//       expect(fakeTweetDayService.getData).toHaveBeenCalledTimes(1);
//     });

//     it('should render the Tweet', fakeAsync(() => {
//       const compiled = fixture.nativeElement as HTMLElement;
//       tick();

//       expect(compiled.querySelector('[data-testid="main-title"]')?.textContent).toBeDefined();
//       expect(compiled.querySelector('[data-testid="main-title"]')?.textContent).toContain('Tweet of the Day');
//       expect(compiled.querySelector('[data-testid="english-name"]')?.textContent).toContain('Lapwing');
//       expect(compiled.querySelector('[data-testid="scientific-name"]')?.textContent).toContain('Vanellus vanellus');
//     }));


//     it('should not show loading child component', () => {
//       const { debugElement } = fixture;
//       const loading = debugElement.query(By.css('app-loading'));
//       expect(loading).toBeFalsy();
//     });

//     it('should not show error content', () => {
//       const compiled = fixture.nativeElement as HTMLElement;
//       expect(compiled.querySelector('[data-testid="error-content"]')?.textContent).toBeUndefined();
//     });
//   });


//   describe('TweetDayComponent - test when error', () => {
//     let fixture: ComponentFixture<TweetDayComponent>;
//     let debugElement: DebugElement;
//     let fakeTweetDayService: TweetDayService;

//     beforeEach(async () => {

//       fakeTweetDayService = jasmine.createSpyObj<TweetDayService>(
//         'TweetDayService',
//         {
//           getData: undefined,
//         },
//         {
//           isLoading: of(false),
//           isError: of(true),
//           getTweet: undefined //of(fakeITweet)
//         }
//       );

//       await TestBed.configureTestingModule({
//         declarations: [
//           TweetDayComponent
//         ],
//         schemas: [NO_ERRORS_SCHEMA],
//         providers: [
//           { provide: TweetDayService, useValue: fakeTweetDayService }
//         ]
//       }).compileComponents();

//       fixture = TestBed.createComponent(TweetDayComponent);
//       fixture.detectChanges();
//       debugElement = fixture.debugElement;
//     });

//     it('hides loading content', () => {
//       const { debugElement } = fixture;
//       const loading = debugElement.query(By.css('app-loading'));
//       expect(loading).toBeFalsy();
//     });

//     it('hides main content', () => {
//       const compiled = fixture.nativeElement as HTMLElement;
//       expect(compiled.querySelector('[data-testid="main-title"]')?.textContent).toBeUndefined();
//     });

//     it('shows error content', () => {
//       const compiled = fixture.nativeElement as HTMLElement;
//       expect(compiled.querySelector('[data-testid="error-content"]')?.textContent).toBeDefined();
//       expect(compiled.querySelector('[data-testid="reload-button"]')?.textContent).toBeDefined();
//       expect(compiled.querySelector('[data-testid="error-content"]')?.textContent).toContain('Whoops');
//     });

//     // 
//     it('error reload button on click calls reload()', fakeAsync(() => {
//       // Arrange
//       const component = fixture.componentInstance;
//       const reloadMethod = spyOn(component, 'reload');
//       const incrementButton = debugElement.query(
//         By.css('[data-testid="reload-button"]')
//       );
  
//       // Act
//       incrementButton.triggerEventHandler('click', null);
  
//       tick();
  
//       // Assert
//       expect(reloadMethod).toHaveBeenCalled();
//     }));
//   });


//   describe('TweetDayComponent - test loading placeholder', () => {
//     let fixture: ComponentFixture<TweetDayComponent>;
//     let debugElement: DebugElement;
//     let fakeTweetDayService: TweetDayService;

//     beforeEach(async () => {

//       fakeTweetDayService = jasmine.createSpyObj<TweetDayService>(
//         'TweetDayService',
//         {
//           getData: undefined,
//         },
//         {
//           isLoading: of(true),
//           isError: of(false),
//           getTweet: undefined //of(fakeITweet)
//         }
//       );

//       await TestBed.configureTestingModule({
//         declarations: [
//           TweetDayComponent
//         ],
//         schemas: [NO_ERRORS_SCHEMA],
//         providers: [
//           { provide: TweetDayService, useValue: fakeTweetDayService }
//         ]
//       }).compileComponents();

//       fixture = TestBed.createComponent(TweetDayComponent);
//       fixture.detectChanges();
//       debugElement = fixture.debugElement;
//     });


//     it('shows loading content', () => {
//       const { debugElement } = fixture;
//       const loading = debugElement.query(By.css('app-loading'));
//       expect(loading).toBeTruthy();
//     });

//     it('should not show main content', () => {
//       const compiled = fixture.nativeElement as HTMLElement;
//       expect(compiled.querySelector('[data-testid="main-title"]')?.textContent).toBeUndefined();
//     });

//     it('should not show error content', () => {
//       const compiled = fixture.nativeElement as HTMLElement;
//       expect(compiled.querySelector('[data-testid="error-content"]')?.textContent).toBeUndefined();
//     });
//   });
// });