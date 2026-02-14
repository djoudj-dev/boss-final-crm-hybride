import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Interaction } from '../models/interaction.model';
import { InteractionGateway } from '../gateways/interaction.gateway';

@Injectable({ providedIn: 'root' })
export class GetInteractionsUseCase {
  private readonly _gateway = inject(InteractionGateway);

  readonly interactions$: Observable<Interaction[]> = this._gateway.interactions$;

  execute(): void {
    this._gateway.getInteractions();
  }
}
