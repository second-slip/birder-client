import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationCreateComponent } from './observation-create.component';

describe('ObservationCreateComponent', () => {
  let component: ObservationCreateComponent;
  let fixture: ComponentFixture<ObservationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObservationCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
