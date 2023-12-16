import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSpeciesTwoComponent } from './select-species-two.component';

describe('SelectSpeciesTwoComponent', () => {
  let component: SelectSpeciesTwoComponent;
  let fixture: ComponentFixture<SelectSpeciesTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectSpeciesTwoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectSpeciesTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
