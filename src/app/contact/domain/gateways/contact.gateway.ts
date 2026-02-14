import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';

export abstract class ContactGateway {
  abstract contacts$: Observable<Contact[]>;
  abstract getContacts(): void;
  abstract getContactById(id: number): Observable<Contact>;
  abstract addContact(contact: Omit<Contact, 'id'>): Observable<Contact>;
  abstract updateContact(contact: Contact): Observable<Contact>;
}
