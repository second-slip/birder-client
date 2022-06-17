import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationTopFiveComponent } from './observation-top-five.component';

describe('ObservationTopFiveComponent', () => {
  let component: ObservationTopFiveComponent;
  let fixture: ComponentFixture<ObservationTopFiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObservationTopFiveComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationTopFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
