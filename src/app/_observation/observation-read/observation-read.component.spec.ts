import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationReadComponent } from './observation-read.component';

describe('ObservationReadComponent', () => {
  let component: ObservationReadComponent;
  let fixture: ComponentFixture<ObservationReadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObservationReadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
