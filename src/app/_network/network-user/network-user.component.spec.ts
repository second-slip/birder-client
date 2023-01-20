import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { expectText } from 'src/app/testing/element.spec-helper';
import { fakeNetworkUserModel, userName } from 'src/app/testing/network-test-helpers';
import { AnnounceChangesService } from 'src/app/_sharedServices/announce-changes.service';
import { INetworkUser } from '../i-network-user.dto';

import { NetworkUserComponent } from './network-user.component';
import { NetworkUserService } from './network-user.service';

describe('NetworkUserComponent', () => {
  let component: NetworkUserComponent;
  let fixture: ComponentFixture<NetworkUserComponent>;

  let fakeService: jasmine.SpyObj<NetworkUserService>;
  let fakeAnnounceChangesService: jasmine.SpyObj<AnnounceChangesService>;

  const setup = async (
    user: INetworkUser,
    fakeMethodValues?: jasmine.SpyObjMethodNames<NetworkUserService>) => {

    fakeService = jasmine.createSpyObj<NetworkUserService>(
      'NetworkUserService',
      {
        postFollowUser: undefined,
        postUnfollowUser: undefined,
        ...fakeMethodValues
      });

    fakeAnnounceChangesService = jasmine.createSpyObj<AnnounceChangesService>(
      'AnnounceChangesService',
      {
        announceNetworkChanged: undefined,
        announceObservationsChanged: undefined
      });

    await TestBed.configureTestingModule({
      declarations: [
        NetworkUserComponent
      ],
      providers: [
        { provide: NetworkUserService, useValue: fakeService },
        { provide: AnnounceChangesService, useValue: fakeAnnounceChangesService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkUserComponent);
    component = fixture.componentInstance;
    component.user = user;
    fixture.detectChanges();
  };

  describe('when the component is rendered', () => {

    it('"SMOKE TEST": should be created and show the loading placeloader', fakeAsync(async () => {
      await setup(fakeNetworkUserModel);
      expect(component).toBeTruthy();
    }));

    it('it sets the @input', fakeAsync(async () => {
      await setup(fakeNetworkUserModel);
      expect(component.user).toBe(fakeNetworkUserModel)
    }));

    it('it shows the username', fakeAsync(async () => {
      await setup(fakeNetworkUserModel);
      expect(component.user).toBe(fakeNetworkUserModel)
      expectText(fixture, 'username', ` ${userName} `);
    }));
  });

  describe('when own profile', () => {

    it('it hides the "follow/unfollow" button', fakeAsync(async () => {
      const user: INetworkUser = {
        userName: userName,
        avatar: 'https://img.icons8.com/color/96/000000/user.png',
        isFollowing: false,
        isOwnProfile: true // <--
      };
      await setup(user);

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="follow-button"]')?.textContent).toBeUndefined();
    }));

  });

  describe('when other user profile', () => {

    it('it shows the "follow/unfollow" button', fakeAsync(async () => {
      const user: INetworkUser = {
        userName: userName,
        avatar: 'https://img.icons8.com/color/96/000000/user.png',
        isFollowing: false,
        isOwnProfile: false // <--
      };
      await setup(user);


      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="follow-button"]')?.textContent).toBeDefined();

      expectText(fixture, 'follow-button', ' Follow');
    }));

    it('follows user on button click and changes the button text', fakeAsync(async () => {

      const user: INetworkUser = {
        userName: userName,
        avatar: 'https://img.icons8.com/color/96/000000/user.png',
        isFollowing: false, // <-- not following
        isOwnProfile: false // <--
      };

      const userReturned: INetworkUser = {
        userName: userName,
        avatar: 'https://img.icons8.com/color/96/000000/user.png',
        isFollowing: true, // <-- following
        isOwnProfile: false
      };

      await setup(user, {
        postFollowUser: of(userReturned)
      });

      // initial button text
      expectText(fixture, 'follow-button', ' Follow');

      // button click...
      fixture.debugElement.query(By.css('.btn-follow')).triggerEventHandler('click', null);

      //..should call method
      expect(fakeService.postFollowUser).toHaveBeenCalled();

      fixture.detectChanges();
      //... and change button text
      expectText(fixture, 'follow-button', ' Unfollow');
    }));

    it('unfollows user on button click and changes the button text', fakeAsync(async () => {

      const user: INetworkUser = {
        userName: userName,
        avatar: 'https://img.icons8.com/color/96/000000/user.png',
        isFollowing: true, // <-- following
        isOwnProfile: false // <--
      };

      const userReturned: INetworkUser = {
        userName: userName,
        avatar: 'https://img.icons8.com/color/96/000000/user.png',
        isFollowing: false, // <-- not following
        isOwnProfile: false
      };

      await setup(user, {
        postUnfollowUser: of(userReturned)
      });

      // initial button text
      expectText(fixture, 'follow-button', ' Unfollow');

      // button click...
      fixture.debugElement.query(By.css('.btn-follow')).triggerEventHandler('click', null);

      //..should call method
      expect(fakeService.postUnfollowUser).toHaveBeenCalled();

      fixture.detectChanges();
      //... and change button text
      expectText(fixture, 'follow-button', ' Follow');
    }));
  });
});