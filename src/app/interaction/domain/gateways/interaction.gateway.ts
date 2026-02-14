import { Observable } from 'rxjs';
import { Interaction } from '../models/interaction.model';

export abstract class InteractionGateway {
  abstract interactions$: Observable<Interaction[]>;
  abstract getInteractions(): void;
  abstract getInteractionsByContactId(contactId: number): Observable<Interaction[]>;
  abstract addInteraction(interaction: Omit<Interaction, 'id'>): Observable<Interaction>;
}
