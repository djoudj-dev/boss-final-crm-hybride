import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { ContactGateway } from '../gateways/contact.gateway';

@Injectable({ providedIn: 'root' })
export class AddContactUseCase {
  private readonly _gateway = inject(ContactGateway);

  execute(contact: Omit<Contact, 'id'>): Observable<Contact> {
    return this._gateway.addContact(contact);
  }
}
