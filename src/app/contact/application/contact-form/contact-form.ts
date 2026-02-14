import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StatutContact } from '../../domain/models/contact.model';
import { AddContactUseCase } from '../../domain/use-cases/add-contact.use-case';
import { atLeastOneContactValidator } from '../../domain/validators/at-least-one-contact.validator';

type ContactFormControls = {
  nom: FormControl<string>;
  prenom: FormControl<string>;
  poste: FormControl<string>;
  entreprise: FormControl<string>;
  email: FormControl<string>;
  telephone: FormControl<string>;
  linkedin: FormControl<string>;
};

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './contact-form.html',
})
export default class ContactForm {
  private readonly _addContact = inject(AddContactUseCase);
  private readonly _router = inject(Router);

  protected readonly form = new FormGroup<ContactFormControls>(
    {
      nom: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      prenom: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      poste: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      entreprise: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.email],
      }),
      telephone: new FormControl('', { nonNullable: true }),
      linkedin: new FormControl('', { nonNullable: true }),
    },
    { validators: atLeastOneContactValidator() }
  );

  protected onSubmit(): void {
    if (this.form.invalid) return;

    const value = this.form.getRawValue();

    this._addContact
      .execute({
        ...value,
        statut: StatutContact.NOUVEAU,
        dateCreation: new Date().toISOString(),
      })
      .subscribe(() => {
        this._router.navigate(['/contacts']);
      });
  }
}
