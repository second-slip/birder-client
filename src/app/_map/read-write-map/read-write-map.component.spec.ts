import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadWriteMapComponent } from './read-write-map.component';

describe('ReadWriteMapComponent', () => {
  let component: ReadWriteMapComponent;
  let fixture: ComponentFixture<ReadWriteMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadWriteMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadWriteMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
