import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutGeneralComponent } from './about-general.component';
import { provideZonelessChangeDetection } from '@angular/core';

describe('AboutGeneralComponent', () => {
  let component: AboutGeneralComponent;
  let fixture: ComponentFixture<AboutGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [AboutGeneralComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
