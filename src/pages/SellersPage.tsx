import React, { useState } from 'react';
import { useSellers } from '../context/SellerContext';
import { useCompanies } from '../context/CompanyContext';
import { SellerCard } from '../components/seller/SellerCard';
import { SellerForm } from '../components/seller/SellerForm';
import { Plus, Search, Filter } from 'lucide-react';
import { Seller } from '../types';

export function SellersPage() {
  const { sellers, isLoading } = useSellers();
  const { companies } = useCompanies();
  const [showForm, setShowForm] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompanyId, setFilterCompanyId] = useState<string>('');
  const [showInactive, setShowInactive] = useState(false);
  
  const handleAddNew = () => {
    setSelectedSeller(null);
    setShowForm(true);
  };
  
  const handleEditSeller = (seller: Seller) => {
    setSelectedSeller(seller);
    setShowForm(true);
  };
  
  const handleFormSubmit = () => {
    setShowForm(false);
    setSelectedSeller(null);
  };
  
  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedSeller(null);
  };
  
  const filteredSellers = sellers.filter(seller => {
    // Filtrar por termo de busca
    const matchesSearch = 
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.phone.includes(searchTerm);
    
    // Filtrar por empresa
    const matchesCompany = filterCompanyId ? seller.companyId === filterCompanyId : true;
    
    // Filtrar por status (ativo/inativo)
    const matchesStatus = showInactive ? true : seller.active;
    
    return matchesSearch && matchesCompany && matchesStatus;
  });
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vendedores</h1>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Vendedor
        </button>
      </div>
      
      {showForm ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {selectedSeller ? 'Editar Vendedor' : 'Novo Vendedor'}
          </h2>
          <SellerForm 
            initialData={selectedSeller || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nome, email ou telefone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={filterCompanyId}
                  onChange={(e) => setFilterCompanyId(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas as empresas</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showInactive"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="showInactive" className="ml-2 text-sm text-gray-700">
                  Mostrar inativos
                </label>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredSellers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">
                {searchTerm || filterCompanyId || !showInactive
                  ? 'Nenhum vendedor encontrado com os filtros aplicados.' 
                  : 'Nenhum vendedor cadastrado. Clique em "Novo Vendedor" para começar.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSellers.map(seller => (
                <SellerCard 
                  key={seller.id} 
                  seller={seller} 
                  onClick={() => handleEditSeller(seller)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
