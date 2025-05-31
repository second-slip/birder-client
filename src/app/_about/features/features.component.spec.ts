import {
  DebugElement,
  NO_ERRORS_SCHEMA,
  provideZonelessChangeDetection,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturesComponent } from './features.component';

describe('FeaturesComponent', () => {
  let fixture: ComponentFixture<FeaturesComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [FeaturesComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturesComponent);
    debugElement = fixture.debugElement;
  });

  it('should create the app', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelector('[data-testid="main-title"]')?.textContent
    ).toContain('Website Features');
  });
});
