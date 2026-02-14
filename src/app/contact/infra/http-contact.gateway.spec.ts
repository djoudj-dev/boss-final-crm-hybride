import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { HttpContactGateway } from './http-contact.gateway';
import { ContactGateway } from '../domain/gateways/contact.gateway';
import { Contact, StatutContact } from '../domain/models/contact.model';

describe('HttpContactGateway', () => {
  let gateway: ContactGateway;
  let httpTesting: HttpTestingController;

  const mockContact: Contact = {
    id: 1,
    nom: 'Dupont',
    prenom: 'Marie',
    poste: 'Dev',
    entreprise: 'TechCorp',
    email: 'marie@techcorp.fr',
    statut: StatutContact.NOUVEAU,
    dateCreation: '2026-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ContactGateway, useClass: HttpContactGateway },
      ],
    });
    gateway = TestBed.inject(ContactGateway);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(gateway).toBeTruthy();
  });

  it('should fetch contacts and update BehaviorSubject', () => {
    const contacts = [mockContact];
    let result: Contact[] = [];

    gateway.contacts$.subscribe((c) => (result = c));
    gateway.getContacts();

    const req = httpTesting.expectOne('http://localhost:3000/contacts');
    expect(req.request.method).toBe('GET');
    req.flush(contacts);

    expect(result).toEqual(contacts);
  });

  it('should get contact by id', () => {
    let result: Contact | undefined;

    gateway.getContactById(1).subscribe((c) => (result = c));

    const req = httpTesting.expectOne('http://localhost:3000/contacts/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockContact);

    expect(result).toEqual(mockContact);
  });

  it('should add contact and update BehaviorSubject', () => {
    const { id, ...newContact } = mockContact;
    let result: Contact[] = [];

    gateway.contacts$.subscribe((c) => (result = c));
    gateway.addContact(newContact).subscribe();

    const req = httpTesting.expectOne('http://localhost:3000/contacts');
    expect(req.request.method).toBe('POST');
    req.flush(mockContact);

    expect(result.length).toBe(1);
    expect(result[0]).toEqual(mockContact);
  });

  it('should update contact and update BehaviorSubject', () => {
    // First populate the subject
    gateway.getContacts();
    httpTesting.expectOne('http://localhost:3000/contacts').flush([mockContact]);

    const updated = { ...mockContact, nom: 'Martin' };
    let result: Contact[] = [];

    gateway.contacts$.subscribe((c) => (result = c));
    gateway.updateContact(updated).subscribe();

    const req = httpTesting.expectOne('http://localhost:3000/contacts/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updated);

    expect(result[0].nom).toBe('Martin');
  });
});
