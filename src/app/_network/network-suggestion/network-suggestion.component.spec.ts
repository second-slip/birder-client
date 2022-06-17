import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkSuggestionComponent } from './network-suggestion.component';

describe('NetworkSuggestionComponent', () => {
  let component: NetworkSuggestionComponent;
  let fixture: ComponentFixture<NetworkSuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkSuggestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
