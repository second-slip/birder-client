import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporarySideBarComponent } from './temporary-side-bar.component';

describe('TemporarySideBarComponent', () => {
  let component: TemporarySideBarComponent;
  let fixture: ComponentFixture<TemporarySideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemporarySideBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemporarySideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
