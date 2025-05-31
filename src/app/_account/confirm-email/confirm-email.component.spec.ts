import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEmailComponent } from './confirm-email.component';
import { ConfirmEmailResendComponent } from '../confirm-email-resend/confirm-email-resend.component';
import { MockComponent } from 'ng-mocks';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmEmailComponent],
      providers: [provideZonelessChangeDetection()],
    })
      .overrideComponent(ConfirmEmailComponent, {
        remove: { imports: [ConfirmEmailResendComponent] },
        add: { imports: [MockComponent(ConfirmEmailResendComponent)] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
