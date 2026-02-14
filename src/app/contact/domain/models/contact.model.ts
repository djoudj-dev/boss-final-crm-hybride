export enum StatutContact {
  NOUVEAU = 'NOUVEAU',
  PROSPECT = 'PROSPECT',
  CLIENT = 'CLIENT',
  PERDU = 'PERDU',
}

export const STATUT_ORDER: Record<StatutContact, number> = {
  [StatutContact.NOUVEAU]: 0,
  [StatutContact.PROSPECT]: 1,
  [StatutContact.CLIENT]: 2,
  [StatutContact.PERDU]: 3,
};

export type Contact = {
  id: number;
  nom: string;
  prenom: string;
  poste: string;
  entreprise: string;
  email?: string;
  telephone?: string;
  linkedin?: string;
  statut: StatutContact;
  dateCreation: string;
};
