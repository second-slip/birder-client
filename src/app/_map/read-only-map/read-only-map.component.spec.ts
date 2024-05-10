import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadOnlyMapComponent } from './read-only-map.component';
import { throwError } from 'rxjs';
import { expectText } from 'src/app/testing/element.spec-helper';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { By } from '@angular/platform-browser';
import { fakeLocationMarker } from 'src/app/testing/map-tests-helpers';

describe('ReadOnlyMapComponent', () => {
  let component: ReadOnlyMapComponent;
  let fixture: ComponentFixture<ReadOnlyMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleMapsModule, ReadOnlyMapComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadOnlyMapComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    component.position = fakeLocationMarker;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // it('should show loading', () => {
  //   component.position = fakeLocationMarker;
  //   fixture.detectChanges();

  //   // component.markerStatus = 'idle';

  //   fixture.detectChanges();

  //   const { debugElement } = fixture;
  //   const loading = debugElement.query(By.css('app-loading'));
  //   expect(loading).toBeDefined();

  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('[data-testid="location"]')?.textContent).toBeUndefined();

  //   const map = debugElement.query(By.css('google-map'));
  //   expect(map).toBeNull();
  // });

  it('should display the map when valid', () => {
    component.position = fakeLocationMarker;
    fixture.detectChanges();

    // expect(component.markerStatus).toBe('success');

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="location"]')?.textContent).toBeDefined();
    expectText(fixture, 'location-text', 'address string');

    const { debugElement } = fixture;
    const map = debugElement.query(By.css('google-map'));
    expect(map).toBeDefined();
  });


  it('should show error content on error', () => {
    component.options = throwError(() => new Error(''));
    fixture.detectChanges();

    expect(component.error).toBeTruthy();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeDefined();
    expectText(fixture, 'error', 'Whoops! There is an error displaying the map.');
  });
});