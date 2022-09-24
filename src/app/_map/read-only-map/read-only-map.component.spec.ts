import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadOnlyMapComponent } from './read-only-map.component';

describe('ReadOnlyMapComponent', () => {
  let component: ReadOnlyMapComponent;
  let fixture: ComponentFixture<ReadOnlyMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadOnlyMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadOnlyMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
