
//   console.log(this.findInvalidControls());
//  console.log(this.resetPasswordForm.value);
//   console.log(this.resetPasswordForm.valid);

import { FormGroup } from "@angular/forms";

export function findInvalidControls(form: FormGroup) {
    const invalid = [];
    const controls = form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
}