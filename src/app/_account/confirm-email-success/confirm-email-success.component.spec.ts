import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEmailSuccessComponent } from './confirm-email-success.component';

describe('ConfirmEmailSuccessComponent', () => {
  let component: ConfirmEmailSuccessComponent;
  let fixture: ComponentFixture<ConfirmEmailSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ConfirmEmailSuccessComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEmailSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
