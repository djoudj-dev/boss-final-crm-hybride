import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function atLeastOneContactValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.get('email')?.value;
    const telephone = control.get('telephone')?.value;
    const linkedin = control.get('linkedin')?.value;

    if (email || telephone || linkedin) {
      return null;
    }

    return { atLeastOneContact: true };
  };
}
