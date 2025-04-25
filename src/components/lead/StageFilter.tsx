import React from 'react';
import { FunnelStage } from '../../types';

type StageFilterProps = {
  activeStage: FunnelStage | 'all';
  onChange: (stage: FunnelStage | 'all') => void;
  stageCounts: Record<string, number>;
};

export function StageFilter({ activeStage, onChange, stageCounts }: StageFilterProps) {
  const stages: { value: FunnelStage | 'all'; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'new', label: 'Novos' },
    { value: 'qualifying', label: 'Qualificando' },
    { value: 'proposal', label: 'Proposta' },
    { value: 'rejected', label: 'Ficha recusada' },
    { value: 'closed', label: 'Fechados' }
  ];

  return (
    <div className="flex overflow-x-auto py-2 -mx-4 px-4 mb-3 sticky top-16 bg-gray-50 z-10">
      <div className="flex space-x-2">
        {stages.map((stage) => {
          // Safely get the count, defaulting to 0 if undefined
          const count = stageCounts[stage.value] !== undefined ? stageCounts[stage.value] : 0;
          
          return (
            <button
              key={stage.value}
              onClick={() => onChange(stage.value)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all flex items-center ${
                activeStage === stage.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              <span>{stage.label}</span>
              
              <span className={`ml-2 inline-flex items-center justify-center rounded-full text-xs w-5 h-5 ${
                activeStage === stage.value 
                  ? 'bg-white text-blue-600' 
                  : 'bg-gray-100 text-gray-600'
              } font-medium`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}