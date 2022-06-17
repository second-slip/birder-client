import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkFindComponent } from './network-find.component';

describe('NetworkFindComponent', () => {
  let component: NetworkFindComponent;
  let fixture: ComponentFixture<NetworkFindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkFindComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
