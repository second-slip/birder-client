import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkComponent } from './network.component';
import { NetworkFindComponent } from '../network-find/network-find.component';
import { NetworkSuggestionComponent } from '../network-suggestion/network-suggestion.component';
import { MockComponent } from 'ng-mocks';
import { NetworkSummaryComponent } from '../network-summary/network-summary.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideZonelessChangeDetection } from '@angular/core';

describe('NetworkComponent', () => {
  let component: NetworkComponent;
  let fixture: ComponentFixture<NetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, NetworkComponent],
      providers: [provideZonelessChangeDetection()]
    })
      .overrideComponent(NetworkComponent, {
        remove: { imports: [NetworkFindComponent, NetworkSuggestionComponent, NetworkSummaryComponent] },
        add: { imports: [MockComponent(NetworkFindComponent), MockComponent(NetworkSuggestionComponent), MockComponent(NetworkSummaryComponent)] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
