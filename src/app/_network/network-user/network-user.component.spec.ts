import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expectText } from 'src/app/testing/element.spec-helper';
import { fakeNetworkUserModel, userName } from 'src/app/testing/network-test-helpers';
import { NetworkUserComponent } from './network-user.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('NetworkUserComponent', () => {
  let component: NetworkUserComponent;
  let fixture: ComponentFixture<NetworkUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NetworkUserComponent, RouterTestingModule]
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
      expect(component.user).toBe(fakeNetworkUserModel)
    });

    it('it shows the username', () => {
      // await setup(fakeNetworkUserModel);
      expect(component.user).toBe(fakeNetworkUserModel)
      expectText(fixture, 'username', ` ${userName} `);
    });
  });
});