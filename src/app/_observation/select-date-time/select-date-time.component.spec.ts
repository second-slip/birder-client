import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDateTimeComponent } from './select-date-time.component';

describe('SelectDateTimeComponent', () => {
  let component: SelectDateTimeComponent;
  let fixture: ComponentFixture<SelectDateTimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectDateTimeComponent]
    });
    fixture = TestBed.createComponent(SelectDateTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
