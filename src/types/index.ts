export interface Utilisateur {
  id_user: number;
  mail: string;
  telephone?: string;
  nom: string;
  prenom: string;
  type: 'locataire' | 'proprietaire';
  date_creation?: string;
}

export interface Locataire extends Utilisateur {
  id_locataire: number;
  age?: number;
  sexe?: 'M' | 'F' | 'A';
  description?: string;
}

export interface Proprietaire extends Utilisateur {
  id_proprio: number;
}

export interface Logement {
  id_logement: number;
  code_postal: string;
  quartier?: string;
  prix: number;
  superficie?: string;
  etage?: number;
  ville: string;
  meuble: boolean;
  date_creation?: string;
}

export interface Groupe {
  id_group: number;
  description?: string;
  date_creation?: string;
  nombre_membres: number;
}
