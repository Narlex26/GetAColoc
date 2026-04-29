import type { Logement } from '../../types';
import type { ReactNode } from 'react';

interface LogementCardProps {
  logement: Logement;
  action?: ReactNode;
}

export default function LogementCard({ logement, action }: LogementCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-syne font-bold text-dark-blue text-base">
            {logement.ville}
            {logement.quartier && <span className="text-gray-400 font-normal"> · {logement.quartier}</span>}
          </p>
          <p className="text-gray-500 text-xs mt-0.5">{logement.code_postal}</p>
        </div>
        <p className="font-syne font-black text-dark-blue text-lg">
          {logement.prix} €<span className="text-xs font-normal text-gray-400">/mois</span>
        </p>
      </div>
      <div className="flex gap-2 flex-wrap mb-4">
        {logement.superficie && (
          <span className="bg-blue-100 text-dark-blue text-xs px-3 py-1 rounded-full font-inter">
            {logement.superficie} m²
          </span>
        )}
        {logement.etage !== null && logement.etage !== undefined && (
          <span className="bg-blue-100 text-dark-blue text-xs px-3 py-1 rounded-full font-inter">
            Étage {logement.etage}
          </span>
        )}
        <span className={`text-xs px-3 py-1 rounded-full font-inter ${logement.meuble ? 'bg-orange-400/20 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
          {logement.meuble ? '✓ Meublé' : 'Non meublé'}
        </span>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
