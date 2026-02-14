import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Interaction } from '../models/interaction.model';
import { InteractionGateway } from '../gateways/interaction.gateway';

@Injectable({ providedIn: 'root' })
export class AddInteractionUseCase {
  private readonly _gateway = inject(InteractionGateway);

  execute(interaction: Omit<Interaction, 'id'>): Observable<Interaction> {
    return this._gateway.addInteraction(interaction);
  }
}
