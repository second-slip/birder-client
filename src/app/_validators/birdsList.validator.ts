import { AbstractControl, ValidatorFn } from "@angular/forms"

export function BirdsListValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (typeof control.value === 'string') {
      return { 'notBirdListObject': { value: control.value } }
    }
    return null  /* valid option selected */
  }
}