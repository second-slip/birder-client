import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMenuComponent } from './navigation-menu.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavigationMenuComponent', () => {
  let component: NavigationMenuComponent;
  let fixture: ComponentFixture<NavigationMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NavigationMenuComponent, RouterTestingModule]
})
    .compileComponents();
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
