import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkSidebarComponent } from './network-sidebar.component';
import { NetworkSummaryComponent } from '../network-summary/network-summary.component';
import { NetworkSuggestionComponent } from '../network-suggestion/network-suggestion.component';
import { MockComponent } from 'ng-mocks';

describe('NetworkSidebarComponent', () => {
  let component: NetworkSidebarComponent;
  let fixture: ComponentFixture<NetworkSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkSidebarComponent]
    })
      .overrideComponent(NetworkSidebarComponent, {
        remove: { imports: [NetworkSummaryComponent, NetworkSuggestionComponent] },
        add: { imports: [MockComponent(NetworkSummaryComponent), MockComponent(NetworkSuggestionComponent)] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
