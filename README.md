# Mini CRM Hybride

> Boss de fin du module **RxJS & Signals** — [Easy Angular Kit](https://easyangularkit.com?via=djoudj) par [Gaetan Redin](https://www.linkedin.com/in/gaetan-redin/)

Application de gestion de la relation client (CRM) construite avec **Angular 21**, combinant **RxJS** pour les flux asynchrones et **Signals** pour l'etat reactif des composants, le tout structure en **clean architecture par feature**.

---

## Fonctionnalites

| Fonctionnalite | Description |
|---|---|
| **Creer un contact** | Formulaire avec validation (nom, prenom, poste, entreprise + au moins un moyen de contact). Statut `NOUVEAU` attribue automatiquement. |
| **Lister les contacts** | Tableau affichant nom, prenom, poste, entreprise et statut avec badge colore. |
| **Filtrer par statut** | Boutons de filtre : Tous, NOUVEAU, PROSPECT, CLIENT, PERDU. |
| **Trier** | Par statut (ordre metier par defaut) ou par date de derniere interaction. |
| **Persistance des filtres** | Filtres et tri conserves dans les query params de l'URL, persistes au rafraichissement. |
| **Ajouter une interaction** | Formulaire contextuel par contact (type, notes, date). Le type disponible depend des coordonnees du contact. |
| **Mise a jour du statut** | Champ optionnel dans le formulaire d'interaction pour faire evoluer le statut du contact. |

---

## Stack technique

| Technologie | Version | Role |
|---|---|---|
| Angular | 21 | Framework applicatif (standalone components, signals) |
| RxJS | 7.8 | Flux asynchrones (HTTP, stores) |
| TailwindCSS | 4 | Styles utilitaires avec theme custom |
| Vitest | 4 | Tests unitaires (jsdom) |
| json-server | 0.17 | API REST mock (stockage `db.json`) |
| TypeScript | 5.9 | Typage strict |

---

## Demarrage rapide

```bash
# Installer les dependances
npm install

# Lancer l'API mock (port 3000)
npm run api

# Lancer le serveur de dev (port 4200) — dans un autre terminal
npm start
```

L'application est accessible sur `http://localhost:4200`.

### Commandes utiles

```bash
npm test          # Lancer les 35 tests
npm run build     # Build de production
```

---

## Architecture

Le projet suit une **clean architecture par feature** inspiree du module 3 du cours EAK (approche pragmatique).

```
src/app/
├── app.ts                          # Composant racine (navigation)
├── app.config.ts                   # Providers (gateways, router, HTTP)
├── app.routes.ts                   # Configuration des routes
│
├── contact/                        # Feature Contact
│   ├── domain/
│   │   ├── models/
│   │   │   └── contact.model.ts        # Type Contact, enum StatutContact
│   │   ├── gateways/
│   │   │   └── contact.gateway.ts      # Abstract class (token DI)
│   │   ├── validators/
│   │   │   └── at-least-one-contact.validator.ts
│   │   └── use-cases/
│   │       ├── get-contacts.use-case.ts
│   │       ├── get-contact-by-id.use-case.ts
│   │       ├── add-contact.use-case.ts
│   │       └── update-contact.use-case.ts
│   ├── infra/
│   │   └── http-contact.gateway.ts     # Implementation HTTP (json-server)
│   └── application/
│       ├── contact-list/               # Page liste des contacts
│       ├── contact-form/               # Page creation de contact
│       └── status-badge/               # Composant badge de statut
│
├── interaction/                    # Feature Interaction
│   ├── domain/
│   │   ├── models/
│   │   │   └── interaction.model.ts    # Type Interaction, enum TypeInteraction
│   │   ├── gateways/
│   │   │   └── interaction.gateway.ts  # Abstract class (token DI)
│   │   └── use-cases/
│   │       ├── get-interactions.use-case.ts
│   │       ├── get-interactions-by-contact-id.use-case.ts
│   │       └── add-interaction.use-case.ts
│   ├── infra/
│   │   └── http-interaction.gateway.ts
│   └── application/
│       └── interaction-form/           # Page creation d'interaction
│
└── not-found/                      # Page 404
```

### Les 3 couches

| Couche | Contenu | Depend de |
|---|---|---|
| **domain** | Types, abstract gateways, validators, use cases | Rien (pur TypeScript + RxJS) |
| **infra** | Implementation concrete des gateways (`HttpClient`) | domain |
| **application** | Composants Angular (smart components) | domain (via use cases) |

### Patterns appliques

**Abstract class comme token DI** — Les gateways sont des classes abstraites qui servent a la fois de contrat et de token d'injection. Le cablage se fait dans `app.config.ts` :

```typescript
{ provide: ContactGateway, useClass: HttpContactGateway }
```

Pour passer en in-memory, il suffit de changer une ligne :

```typescript
{ provide: ContactGateway, useClass: InMemoryContactGateway }
```

**Use cases injectables** — Chaque operation metier est un use case `@Injectable({ providedIn: 'root' })` qui injecte la gateway abstraite :

```typescript
@Injectable({ providedIn: 'root' })
export class GetContactsUseCase {
  private readonly _gateway = inject(ContactGateway);
  readonly contacts$ = this._gateway.contacts$;
  execute(): void { this._gateway.getContacts(); }
}
```

**Composants smart** — Les composants injectent les use cases, jamais les gateways directement.

---

## Approche hybride RxJS + Signals

L'architecture suit le pattern recommande par le module 6 du cours EAK :

| Couche | Technologie | Pourquoi |
|---|---|---|
| Gateway / Store | **RxJS** (`BehaviorSubject`, `Observable`) | Flux HTTP asynchrones, gestion d'etat reactif |
| Composants | **Signals** (`signal`, `computed`, `toSignal`) | Etat local synchrone, derivation declarative |
| Pont | **`toSignal()`** | Convertit les observables du store en signals pour le template |

Exemple concret dans `contact-list.ts` :

```typescript
// RxJS → Signal via toSignal()
private readonly _getContacts = inject(GetContactsUseCase);
protected readonly contacts = toSignal(this._getContacts.contacts$, { initialValue: [] });

// Signal pur pour l'etat local du composant
protected readonly filterStatut = signal<StatutContact | null>(null);
protected readonly sortBy = signal<'statut' | 'derniere-interaction'>('statut');

// Computed derivant les deux sources (RxJS converti + signal local)
protected readonly filteredContacts = computed(() => {
  let result = this.contacts();
  const filtre = this.filterStatut();
  if (filtre) result = result.filter(c => c.statut === filtre);
  // ... tri
  return result;
});
```

**Regle de decision :**
- Etat synchrone local (filtre, tri, formulaire) → `signal()` + `computed()`
- Flux async (HTTP, store) → `Observable` + operateurs RxJS
- Observable dans le template → `toSignal(obs$, { initialValue })`

---

## Formulaires

Les formulaires suivent les patterns du module 2 du cours EAK (ReactiveForms) :

- **Typage explicite** avec `FormGroup<Type>` et `new FormControl` (pas de `FormBuilder`)
- **Acces type** aux controles via `form.controls.nom` (pas de `.get('nom')`)
- **Validation d'erreur** via `errors?.['required']` (pas de `hasError()`)
- **Bouton desactive** avec `[disabled]="form.invalid"` (pas de `markAllAsTouched`)
- **Validateur custom** `atLeastOneContact` cross-field pour imposer au moins un moyen de contact (email, telephone ou linkedin)

---

## Routing

Configuration suivant le module 5 du cours EAK :

| Route | Chargement | Description |
|---|---|---|
| `/contacts` | Eager | Page principale (liste des contacts) |
| `/contacts/new` | Lazy | Formulaire de creation de contact |
| `/contacts/:contactId/interactions/new` | Lazy | Formulaire d'interaction |
| `**` | Lazy | Page 404 |

- **Query params** pour persister filtres et tri (`?statut=CLIENT&tri=statut`)
- `withComponentInputBinding()` pour injecter les params de route comme `input()`
- Redirection automatique de `/` vers `/contacts`

---

## Tests

35 tests couvrant toutes les couches :

```
 src/app/app.spec.ts                                       →  2 tests  (navigation, titre)
 src/app/contact/domain/validators/...spec.ts               →  4 tests  (validateur custom)
 src/app/contact/infra/http-contact.gateway.spec.ts         →  5 tests  (appels HTTP)
 src/app/interaction/infra/http-interaction.gateway.spec.ts →  4 tests  (appels HTTP)
 src/app/contact/application/contact-list/...spec.ts        →  7 tests  (affichage, filtre, tri)
 src/app/contact/application/contact-form/...spec.ts        →  7 tests  (validation, soumission)
 src/app/interaction/application/interaction-form/...spec.ts →  6 tests  (types dynamiques, statut)
```

**Strategie de test par couche :**

| Couche | Approche |
|---|---|
| **domain/validators** | Test unitaire pur TypeScript (pas besoin de TestBed) |
| **infra/gateways** | `HttpTestingController` pour verifier les appels HTTP reels |
| **application/composants** | Mock gateway fournie via `{ provide: Gateway, useValue: mock }` — les use cases se resolvent automatiquement via le provider mock |

---

## Regles metier

- Un contact doit avoir au moins **un moyen de communication** (email, telephone ou linkedin)
- Le statut par defaut a la creation est **NOUVEAU**
- L'ordre des statuts suit la progression commerciale : `NOUVEAU → PROSPECT → CLIENT → PERDU`
- Le **type d'interaction** disponible depend des coordonnees renseignees sur le contact
- Si un seul type est possible, il est **pre-selectionne et desactive**
- La **date du jour** est proposee par defaut pour chaque nouvelle interaction
- Le **statut du contact** peut etre mis a jour lors de l'ajout d'une interaction (champ optionnel)

---

## API (json-server)

Le fichier `db.json` a la racine du projet expose deux ressources REST :

| Endpoint | Methodes | Description |
|---|---|---|
| `/contacts` | GET, POST | Liste et creation de contacts |
| `/contacts/:id` | GET, PUT | Detail et mise a jour d'un contact |
| `/interactions` | GET, POST | Liste et creation d'interactions |
| `/interactions?contactId=:id` | GET | Interactions filtrees par contact |

---

## Cours de reference

Ce projet est le **boss de fin** du module **6. RxJS & Signals** du cours [Easy Angular Kit](https://easyangularkit.com?via=djoudj), integrant les concepts des modules precedents :

| Module | Concepts appliques |
|---|---|
| **Module 2** | ReactiveForms types, validateurs custom, `FormGroup<Type>` |
| **Module 3** | Clean architecture par feature (domain / infra / application) |
| **Module 5** | Routing, lazy loading, query params, wildcard 404 |
| **Module 6** | Hybridation RxJS (BehaviorSubject) + Signals (`toSignal`, `computed`) |
