import React, { useState } from 'react';
import { useCompanies } from '../context/CompanyContext';
import { CompanyCard } from '../components/company/CompanyCard';
import { CompanyForm } from '../components/company/CompanyForm';
import { Plus, Search } from 'lucide-react';
import { Company } from '../types';

export function CompaniesPage() {
  const { companies, isLoading } = useCompanies();
  const [showForm, setShowForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleAddNew = () => {
    setSelectedCompany(null);
    setShowForm(true);
  };
  
  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setShowForm(true);
  };
  
  const handleFormSubmit = () => {
    setShowForm(false);
    setSelectedCompany(null);
  };
  
  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedCompany(null);
  };
  
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.cnpj.includes(searchTerm)
  );
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Empresas</h1>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Empresa
        </button>
      </div>
      
      {showForm ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {selectedCompany ? 'Editar Empresa' : 'Nova Empresa'}
          </h2>
          <CompanyForm 
            initialData={selectedCompany || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome ou CNPJ"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Nenhuma empresa encontrada com os termos da busca.' 
                  : 'Nenhuma empresa cadastrada. Clique em "Nova Empresa" para começar.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompanies.map(company => (
                <CompanyCard 
                  key={company.id} 
                  company={company} 
                  onClick={() => handleEditCompany(company)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
