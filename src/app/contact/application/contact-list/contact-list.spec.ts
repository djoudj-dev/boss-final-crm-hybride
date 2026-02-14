import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import ContactList from './contact-list';
import { Contact, StatutContact } from '../../domain/models/contact.model';
import { Interaction, TypeInteraction } from '../../../interaction/domain/models/interaction.model';
import { ContactGateway } from '../../domain/gateways/contact.gateway';
import { InteractionGateway } from '../../../interaction/domain/gateways/interaction.gateway';

describe('ContactList', () => {
  let router: Router;

  const mockContacts: Contact[] = [
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Marie',
      poste: 'Dev',
      entreprise: 'TechCorp',
      email: 'marie@techcorp.fr',
      statut: StatutContact.CLIENT,
      dateCreation: '2025-11-15T10:30:00.000Z',
    },
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Lucas',
      poste: 'CTO',
      entreprise: 'StartupIO',
      linkedin: 'https://linkedin.com/in/lucas',
      statut: StatutContact.NOUVEAU,
      dateCreation: '2026-01-20T14:00:00.000Z',
    },
  ];

  const mockInteractions: Interaction[] = [
    {
      id: 1,
      contactId: 1,
      type: TypeInteraction.EMAIL,
      notes: 'Test',
      date: '2026-02-01T09:00:00.000Z',
    },
  ];

  const mockContactGateway = {
    contacts$: of(mockContacts),
    getContacts: vi.fn(),
    getContactById: vi.fn(),
    addContact: vi.fn(),
    updateContact: vi.fn(),
  };

  const mockInteractionGateway = {
    interactions$: of(mockInteractions),
    getInteractions: vi.fn(),
    getInteractionsByContactId: vi.fn(),
    addInteraction: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactList],
      providers: [
        provideRouter([]),
        { provide: ContactGateway, useValue: mockContactGateway },
        { provide: InteractionGateway, useValue: mockInteractionGateway },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  function createComponent() {
    const fixture = TestBed.createComponent(ContactList);
    fixture.detectChanges();
    return fixture;
  }

  it('should create', () => {
    const fixture = createComponent();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display contacts in table', () => {
    const fixture = createComponent();
    const rows = fixture.nativeElement.querySelectorAll('[data-testid^="contact-row-"]');
    expect(rows.length).toBe(2);
  });

  it('should filter by statut', () => {
    const fixture = createComponent();
    const component = fixture.componentInstance;

    component['setFilterStatut'](StatutContact.NOUVEAU);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('[data-testid^="contact-row-"]');
    expect(rows.length).toBe(1);
  });

  it('should sort by statut', () => {
    const fixture = createComponent();
    const component = fixture.componentInstance;

    component['setSortBy']('statut');
    fixture.detectChanges();

    const filtered = component['filteredContacts']();
    expect(filtered[0].statut).toBe(StatutContact.NOUVEAU);
    expect(filtered[1].statut).toBe(StatutContact.CLIENT);
  });

  it('should sort by derniere-interaction', () => {
    const fixture = createComponent();
    const component = fixture.componentInstance;

    component['setSortBy']('derniere-interaction');
    fixture.detectChanges();

    const filtered = component['filteredContacts']();
    // Contact 1 has an interaction, so should be first
    expect(filtered[0].id).toBe(1);
  });

  it('should navigate to add contact', () => {
    const fixture = createComponent();
    const link = fixture.nativeElement.querySelector('[data-testid="btn-add-contact"]');
    expect(link.getAttribute('href')).toBe('/contacts/new');
  });

  it('should navigate to add interaction', () => {
    const fixture = createComponent();
    const navigateSpy = vi.spyOn(router, 'navigate');

    fixture.componentInstance['navigateToInteraction'](1);
    expect(navigateSpy).toHaveBeenCalledWith(['/contacts', 1, 'interactions', 'new']);
  });
});
