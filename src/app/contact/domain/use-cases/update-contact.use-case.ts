import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { ContactGateway } from '../gateways/contact.gateway';

@Injectable({ providedIn: 'root' })
export class UpdateContactUseCase {
  private readonly _gateway = inject(ContactGateway);

  execute(contact: Contact): Observable<Contact> {
    return this._gateway.updateContact(contact);
  }
}
