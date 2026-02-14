import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StatutContact, STATUT_ORDER } from '../../domain/models/contact.model';
import { Interaction } from '../../../interaction/domain/models/interaction.model';
import { GetContactsUseCase } from '../../domain/use-cases/get-contacts.use-case';
import { GetInteractionsUseCase } from '../../../interaction/domain/use-cases/get-interactions.use-case';
import { StatusBadge } from '../status-badge/status-badge';

@Component({
  selector: 'app-contact-list',
  imports: [RouterLink, StatusBadge],
  templateUrl: './contact-list.html',
})
export default class ContactList implements OnInit {
  private readonly _getContacts = inject(GetContactsUseCase);
  private readonly _getInteractions = inject(GetInteractionsUseCase);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);

  protected readonly contacts = toSignal(this._getContacts.contacts$, { initialValue: [] });
  protected readonly interactions = toSignal(this._getInteractions.interactions$, {
    initialValue: [],
  });

  protected readonly filterStatut = signal<StatutContact | null>(null);
  protected readonly sortBy = signal<'statut' | 'derniere-interaction'>('statut');

  protected readonly statuts = Object.values(StatutContact);

  protected readonly filteredContacts = computed(() => {
    let result = this.contacts();
    const filtre = this.filterStatut();

    if (filtre) {
      result = result.filter((c) => c.statut === filtre);
    }

    const sort = this.sortBy();
    if (sort === 'statut') {
      result = [...result].sort((a, b) => STATUT_ORDER[a.statut] - STATUT_ORDER[b.statut]);
    } else if (sort === 'derniere-interaction') {
      const interactionMap = this._buildInteractionMap(this.interactions());
      result = [...result].sort((a, b) => {
        const dateA = interactionMap.get(a.id) ?? '';
        const dateB = interactionMap.get(b.id) ?? '';
        return dateB.localeCompare(dateA);
      });
    }

    return result;
  });

  ngOnInit(): void {
    this._getContacts.execute();
    this._getInteractions.execute();

    const params = this._route.snapshot.queryParams;
    if (params['statut'] && Object.values(StatutContact).includes(params['statut'])) {
      this.filterStatut.set(params['statut'] as StatutContact);
    }
    if (params['tri'] === 'statut' || params['tri'] === 'derniere-interaction') {
      this.sortBy.set(params['tri']);
    }
  }

  protected setFilterStatut(statut: StatutContact | null): void {
    this.filterStatut.set(statut);
    this._updateQueryParams();
  }

  protected setSortBy(sort: 'statut' | 'derniere-interaction'): void {
    this.sortBy.set(sort);
    this._updateQueryParams();
  }

  protected navigateToInteraction(contactId: number): void {
    this._router.navigate(['/contacts', contactId, 'interactions', 'new']);
  }

  private _updateQueryParams(): void {
    const queryParams: Record<string, string | null> = {
      statut: this.filterStatut() ?? null,
      tri: this.sortBy(),
    };
    this._router.navigate([], { queryParams, queryParamsHandling: 'merge' });
  }

  private _buildInteractionMap(interactions: Interaction[]): Map<number, string> {
    const map = new Map<number, string>();
    for (const interaction of interactions) {
      const current = map.get(interaction.contactId);
      if (!current || interaction.date > current) {
        map.set(interaction.contactId, interaction.date);
      }
    }
    return map;
  }
}
