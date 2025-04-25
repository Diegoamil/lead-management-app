import React from 'react';
import { Phone, Clock } from 'lucide-react';
import { Lead } from '../../types';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';

const stageLabelMap = {
  new: 'Novo',
  qualifying: 'Qualificando',
  proposal: 'Proposta',
  rejected: 'Ficha recusada',
  closed: 'Fechado'
};

type LeadCardProps = {
  lead: Lead;
  onClick: () => void;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="mb-3"
    >
      <div className="flex items-start gap-3">
        <Avatar name={lead.name} imageUrl={lead.imageUrl} />
        
        <div className="flex-1 space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
              <Badge 
                variant={lead.stage} 
                label={stageLabelMap[lead.stage]}
              />
            </div>
            
            <div className="flex items-center mt-1.5 text-gray-600">
              <Phone size={14} className="mr-1.5" />
              <span>{lead.phone}</span>
            </div>

            <div className="flex items-center mt-1.5 text-gray-500 text-sm">
              <Clock size={14} className="mr-1.5" />
              <span>{formatDate(lead.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}