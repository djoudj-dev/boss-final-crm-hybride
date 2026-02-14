import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Interaction } from '../models/interaction.model';
import { InteractionGateway } from '../gateways/interaction.gateway';

@Injectable({ providedIn: 'root' })
export class GetInteractionsByContactIdUseCase {
  private readonly _gateway = inject(InteractionGateway);

  execute(contactId: number): Observable<Interaction[]> {
    return this._gateway.getInteractionsByContactId(contactId);
  }
}
