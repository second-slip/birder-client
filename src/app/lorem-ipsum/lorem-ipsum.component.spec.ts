import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoremIpsumComponent } from './lorem-ipsum.component';
import { provideZonelessChangeDetection } from '@angular/core';

describe('LoremIpsumComponent', () => {
  let component: LoremIpsumComponent;
  let fixture: ComponentFixture<LoremIpsumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoremIpsumComponent],
      providers: [provideZonelessChangeDetection()]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoremIpsumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
