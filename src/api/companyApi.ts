import { Company } from '../types';

const API_URL = 'http://localhost:3001/api';

// Função para buscar todas as empresas
export async function fetchCompanies(): Promise<Company[]> {
  try {
    console.log('Buscando empresas da API...');
    const response = await fetch(`${API_URL}/companies`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      console.error('Resposta da API não ok:', response.status, errorData);
      throw new Error(`Erro ao buscar empresas: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
    }
    
    const companies = await response.json();
    console.log('Empresas recebidas:', companies.length);
    return companies as Company[];
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    throw error;
  }
}

// Função para buscar uma empresa por ID
export async function fetchCompanyById(id: string): Promise<Company | null> {
  try {
    console.log(`Buscando empresa com ID ${id}...`);
    const response = await fetch(`${API_URL}/companies/${id}`);
    
    if (response.status === 404) {
      console.log(`Empresa com ID ${id} não encontrada`);
      return null;
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(`Erro ao buscar empresa: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
    }
    
    const company = await response.json();
    return company as Company;
  } catch (error) {
    console.error(`Erro ao buscar empresa com ID ${id}:`, error);
    throw error;
  }
}

// Função para criar uma nova empresa
export async function createCompany(companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<Company> {
  try {
    console.log('Criando nova empresa com dados:', companyData);
    
    // Garantir que os dados estejam no formato esperado pelo backend
    const formattedData = {
      name: companyData.name,
      cnpj: companyData.cnpj || null, // CNPJ é opcional
      address: companyData.address,
      phone: companyData.phone,
      email: companyData.email || null,
      logo: companyData.logo || null,
      active: true
    };
    
    const response = await fetch(`${API_URL}/companies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });
    
    if (!response.ok) {
      let errorMessage = 'Erro desconhecido';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || 'Erro desconhecido';
      } catch (e) {
        // Ignorar erro ao tentar parsear o corpo da resposta
      }
      
      throw new Error(`Erro ao criar empresa: ${response.status} - ${errorMessage}`);
    }
    
    const newCompany = await response.json();
    console.log('Nova empresa criada com sucesso:', newCompany);
    return newCompany as Company;
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    throw error;
  }
}

// Função para atualizar uma empresa existente
export async function updateCompanyById(id: string, updates: Partial<Company>): Promise<Company> {
  try {
    console.log(`Atualizando empresa com ID ${id}:`, updates);
    
    // Remover campos que não devem ser enviados para o backend
    const { id: updateId, createdAt, updatedAt, ...updateData } = updates;
    
    const response = await fetch(`${API_URL}/companies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(`Erro ao atualizar empresa: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
    }
    
    const updatedCompany = await response.json();
    console.log('Empresa atualizada com sucesso:', updatedCompany);
    return updatedCompany as Company;
  } catch (error) {
    console.error(`Erro ao atualizar empresa com ID ${id}:`, error);
    throw error;
  }
}

// Função para excluir uma empresa
export async function deleteCompanyById(id: string): Promise<void> {
  try {
    console.log(`Excluindo empresa com ID ${id}...`);
    const response = await fetch(`${API_URL}/companies/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(`Erro ao excluir empresa: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
    }
    
    console.log(`Empresa com ID ${id} excluída com sucesso`);
  } catch (error) {
    console.error(`Erro ao excluir empresa com ID ${id}:`, error);
    throw error;
  }
}
