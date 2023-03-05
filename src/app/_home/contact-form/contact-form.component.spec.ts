import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { dispatchFakeEvent, expectText, expectTextToContain, findEl, setFieldValue } from 'src/app/testing/element.spec-helper';
import {
  messageData,
  email,
  name,
  message,
} from 'src/app/testing/contact-form-data';

import { ContactFormComponent } from './contact-form.component';
import { ContactFormService } from './contact-form.service';
import { DebugElement } from '@angular/core';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

const requiredFields = [
  'name',
  'email',
  'message'
];


describe('ContactFormComponent', () => {
  let fixture: ComponentFixture<ContactFormComponent>;
  //let debugElement: DebugElement;
  let fakeContactFormService: jasmine.SpyObj<ContactFormService>;

  const setup = async (
    fakeContactFormServiceReturnValues?: jasmine.SpyObjMethodNames<ContactFormService>,
  ) => {
    // signupService = jasmine.createSpyObj<SignupService>('SignupService', {
    //   // Successful responses per default
    //   isUsernameTaken: of(false),
    //   isEmailTaken: of(false),
    //   getPasswordStrength: of(strongPassword),
    //   signup: of({ success: true }),
    //   // Overwrite with given return values
    //   ...signupServiceReturnValues,
    // });

    //beforeEach(async () => {

    fakeContactFormService = jasmine.createSpyObj<ContactFormService>(
      'ContactFormService',
      {
        postMessage: undefined,
        ...fakeContactFormServiceReturnValues
      }
    );


    await TestBed.configureTestingModule({
      declarations: [
        ContactFormComponent
      ],
      imports: [FormsModule],
      providers: [{ provide: ContactFormService, useValue: fakeContactFormService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormComponent);
    fixture.detectChanges();
    //debugElement = fixture.debugElement;
  };

  const fillForm = () => {
    setFieldValue(fixture, 'name', name);
    setFieldValue(fixture, 'email', email);
    setFieldValue(fixture, 'message', message);
    // checkField(fixture, 'tos', true);
  };

  it('submits the form successfully', fakeAsync(async () => {
    await setup(
      {
        postMessage: of(messageData),
      }
    );

    fillForm();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="success"]')?.textContent).toBeUndefined();


    expect(findEl(fixture, 'submit').properties.disabled).toBe(true);


    // tick(1000);
    // tick(1000);
    // fixture.detectChanges();

    expect(findEl(fixture, 'submit').properties.disabled).toBe(true);


    findEl(fixture, 'contactForm').triggerEventHandler('submit', {});

    tick(1000);
    fixture.detectChanges();

    expectText(fixture, 'success', 'Success! Your message has been sent to the developer. Thank you. ');

    // use jasmine.objectContaining because:
    // Expected spy ContactFormService.postMessage to have been called with:
    // [ Object({ name: 'test name', email: 'test email', message: 'test message' }) ]
    // but actual calls were:
    // [ ContactFormModel({ name: 'test name', email: 'test email', message: 'test message' }) ].
    // Call 0:
    // Expected $[0] to be a kind of Object, but was ContactFormModel({ name: 'test name', email: 'test email', message: 'test message' }).
    expect(fakeContactFormService.postMessage).toHaveBeenCalledWith(jasmine.objectContaining(messageData));
  }));

  it('handles signup failure', fakeAsync(async () => {

    await setup({
      // Let the API report a failure
      postMessage: throwError(() => new Error('test')) // throwError(new Error('Validation failed')),
    });

    fillForm();

    tick(1000);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();

    findEl(fixture, 'contactForm').triggerEventHandler('submit', {});
    fixture.detectChanges();

    expectText(fixture, 'error', 'Error! An error occurred. Please try to send the form again. ');

    expect(fakeContactFormService.postMessage).toHaveBeenCalledWith(jasmine.objectContaining(messageData));
  }));


  // This should not happen as the 'submit' button should be disabled, but:
  it('does not submit an invalid form', fakeAsync(async () => {
    await setup();
  
    // Wait for async validators
    tick(1000);
  
    findEl(fixture, 'contactForm').triggerEventHandler('submit', {});
  
    expect(fakeContactFormService.postMessage).not.toHaveBeenCalled();
  }));



  it('submit button should be disabled', fakeAsync(async () => {
    await setup();
  
    // Wait for async validators
    tick(1000);
    fixture.detectChanges();

    expect(findEl(fixture, 'submit').properties.disabled).toBe(true);
  }));

  const markFieldAsTouched = (element: DebugElement) => {
    dispatchFakeEvent(element.nativeElement, 'blur');
  };

  it('marks fields as required', async () => {

    await setup();

    // Mark required fields as touched
    requiredFields.forEach((testId) => {
      markFieldAsTouched(findEl(fixture, testId));
      // console.log(el.attributes)
      // changes ng-untouched to ng-touched
      // e.g.: 'form-control ng-touched ng-pristine ng-invalid'
    });

    fixture.detectChanges();

    requiredFields.forEach((testId) => {
      const el = findEl(fixture, testId);

      // console.log(el);
      // console.log(el.attributes);

      // Check aria-required attribute
      expect(el.attributes['required']).toBe(  //['aria-required']).toBe(
        '',
        `${testId} must be marked as aria-required`,
      );

      // check error message is displayed
      expectTextToContain(fixture, `${testId}-error`, `Your ${testId} is required`);
    });
  });


});

function isDisabled(fixture: ComponentFixture<any>, selector: string): boolean {
  const element = fixture.debugElement.query(By.css(selector));

  //expect(element).toBeTruthy(`${selector} should exist`);

  return element.properties.disabled;
}