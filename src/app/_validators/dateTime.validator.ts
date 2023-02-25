import { AbstractControl, ValidatorFn } from "@angular/forms";

export function DateValid(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? { 'invalidDate': { value: control.value } } : null;
  };
}