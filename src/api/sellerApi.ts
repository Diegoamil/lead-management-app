import { Seller } from '../types';

const API_URL = 'http://localhost:3001/api';

// Função para buscar todos os vendedores
export async function fetchSellers(): Promise<Seller[]> {
  try {
    console.log('Buscando vendedores da API...');
    const response = await fetch(`${API_URL}/sellers`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      console.error('Resposta da API não ok:', response.status, errorData);
      throw new Error(`Erro ao buscar vendedores: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
    }
    
    const sellers = await response.json();
    console.log('Vendedores recebidos:', sellers.length);
    return sellers as Seller[];
  } catch (error) {
    console.error('Erro ao buscar vendedores:', error);
    throw error;
  }
}

// Função para buscar vendedores por empresa
export async function fetchSellersByCompany(companyId: string): Promise<Seller[]> {
  try {
    console.log(`Buscando vendedores da empresa ${companyId}...`);
    const response = await fetch(`${API_URL}/sellers/company/${companyId}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      console.error('Resposta da API não ok:', response.status, errorData);
      throw new Error(`Erro ao buscar vendedores da empresa: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
    }
    
    const sellers = await response.json();
    console.log(`Vendedores da empresa ${companyId} recebidos:`, sellers.length);
    return sellers as Seller[];
  } catch (error) {
    console.error(`Erro ao buscar vendedores da empresa ${companyId}:`, error);
    throw error;
  }
}

// Função para buscar um vendedor por ID
export async function fetchSellerById(id: string): Promise<Seller | null> {
  try {
    console.log(`Buscando vendedor com ID ${id}...`);
    const response = await fetch(`${API_URL}/sellers/${id}`);
    
    if (response.status === 404) {
      console.log(`Vendedor com ID ${id} não encontrado`);
      return null;
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(`Erro ao buscar vendedor: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
    }
    
    const seller = await response.json();
    return seller as Seller;
  } catch (error) {
    console.error(`Erro ao buscar vendedor com ID ${id}:`, error);
    throw error;
  }
}

// Função para criar um novo vendedor com usuário associado
export async function createSeller(sellerData: Omit<Seller, 'id' | 'createdAt' | 'updatedAt'> & { password: string }): Promise<Seller> {
  try {
    console.log('Criando novo vendedor com dados:', sellerData);
    
    const response = await fetch(`${API_URL}/sellers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sellerData),
    });
    
    if (!response.ok) {
      let errorMessage = 'Erro desconhecido';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || 'Erro desconhecido';
      } catch (e) {
        // Ignorar erro ao tentar parsear o corpo da resposta
      }
      
      throw new Error(`Erro ao criar vendedor: ${response.status} - ${errorMessage}`);
    }
    
    const newSeller = await response.json();
    console.log('Novo vendedor criado com sucesso:', newSeller);
    return newSeller as Seller;
  } catch (error) {
    console.error('Erro ao criar vendedor:', error);
    throw error;
  }
}

// Função para atualizar um vendedor existente
export async function updateSellerById(id: string, updates: Partial<Seller>): Promise<Seller> {
  try {
    console.log(`Atualizando vendedor com ID ${id}:`, updates);
    
    // Remover campos que não devem ser enviados para o backend
    const { id: updateId, createdAt, updatedAt, ...updateData } = updates;
    
    const response = await fetch(`${API_URL}/sellers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(`Erro ao atualizar vendedor: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
    }
    
    const updatedSeller = await response.json();
    console.log('Vendedor atualizado com sucesso:', updatedSeller);
    return updatedSeller as Seller;
  } catch (error) {
    console.error(`Erro ao atualizar vendedor com ID ${id}:`, error);
    throw error;
  }
}

// Função para excluir um vendedor
export async function deleteSellerById(id: string): Promise<void> {
  try {
    console.log(`Excluindo vendedor com ID ${id}...`);
    const response = await fetch(`${API_URL}/sellers/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(`Erro ao excluir vendedor: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
    }
    
    console.log(`Vendedor com ID ${id} excluído com sucesso`);
  } catch (error) {
    console.error(`Erro ao excluir vendedor com ID ${id}:`, error);
    throw error;
  }
}
