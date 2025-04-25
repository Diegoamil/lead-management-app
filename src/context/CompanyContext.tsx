import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company } from '../types';
import { fetchCompanies, createCompany, updateCompanyById } from '../api/companyApi';

type CompanyContextType = {
  companies: Company[];
  isLoading: boolean;
  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCompany: (id: string, updates: Partial<Company>) => Promise<void>;
  getCompany: (id: string) => Company | undefined;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar empresas do banco de dados
    const loadCompanies = async () => {
      try {
        setIsLoading(true);
        
        // Buscar empresas do banco de dados
        const dbCompanies = await fetchCompanies();
        setCompanies(dbCompanies);
      } catch (error) {
        console.error('Erro ao carregar empresas:', error);
        // Fallback para dados mockados em caso de erro
        setCompanies([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCompanies();
  }, []);

  const addCompany = async (companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    try {
      // Adicionar empresa no banco de dados
      const newCompany = await createCompany(companyData);
      
      // Atualizar o estado local
      setCompanies(prevCompanies => [...prevCompanies, newCompany]);
    } catch (error) {
      console.error('Erro ao adicionar empresa:', error);
      throw error;
    }
  };

  const updateCompany = async (id: string, updates: Partial<Company>): Promise<void> => {
    try {
      // Atualizar empresa no banco de dados
      const updatedCompany = await updateCompanyById(id, updates);
      
      // Atualizar o estado local
      setCompanies(prevCompanies => 
        prevCompanies.map(company => 
          company.id === id 
            ? updatedCompany
            : company
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      throw error;
    }
  };

  const getCompany = (id: string) => {
    return companies.find(company => company.id === id);
  };

  return (
    <CompanyContext.Provider value={{ 
      companies, 
      isLoading, 
      addCompany, 
      updateCompany, 
      getCompany
    }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompanies() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompanies must be used within a CompanyProvider');
  }
  return context;
}
