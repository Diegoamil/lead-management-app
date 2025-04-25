import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lead, FunnelStage } from '../types';
import { fetchLeads, fetchLeadById, createLead, updateLead } from '../api/leadApi';
import { useAuth } from './AuthContext';

type LeadContextType = {
  leads: Lead[];
  isLoading: boolean;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  getLead: (id: string) => Promise<Lead | undefined>;
  filteredLeads: (stage?: FunnelStage | 'all') => Lead[];
};

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export function LeadProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Carregar leads quando o usuário estiver logado
    const loadLeads = async () => {
      if (!user || !user.id || !user.companyId) {
        setLeads([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const leadsData = await fetchLeads(user.id, user.companyId);
        
        // Converter as datas de string para objeto Date
        const formattedLeads = leadsData.map(lead => ({
          ...lead,
          createdAt: new Date(lead.createdAt),
          updatedAt: new Date(lead.updatedAt)
        }));
        
        setLeads(formattedLeads);
      } catch (error) {
        console.error('Erro ao carregar leads:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLeads();
  }, [user]);

  const addLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    if (!user || !user.id || !user.companyId) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const newLead = await createLead(leadData, user.id, user.companyId);
      
      // Converter as datas de string para objeto Date
      const formattedLead = {
        ...newLead,
        createdAt: new Date(newLead.createdAt),
        updatedAt: new Date(newLead.updatedAt)
      };
      
      setLeads(prevLeads => [formattedLead, ...prevLeads]);
    } catch (error) {
      console.error('Erro ao adicionar lead:', error);
      throw error;
    }
  };

  const updateLeadState = async (id: string, updates: Partial<Lead>): Promise<void> => {
    if (!user || !user.id || !user.companyId) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const updatedLead = await updateLead(id, updates, user.id, user.companyId);
      
      // Converter as datas de string para objeto Date
      const formattedLead = {
        ...updatedLead,
        createdAt: new Date(updatedLead.createdAt),
        updatedAt: new Date(updatedLead.updatedAt)
      };
      
      // Atualizar o estado local
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === id 
            ? formattedLead
            : lead
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      throw error;
    }
  };

  const getLead = async (id: string): Promise<Lead | undefined> => {
    if (!user || !user.id || !user.companyId) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const lead = await fetchLeadById(id, user.id, user.companyId);
      
      // Converter as datas de string para objeto Date
      return {
        ...lead,
        createdAt: new Date(lead.createdAt),
        updatedAt: new Date(lead.updatedAt)
      };
    } catch (error) {
      console.error(`Erro ao buscar lead ${id}:`, error);
      return undefined;
    }
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
      updateLead: updateLeadState, 
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