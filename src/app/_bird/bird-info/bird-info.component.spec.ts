import { ComponentFixture, TestBed } from '@angular/core/testing';
import { fakeIBirdDetail } from 'src/app/testing/birds-helpers';
import { expectText } from 'src/app/testing/element.spec-helper';

import { BirdInfoComponent } from './bird-info.component';

describe('BirdInfoComponent', () => {
  let component: BirdInfoComponent;
  let fixture: ComponentFixture<BirdInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BirdInfoComponent]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BirdInfoComponent);
    component = fixture.componentInstance;
    component.bird = fakeIBirdDetail;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the species information from the from the Input() object', () => {
    expectText(fixture, 'order', String(fakeIBirdDetail.order));
    expectText(fixture, 'international-name', String('N/a'));
    expectText(fixture, 'bto-status', String(fakeIBirdDetail.btoStatusInBritain));
  });
});
