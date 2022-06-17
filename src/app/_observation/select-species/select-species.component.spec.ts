import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSpeciesComponent } from './select-species.component';

describe('SelectSpeciesComponent', () => {
  let component: SelectSpeciesComponent;
  let fixture: ComponentFixture<SelectSpeciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectSpeciesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSpeciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
