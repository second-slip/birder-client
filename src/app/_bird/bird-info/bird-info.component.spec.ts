import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirdInfoComponent } from './bird-info.component';

describe('BirdInfoComponent', () => {
  let component: BirdInfoComponent;
  let fixture: ComponentFixture<BirdInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BirdInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BirdInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
