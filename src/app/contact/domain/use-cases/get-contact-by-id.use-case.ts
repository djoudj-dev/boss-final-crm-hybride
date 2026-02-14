import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { ContactGateway } from '../gateways/contact.gateway';

@Injectable({ providedIn: 'root' })
export class GetContactByIdUseCase {
  private readonly _gateway = inject(ContactGateway);

  execute(id: number): Observable<Contact> {
    return this._gateway.getContactById(id);
  }
}
