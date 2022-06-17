import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TweetDayArchiveComponent } from './tweet-day-archive.component';

describe('TweetDayArchiveComponent', () => {
  let component: TweetDayArchiveComponent;
  let fixture: ComponentFixture<TweetDayArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TweetDayArchiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TweetDayArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
