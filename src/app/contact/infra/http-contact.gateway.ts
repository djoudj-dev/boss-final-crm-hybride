import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Contact } from '../domain/models/contact.model';
import { ContactGateway } from '../domain/gateways/contact.gateway';

@Injectable()
export class HttpContactGateway implements ContactGateway {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = 'http://localhost:3000/contacts';

  private readonly _contacts$ = new BehaviorSubject<Contact[]>([]);
  readonly contacts$ = this._contacts$.asObservable();

  getContacts(): void {
    this._http.get<Contact[]>(this._apiUrl).subscribe((contacts) => {
      this._contacts$.next(contacts);
    });
  }

  getContactById(id: number): Observable<Contact> {
    return this._http.get<Contact>(`${this._apiUrl}/${id}`);
  }

  addContact(contact: Omit<Contact, 'id'>): Observable<Contact> {
    return this._http.post<Contact>(this._apiUrl, contact).pipe(
      tap((newContact) => {
        this._contacts$.next([...this._contacts$.getValue(), newContact]);
      })
    );
  }

  updateContact(contact: Contact): Observable<Contact> {
    return this._http.put<Contact>(`${this._apiUrl}/${contact.id}`, contact).pipe(
      tap((updated) => {
        const contacts = this._contacts$
          .getValue()
          .map((c) => (c.id === updated.id ? updated : c));
        this._contacts$.next(contacts);
      })
    );
  }
}
