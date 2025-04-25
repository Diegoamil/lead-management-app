import React, { createContext, useContext, useState, useEffect } from 'react';
import { Seller } from '../types';
import { fetchSellers, createSeller, updateSellerById, fetchSellersByCompany } from '../api/sellerApi';

type SellerContextType = {
  sellers: Seller[];
  isLoading: boolean;
  addSeller: (seller: Omit<Seller, 'id' | 'createdAt' | 'updatedAt'> & { password?: string }) => Promise<void>;
  updateSeller: (id: string, updates: Partial<Seller> & { password?: string }) => Promise<void>;
  getSeller: (id: string) => Seller | undefined;
  getSellersByCompany: (companyId: string) => Seller[];
};

const SellerContext = createContext<SellerContextType | undefined>(undefined);

export function SellerProvider({ children }: { children: React.ReactNode }) {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar vendedores do banco de dados
    const loadSellers = async () => {
      try {
        setIsLoading(true);
        
        // Buscar vendedores do banco de dados
        const dbSellers = await fetchSellers();
        setSellers(dbSellers);
      } catch (error) {
        console.error('Erro ao carregar vendedores:', error);
        // Fallback para lista vazia em caso de erro
        setSellers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSellers();
  }, []);

  const addSeller = async (sellerData: Omit<Seller, 'id' | 'createdAt' | 'updatedAt'> & { password?: string }): Promise<void> => {
    try {
      if (!sellerData.password) {
        throw new Error('Senha é obrigatória para criar um vendedor');
      }
      
      // Adicionar vendedor no banco de dados
      const newSeller = await createSeller(sellerData as any);
      
      // Atualizar o estado local
      setSellers(prevSellers => [...prevSellers, newSeller]);
    } catch (error) {
      console.error('Erro ao adicionar vendedor:', error);
      throw error;
    }
  };

  const updateSeller = async (id: string, updates: Partial<Seller> & { password?: string }): Promise<void> => {
    try {
      // Atualizar vendedor no banco de dados
      const updatedSeller = await updateSellerById(id, updates);
      
      // Atualizar o estado local
      setSellers(prevSellers => 
        prevSellers.map(seller => 
          seller.id === id 
            ? updatedSeller
            : seller
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar vendedor:', error);
      throw error;
    }
  };

  const getSeller = (id: string) => {
    return sellers.find(seller => seller.id === id);
  };

  const getSellersByCompany = (companyId: string) => {
    return sellers.filter(seller => seller.companyId === companyId);
  };

  return (
    <SellerContext.Provider value={{ 
      sellers, 
      isLoading, 
      addSeller, 
      updateSeller, 
      getSeller,
      getSellersByCompany
    }}>
      {children}
    </SellerContext.Provider>
  );
}

export function useSellers() {
  const context = useContext(SellerContext);
  if (context === undefined) {
    throw new Error('useSellers must be used within a SellerProvider');
  }
  return context;
}
