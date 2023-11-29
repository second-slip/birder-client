import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutComponent } from './about.component';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockComponent } from 'ng-mocks';
import { FeaturesComponent } from '../features/features.component';
import { blankRoutesArray } from 'src/app/testing/route-tests-helpers';
import { provideRouter } from '@angular/router';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideRouter(blankRoutesArray)],
      imports: [NgbNavModule, AboutComponent]
    })
      .overrideComponent(AboutComponent, {
        remove: { imports: [FeaturesComponent] },
        add: { imports: [MockComponent(FeaturesComponent)] }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
