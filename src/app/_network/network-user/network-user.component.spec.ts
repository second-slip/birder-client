import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expectText } from 'src/app/testing/element.spec-helper';
import {
  fakeNetworkUserModel,
  userName,
} from 'src/app/testing/network-test-helpers';
import { NetworkUserComponent } from './network-user.component';
import { FollowCommandComponent } from '../follow-command/follow-command.component';
import { MockComponent } from 'ng-mocks';
import { provideRouter } from '@angular/router';
import { blankRoutesArray } from 'src/app/testing/route-tests-helpers';
import { provideZonelessChangeDetection } from '@angular/core';

describe('NetworkUserComponent', () => {
  let component: NetworkUserComponent;
  let fixture: ComponentFixture<NetworkUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkUserComponent],
      providers: [
        provideRouter(blankRoutesArray),
        provideZonelessChangeDetection(),
      ],
    })
      .overrideComponent(NetworkUserComponent, {
        remove: { imports: [FollowCommandComponent] },
        add: { imports: [MockComponent(FollowCommandComponent)] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkUserComponent);
    component = fixture.componentInstance;
    component.user = fakeNetworkUserModel;
    fixture.detectChanges();
  });

  describe('when the component is rendered', () => {
    it('"SMOKE TEST": should be created', () => {
      // await setup(fakeNetworkUserModel);
      expect(component).toBeTruthy();
    });

    it('it sets the @input', () => {
      // await setup(fakeNetworkUserModel);
      expect(component.user).toBe(fakeNetworkUserModel);
    });

    it('it shows the username', () => {
      // await setup(fakeNetworkUserModel);
      expect(component.user).toBe(fakeNetworkUserModel);
      expectText(fixture, 'username', ` ${userName} `);
    });
  });
});
