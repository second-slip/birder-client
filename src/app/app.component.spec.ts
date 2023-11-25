import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { findComponent } from './testing/element.spec-helper';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA],
}).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Birder'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Birder');
  });

  it('should render child components', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  
    const navComponent = findComponent(fixture, 'app-nav-menu');
    expect(navComponent).toBeTruthy();

    const mainComponent = findComponent(fixture, 'router-outlet');
    expect(mainComponent).toBeTruthy();

    const footerComponent = findComponent(fixture, 'app-footer');
    expect(footerComponent).toBeTruthy();
  });
});
