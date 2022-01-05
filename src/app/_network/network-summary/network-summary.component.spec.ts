import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkSummaryComponent } from './network-summary.component';

describe('NetworkSummaryComponent', () => {
  let component: NetworkSummaryComponent;
  let fixture: ComponentFixture<NetworkSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
