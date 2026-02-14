import { StatutContact } from '../../../contact/domain/models/contact.model';

export enum TypeInteraction {
  TELEPHONE = 'telephone',
  EMAIL = 'email',
  LINKEDIN = 'linkedin',
}

export type Interaction = {
  id: number;
  contactId: number;
  type: TypeInteraction;
  notes: string;
  date: string;
  nouveauStatut?: StatutContact;
};
