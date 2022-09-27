import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingsComponent } from './recordings.component';
import { RecordingsService } from './recordings.service';

describe('RecordingsComponent', () => {
  let component: RecordingsComponent;
  let fixture: ComponentFixture<RecordingsComponent>;

  // use of([]) to test empty response case

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [RecordingsComponent],
      providers: [RecordingsService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
