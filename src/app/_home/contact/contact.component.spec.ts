import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ContactComponent } from './contact.component';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { MockComponent } from 'ng-mocks';
import { provideRouter } from '@angular/router';
import { blankRoutesArray } from 'src/app/testing/route-tests-helpers';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideRouter(blankRoutesArray)],
      imports: [NgbNavModule, ContactComponent]
    })
      .overrideComponent(ContactComponent, {
        remove: { imports: [ContactFormComponent] },
        add: { imports: [MockComponent(ContactFormComponent)] }
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
