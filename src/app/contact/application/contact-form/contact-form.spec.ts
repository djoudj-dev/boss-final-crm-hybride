import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import ContactForm from './contact-form';
import { ContactGateway } from '../../domain/gateways/contact.gateway';

describe('ContactForm', () => {
  let router: Router;

  const mockContactGateway = {
    contacts$: of([]),
    getContacts: vi.fn(),
    getContactById: vi.fn(),
    addContact: vi.fn().mockReturnValue(of({ id: 1 })),
    updateContact: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactForm],
      providers: [
        provideRouter([]),
        { provide: ContactGateway, useValue: mockContactGateway },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ContactForm);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    const fixture = TestBed.createComponent(ContactForm);
    expect(fixture.componentInstance['form'].valid).toBe(false);
  });

  it('should require nom, prenom, poste, entreprise', () => {
    const fixture = TestBed.createComponent(ContactForm);
    const form = fixture.componentInstance['form'];

    expect(form.get('nom')!.hasError('required')).toBe(true);
    expect(form.get('prenom')!.hasError('required')).toBe(true);
    expect(form.get('poste')!.hasError('required')).toBe(true);
    expect(form.get('entreprise')!.hasError('required')).toBe(true);
  });

  it('should validate email format', () => {
    const fixture = TestBed.createComponent(ContactForm);
    const form = fixture.componentInstance['form'];

    form.get('email')!.setValue('invalid');
    expect(form.get('email')!.hasError('email')).toBe(true);

    form.get('email')!.setValue('valid@test.com');
    expect(form.get('email')!.hasError('email')).toBe(false);
  });

  it('should have atLeastOneContact error when no contact info', () => {
    const fixture = TestBed.createComponent(ContactForm);
    const form = fixture.componentInstance['form'];
    expect(form.hasError('atLeastOneContact')).toBe(true);
  });

  it('should not submit when form is invalid', () => {
    const fixture = TestBed.createComponent(ContactForm);
    fixture.componentInstance['onSubmit']();
    expect(mockContactGateway.addContact).not.toHaveBeenCalled();
  });

  it('should submit and navigate when form is valid', () => {
    const fixture = TestBed.createComponent(ContactForm);
    const form = fixture.componentInstance['form'];
    const navigateSpy = vi.spyOn(router, 'navigate');

    form.setValue({
      nom: 'Dupont',
      prenom: 'Marie',
      poste: 'Dev',
      entreprise: 'Corp',
      email: 'marie@corp.fr',
      telephone: '',
      linkedin: '',
    });

    fixture.componentInstance['onSubmit']();

    expect(mockContactGateway.addContact).toHaveBeenCalled();
    const callArg = mockContactGateway.addContact.mock.calls.at(-1)![0];
    expect(callArg.statut).toBe('NOUVEAU');
    expect(navigateSpy).toHaveBeenCalledWith(['/contacts']);
  });
});
