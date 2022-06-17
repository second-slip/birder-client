import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TweetDayComponent } from './tweet-day.component';

describe('TweetDayComponent', () => {
  let component: TweetDayComponent;
  let fixture: ComponentFixture<TweetDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TweetDayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TweetDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
