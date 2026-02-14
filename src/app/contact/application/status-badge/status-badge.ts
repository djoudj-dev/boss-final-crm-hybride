import { Component, computed, input } from '@angular/core';
import { StatutContact } from '../../domain/models/contact.model';

@Component({
  selector: 'app-status-badge',
  imports: [],
  templateUrl: './status-badge.html',
})
export class StatusBadge {
  readonly statut = input.required<StatutContact>();

  protected readonly colorClass = computed(() => {
    switch (this.statut()) {
      case StatutContact.NOUVEAU:
        return 'bg-islands-blue/20 text-islands-blue';
      case StatutContact.PROSPECT:
        return 'bg-islands-orange/20 text-islands-orange';
      case StatutContact.CLIENT:
        return 'bg-islands-green/20 text-islands-green';
      case StatutContact.PERDU:
        return 'bg-islands-red/20 text-islands-red';
    }
  });
}
