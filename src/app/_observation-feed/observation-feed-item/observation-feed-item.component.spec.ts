import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { of } from 'rxjs';

import { ObservationFeedItemComponent } from './observation-feed-item.component';
import { IObservationFeed } from '../i-observation-feed.dto';
import { IAuthUser } from '../../_auth/i-auth-user.dto';
import { expectText } from 'src/app/testing/element.spec-helper';


describe('ObservationFeedItemComponent', () => {
    let component: ObservationFeedItemComponent;
    let fixture: ComponentFixture<ObservationFeedItemComponent>;

    let fakeAuthService: AuthenticationService;

    const authUser: IAuthUser = {
        userName: 'test',
        avatar: 'testAvatar',
        defaultLocationLatitude: 0.99,
        defaultLocationLongitude: 0.88
    }

    fakeAuthService = jasmine.createSpyObj<AuthenticationService>(
        'AuthenticationService',
        {
            checkAuthStatus: undefined,
            logout: undefined
        },
        {
            isAuthorisedObservable: of(false),
            getAuthUser: of(authUser)
        }
    );

    const fakeIObservationFeedSingleItem: IObservationFeed =
    {
        observationId: 10099,
        quantity: 1,
        observationDateTime: "2021-11-28T17:02:13.527Z",
        birdId: 1002,
        species: "Stercorarius parasiticus",
        englishName: "Arctic Skua",
        thumbnailUrl: "https://farm66.staticflickr.com/65535/52183437764_25d56664db_q.jpg",
        latitude: 53.44244782183897,
        longitude: -2.2773529647976964,
        formattedAddress: "581A Wilbraham Rd, Chorlton-cum-Hardy, Manchester M21 9AF, UK",
        shortAddress: "Manchester, United Kingdom",
        username: "monkey",
        notesCount: 0,
        creationDate: "2021-11-28T17:02:45.1213198Z",
        lastUpdateDate: "2021-11-28T17:02:45.1213198Z"
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ObservationFeedItemComponent],
            providers: [{ provide: AuthenticationService, useValue: fakeAuthService }]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ObservationFeedItemComponent);
        component = fixture.componentInstance;
        component.observation = fakeIObservationFeedSingleItem; // {} as IObservationFeed;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('renders the species name from the Input() object', () => {
        expectText(fixture, 'species-name', String(fakeIObservationFeedSingleItem.species));
    });
});
