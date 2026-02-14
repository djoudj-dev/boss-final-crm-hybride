import { FormControl, FormGroup } from '@angular/forms';
import { atLeastOneContactValidator } from './at-least-one-contact.validator';

describe('atLeastOneContactValidator', () => {
  let form: FormGroup;

  beforeEach(() => {
    form = new FormGroup(
      {
        email: new FormControl(''),
        telephone: new FormControl(''),
        linkedin: new FormControl(''),
      },
      { validators: atLeastOneContactValidator() }
    );
  });

  it('should return error when no contact info is provided', () => {
    expect(form.hasError('atLeastOneContact')).toBe(true);
  });

  it('should pass when email is provided', () => {
    form.get('email')!.setValue('test@example.com');
    expect(form.hasError('atLeastOneContact')).toBe(false);
  });

  it('should pass when telephone is provided', () => {
    form.get('telephone')!.setValue('06 12 34 56 78');
    expect(form.hasError('atLeastOneContact')).toBe(false);
  });

  it('should pass when linkedin is provided', () => {
    form.get('linkedin')!.setValue('https://linkedin.com/in/test');
    expect(form.hasError('atLeastOneContact')).toBe(false);
  });
});
