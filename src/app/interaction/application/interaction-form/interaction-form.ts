import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Contact, StatutContact } from '../../../contact/domain/models/contact.model';
import { TypeInteraction } from '../../domain/models/interaction.model';
import { GetContactByIdUseCase } from '../../../contact/domain/use-cases/get-contact-by-id.use-case';
import { UpdateContactUseCase } from '../../../contact/domain/use-cases/update-contact.use-case';
import { AddInteractionUseCase } from '../../domain/use-cases/add-interaction.use-case';

type InteractionFormControls = {
  type: FormControl<string>;
  notes: FormControl<string>;
  date: FormControl<string>;
  nouveauStatut: FormControl<string>;
};

@Component({
  selector: 'app-interaction-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './interaction-form.html',
})
export default class InteractionForm {
  private readonly _getContactById = inject(GetContactByIdUseCase);
  private readonly _updateContact = inject(UpdateContactUseCase);
  private readonly _addInteraction = inject(AddInteractionUseCase);
  private readonly _router = inject(Router);

  readonly contactId = input.required<string>();

  protected readonly contact = signal<Contact | null>(null);
  protected readonly statuts = Object.values(StatutContact);

  protected readonly availableTypes = computed(() => {
    const c = this.contact();
    if (!c) return [];

    const types: TypeInteraction[] = [];
    if (c.email) types.push(TypeInteraction.EMAIL);
    if (c.telephone) types.push(TypeInteraction.TELEPHONE);
    if (c.linkedin) types.push(TypeInteraction.LINKEDIN);
    return types;
  });

  protected readonly form = new FormGroup<InteractionFormControls>({
    type: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    notes: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    date: new FormControl(new Date().toISOString().split('T')[0], {
      nonNullable: true,
      validators: [Validators.required],
    }),
    nouveauStatut: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const id = this.contactId();
      if (id) {
        this._getContactById.execute(Number(id)).subscribe((contact) => {
          this.contact.set(contact);
          this._setupForm(contact);
        });
      }
    });
  }

  private _setupForm(contact: Contact): void {
    const types = this.availableTypes();

    if (types.length === 1) {
      this.form.controls.type.setValue(types[0]);
      this.form.controls.type.disable();
    }

    this.form.controls.nouveauStatut.setValue(contact.statut);
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;

    const contact = this.contact();
    if (!contact) return;

    const raw = this.form.getRawValue();
    const nouveauStatut = raw.nouveauStatut as StatutContact;

    this._addInteraction
      .execute({
        contactId: contact.id,
        type: raw.type as TypeInteraction,
        notes: raw.notes,
        date: new Date(raw.date).toISOString(),
        nouveauStatut: nouveauStatut !== contact.statut ? nouveauStatut : undefined,
      })
      .subscribe(() => {
        if (nouveauStatut && nouveauStatut !== contact.statut) {
          this._updateContact
            .execute({ ...contact, statut: nouveauStatut })
            .subscribe(() => {
              this._router.navigate(['/contacts']);
            });
        } else {
          this._router.navigate(['/contacts']);
        }
      });
  }
}
