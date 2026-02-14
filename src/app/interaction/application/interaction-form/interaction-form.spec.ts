import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ComponentRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import InteractionForm from './interaction-form';
import { Contact, StatutContact } from '../../../contact/domain/models/contact.model';
import { Interaction } from '../../domain/models/interaction.model';
import { ContactGateway } from '../../../contact/domain/gateways/contact.gateway';
import { InteractionGateway } from '../../domain/gateways/interaction.gateway';

describe('InteractionForm', () => {
  let router: Router;

  const mockContact: Contact = {
    id: 1,
    nom: 'Dupont',
    prenom: 'Marie',
    poste: 'Dev',
    entreprise: 'TechCorp',
    email: 'marie@techcorp.fr',
    telephone: '06 12 34 56 78',
    statut: StatutContact.PROSPECT,
    dateCreation: '2025-11-15T10:30:00.000Z',
  };

  const contactEmailOnly: Contact = {
    ...mockContact,
    telephone: undefined,
    linkedin: undefined,
  };

  let mockContactGateway: {
    contacts$: Observable<Contact[]>;
    getContacts: ReturnType<typeof vi.fn>;
    getContactById: ReturnType<typeof vi.fn>;
    addContact: ReturnType<typeof vi.fn>;
    updateContact: ReturnType<typeof vi.fn>;
  };

  let mockInteractionGateway: {
    interactions$: Observable<Interaction[]>;
    getInteractions: ReturnType<typeof vi.fn>;
    getInteractionsByContactId: ReturnType<typeof vi.fn>;
    addInteraction: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockContactGateway = {
      contacts$: of([]),
      getContacts: vi.fn(),
      getContactById: vi.fn().mockReturnValue(of(mockContact)),
      addContact: vi.fn(),
      updateContact: vi.fn().mockReturnValue(of(mockContact)),
    };

    mockInteractionGateway = {
      interactions$: of([]),
      getInteractions: vi.fn(),
      getInteractionsByContactId: vi.fn(),
      addInteraction: vi.fn().mockReturnValue(of({ id: 2 })),
    };

    await TestBed.configureTestingModule({
      imports: [InteractionForm],
      providers: [
        provideRouter([]),
        { provide: ContactGateway, useValue: mockContactGateway },
        { provide: InteractionGateway, useValue: mockInteractionGateway },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  function createWithContact(contact: Contact) {
    mockContactGateway.getContactById.mockReturnValue(of(contact));
    const fixture = TestBed.createComponent(InteractionForm);
    const ref: ComponentRef<InteractionForm> = fixture.componentRef;
    ref.setInput('contactId', String(contact.id));
    fixture.detectChanges();

    return fixture;
  }

  it('should create', () => {
    const fixture = createWithContact(mockContact);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display contact name', () => {
    const fixture = createWithContact(mockContact);
    const el = fixture.nativeElement.querySelector('[data-testid="interaction-contact-name"]');
    expect(el?.textContent).toContain('Marie Dupont');
  });

  it('should show available types based on contact info', () => {
    const fixture = createWithContact(mockContact);
    const types = fixture.componentInstance['availableTypes']();
    expect(types).toContain('email');
    expect(types).toContain('telephone');
    expect(types).not.toContain('linkedin');
  });

  it('should pre-select and disable type when only one available', () => {
    const fixture = createWithContact(contactEmailOnly);
    const form = fixture.componentInstance['form'];
    expect(form.getRawValue().type).toBe('email');
    expect(form.get('type')!.disabled).toBe(true);
  });

  it('should submit interaction and navigate', () => {
    const fixture = createWithContact(mockContact);
    const form = fixture.componentInstance['form'];
    const navigateSpy = vi.spyOn(router, 'navigate');

    form.patchValue({
      type: 'email',
      notes: 'Test interaction',
      date: '2026-02-14',
    });

    fixture.componentInstance['onSubmit']();

    expect(mockInteractionGateway.addInteraction).toHaveBeenCalled();
    const callArg = mockInteractionGateway.addInteraction.mock.calls.at(-1)![0];
    expect(callArg.notes).toBe('Test interaction');
    expect(navigateSpy).toHaveBeenCalledWith(['/contacts']);
  });

  it('should update contact status when changed', () => {
    const fixture = createWithContact(mockContact);
    const form = fixture.componentInstance['form'];
    const navigateSpy = vi.spyOn(router, 'navigate');

    form.patchValue({
      type: 'email',
      notes: 'Changed status',
      date: '2026-02-14',
      nouveauStatut: StatutContact.CLIENT,
    });

    fixture.componentInstance['onSubmit']();

    expect(mockInteractionGateway.addInteraction).toHaveBeenCalled();
    expect(mockContactGateway.updateContact).toHaveBeenCalled();
    const updateArg = mockContactGateway.updateContact.mock.calls.at(-1)![0];
    expect(updateArg.statut).toBe(StatutContact.CLIENT);
    expect(navigateSpy).toHaveBeenCalledWith(['/contacts']);
  });
});
