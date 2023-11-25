import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { fakeIObservationCount } from 'src/app/testing/analysis-helpers';
import { expectText } from 'src/app/testing/element.spec-helper';
import { username, userProfileModel } from 'src/app/testing/userProfile-tests-helpers';
import { ObservationCountService } from 'src/app/_analysis/observation-count/observation-count.service';
import { IUserProfile } from './i-user-profile.dto';

import { UserProfileComponent } from './user-profile.component';
import { UserProfileService } from './user-profile.service';

describe('UserProfileComponent', () => {
    let component: UserProfileComponent;
    let fixture: ComponentFixture<UserProfileComponent>;

    let fakeService: jasmine.SpyObj<UserProfileService>;
    let fakeCountService: jasmine.SpyObj<ObservationCountService>;

    let fakeRouteArgument = username;

    const setup = async (fakePropertyValues?: jasmine.SpyObjPropertyNames<UserProfileService>) => {

        fakeService = jasmine.createSpyObj<UserProfileService>(
            'NetworkSummaryService',
            {
                getData: undefined
            },
            {
                isError: of(false),
                getUserProfile: of(null),
                ...fakePropertyValues
            }
        );

        fakeCountService = jasmine.createSpyObj<ObservationCountService>(
            'ObservationCountService',
            {
                getData: undefined,
            },
            {
                isError: of(false),
                count: of(fakeIObservationCount)
            }
        );

        await TestBed.configureTestingModule({
    providers: [
        { provide: ObservationCountService, useValue: fakeCountService },
        {
            provide: ActivatedRoute,
            useValue: {
                paramMap: of(new Map(Object.entries({
                    username: fakeRouteArgument
                })))
                // needs to be a 'Map' object otherwise "map.get is not a function" error occurs
                // see: https://bobbyhadz.com/blog/javascript-typeerror-map-get-is-not-a-function#:~:text=get%20is%20not%20a%20function%22%20error%20occurs%20when%20we%20call,the%20method%20on%20Map%20objects.
            }
        }
    ],
    imports: [NgbNavModule, UserProfileComponent],
}).overrideComponent(UserProfileComponent,
            {
                set: {
                    providers: [
                        { provide: UserProfileService, useValue: fakeService }
                    ]
                }
            }).compileComponents();

        fixture = TestBed.createComponent(UserProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    describe('when component is instantiated', () => {

        it('"SMOKE TEST": should be created and show the loading placeloader', fakeAsync(async () => {
            await setup({});

            expect(component).toBeTruthy();
            const { debugElement } = fixture;
            const loading = debugElement.query(By.css('app-loading'));
            expect(loading).toBeTruthy();
        }));

        it('calls data fetch service method', fakeAsync(async () => {
            await setup({});

            expect(fakeService.getData).toHaveBeenCalledOnceWith(username);
        }));

    });

    describe('when the response is successful', () => {

        it('shows the user profile', fakeAsync(async () => {
            await setup({
                getUserProfile: of(userProfileModel)
            });

            const compiled = fixture.nativeElement as HTMLElement;
            expect(compiled.querySelector('[data-testid="user-profile"]')?.textContent).toBeDefined();

            expectText(fixture, 'h1-user-name', username);
        }));

        it('shows the network summary', fakeAsync(async () => {
            await setup({
                getUserProfile: of(userProfileModel)
            });

            const compiled = fixture.nativeElement as HTMLElement;
            expect(compiled.querySelector('[data-testid="network-summary"]')?.textContent).toBeDefined();

            const summaryText = `${userProfileModel.followersCount} follower / ${userProfileModel.followingCount} following`;
            expectText(fixture, 'network-summary', summaryText);
        }));

        describe('when viewing OWN PROFILE', () => {

            it('shows the observations count summary from the ObservationCountService', fakeAsync(async () => {
                await setup({
                    getUserProfile: of(userProfileModel)
                });

                const compiled = fixture.nativeElement as HTMLElement;
                expect(compiled.querySelector('[data-testid="obs-summary-own"]')?.textContent).toBeDefined();

                const summaryText = `${fakeIObservationCount.uniqueSpeciesCount} species in ${fakeIObservationCount.totalObservationsCount} observations`;
                expectText(fixture, 'obs-summary-own', summaryText);
            }));
        });

        describe('when viewing OTHER PROFILE', () => {

            it('shows the observations count summary from userProfileModel', fakeAsync(async () => {
                const otherProfile: IUserProfile = {
                    user: {
                        avatar: "",
                        userName: username,
                        isFollowing: true,
                        isOwnProfile: false // <---
                    },
                    registrationDate: new Date,
                    observationCount: {
                        totalObservationsCount: 80, // <---
                        uniqueSpeciesCount: 50 // <---
                    },
                    followersCount: 1,
                    followingCount: 2
                }


                await setup({
                    getUserProfile: of(otherProfile)
                });

                const compiled = fixture.nativeElement as HTMLElement;
                expect(compiled.querySelector('[data-testid="obs-summary-other"]')?.textContent).toBeDefined();

                const summaryText = `${otherProfile.observationCount.uniqueSpeciesCount} species in ${otherProfile.observationCount.totalObservationsCount} observations`;
                expectText(fixture, 'obs-summary-other', summaryText);
            }));
        });
    });

    describe('when response is unsuccessful', () => {

        it('shows error content', fakeAsync(async () => {
            await setup({
                isError: of(true),
                getUserProfile: of(null)
            });

            const compiled = fixture.nativeElement as HTMLElement;
            expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeDefined();
            expect(compiled.querySelector('[data-testid="reload-button"]')?.textContent).toBeDefined();
            expectText(fixture, 'error', 'Whoops! There was an error retrieving the data.Try Again');
        }));

        it('tries data fetch again on retry button click', fakeAsync(async () => {
            await setup({
                isError: of(true),
                getUserProfile: of(null)
            });

            fixture.debugElement.query(By.css('.btn-try-again')).triggerEventHandler('click', null);

            expect(fakeService.getData).toHaveBeenCalled();
        }));

        it('does not show success content', fakeAsync(async () => {
            await setup({
                isError: of(true),
                getUserProfile: of(null)
            });

            const compiled = fixture.nativeElement as HTMLElement;
            expect(compiled.querySelector('[data-testid="summary"]')?.textContent).toBeUndefined();
        }));

        it('does not show loading section', fakeAsync(async () => {
            await setup({
                isError: of(true),
                getUserProfile: of(null)
            });

            const { debugElement } = fixture;
            const loading = debugElement.query(By.css('app-loading'));
            expect(loading).toBeNull();
        }));
    });
});
