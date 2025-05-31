import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationMenuComponent } from './navigation-menu.component';
import { provideRouter } from '@angular/router';
import { blankRoutesArray } from 'src/app/testing/route-tests-helpers';
import { provideZonelessChangeDetection } from '@angular/core';

describe('NavigationMenuComponent', () => {
  let component: NavigationMenuComponent;
  let fixture: ComponentFixture<NavigationMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationMenuComponent],
      providers: [
        provideRouter(blankRoutesArray),
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
