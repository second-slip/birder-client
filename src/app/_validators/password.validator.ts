import { FormControl, FormGroup, NgForm, FormGroupDirective, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class ParentErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = !!(form && form.submitted);
    const controlTouched = !!(control && (control.dirty || control.touched));
    const controlInvalid = !!(control && control.invalid);
    const parentInvalid = !!(control && control.parent && control.parent.invalid && (control.parent.dirty || control.parent.touched));

    return isSubmitted || (controlTouched && (controlInvalid || parentInvalid));
  }
}

export class ValidatePassword {
  static passwordMatcher(c: AbstractControl): ValidationErrors | null {
    const control = c.get('password');
    const confirmControl = c.get('confirmPassword');

    if (control?.pristine || confirmControl?.pristine) {
      return null;
    }

    if (control?.value === confirmControl?.value) {
      return null;
    }
    return { match: true };
  }
}

export function MatchOtherValidator(otherControlName: string) {

  let thisControl: FormControl;
  let otherControl: FormControl;

  return function matchOtherValidate(control: FormControl) {

    if (!control.parent) {
      return null;
    }

    // Initializing the validator.
    if (!thisControl) {
      thisControl = control;
      otherControl = control.parent.get(otherControlName) as FormControl;
      if (!otherControl) {
        throw new Error('matchOtherValidator(): other control is not found in parent group');
      }
      otherControl.valueChanges.subscribe(() => {
        thisControl.updateValueAndValidity();
      });
    }

    if (!otherControl) {
      return null;
    }

    if (otherControl.value !== thisControl.value) {
      return {
        matchOther: true
      };
    }

    return null;
  }
}

// export class PasswordValidator {
//   // Inspired on: http://plnkr.co/edit/Zcbg2T3tOxYmhxs7vaAm?p=preview
//   static areEqual(formGroup: FormGroup): any {
//     let value;
//     let valid = true;
//     for (let key in formGroup.controls) {
//       if (formGroup.controls.hasOwnProperty(key)) {
//         let control: FormControl = <FormControl>formGroup.controls[key];

//         if (value === undefined) {
//           value = control.value;
//         } else {
//           if (value !== control.value) {
//             valid = false;
//             break;
//           }
//         }
//       }
//     }

//     if (valid) {
//       return null;
//     }

//     return {
//       areEqual: true
//     };
//   }
// }
