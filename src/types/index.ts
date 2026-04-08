// Aligné approximativement sur les modèles Flask (app/models).
// À affiner au fur et à mesure que les schémas se stabilisent.

export interface Utilisateur {
  id: number;
  email: string;
  nom?: string;
  prenom?: string;
  role?: "locataire" | "proprietaire" | string;
}

export interface Photo {
  id: number;
  url: string;
  logement_id?: number;
}

export interface Logement {
  id: number;
  titre: string;
  description?: string;
  prix?: number;
  ville?: string;
  adresse?: string;
  surface?: number;
  nb_chambres?: number;
  proprietaire_id?: number;
  photos?: Photo[];
}

export interface Groupe {
  id: number;
  nom: string;
  description?: string;
  membres?: Utilisateur[];
}
