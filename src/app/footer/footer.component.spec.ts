import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { provideRouter } from '@angular/router';
import { blankRoutesArray } from '../testing/route-tests-helpers';
import { provideZonelessChangeDetection } from '@angular/core';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        provideRouter(blankRoutesArray),
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should set the year property to current year', () => {
      // Arrange
      const year = new Date().getFullYear().toString();
      const expected = `\u00A9 ${year} Birder`;

      // Act or change
      fixture.detectChanges();

      // Assert
      expect(component.message).toEqual(expected);
    });
  });
});
