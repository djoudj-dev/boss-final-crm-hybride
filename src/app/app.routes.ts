import { Routes } from '@angular/router';
import ContactList from './contact/application/contact-list/contact-list';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'contacts',
    pathMatch: 'full',
  },
  {
    path: 'contacts',
    component: ContactList,
  },
  {
    path: 'contacts/new',
    loadComponent: () => import('./contact/application/contact-form/contact-form'),
  },
  {
    path: 'contacts/:contactId/interactions/new',
    loadComponent: () => import('./interaction/application/interaction-form/interaction-form'),
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found'),
  },
];
