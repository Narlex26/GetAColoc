import type { Locataire } from '../../types';
import type { ReactNode } from 'react';

interface LocataireCardProps {
  locataire: Locataire;
  action?: ReactNode;
}

const sexeLabel: Record<string, string> = { M: 'Homme', F: 'Femme', A: 'Autre' };

export default function LocataireCard({ locataire, action }: LocataireCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-syne font-bold text-dark-blue text-base">{locataire.prenom} {locataire.nom}</p>
          <div className="flex gap-2 mt-1 flex-wrap">
            {locataire.age && <span className="text-gray-500 text-xs">{locataire.age} ans</span>}
            {locataire.sexe && (
              <span className="text-gray-500 text-xs">· {sexeLabel[locataire.sexe] ?? locataire.sexe}</span>
            )}
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-blue-400 flex items-center justify-center text-white font-syne font-bold text-sm">
          {locataire.prenom[0]}
        </div>
      </div>
      {locataire.description && (
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{locataire.description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
