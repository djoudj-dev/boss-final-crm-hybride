import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section aria-labelledby="not-found-title" class="text-center py-16">
      <h1 id="not-found-title" class="text-4xl font-bold text-islands-text mb-4">404</h1>
      <p class="text-islands-text-muted mb-6">Page introuvable</p>
      <a
        routerLink="/contacts"
        class="text-islands-blue hover:text-white transition-colors"
      >
        Retour aux contacts
      </a>
    </section>
  `,
})
export default class NotFound {}
