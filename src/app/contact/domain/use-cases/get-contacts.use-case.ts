import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { ContactGateway } from '../gateways/contact.gateway';

@Injectable({ providedIn: 'root' })
export class GetContactsUseCase {
  private readonly _gateway = inject(ContactGateway);

  readonly contacts$: Observable<Contact[]> = this._gateway.contacts$;

  execute(): void {
    this._gateway.getContacts();
  }
}
