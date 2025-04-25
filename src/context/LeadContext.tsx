import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lead, FunnelStage, LeadStatus, LeadSource } from '../types';

type LeadContextType = {
  leads: Lead[];
  isLoading: boolean;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  getLead: (id: string) => Lead | undefined;
  filteredLeads: (stage?: FunnelStage | 'all') => Lead[];
};

const LeadContext = createContext<LeadContextType | undefined>(undefined);

// Mock data for demonstration purposes
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Carlos Oliveira',
    phone: '(11) 98765-4321',
    source: 'instagram',
    stage: 'new',
    status: 'active',
    interest: 'SUV compacto',
    notes: 'Interessado no modelo XYZ, precisa de financiamento',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Maria Silva',
    phone: '(11) 91234-5678',
    source: 'whatsapp',
    stage: 'qualifying',
    status: 'active',
    interest: 'Sedan médio',
    notes: 'Já possui um veículo, busca upgrade',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Lucas Mendes',
    phone: '(11) 97777-8888',
    source: 'website',
    stage: 'proposal',
    status: 'active',
    interest: 'Picape',
    notes: 'Negociando desconto, quer fechar na próxima semana',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Ana Paula Costa',
    phone: '(11) 95555-4444',
    source: 'referral',
    stage: 'closed',
    status: 'won',
    interest: 'Hatch esportivo',
    notes: 'Fechou compra à vista',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export function LeadProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    // For demo, we'll use the mock data with a delay
    const loadLeads = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLeads(mockLeads);
      setIsLoading(false);
    };
    
    loadLeads();
  }, []);

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setLeads(prevLeads => [newLead, ...prevLeads]);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === id 
          ? { ...lead, ...updates, updatedAt: new Date() } 
          : lead
      )
    );
  };

  const getLead = (id: string) => {
    return leads.find(lead => lead.id === id);
  };

  const filteredLeads = (stage?: FunnelStage | 'all') => {
    if (!stage || stage === 'all') {
      return leads;
    }
    return leads.filter(lead => lead.stage === stage);
  };

  return (
    <LeadContext.Provider value={{ 
      leads, 
      isLoading, 
      addLead, 
      updateLead, 
      getLead, 
      filteredLeads 
    }}>
      {children}
    </LeadContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
}