import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { ContactGateway } from './contact/domain/gateways/contact.gateway';
import { HttpContactGateway } from './contact/infra/http-contact.gateway';
import { InteractionGateway } from './interaction/domain/gateways/interaction.gateway';
import { HttpInteractionGateway } from './interaction/infra/http-interaction.gateway';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    { provide: ContactGateway, useClass: HttpContactGateway },
    { provide: InteractionGateway, useClass: HttpInteractionGateway },
  ],
};
