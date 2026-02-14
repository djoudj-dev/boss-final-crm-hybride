import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Interaction } from '../domain/models/interaction.model';
import { InteractionGateway } from '../domain/gateways/interaction.gateway';

@Injectable()
export class HttpInteractionGateway implements InteractionGateway {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = 'http://localhost:3000/interactions';

  private readonly _interactions$ = new BehaviorSubject<Interaction[]>([]);
  readonly interactions$ = this._interactions$.asObservable();

  getInteractions(): void {
    this._http.get<Interaction[]>(this._apiUrl).subscribe((interactions) => {
      this._interactions$.next(interactions);
    });
  }

  getInteractionsByContactId(contactId: number): Observable<Interaction[]> {
    return this._http.get<Interaction[]>(`${this._apiUrl}?contactId=${contactId}`);
  }

  addInteraction(interaction: Omit<Interaction, 'id'>): Observable<Interaction> {
    return this._http.post<Interaction>(this._apiUrl, interaction).pipe(
      tap((newInteraction) => {
        this._interactions$.next([...this._interactions$.getValue(), newInteraction]);
      })
    );
  }
}
