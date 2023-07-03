import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { SelectDateTimeComponent } from './select-date-time.component';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('SelectDateTimeComponent', () => {
  let component: SelectDateTimeComponent;
  let fixture: ComponentFixture<SelectDateTimeComponent>;

  const setup = async () => {

    await TestBed.configureTestingModule({
      imports: [FormsModule, NgbModule],
      declarations: [SelectDateTimeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SelectDateTimeComponent);
    component = fixture.componentInstance;

    component.dateForm = new FormGroup({
      observationDateTime: new FormControl(new Date(), Validators.compose([
        Validators.required
      ]))
    });

    //spyOn(component, 'reload');

    fixture.detectChanges();
  };

  describe('when component is loaded', () => {

    it('should create', fakeAsync(async () => {
      await setup();
      expect(component).toBeTruthy();
    }));

    // it('should call the data fetch method', fakeAsync(async () => {
    //   await setup();
    //   expect(fakeSelectSpeciesService.getData).toHaveBeenCalledTimes(1);
    // }));

    // it('should show the loading symbol', fakeAsync(async () => {
    //   await setup();
    //   expect(findEl(fixture, 'loading')).toBeDefined();
    // }));
  });


//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [SelectDateTimeComponent]
//     });
//     fixture = TestBed.createComponent(SelectDateTimeComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
 });
