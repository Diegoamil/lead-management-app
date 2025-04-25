import { Lead } from '../types';

const API_URL = 'http://localhost:3001/api';

export async function fetchLeads(userId: string, companyId: string): Promise<Lead[]> {
  try {
    const response = await fetch(`${API_URL}/leads?userId=${userId}&companyId=${companyId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao buscar leads:', errorData);
      throw new Error(errorData.error || 'Erro ao buscar leads');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    throw error;
  }
}

export async function fetchLeadById(id: string, userId: string, companyId: string): Promise<Lead> {
  try {
    const response = await fetch(`${API_URL}/leads/${id}?userId=${userId}&companyId=${companyId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Erro ao buscar lead ${id}:`, errorData);
      throw new Error(errorData.error || 'Erro ao buscar lead');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro ao buscar lead ${id}:`, error);
    throw error;
  }
}

export async function createLead(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>, userId: string, companyId: string): Promise<Lead> {
  try {
    const response = await fetch(`${API_URL}/leads?userId=${userId}&companyId=${companyId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lead),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao criar lead:', errorData);
      throw new Error(errorData.error || 'Erro ao criar lead');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao criar lead:', error);
    throw error;
  }
}

export async function updateLead(id: string, lead: Partial<Lead>, userId: string, companyId: string): Promise<Lead> {
  try {
    const response = await fetch(`${API_URL}/leads/${id}?userId=${userId}&companyId=${companyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lead),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Erro ao atualizar lead ${id}:`, errorData);
      throw new Error(errorData.error || 'Erro ao atualizar lead');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro ao atualizar lead ${id}:`, error);
    throw error;
  }
}
