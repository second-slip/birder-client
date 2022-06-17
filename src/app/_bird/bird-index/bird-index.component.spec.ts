import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirdIndexComponent } from './bird-index.component';

describe('BirdIndexComponent', () => {
  let component: BirdIndexComponent;
  let fixture: ComponentFixture<BirdIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BirdIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BirdIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
