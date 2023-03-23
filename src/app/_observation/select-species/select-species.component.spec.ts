import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { BirdsListValidator } from 'src/app/_validators';

import { SelectSpeciesComponent } from './select-species.component';
import { SelectSpeciesService } from './select-species.service';

describe('SelectSpeciesComponent', () => {
  let component: SelectSpeciesComponent;
  let fixture: ComponentFixture<SelectSpeciesComponent>;

  let fakeSelectSpeciesService: jasmine.SpyObj<SelectSpeciesService>;

  fakeSelectSpeciesService = jasmine.createSpyObj<SelectSpeciesService>(
    'SelectSpeciesService',
    {
        getData: undefined,
        //...fakeMethodValues
    },
    {
        isError: of(false),
        getBirds: [],
        //...fakePropertyValues
    }
);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormsModule, HttpClientTestingModule, NgbModule, FormsModule, ReactiveFormsModule ],
      declarations: [ SelectSpeciesComponent ],
      providers: [{provide: SelectSpeciesService, useValue: fakeSelectSpeciesService}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSpeciesComponent);
    component = fixture.componentInstance;

    component.selectSpeciesForm = new FormGroup({
      bird: new FormControl('', Validators.compose([
        Validators.required,
        BirdsListValidator()
      ]))
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
