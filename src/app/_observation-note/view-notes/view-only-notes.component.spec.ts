import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOnlyNotesComponent } from './view-only-notes.component';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ViewOnlyNotesComponent', () => {
  let component: ViewOnlyNotesComponent;
  let fixture: ComponentFixture<ViewOnlyNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOnlyNotesComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOnlyNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
