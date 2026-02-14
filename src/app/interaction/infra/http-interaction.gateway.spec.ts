import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { HttpInteractionGateway } from './http-interaction.gateway';
import { InteractionGateway } from '../domain/gateways/interaction.gateway';
import { Interaction, TypeInteraction } from '../domain/models/interaction.model';

describe('HttpInteractionGateway', () => {
  let gateway: InteractionGateway;
  let httpTesting: HttpTestingController;

  const mockInteraction: Interaction = {
    id: 1,
    contactId: 1,
    type: TypeInteraction.EMAIL,
    notes: 'Envoi proposition',
    date: '2026-02-01T09:00:00.000Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: InteractionGateway, useClass: HttpInteractionGateway },
      ],
    });
    gateway = TestBed.inject(InteractionGateway);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(gateway).toBeTruthy();
  });

  it('should fetch interactions and update BehaviorSubject', () => {
    let result: Interaction[] = [];

    gateway.interactions$.subscribe((i) => (result = i));
    gateway.getInteractions();

    const req = httpTesting.expectOne('http://localhost:3000/interactions');
    expect(req.request.method).toBe('GET');
    req.flush([mockInteraction]);

    expect(result).toEqual([mockInteraction]);
  });

  it('should get interactions by contact id', () => {
    let result: Interaction[] = [];

    gateway.getInteractionsByContactId(1).subscribe((i) => (result = i));

    const req = httpTesting.expectOne('http://localhost:3000/interactions?contactId=1');
    expect(req.request.method).toBe('GET');
    req.flush([mockInteraction]);

    expect(result).toEqual([mockInteraction]);
  });

  it('should add interaction and update BehaviorSubject', () => {
    const { id, ...newInteraction } = mockInteraction;
    let result: Interaction[] = [];

    gateway.interactions$.subscribe((i) => (result = i));
    gateway.addInteraction(newInteraction).subscribe();

    const req = httpTesting.expectOne('http://localhost:3000/interactions');
    expect(req.request.method).toBe('POST');
    req.flush(mockInteraction);

    expect(result.length).toBe(1);
    expect(result[0]).toEqual(mockInteraction);
  });
});
