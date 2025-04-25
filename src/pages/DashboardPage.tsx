import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FunnelStage } from '../types';
import { PageContainer } from '../components/layout/PageContainer';
import { Header } from '../components/layout/Header';
import { LeadCard } from '../components/lead/LeadCard';
import { StageFilter } from '../components/lead/StageFilter';
import { DateFilter } from '../components/lead/DateFilter';
import { useLeads } from '../context/LeadContext';

export function DashboardPage() {
  const [activeStage, setActiveStage] = useState<FunnelStage | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const { leads, filteredLeads, isLoading } = useLeads();
  const navigate = useNavigate();
  
  // Calculate the count of leads for each stage
  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: leads.length,
      new: 0,
      qualifying: 0,
      proposal: 0,
      rejected: 0,
      closed: 0
    };
    
    leads.forEach(lead => {
      if (counts[lead.stage] !== undefined) {
        counts[lead.stage]++;
      }
    });
    
    return counts;
  }, [leads]);
  
  const filteredLeadsList = filteredLeads(activeStage).filter(lead => {
    if (!startDate && !endDate) return true;
    
    const leadDate = new Date(lead.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start && end) {
      return leadDate >= start && leadDate <= end;
    } else if (start) {
      return leadDate >= start;
    } else if (end) {
      return leadDate <= end;
    }
    
    return true;
  });

  return (
    <>
      <Header title="Meus Leads" />
      
      <PageContainer>
        <DateFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        
        <StageFilter 
          activeStage={activeStage} 
          onChange={(stage) => setActiveStage(stage)}
          stageCounts={stageCounts}
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500">Carregando leads...</p>
          </div>
        ) : filteredLeadsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
            <p className="text-gray-500 mb-2">Nenhum lead encontrado</p>
            <p className="text-gray-400 text-sm">
              {activeStage === 'all' 
                ? 'Adicione seu primeiro lead clicando no botão +' 
                : 'Tente mudar o filtro para encontrar leads'}
            </p>
          </div>
        ) : (
          <div className="mt-4">
            {filteredLeadsList.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={() => navigate(`/lead/${lead.id}`)}
              />
            ))}
          </div>
        )}
      </PageContainer>
    </>
  );
}