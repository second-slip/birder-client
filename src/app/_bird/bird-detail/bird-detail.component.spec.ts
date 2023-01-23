import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { findComponent } from 'src/app/testing/element.spec-helper'

import { BirdDetailComponent } from './bird-detail.component';
import { BirdDetailService } from './bird-detail.service';

import { NavigationService } from '../../_sharedServices/navigation.service';
import { fakeIBirdDetail } from 'src/app/testing/birds-helpers';
import { ActivatedRoute } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

describe('BirdDetailComponent unit tests', () => {
    let fakeNavService: NavigationService;

    fakeNavService = jasmine.createSpyObj<NavigationService>(
        'NavigationService',
        {
            back: undefined
        }
    );

    describe('BirdDetailComponent - opens loading placeholder by default', () => {
        let fixture: ComponentFixture<BirdDetailComponent>;
        let debugElement: DebugElement;
        let fakeBirdDetailService: BirdDetailService;
        // let fakeNavService: NavigationService;

        beforeEach(async () => {

            // fakeNavService = jasmine.createSpyObj<NavigationService>(
            //     'NavigationService',
            //     {
            //         back: undefined
            //     }
            // );

            fakeBirdDetailService = jasmine.createSpyObj<BirdDetailService>(
                'BirdDetailService',
                {
                    getData: undefined,
                },
                {
                    isError: of(false),
                    getBird: undefined //of(fakeITweet)
                }
            );

            await TestBed.configureTestingModule({
                declarations: [
                    BirdDetailComponent
                ],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [
                    {
                        provide: ActivatedRoute,
                        useValue: {
                            paramMap: of({ id: 123 })
                        }
                    },
                    {
                        provide: NavigationService,
                        useValue: fakeNavService
                    }
                ]
            })
                .overrideComponent(BirdDetailComponent,
                    {
                        set: {
                            providers: [{ provide: BirdDetailService, useValue: fakeBirdDetailService }]
                        }
                    })
                .compileComponents();

            fixture = TestBed.createComponent(BirdDetailComponent);
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

    describe('BirdDetailComponent service is called successfully', () => {

        // beforeEach(() => {
        //   fixture.detectChanges();
        // });

        let fixture: ComponentFixture<BirdDetailComponent>;
        let debugElement: DebugElement;
        let fakeBirdDetailService: BirdDetailService;

        beforeEach(async () => {

            fakeBirdDetailService = jasmine.createSpyObj<BirdDetailService>(
                'BirdDetailService',
                {
                    getData: undefined,
                },
                {
                    isError: of(false),
                    getBird: of(fakeIBirdDetail)
                }
            );

            await TestBed.configureTestingModule({
                imports: [NgbNavModule],
                declarations: [
                    BirdDetailComponent
                ],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [
                    {
                        provide: ActivatedRoute,
                        useValue: {
                            paramMap: of({ id: 123 })
                        }
                    },
                    {
                        provide: NavigationService,
                        useValue: fakeNavService
                    }
                ]
            })
                .overrideComponent(BirdDetailComponent,
                    {
                        set: {
                            providers: [{ provide: BirdDetailService, useValue: fakeBirdDetailService },
                            {
                                provide: ActivatedRoute,
                                useValue: {
                                    paramMap: of({ id: 123 })
                                }
                            }]
                        }
                    })


                .compileComponents();

            fixture = TestBed.createComponent(BirdDetailComponent);
            fixture.detectChanges();
            debugElement = fixture.debugElement;
        });

        // ToDo: not called due to guard?
        
        // it('should call getData on init', () => {
        //     expect(fakeBirdDetailService.getData).toHaveBeenCalled();
        //     expect(fakeBirdDetailService.getData).toHaveBeenCalledTimes(1);
        // });

        it('should render the Bird', fakeAsync(() => {
            const compiled = fixture.nativeElement as HTMLElement;
            tick();

            expect(compiled.querySelector('[data-testid="main-title"]')?.textContent).toBeDefined();
            expect(compiled.querySelector('[data-testid="main-title"]')?.textContent).toContain('Black Guillemot Cepphus grylle');
        }));

        it('should render the Bird child component', fakeAsync(() => {
            const feed = findComponent(fixture, 'app-bird-info');
            expect(feed).toBeTruthy();
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


    describe('BirdDetailComponent - test when error', () => {
        let fixture: ComponentFixture<BirdDetailComponent>;
        let debugElement: DebugElement;
        let fakeBirdDetailService: BirdDetailService;

        beforeEach(async () => {

            fakeBirdDetailService = jasmine.createSpyObj<BirdDetailService>(
                'BirdDetailService',
                {
                    getData: undefined,
                },
                {
                    isError: of(true),
                    getBird: undefined
                }
            );

            await TestBed.configureTestingModule({
                declarations: [
                    BirdDetailComponent
                ],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [
                    {
                        provide: ActivatedRoute,
                        useValue: {
                            paramMap: of({ id: 123 })
                        }
                    },
                    {
                        provide: NavigationService,
                        useValue: fakeNavService
                    }
                ]
            })
                .overrideComponent(BirdDetailComponent,
                    {
                        set: {
                            providers: [{ provide: BirdDetailService, useValue: fakeBirdDetailService }]
                        }
                    })

                .compileComponents();

            fixture = TestBed.createComponent(BirdDetailComponent);
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


    describe('BirdDetailComponent - test loading placeholder', () => {
        let fixture: ComponentFixture<BirdDetailComponent>;
        let debugElement: DebugElement;
        let fakeBirdDetailService: BirdDetailService;

        beforeEach(async () => {

            fakeBirdDetailService = jasmine.createSpyObj<BirdDetailService>(
                'BirdDetailService',
                {
                    getData: undefined,
                },
                {
                    isError: of(false),
                    getBird: undefined
                }
            );

            await TestBed.configureTestingModule({
                declarations: [
                    BirdDetailComponent
                ],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [
                    {
                        provide: ActivatedRoute,
                        useValue: {
                            paramMap: of({ id: 123 })
                        }
                    },
                    {
                        provide: NavigationService,
                        useValue: fakeNavService
                    }
                ]
            })
                .overrideComponent(BirdDetailComponent,
                    {
                        set: {
                            providers: [{ provide: BirdDetailService, useValue: fakeBirdDetailService }]
                        }
                    })

                .compileComponents();

            fixture = TestBed.createComponent(BirdDetailComponent);
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